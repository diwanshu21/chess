import mongoose from "mongoose";
import Game from "../model/Game.js";
import User from "../model/User.js";

const register = async (req, res) => {
  try {
    const user = await User.create({ ...req.body });
    const token = user.createJWT();
    res.cookie("token", token, { httpOnly: true });
    console.log(user);
    res.status(201).json({ success: true, message: "User registered" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: true, message: "Error during register" });
  }
};

const login = async (req, res) => {
  try {
    console.log("hello");
    // await User.deleteMany()
    let { username, password } = req.body;
    console.log(req.body);
    const user = await User.findOne({ username });

    if (!user) {
      console.log("here1");
      res.status(200).json({ success: false, message: "User not found" });
      return;
    }
    const match = await user.comparePassword(password);
    if (match) {
      const token = user.createJWT();
      res.cookie("token", token, { httpOnly: true });
      res.status(200).json({ success: true, message: "Login successful" });
    } else {
      res.status(200).json({ success: false, message: "Password incorrect" });
    }
  } catch (error) {
    console.log(error);
    // res.status(400).json({ success: false, message: "Server error" });
  }
};
const logout = async (req, res) => {
  res.cookie("token", "", { httpOnly: true });
  res.status(200).json({ success: true, message: "logout successful" });
};

const allgames = async (req, res) => {
  let userId = new mongoose.Types.ObjectId(req.params.id);
  console.log({ userId });

  try {
    const requiredUser = await User.findById(userId);
    // console.log({ requiredUser });
    const games = requiredUser.games;
    // console.log({ games });
    let final = [];

    for (let i = 0; i < games.length; i++) {
      const gameData = await Game.findById(games[i]);
      // console.log({ gameData });
      if(gameData)
      final.push(gameData);
    }
// console.log(final.length)
    // console.log({ final });
    res.status(200).json({ allgames: final });
  } catch (error) {
    console.log(error);

    res.status(500).json({ allgames: null });
  }
};
export { login, register, logout, allgames };
