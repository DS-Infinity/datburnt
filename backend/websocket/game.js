const makeid = require("../utils/makeid");
const state = require("../state");
const { parse } = require("cookie");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

function findGame(code) {
  const games = state.games;
  let g;

  games.some((game) => {
    if (game.code === code) {
      g = game;
      return true;
    }
  });

  return g;
}

function getRound(categories, previousRounds) {
  return {
    image:
      "https://media.discordapp.net/attachments/772689583019393084/1015302933526622318/unknown.png?width=638&height=586",
    category: "Politics",
  };
}

function updateGame(code, newGame) {
  const index = state.games.findIndex((game) => game.code === code);
  const games = [...state.games];
  games[index] = newGame;

  state.setGames(games);
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
    console.log("New Game Connection: ", socket.id);

    socket.on("disconnect", () => {
      console.log("Game Disconnection: ", socket.id);
      const code = state.sockets[socket.id];

      if (code) {
        console.log("Leaving from ", code);
        const game = findGame(code);
        const index = game.players.findIndex(
          (p) => p.id === socket.user._id.toString() && p.socketId === socket.id
        );

        if (index >= 0) {
          game.players.splice(index, 1);
          updateGame(code, game);
          state.setSockets({ ...state.sockets, [socket.id]: null });
          io.in(code).emit("players", game.players);
        }
      }
      socket.removeAllListeners();
      socket.disconnect();
    });

    socket.on("join-game", (code) => {
      const game = findGame(code);

      if (!game) {
        io.to(socket.id).emit("game-details", {
          success: false,
          message: "Game not Found",
        });
      } else {
        if (game.started) {
          io.to(socket.id).emit("game-details", {
            success: false,
            message: "Game has already started",
          });
        } else if (game.players.length >= game.maxPlayers) {
          io.to(socket.id).emit("game-details", {
            success: false,
            message: "Game is full",
          });
        } else if (
          game.players.find((p) => p.id == socket.user._id.toString())
        ) {
          io.to(socket.id).emit("game-details", {
            success: false,
            message: "You have already joined this game",
          });
        } else {
          const newGame = {
            ...game,
            players: [
              {
                id: socket.user._id.toString(),
                socketId: socket.id,
                username: socket.user.name,
                avatarUrl: socket.user.avatar,
                score: 0,
              },
              ...game.players,
            ],
          };

          updateGame(code, newGame);
          state.setSockets({ ...state.sockets, [socket.id]: code });
          socket.join(code);
          socket.emit("game-details", {
            success: true,
            game: {
              ...newGame,
              rounds: null,
            },
          });
          io.in(code).emit("players", newGame.players);
        }
      }
    });

    socket.on("start", (code) => {
      const game = findGame(code);
      if (game.owner.toString() == socket.user._id.toString()) {
        console.log("request to start game", code);
        const round = getRound(game.categories, game.rounds);
        const newGame = { ...game, started: true, currentRound: 1 };
        updateGame(code, newGame);
        io.in(code).emit("next-round", { round: 1, details: round });
      }
    });

    socket.on("submit", ({ code, roast }) => {
      const game = findGame(code);
      if (!game.rounds[game.currentRound]) {
        game.rounds[game.currentRound] = [];
      }
      game.rounds[game.currentRound].push({
        userid: socket.user._id.toString(),
        roast,
        votes: 0,
      });
      updateGame(code, game);
      if (game.rounds[game.currentRound].length >= game.players.length) {
        io.in(code).emit("voting", game.rounds[game.currentRound]);
      }
    });
  });
};
