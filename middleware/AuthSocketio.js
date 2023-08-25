import jwt from "jsonwebtoken";
import cookie from 'cookie'

const authenticateUser = (socket, next) => {

    const cookies = cookie.parse(socket.request.headers.cookie || "");
    // console.log(cookies)
  jwt.verify(cookies.token,process.env.SECRET_KEY,(err,decoded)=>{
    if(err)
    {
        // console.log(err)
        next();
    }
    else{
        console.log('socketio authenticated')
        socket.user=decoded;
        next();
    }
})

};

export default authenticateUser;