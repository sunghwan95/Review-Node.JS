import express from "express";
import { edit, remove, see, logout } from "../controllers/userController";

const userRouter = express.Router();

userRouter.route("/:id[0-9a-f]").get(see);
userRouter.route("/logout").get(logout);
userRouter.route("/edit").get(edit);
userRouter.route("/remove").get(remove);

export default userRouter;
