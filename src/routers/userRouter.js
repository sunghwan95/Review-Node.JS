import express from "express";
import {
  getEdit,
  postEdit,
  see,
  logout,
  startGithubLogin,
  endGithubLogin,
  getChangePw,
  postChangePw,
} from "../controllers/userController";
import {
  multerMiddlewareAvatar,
  protectorMiddleware,
  publicOnlyMiddleware,
} from "../middlewares";

const userRouter = express.Router();

userRouter.route("/:id([0-9a-f]{24})").get(protectorMiddleware, see);
userRouter.route("/logout").get(protectorMiddleware, logout);
userRouter
  .route("/edit")
  .all(protectorMiddleware)
  .get(getEdit)
  .post(multerMiddlewareAvatar.single("avatar"), postEdit);
userRouter.route("/github/start").get(publicOnlyMiddleware, startGithubLogin);
userRouter.route("/github/callback").get(publicOnlyMiddleware, endGithubLogin);
userRouter.route("/change-pw").get(getChangePw).post(postChangePw);

export default userRouter;
