import express from "express";
import { home, join } from "../controllers/userController";

const globalRouter = express.Router();

globalRouter.route("/").get(home);
globalRouter.route("/join").get(join);

export default globalRouter;
