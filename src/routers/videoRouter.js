import express from "express";
import {
  watch,
  getEdit,
  postEdit,
  upload,
  postUpload,
  deleteVideo,
} from "../controllers/videoController";
import { protectorMiddleware, multerMiddlewareVideo } from "../middlewares";

const videoRouter = express.Router();

// https://www.regexpal.com
videoRouter.route("/:id([0-9a-f]{24})").get(watch);
videoRouter
  .route("/:id([0-9a-f]{24})/edit")
  .all(protectorMiddleware)
  .get(getEdit)
  .post(postEdit);
videoRouter
  .route("/:id([0-9a-f]{24})/delete")
  .all(protectorMiddleware)
  .get(deleteVideo);
videoRouter
  .route("/upload")
  .all(protectorMiddleware)
  .get(upload)
  .post(multerMiddlewareVideo.single("video"), postUpload);

export default videoRouter;
