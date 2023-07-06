from typing import List
from fastapi import FastAPI, HTTPException, Response, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from config import *
import uuid
from pymongo import MongoClient
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


config = CosConfig(
    Region=REGION, SecretId=SECRET_ID, SecretKey=SECRET_KEY, Scheme="https"
)
client = CosS3Client(config)


@app.get("/")
async def index() -> str:
    return "ciallo!"


mongo_client = MongoClient(DB_URL)
db = mongo_client["mc_lp"]


@app.get("/{user}/")
async def check_user(user: str) -> bool:
    return db.users.find_one({"name": user}) != None


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
    if not await check_user(user):
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
    if not await check_user(user):
        raise HTTPException(status_code=404)

    id = str(uuid.uuid4())

    resp = client.put_object(Bucket=BUCKET, Body=file.file, Key=user + "/" + id)

    print(resp)

    return Image.from_key(user + "/" + id)


@app.delete("/{user}/images/{id}")
async def delete_image(user: str, id: str):
    if not await check_user(user):
        raise HTTPException(status_code=404)

    resp = client.delete_object(Bucket=BUCKET, Key=user + "/" + id)
    print(resp)
