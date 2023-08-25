import express from "express";
import checktoken from "../middleware/checktoken.js";
const router = express.Router();
import {
  homePage,
  loginPage,
  registerPage,
  GamePage,
} from "../controller/viewControllers.js";
const io = global.io;
router.get("/", checktoken, homePage);
router.get("/login", loginPage);
router.get("/register", registerPage);
router.get("/play/:id", checktoken, GamePage);

export default router;
