var stockfish = new Worker("stockfish.js");
 // start UCI
 stockfish.postMessage("uci");
 // start new game
 stockfish.postMessage("ucinewgame");
 // set new game position