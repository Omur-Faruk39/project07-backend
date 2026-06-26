const { createClient } = require("@supabase/supabase-js");
const { v4: uuidv4 } = require("uuid");
const env = require("../config/env.js");

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);

const uploadImage = async (image, folder) => {
  if (!image) return null;

  if (typeof image === "string") {
    if (image.startsWith("http")) return image;

    const matches = image.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!matches) return null;

    const ext = matches[1] === "jpeg" ? "jpg" : matches[1];
    const buffer = Buffer.from(matches[2], "base64");
    return await uploadToSupabase(buffer, ext, folder);
  }

  if (image.buffer) {
    const ext = image.mimetype.split("/")[1] || "png";
    return await uploadToSupabase(image.buffer, ext, folder);
  }

  return null;
};

const uploadToSupabase = async (buffer, ext, folder) => {
  const fileName = `${folder}/${uuidv4()}.${ext}`;

  const { error } = await supabase.storage
    .from(env.SUPABASE_BUCKET)
    .upload(fileName, buffer, {
      contentType: `image/${ext}`,
      upsert: false,
    });

  if (error) {
    console.error("Supabase upload error:", error);
    return null;
  }

  const { data: publicUrl } = supabase.storage
    .from(env.SUPABASE_BUCKET)
    .getPublicUrl(fileName);

  return publicUrl.publicUrl;
};

const generateSignedUrl = async (ext, folder) => {
  const allowedExts = ["jpg", "jpeg", "png", "webp", "gif"];
  const normalizedExt = ext === "jpeg" ? "jpg" : ext.toLowerCase();

  if (!allowedExts.includes(normalizedExt)) {
    return { error: "Invalid file type. Allowed: jpg, png, webp, gif" };
  }

  const fileName = `${folder}/${uuidv4()}.${normalizedExt}`;

  const { data, error } = await supabase.storage
    .from(env.SUPABASE_BUCKET)
    .createSignedUploadUrl(fileName);

  if (error) {
    console.error("Supabase signed URL error:", error);
    return { error: error.message };
  }

  const { data: publicUrl } = supabase.storage
    .from(env.SUPABASE_BUCKET)
    .getPublicUrl(fileName);

  return {
    signedUrl: data.signedUrl,
    publicUrl: publicUrl.publicUrl,
    path: fileName,
  };
};

module.exports = { uploadImage, generateSignedUrl };
