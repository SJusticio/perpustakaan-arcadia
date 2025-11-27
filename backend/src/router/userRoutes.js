import express from "express";
import { loginAccount, registerAccount } from "../controller/userController.js";
import { getAllBook, Loaning } from "../controller/libraryController.js";

const router = express.Router()

//endpoint
router.post("/login", loginAccount)
router.post("/register", registerAccount)
router.post("/loan", Loaning)
router.post("/book", getAllBook)

export default router;