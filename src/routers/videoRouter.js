import express from "express";
import { watch, edit, upload, remove } from "../controllers/videoController";

const videoRouter = express.Router();

// https://www.regexpal.com
videoRouter.route("/:id[\\d+]").get(watch);
videoRouter.route("/:id[0-9a-f]/edit").get(edit);
videoRouter.route("/:id[0-9a-f]/remove").get(remove);
videoRouter.route("/upload").get(upload);

export default videoRouter;
