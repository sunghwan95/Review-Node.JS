import express from "express";
import { edit, remove } from "../controllers/userController";

const userRouter = express.Router();

userRouter.route("/edit").get(edit);
userRouter.route("/remove").get(remove);

export default userRouter;
