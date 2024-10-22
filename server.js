const express = require("express");
const crossDomain = require("cors");
const dotenv = require("dotenv");
// const storage = require("./lib/upload");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const handleFileUpload = require("./lib/file-upload-util");
const multer = require("multer");
const { date } = require("./lib/date.js");
const connectDB = require("./lib/db.js");

const userRoute = require("./router/userRoute.js");
const User = require("./models/user.js");
const { checkIsValid } = require("./middleware.js");
const { sessionManagement } = require("./lib/sessionConnection.js");

// connect express
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB database
connectDB({ poolSize: 10 });

// Connect to MongoDB session storage
sessionManagement(app);
const port = process.env.PORT || 5000;
// Enable CORS for multiple client URLs
app.use(
  crossDomain({
    origin: [
      process.env.CLIENT_URL,
      process.env.CLIENT_URL1,
      process.env.CLIENT_URL2,
    ],
    default: process.env.CLIENT_URL,
    optionsSuccessStatus: 200,
  })
);

app.use("/", express.static(path.join(__dirname, "./build")));

app.get("/",checkIsValid,(req, res) => {
  res.sendFile(path.join(__dirname, "./build", "index.html"));
});

app.get("/signin",checkIsValid,(req, res) => {
  res.sendFile(path.join(__dirname, "./build", "index.html"));
});

app.get("/signup",checkIsValid,(req, res) => {
  res.sendFile(path.join(__dirname, "./build", "index.html"));
});

app.get("/error",(req, res) => {
  res.sendFile(path.join(__dirname, "./build", "index.html"));
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Specify the upload folder
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const originalName = file.originalname;
    const extension = path.extname(originalName);
    const nameWithoutExt = path.basename(originalName, extension);

    // Create a filename using the original name + timestamp to avoid collisions
    cb(null, `${nameWithoutExt}-${uniqueSuffix}${extension}`);
  },
});

// Set up the Multer middleware
const upload = multer({
  storage: storage,
  limits: { fileSize: 200 * 1024 * 1024 },
}); // Max 200MB

app.use("/api",checkIsValid, userRoute);

// Route to handle file uploads
app.post("/upload", checkIsValid,upload.array("files[]"), async (req, res) => {
  try {
    if (req.files.length < 0)
      return res.status(400).json({ message: "No file uploaded" });
    const getUser = await User.findOne({ _id: req.session.userId });
    if (!getUser)
      return res
        .status(400)
        .json({ status: "error", message: "User not found " });
    let listUpload = [];
    for (var i = 0; i < req.files.length; i++) {
      const originalname = req.files[i].filename;
      const attachment = req.files[i];
      const filePath = path.resolve(__dirname, "uploads", originalname);
      const getPromise = await new Promise((resolve, reject) => {
        (async () => {
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
              date: date(),
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
        })();
      });
      if (getPromise.status == "error") return res.json(getPromise);
    }

    getUser.upload.push(...listUpload);
    await getUser.save();
    return await res.status(200).json({
      status:"success",
      message: "Files uploaded successfully!",
      files: listUpload,
      user:getUser
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

app.post("/delete", checkIsValid,async (req, res) => {
  try {
  const fileName = req.body.url.split("/")[3];
  const getUser = await User.findOne({ _id: req.session.userId });
  if (!getUser)
    return res
  .status(400)
  .json({ status: "error", message: "User not found " });
  axios
    .delete(
      `https://${process.env.BUNNY_STORAGE_HOST}/${process.env.BUNNY_STORAGE_NAME}/${fileName}`,
      {
        headers: {
          AccessKey: process.env.BUNNY_STORAGE_ACCESS_KEY,
        },
      }
    )
    .then(async (response) => {
    
        getUser.upload = await [...getUser.upload.filter(
          (file) => file.url !== req.body.url
        )]
        await getUser.save();
        res.json({status:"success", message: "File deleted successfully", success: true ,user:getUser });
    })
    .catch((error) => {
      console.log(error.message);
      res.json({ status:"error", message: "File deletion failed", success: false });
    });
  }
  catch (e) {
    res.status(500).json({status:"error",message: e.message});
  }
});


app.use((req, res, next) => {
  res.redirect('/error')
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
