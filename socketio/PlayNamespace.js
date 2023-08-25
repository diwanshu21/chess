import mongoose from "mongoose";
import Game from "../model/Game.js";
import { Chess } from "chess.js";

let gameDetails = {};

const PlayIO = (socket) => {
  // console.log(socket.nsp)
  console.log("User connected");
  //   console.log(socket.request.kHeaders)
  let cur;
  if (socket.user) {
    cur = socket.user.username;
  } else {
    cur = null;
  }
  socket.on("joinRoom", async ({ roomId }) => {
    console.log("joinRoom");

    try {
      // let start = Date.now();
      var id = new mongoose.Types.ObjectId(roomId);
 
      // console.log(roomId);
      let game = await Game.findById(id);
      // console.log(game);
      // console.log(`Fetch game in`, Date.now() - start, "MS");
      gameDetails[roomId] = game;

      if (
        cur == gameDetails[roomId].player1 ||
        cur == gameDetails[roomId].player2
      ) {
        socket.emit("gameDetails", { data: gameDetails[roomId], user: cur });
      } else {
        socket.emit("gameDetails", { data: gameDetails[roomId], user: null });
      }
      socket.join(roomId);
    } catch (error) {
      console.log("join room error", error);
    }
  });


  socket.on("makeMove", async ({ move, roomId }) => {
    if (
      cur == gameDetails[roomId].player1 ||
      cur == gameDetails[roomId].player2
    ) {
      try {
        var id = new mongoose.Types.ObjectId(roomId);

        const game = await Game.findById(id);
 
        // console.log(game);
        const chess = new Chess();
        if (game.pgn !== "") {
          chess.load_pgn(game.pgn);
        }

        if (chess.game_over()) {
          return;
        }
 let time = game.timeData;
        let timep1 = game.timeByP1;
        let timep2 = game.timeByP2;
        let newelem;

        if (time.length == 0) {
          newelem = {
            date: Date.now(),
            duration: Date.now() - game.startDate,
          };
          // console.log({ newelem });
          // console.log(game.timeByP1);
          timep1 += newelem.duration;
          // console.log(game.timeByP1);
        } else {
          let last = time[time.length - 1];
          // console.log({ last });
          newelem = {
            date: Date.now(),
            duration: Date.now() - last.date,
          };
          // console.log({ newelem });
          if (time.length % 2 == 1) {
            // console.log(game.timeByP2);
            timep2 += newelem.duration;
            // console.log(game.timeByP2);
          } else {
            // console.log(game.timeByP1);
            timep1 += newelem.duration;
            // console.log(game.timeByP1);
          }
        }

        let newArray = game.timeData.push(newelem);

        if (timep1 >= game.totalTime || timep2 >= game.totalTime) {
          let won = game.player1;
          if (cur == game.player1) {
            won = game.player2;
          }
          game.result = won;
          const newgame = await Game.findByIdAndUpdate(id, game, {
            upsert: true,
            returnDocument: "after",
          });
          return;
        }
        let moveBool = chess.move({
          from: move.from,
          to: move.to,
          promotion: "q", // NOTE: always promote to a queen for example simplicity
        });
        if (moveBool == null) return;

        if (chess.in_checkmate()) {
          let won = cur;
          game.result = won;
          const newgame = await Game.findByIdAndUpdate(id, game, {
            upsert: true,
            returnDocument: "after",
          });
          return;
        }

        if (chess.game_over()) {
          game.result = "Draw";
          const newgame = await Game.findByIdAndUpdate(id, game, {
            upsert: true,
            returnDocument: "after",
          });
          return;
        }

       
        game.timeData = newArray;
        game.timeByP1 = timep1;
        game.timeByP2 = timep2;
        // console.log(newArray, game.timeData);
        game.pgn = String(chess.pgn());
        const newgame = await Game.findByIdAndUpdate(id, game, {
          upsert: true,
          returnDocument: "after",
        });
        // console.log(newgame);
        socket.to(roomId).emit("OpponentMoved", { move, newgame });
      } catch (error) {
        console.log(error);
      }
    }
  });
};

export default PlayIO;
