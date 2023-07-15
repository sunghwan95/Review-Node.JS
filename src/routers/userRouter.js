import express from "express";
import {
  edit,
  see,
  logout,
  startGithubLogin,
  endGithubLogin,
} from "../controllers/userController";

const userRouter = express.Router();

userRouter.route("/:id([0-9a-f]{24})").get(see);
userRouter.route("/logout").get(logout);
userRouter.route("/edit").get(edit);
userRouter.route("/github/start").get(startGithubLogin);
userRouter.route("/github/callback").get(endGithubLogin);

export default userRouter;
