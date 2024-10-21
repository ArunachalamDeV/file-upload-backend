const axios = require("axios");
const fs = require("fs");

module.exports = handleFileUpload = async (file) => {
  const fileStream = fs.createReadStream(file.path);
  const uniqueFilename = `${Date.now()}-${file.filename}-${file.originalname}`;
  
  const response = await axios.put(
    //url
    //stream
    //headers
    `https://${process.env.BUNNY_STORAGE_HOST}/${process.env.BUNNY_STORAGE_NAME}/${uniqueFilename}`,
    fileStream,
    {
      headers: {
        AccessKey: process.env.BUNNY_STORAGE_ACCESS_KEY,
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
