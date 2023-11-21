import express from "express";

const router = express.Router();

router.route('/login').post(registerUser);
router.post('/login',authUser);

export default router;