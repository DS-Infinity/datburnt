const jwt = require("jsonwebtoken");

async function auth(req, res, next) {
  const token = req.cookies.token;

  try {
    let decoded = jwt.verify(token, process.env.JWT_KEY);
    req.user = decoded;
    next();
  } catch (e) {
    res.send({ success: false, message: "Invalid token" });
  }
}

module.exports = auth;
