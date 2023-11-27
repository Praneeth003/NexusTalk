import express from "express";
import {registerUser, authUser, allUsers} from "../controllers/userControllers.js";
const router = express.Router();

router.route('/').post(registerUser).get(allUsers);
router.route('/login').post(authUser);

export default router;