import express from "express";
import {protect} from "../middleware/authMiddleware.js";
import { accessChat} from "../controllers/chatControllers.js";

const router = express.Router();

router.route("/").post(protect, accessChat);

export default router;

