import express from "express";
import {protect} from "../middleware/authMiddleware.js";
import { accessChat, fetchChats} from "../controllers/chatControllers.js";

const router = express.Router();

router.route("/").post(protect, accessChat); // get specific chat of the logged in user for the provided user id
router.route("/").get(protect, fetchChats); // get all chats of the logged in user

export default router;

