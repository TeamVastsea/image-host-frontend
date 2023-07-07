const API_BASE = "https://image.vastsea.cc/api/";

export interface Image {
    id: string;
    cover: string; // Cover size url
    original: string; // Original size url
}

export async function getUserImages(username: string): Promise<Image[]> {
    return await (await fetch(API_BASE + username + "/images")).json();
}

export async function checkUsername(username: string): Promise<boolean> {
    return await (await fetch(API_BASE + username)).json();
}

export async function getPlayerName(username: string): Promise<string> {
    return await (await fetch(API_BASE + username + "/name")).json();
}

export async function upload(
    file: globalThis.File,
    username: string,
): Promise<Image> {
    const formData = new FormData();
    formData.append("file", file);
    return await (
        await fetch(API_BASE + username + "/images", {
            method: "POST",
            body: formData,
        })
    ).json();
}

export async function deleteImage(username: string, id: string) {
    await fetch(API_BASE + username + "/images/" + id, {
        method: "DELETE",
    });
}
