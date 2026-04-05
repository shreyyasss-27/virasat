import express from "express";
import upload from "../utils/multer.js";
import {uploadMedia, deleteMedia} from "../controllers/media.controller.js"

const router = express.Router();

router.post("/upload", upload.single("media"), uploadMedia);

router.delete("/:id", deleteMedia);


export default router;