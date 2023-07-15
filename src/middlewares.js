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
