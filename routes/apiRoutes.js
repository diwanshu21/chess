import express from "express";
import { login, register, logout, allgames } from "../controller/apiControllers.js";
const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/logout", logout);
router.get("/allgames/:id", allgames);
router.get("/test", (req, res) => {
	res.json({ success: true });
})
export default router;
