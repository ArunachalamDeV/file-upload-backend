const router = require("express").Router();

const User = require("../models/user.js");
const validator = require("email-validator");
router.post("/user-create", async (req, res) => {
  console.log(req.body);
  const { email, name } = req.body;
  try {
    if (!validator.validate(email))
      return res
        .status(403)
        .json({ status: "error", message: "Invalid email" });
    // Assume 'User' is a Mongoose model representing a user
    const checkUser = await User.findOne({ email: email });
    console.log(checkUser);

    if (checkUser)
      return res
        .status(200)
        .json({ status: "error", message: "The email already exists" });
    const newUser = await User({
      name,
      email,
    });
    req.session.isAuth = true;
    req.session.userId = newUser._id;
    await newUser.save();
    return res
      .status(201)
      .json({ status: "success", message: "Account created successfully" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.post("/user-login", async (req, res) => {
  const { email } = req.body;
  if (!validator.validate(email))
    return res.status(403).json({ status: "error", message: "Invalid email" });
  try {
    // Assume 'User' is a Mongoose model representing a user
    const user = await User.findOne({
      email,
    });
    if (!user)
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    req.session.isAuth = true;
    req.session.userId = user._id;
    res
      .status(201)
      .json({ status: "success", message: "User login successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/get-user", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.session.userId });
    if (!user)
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    res.status(200).json({
      status: "success",
      message: "success get user information",
      data: { name: user.name, email: user.email, upload: user.upload },
    });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
});



router.get("/isValid", (req, res) => {
  try {
    if (!req.session.isAuth || req.session.isAuth == undefined)
      return res.status(401).json({
        status: "error",
        message: "Not authenticated",
      });
    res.json({ status: "success", message: "You have authentication" });
  } catch (error) {
    res
      .status(404)
      .send({ status: "error", message: "API is working properly" });
  }
});

router.get("/logout", (req, res) => {
  try {
    if (!req.session.isAuth || req.session.isAuth == undefined)
      res.json({ status: "error", message: "Something went wrong" });
    if (req.session.isAuth || req.session.isAuth !== undefined)
      req.session.destroy(() => {
        res.clearCookie("connect.sid");
        return res.json({
          status: "success",
          message: "Logged out successfully",
        });
      });
  } catch (error) {
    res
      .status(404)
      .send({ status: "error", message: "API is working properly" });
  }
});

module.exports = router;


