import { isObjectIdOrHexString } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import Game from "../model/Game.js";
import User from "../model/User.js";
// uuidv4();

let playRequest = {};
const HomeIO = (socket) => {
  console.log("Connected to Home page");
  socket.on("playrequest", async () => {
    if (socket.user == null) return;
    let user = socket.user.username;
    let ID = socket.id;
    console.log(user, ID);
    console.log("playrequest received", user);
    playRequest[user] = ID;

    let date = Date.now();
    console.log(playRequest);
    if (Object.keys(playRequest).length > 1) {
      for (let key in playRequest) {
        if (key != user) {
          console.log("hello");
          let user1 = user;
          let user2 = key;
          try {
            const game = await Game.create({
              player1: user,
              player2: user2,
              pgn: "",
              time: [],
              timeByP1: 0,
              timeByP2: 0,
              totalTime: 10 * 60 * 1000,
              startDate: Date.now(),
            });
            // console.log(game);

            let gameID = game._id;
            socket.join(gameID);
            const io = global.io;
            io.sockets.sockets.get(playRequest[key]).join(gameID);

            const clients = io.sockets.adapter.rooms.get(gameID);
            const numClients = clients ? clients.size : 0;
            console.log(numClients);
            delete playRequest[user];
            delete playRequest[key];
            
            const firstuser = await User.findOneAndUpdate(
              {username:user1},
              { $push: { games: gameID } },
              { new: true }
            );
            const seconduser = await User.findOneAndUpdate(
              {username:user2},
              { $push: { games: gameID } },
              { new: true }
            );
            let url = "http://localhost:3000/play/" + gameID;
            console.log(url, user);

            socket.emit("startGame", url);
            socket.to(gameID).emit("startGame", url);
          } catch (error) { 
            console.log(error);
          }

          break;
        }
      }
    }
  });
};

export default HomeIO;
