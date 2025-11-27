import express from "express";
import { loginAccount } from "../controller/userController.js";

const router = express.Router()

//endpoint
router.post("/login", loginAccount)

export default router;