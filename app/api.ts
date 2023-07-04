export interface Image {
  cover: string; // Cover size url
  original: string; // Original size url
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getUserImages(username: string): Promise<Image[]> {
  await sleep(500);
  return [
    {
      cover:
        "https://images.unsplash.com/photo-1688362378188-264c2d01ae9d?w=500",
      original: "https://images.unsplash.com/photo-1688362378188-264c2d01ae9d",
    },
    {
      cover:
        "https://images.unsplash.com/photo-1619796753108-cba77bacf03d?w=500",
      original: "https://images.unsplash.com/photo-1619796753108-cba77bacf03d",
    },
    {
      cover:
        "https://images.unsplash.com/photo-1688362378188-264c2d01ae9d?w=500",
      original: "https://images.unsplash.com/photo-1688362378188-264c2d01ae9d",
    },
    {
      cover:
        "https://images.unsplash.com/photo-1619796753108-cba77bacf03d?w=500",
      original: "https://images.unsplash.com/photo-1619796753108-cba77bacf03d",
    },
    {
      cover:
        "https://images.unsplash.com/photo-1688362378188-264c2d01ae9d?w=500",
      original: "https://images.unsplash.com/photo-1688362378188-264c2d01ae9d",
    },
    {
      cover:
        "https://images.unsplash.com/photo-1619796753108-cba77bacf03d?w=500",
      original: "https://images.unsplash.com/photo-1619796753108-cba77bacf03d",
    },
    {
      cover:
        "https://images.unsplash.com/photo-1688362378188-264c2d01ae9d?w=500",
      original: "https://images.unsplash.com/photo-1688362378188-264c2d01ae9d",
    },
    {
      cover:
        "https://images.unsplash.com/photo-1619796753108-cba77bacf03d?w=500",
      original: "https://images.unsplash.com/photo-1619796753108-cba77bacf03d",
    },
  ];
}

export async function checkUsername(username: string): Promise<boolean> {
  await sleep(500);
  return username === "test";
}
