import multer from "multer";

export const localsMiddleware = (req, res, next) => {
  console.log("특정 세션의 정보:", req.session);
  console.log("세션 ID:", req.sessionID);
  if (req.session.loggedIn) {
    res.locals.loggedIn = true;
  } else {
    res.locals.loggedIn = false;
  }
  res.locals.sitename = "Review Node.JS";
  res.locals.loggedInUser = req.session.user;
  next();
};

export const protectorMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    next();
  } else {
    return res.redirect("/login");
  }
};

export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    next();
  } else {
    return res.redirect("/");
  }
};

export const multerMiddlewareAvatar = multer({
  dest: "uploads/avatars",
  limits: {
    fileSize: 3e6,
  },
});

export const multerMiddlewareVideo = multer({
  dest: "uploads/videos",
  limits: {
    fileSize: 1e7,
  },
});
