const axios = require("axios");
const fs = require("fs");

module.exports = handleFileUpload = async (file) => {
  const fileStream = fs.createReadStream(file.path);
  const uniqueFilename = `${Date.now()}-${file.filename}-${file.originalname}`;
  let yourStorageZone = "master-course";
  const response = await axios.put(
    //url
    //stream
    //headers
    `https://sg.storage.bunnycdn.com/${yourStorageZone}/${uniqueFilename}`,
    fileStream,
    {
      headers: {
        AccessKey: "d0b18e72-3b81-483e-917a3f9e2c24-d936-4eff",
      },
    }
  );

  if (response.data) {
    return (data = { uniqueFilename, success: true });
  } else {
    console.log(response.error);
    return (data = {
      success: false,
    });
  }
};
