const dotenv = require("dotenv");
dotenv.config();
// const OAuthServer = require("express-oauth-server")
const express = require("express");
const mongoose = require("mongoose");
const authRouter = require("./routes/auth");
const cookieParser = require("cookie-parser");
const app = express();
const config = require("./config");

const server = require("http").createServer(app);
var io = require("socket.io")(server, {
  cors: {
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_URL_PROD
        : process.env.FRONTEND_URL_DEV,
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});
require("./websocket/index").server(io);

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useFindAndModify: false,
    // useCreateIndex: true,
  })
  .then(() => console.log("Connected to MongoDB......."))
  .catch((err) => console.log(err));

app.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Origin",
    process.env.NODE_ENV === "production"
      ? process.env.FRONTEND_URL_PROD
      : process.env.FRONTEND_URL_DEV
  );
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, x-auth-token, Authorization"
  );
  next();
});

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRouter);

app.get("/", (req, res) => {
  res.send("Hare Rama");
});

const port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log(`Server Listening on port ${port}`);
});
