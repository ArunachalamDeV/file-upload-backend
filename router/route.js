const router = require('express').Router();

const fileRoute = require('./fileRoute.js')
const userRoute = require('./userRoute')

module.exports = ()=>{
    console.log('Starting');
    try {
        
    
    // router.use('/user', userRoute);
    router.use('/file',fileRoute);

    return router
} catch (error) {
        console.log(error);
        
}
}

// const express = require("express");
// const crossDomain = require("cors");
// const dotenv = require("dotenv");
// const storage = require("./lib/upload");
// const axios = require("axios");
// const fs = require("fs");
// const path = require("path");

// const {date} = require('./lib/date.js') 
// const connectDB = require("./lib/db.js")
// const {checkIsValid} = require('./middleware.js')
// const {sessionManagement} =require('./lib/sessionConnection.js')
// const router = require('./router/route.js')

// const port = process.env.PORT || 5000;
// // connect express
// const app = express();

// // Middleware to parse JSON request bodies
// app.use(express.json());

// // Load environment variables from .env file
// dotenv.config();

// // Connect to MongoDB database
// connectDB({poolSize:10})

// // Connect to MongoDB session storage
// sessionManagement(app)


// // Enable CORS for multiple client URLs
// app.use(
//   crossDomain({
//     origin: [
//       process.env.CLIENT_URL,
//       process.env.CLIENT_URL1,
//       process.env.CLIENT_URL2,
//     ],
//     default: process.env.CLIENT_URL,
//     optionsSuccessStatus: 200,
//   })
// );


// // Route to handle file uploads
// app.use('/api',router)


// app.use("/", express.static(path.join(__dirname, "./build")));
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "./build", "index.html"));
// });





// // Route to handle file uploads



// app.use((req, res, next) => {
//   res.status(404).send("Sorry cant find that!");
// });

// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send("Something broke!");
// });

// app.listen(port, () => {
//   console.log(`Server listening on port ${port}`);
// });
