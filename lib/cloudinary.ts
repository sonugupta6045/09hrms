import { v2 as cloudinary } from "cloudinary"

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadToCloudinary(buffer: Buffer, fileName: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      resource_type: "auto",
      folder: "resumes",
      public_id: fileName.split(".")[0], // Use filename without extension as public_id
    }

    // Convert buffer to base64
    const base64Data = buffer.toString("base64")
    const dataURI = `data:application/octet-stream;base64,${base64Data}`

    cloudinary.uploader.upload(dataURI, uploadOptions, (error, result) => {
      if (error) {
        console.error("Cloudinary upload error:", error)
        reject(error)
      } else {
        resolve(result!.secure_url)
      }
    })
  })
}

export async function deleteFromCloudinary(publicId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        console.error("Cloudinary delete error:", error)
        reject(error)
      } else {
        resolve()
      }
    })
  })
}

