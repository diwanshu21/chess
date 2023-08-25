import Game from "../model/Game.js";
import PlayIO from "../socketio/PlayNamespace.js";

const homePage = (req, res) => {
  let obj={user: req.user};
  console.log(obj)
  if(req.user)
  {
    fetch(`http://localhost:3000/api/v1/allgames/${req.user.userId}`).then(res=>res.json()).then(games=>{
console.log(games)
    res.render("index", { user: req.user,games:games.allgames });
  }).catch(error=>{
    console.log(error)
    res.render("index", { user: req.user});
  })
  }
  else{
    console.log('homereached')
    res.render("index", { user: req.user });
  }
  
};

const loginPage = (req, res) => {
  res.render("login");
};

const registerPage = (req, res) => {
  res.render("register");
};

const GamePage = async (req, res) => {
  const io=global.io;
  try {
    // let username = req.user.username;
    let gameID = req.params["id"];
    // console.log(gameID)

    let game = await Game.findOne({ gameID });
    // console.log(game)
    // game.username=username;

    // io.sockets.sockets.get(playRequest[key]).join(gameID);
    // io.sockets.sockets.get(playRequest[key]).join(gameID);
    
    res.status(200).render("game", { gameData:game });
  } catch (error) {
    console.log(error);
  }
};

export { homePage, loginPage, registerPage, GamePage };
