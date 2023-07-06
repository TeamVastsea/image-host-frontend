from typing import List, Set
from fastapi import FastAPI, HTTPException, Response, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from config import *
import uuid
import os
from nbt.nbt import NBTFile
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from qcloud_cos import CosConfig
from qcloud_cos import CosS3Client
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

world_observers = {}

PLAYERS = set()


def get_players_in_world(world_path: str) -> Set[str]:
    players = set()
    for dat_file in os.listdir(os.path.join(world_path, "playerdata")):
        if os.path.splitext(dat_file)[1] != ".dat":
            continue
        path = os.path.join(world_path, "playerdata", dat_file)
        nbt_file = NBTFile(path, "rb")
        players.add(str(nbt_file["bukkit"]["lastKnownName"]))

    return players


def init_players():
    global PLAYERS
    players = set()
    for name in os.listdir(SERVER_DIR):
        path = os.path.join(SERVER_DIR, name)
        if name.startswith("world") and os.path.isdir(path):
            players = players.union(get_players_in_world(path))

            if name not in world_observers.keys():

                class Handler(FileSystemEventHandler):
                    @staticmethod
                    def on_any_event(event):
                        if (
                            event.event_type != "modified"
                            and event.event_type != "created"
                        ):
                            return

                        global PLAYERS
                        print("Change detected!", path)
                        PLAYERS = PLAYERS.union(get_players_in_world(path))

                o = Observer()
                o.schedule(Handler(), os.path.join(path, "playerdata"), recursive=True)

                o.start()

                world_observers[name] = o

    PLAYERS = players


config = CosConfig(
    Region=REGION, SecretId=SECRET_ID, SecretKey=SECRET_KEY, Scheme="https"
)
client = CosS3Client(config)


@app.get("/")
async def index() -> str:
    return "ciallo!"


@app.get("/{user}/")
async def get_user(user: str) -> bool:
    return user in PLAYERS


class Image(BaseModel):
    id: str
    original: str
    cover: str

    @staticmethod
    def from_key(key: str) -> "Image":
        url = "https://%s.cos.%s.myqcloud.com/%s" % (BUCKET, REGION, key)
        return Image(id=key.split("/")[1], original=url, cover=url)


@app.get("/{user}/images")
async def get_user_images(user: str) -> List[Image]:
    if user not in PLAYERS:
        raise HTTPException(status_code=404)

    objs = client.list_objects(Bucket=BUCKET, Prefix=user)

    print(objs)
    if "Contents" in objs.keys():
        images = []
        for obj in objs["Contents"]:
            images.append(Image.from_key(obj["Key"]))
        return images
    else:
        return []


@app.post("/{user}/images")
async def upload_image(user: str, file: UploadFile) -> Image:
    if user not in PLAYERS:
        raise HTTPException(status_code=404)

    id = str(uuid.uuid4())

    resp = client.put_object(Bucket=BUCKET, Body=file.file, Key=user + "/" + id)

    print(resp)

    return Image.from_key(user + "/" + id)


@app.delete("/{user}/images/{id}")
async def delete_image(user: str, id: str):
    if user not in PLAYERS:
        raise HTTPException(status_code=404)

    resp = client.delete_object(Bucket=BUCKET, Key=user + "/" + id)
    print(resp)


init_players()
