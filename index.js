import express, { json, urlencoded } from "express";
const app = express();
import morgan from "morgan";
import { createServer } from "http";
const server = createServer(app);
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import viewRouter from "./routes/viewRoutes.js";
import apiRouter from "./routes/apiRoutes.js";
import HomeIO from "./socketio/HomeNamespace.js";
import PlayIO from "./socketio/PlayNamespace.js";
import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();
// console.log(process.env) // remove this after you've confirmed it is working

// router
const io1 = new Server(server);
global.io = io1;
const io = global.io;

app.use(json());
app.use(
  urlencoded({
    extended: true,
  })
);

app.use(cookieParser());
app.use(express.static("public"));
app.use(viewRouter);
app.use("/api/v1", apiRouter);

app.use(morgan("tiny"));
app.set("view engine", "ejs");

// app.use();
import connectDB from "./db/connectDB.js";
import Home from "./socketio/HomeNamespace.js";
import authenticateUser from "./middleware/AuthSocketio.js";

const HomeNamespace = io.of("/");
const PlayNamespace = io.of("/play");

HomeNamespace.use(authenticateUser);
PlayNamespace.use(authenticateUser);
HomeNamespace.on("connection", HomeIO);
PlayNamespace.on("connection", PlayIO);
// io.of('/play/7128870f-a766-4c4a-808a-6efc44ec4e9a').on("connection",(socket)=>{
//   console.log('playing')
// })
connectDB(process.env.MONGO_URI)
  .then(() => {
    console.log("Database connected");
    server.listen(80, () => {
      console.log("listening on *:3000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
