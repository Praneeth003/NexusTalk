import express from "express";
import {protect} from "../middleware/authMiddleware.js";
import { accessChat, fetchChats, createGroupChat, renameGroupChat, addUserToGroup, removeUserFromGroup, leaveGroup} from "../controllers/chatControllers.js";

const router = express.Router();

router.route("/").post(protect, accessChat); // get specific chat of the logged in user for the provided user id
router.route("/").get(protect, fetchChats); // get all chats of the logged in user
router.route("/group").post(protect, createGroupChat); // create a group chat
router.route("/rename").put(protect, renameGroupChat); // rename a group chat
router.route("/add").put(protect, addUserToGroup); // add members to a group chat
router.route("/remove").put(protect, removeUserFromGroup); // leave a group chat
router.route("/leave").put(protect, leaveGroup ); // leave a group chat

export default router;

