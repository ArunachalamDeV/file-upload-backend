exports.checkIsValid = (req, res, next) => {
  try { 
    if (!req.session.isAuth || req.session.isAuth == undefined)
      if (req.path == "/user-create" || req.path == "/user-login" ||req.path == "/signin" || req.path == "/signup") return next();
      else
        return res.status(401).json({
          status: "error",
          message: "Not authenticated",
        });
    if (req.path == "/user-create" && req.session.isAuth || req.path == "/user-login" && req.session.isAuth ) return res.status(401).json({ status:"error", message:"You already signIn"})
        return next();
  } catch (error) {
    res.status(error.status).json({ status:"error", message: error.message})
}
}
