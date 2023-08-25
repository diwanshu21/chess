import { connect } from "mongoose";

// Replace 'your-db-uri' with your MongoDB URI

function connectDB(url) {
  return connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  
  });
}

export default connectDB;
