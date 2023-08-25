import mongoose from "mongoose";
// Define the game schema
const gameSchema = new mongoose.Schema(
  {
    player1: {
      type: String,
      required: true,
    },

    player2: {
      type: String,
      required: true,
    },
    pgn: {
      type: String,
    },
    startDate: {
      type: Number,
    },
    timeByP1: {
      type: Number,
    },
    timeByP2: {
      type: Number,
    },
    totalTime: {
      type: Number,
    },
    timeData: [
      {
        date: {
          type: Number,
        },
        duration: {
          type: Number,
        },
      },
    ],
    result:{
      type:String,
      default:'---'
    }
  },
  { timestamps: true }
);

function PRE() {
  this._startTime = Date.now();
}
function POST() {
  if (this._startTime != null) {
    console.log("Runtime in MS: ", Date.now() - this._startTime);
  }
}
gameSchema.pre("find", PRE);
gameSchema.pre("findOne", PRE);
gameSchema.pre("findOneAndUpdate", PRE);
gameSchema.pre("findById", PRE);
gameSchema.pre("findByIdAndUpdate", PRE);

gameSchema.post("find", POST);
gameSchema.post("findOne", POST);
gameSchema.post("findById", POST);
gameSchema.post("findByIdAndUpdate", POST);

// Create the user model from the schema
const Game = mongoose.model("Game", gameSchema);

// Export the user model
export default Game;
