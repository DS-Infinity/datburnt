const makeid = require("../utils/makeid");
const state = require("../state");
const { parse } = require("cookie");
const jwt = require("jsonwebtoken");
// import { hop } from "../utils/hop";
const hop = require("../utils/hop");
const channelId = "online_users";

const User = require("../models/User");

function sortGames(games) {
  const g = [];

  games.forEach((game) => {
    if (game.private == false && game.started == false) {
      g.push(game);
    }
  });

  return g;
}

module.exports = (io) => {
  io.use(async (socket, next) => {
    const cookies = parse(socket.request.headers.cookie);
    const token = cookies.token;

    try {
      let decoded = jwt.verify(token, process.env.JWT_KEY);
      const user = await User.findOne({ _id: decoded.id }).lean();
      socket.user = user;
      next();
    } catch (e) {
      next();
    }
  });

  io.on("connection", (socket) => {
    hop.channels.setState(channelId, (s) => ({
      ...s,
      name: "My Channel",
      users: [...s.users, socket.user],
    }));
    socket.emit("games", { games: sortGames(state.games) });

    socket.on('disconnect', () => {
      // hop.channels.getStats(channelId).then((stats) => {
      //   console.log(stats);
      // });
      hop.channels.setState(channelId, (s) => ({
        ...s,
        name: "My Channel",
        users: s.users.filter(
          (u) => u._id.toString() !== socket.user._id.toString()
        ),
      }));
      socket.removeAllListeners();
      socket.disconnect();
    });

    socket.on("newgame", (payload) => {
      const code = makeid(6);
      const newGame = {
        ...payload,
        players: [],
        started: false,
        currentRound: 0,
        rounds: [],
        votes: [],
        code,
        owner: socket.user._id.toString(),
        prevQs: [],
      };

      state.setGames([...state.games, newGame]);
      io.emit("games", { games: sortGames(state.games) });
      io.to(socket.id).emit("redirect", code);
      socket.disconnect();

      console.log(`Creating new game ${code}`);
      console.log("No. of Rooms:", state.games.length);
    });
  });
};
