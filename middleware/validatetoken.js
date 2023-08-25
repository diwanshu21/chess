import jwt from "jsonwebtoken";

const validatetoken = (req, res, next) => {
  const authHeader = req.cookies["token"];
  if (authHeader) {
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        console.log(err);
        res
          .status(400)
          .json({ success: false, message: "authentication failed" });
      } else {
        next();
      }
    });
  }
  res.status(400).json({ success: false, message: "authentication failed" });
};

export default validatetoken;
