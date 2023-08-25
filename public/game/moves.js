function parsePGN(pgn) {
//   const moves = pgn.match(/\d+\.\s*(\S+)(?:\s+\S+)?/g);
//   const parsedMoves = [];

//   if (moves) {
//     moves.forEach((move) => {
//       const sanitizedMove = move.replace(/\d+\.\s*/, "");
//       parsedMoves.push(sanitizedMove);
//     });
//   }

//   return parsedMoves;
const moves = pgn.split(/\s+/).filter(move => move !== '');
  return moves;
}

function moves(pgn) {
  let moves = document.querySelector(".moves");


while (moves.firstChild) {
  moves.removeChild(moves.firstChild);
}
  const parsedMoves = parsePGN(pgn);
    let col1=document.createElement('div.col1');
    let col2=document.createElement('div.col2');
  let info="";

  for(let i=0;i<parsedMoves.length;i++)
  {
      let blk=document.createElement('li');

      
      info+=parsedMoves[i]+" ";
      blk.innerHTML=parsedMoves[i];
      blk.setAttribute('data-pgn',info);
      if(i%3==1)
      {
        col1.appendChild(blk);
    }
    else if(i%3==2){
          col2.appendChild(blk);
      }
      blk.addEventListener('click',(e)=>{
        let elem=e.target;
        const pgn1=elem.getAttribute('data-pgn');
        let game1 = new Chess();
        game1.load_pgn(pgn1);
        let pos=game1.fen();
        board.position(pos,true)
    })
  }

  moves.appendChild(col1);
  moves.appendChild(col2);
}
//   const pgn = "1. e4 e5 2. Nf3 Nc6";
//   const parsedMoves = parsePGN(pgn);

//   console.log(parsedMoves);
