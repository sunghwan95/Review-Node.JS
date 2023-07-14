import express from "express";
import { home, search } from "../controllers/videoController";
import { join, login } from "../controllers/userController";

const globalRouter = express.Router();

globalRouter.route("/").get(home);
globalRouter.route("/join").get(join);
globalRouter.route("/login").get(login);
globalRouter.route("/search").get(search);

export default globalRouter;
