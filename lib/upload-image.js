const IMGBB_URL = "https://api.imgbb.com/1/upload";
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function uploadImage(file) {
  const key = process.env.NEXT_PUBLIC_IMGBB_KEY;
  if (!key) {
    throw new Error("ImgBB API key সেট করা নেই");
  }
  if (!file || !file.type?.startsWith("image/")) {
    throw new Error("শুধু ছবি ফাইল দিন");
  }
  if (file.size > MAX_SIZE) {
    throw new Error("ছবি ৫MB এর বেশি হতে পারবে না");
  }

  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`${IMGBB_URL}?key=${key}`, {
    method: "POST",
    body: formData,
  });
  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data?.error?.message || "ছবি আপলোড হয়নি");
  }
  return data.data.display_url;
}