import jwt from "jsonwebtoken";

const checktoken = (req, res, next) => {
  // console.log(req.cookies)
  const authHeader = req.cookies['token'];
  if(authHeader)
  {
    jwt.verify(authHeader,process.env.SECRET_KEY,(err,decoded)=>{
        if(err)
        {
            console.log(err)
            console.log('error in token')
        }
        else{
            req.user=decoded;
        }
    })
  }
  next();
};

export default checktoken;
