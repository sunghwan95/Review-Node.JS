import express from "express";
import { watch, edit } from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.route("/watch").get(watch);
videoRouter.route("/edit").get(edit);

export default videoRouter;
