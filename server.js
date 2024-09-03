const express = require("express");
const crossDomain = require("cors");
const dotenv = require("dotenv");
const upload = require("./lib/upload");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());
dotenv.config();

const port = process.env.PORT || 5000;

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

// app.all("*", function (req, res, next) {
//   const origin = cors.origin.includes(req.header("origin").toLowerCase())
//     ? req.headers.origin
//     : cors.default;
//   res.header("Access-Control-Allow-Origin", origin);
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

//app.get("/", (req, res) => {
  //console.log("hello");
  //res.json({ message: "Hello World!" });
//});

app.post("/upload", upload.single("file"), async (req, res) => {
  const videoId = req.headers["video-id"];
  const filePath = path.resolve(__dirname, "uploads", req.file.originalname);
  const data = fs.createReadStream(filePath);
  console.log(videoId);
  console.log(req.file);
  axios
    .put(
      `http://video.bunnycdn.com/library/${process.env.BUNNY_STREAM_VIDEO_ID}/videos/${videoId}`,
      data,
      {
        headers: {
          AccessKey: process.env.BUNNY_STREAM_API_KEY,
          "Content-Type": "application/octet-stream",
        },
      }
    )
    .then((response) => {
      console.log(response.data);
      if (response.data.success) {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log("File deleted successfully");
        });
        res.json({ message: "File uploaded successfully", success: true });
      } else {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log("File deleted successfully");
        });
        res.json({ message: "File uploaded successfully", success: true });
      }
    })
    .catch((error) => {
      console.log(error.message);
      res.json({ message: "File upload failed", success: false, error:  error});
    });
});

app.use((req, res, next) => {
  res.status(404).send("Sorry cant find that!");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});