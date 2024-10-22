const axios = require("axios");
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');

// Generate a UUID


module.exports = handleFileUpload = async (file) => {
  const myUUID = uuidv4();
  const fileStream = fs.createReadStream(file.path);
  const uniqueFilename = `${Date.now()}-${myUUID}-${file.originalname}`;
  
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
      message:response.error
    });
  }
};

