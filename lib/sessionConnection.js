const session = require("express-session");
 const mongoDBstore = require("connect-mongodb-session")(session);


exports.sessionManagement = async (app) => {
  const store = new mongoDBstore({
    uri: process.env.DB_URL,
    collection: "sessions",
  });

  // Catch errors
  store.on("error", function (error) {});
  app.use(
    session({
      secret: "secret secret secret secret ",  
      resave: false,
      secure: true,
      httpOnly: true,
      saveUninitialized: false,
      cookie: {
        expires: 2629746000,
  
      },
      store: store,
    })
  );
};
