const router = require("express").Router();
const path = require("path");
const handleFileUpload = require("../lib/file-upload-util");
const storage = require("../lib/upload");
const fs = require("fs");
const multer = require("multer");

const upload = multer({
    storage: storage,
    limits: { fileSize: 200 * 1024 * 1024 },
  }); // Max 200MB

 
  module.exports = ()=>{
console.log("sss");
try {
  
   router.post("/upload", upload.array("files[]"), async (req, res) => {
    try {
      console.log("calling");
      
      if (req.files.length < 0)
        return res.status(400).json({ message: "No file uploaded" });
      let listUpload = [];
      for (var i = 0; i < req.files.length; i++) {
        const originalname = req.files[i].filename;
        const attachment = req.files[i];
        const filePath = path.resolve(__dirname, "../uploads", originalname);
        const getPromise = await new Promise((resolve, reject) => {
        (  async () => {
            const uploadResponse = await handleFileUpload(attachment);
            if (uploadResponse.success) {
              fs.unlink(filePath, (err) => {
                if (err) {
                  console.error(err);
                  return reject({ status: "error", message: err });
                }
                console.log("File deleted successfully");
              });
  
              listUpload.push({
                fileType: req.files[i].mimetype,
                url: `https://${process.env.BUNNY_PULL_ZONE_HOST}/${uploadResponse.uniqueFilename}`,
                date:date()
              });
            } else {
              fs.unlink(filePath, (err) => {
                if (err) {
                  return reject({ status: "error", message: err });
                }
                console.log("File deleted successfully");
              });
              return reject({ status: "error", message: err });
            }
            resolve({ status: "success", message: "File deleted successfully" });
          })()
        });
        if (getPromise.status == "error") return res.json(getPromise);
      }
      console.log(listUpload);
      return await res.status(200).json({
        message: "Files uploaded successfully!",
        files: listUpload,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  });
  
  router.post("/delete-thumbnail", async (req, res) => {
    const fileName = req.body.url.split("/")[3];
    axios
      .delete(
        `https://${process.env.BUNNY_STORAGE_HOST}/${process.env.BUNNY_STORAGE_NAME}/${fileName}`,
        {
          headers: {
            AccessKey: process.env.BUNNY_STORAGE_ACCESS_KEY,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        res.json({ message: "Thumbnail deleted", success: true });
      })
      .catch((error) => {
        console.log(error.message);
        res.json({ message: "Thumbnail deletion failed", success: false });
      });
  });
  
} catch (error) {
  console.log(error);
  
}
return router

  }
