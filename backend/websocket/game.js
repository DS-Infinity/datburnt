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

const images = [
  {
    url: "https://media.discordapp.net/attachments/772689583019393084/1015302933526622318/unknown.png?width=638&height=586",
    category: "Politics",
  },
  {
    url: "https://cdn.discordapp.com/attachments/896998944935120907/1015909432254808104/unknown.png",
    category: "Politics",
  },
  {
    url: "https://cdn.discordapp.com/attachments/896998944935120907/1015909608520437800/unknown.png",
    category: "Politics",
  },
  {
    url: "https://cdn.discordapp.com/attachments/896998944935120907/1015909737495269376/unknown.png",
    category: "Politics",
  },
  {
    url: "https://cdn.discordapp.com/attachments/896998944935120907/1015910009428787200/unknown.png",
    category: "Politics",
  },
  {
    url: "https://cdn.discordapp.com/attachments/896998944935120907/1015910704856973392/unknown.png",
    category: "Sports",
  },
  {
    url: "https://cdn.discordapp.com/attachments/896998944935120907/1015911232563322890/unknown.png",
    category: "Sports",
  },
  {
    url: "https://cdn.discordapp.com/attachments/896998944935120907/1015911668057903124/unknown.png",
    category: "Sports",
  },
  {
    url: "https://media.discordapp.net/attachments/772689583019393084/1016290324919877652/unknown.png",
    category: "Celebs",
  },
  {
    url: "https://media.discordapp.net/attachments/772689583019393084/1016290500615090206/unknown.png",
    category: "Celebs",
  },
  {
    url: "https://media.discordapp.net/attachments/772689583019393084/1016290677165932564/unknown.png",
    category: "Celebs",
  },
  {
    url: "https://media.discordapp.net/attachments/772689583019393084/1016290893520719932/unknown.png",
    category: "Celebs",
  },
  {
    url: "https://media.discordapp.net/attachments/772689583019393084/1016291675875844137/unknown.png",
    category: "Celebs",
  },
  {
    url: "https://media.discordapp.net/attachments/772689583019393084/1016291733262303323/unknown.png",
    category: "Celebs",
  },
  {
    url: "https://media.discordapp.net/attachments/772689583019393084/1016292558864916550/unknown.png",
    category: "Companies",
  },
  {
    url: "https://media.discordapp.net/attachments/772689583019393084/1016292780642943046/unknown.png",
    category: "Companies",
  },
  {
    url: "https://media.discordapp.net/attachments/772689583019393084/1016293192301297764/unknown.png",
    category: "Companies",
  },
  {
    url: "https://media.discordapp.net/attachments/772689583019393084/1016293399348924516/unknown.png",
    category: "Companies",
  },
  {
    url: "https://media.discordapp.net/attachments/772689583019393084/1016293843399884830/unknown.png",
    category: "Companies",
  },
  {
    url: "https://media.discordapp.net/attachments/772689583019393084/1016293883832979496/unknown.png",
    category: "Random",
  },
  {
    url: "https://media.discordapp.net/attachments/772689583019393084/1016294272384892948/unknown.png",
    category: "Random",
  },
  {
    url: "https://media.discordapp.net/attachments/772689583019393084/1016294352135409716/unknown.png",
    category: "Companies",
  },
  {
    url: "https://media.discordapp.net/attachments/772689583019393084/1016296668334919760/unknown.png",
    category: "Celebs",
  },
];

function getRound(categories, previousRounds) {
  let foundUnique = false;
  let ques;

  while (!foundUnique) {
    const index = Math.floor(Math.random() * images.length);
    const q = images[index];

    if (previousRounds.filter((p) => p.image === q.url).length === 0) {
      foundUnique = true;
      ques = q;
    }
  }

  return {
    image: ques.url,
    category: ques.category,
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
    socket.on("disconnect", () => {
      const code = state.sockets[socket.id];

      if (code) {
        const game = findGame(code);
        if (game) {
          const index = game.players.findIndex(
            (p) =>
              p.id === socket.user._id.toString() && p.socketId === socket.id
          );

          if (index >= 0) {
            game.players.splice(index, 1);
            console.log(
              `${socket.id} left room ${code}. ${game.players.length} Players left in room`
            );
            updateGame(code, game);
            state.setSockets({ ...state.sockets, [socket.id]: null });
            io.in(code).emit("players", game.players);

            if (game.players.length <= 0) {
              const gameIndex = state.games.findIndex((g) => g.code === code);
              const gs = [...state.games];
              gs.splice(gameIndex, 1);
              state.setGames(gs);
              state.setSockets({ ...state.sockets, [socket.id]: null });
              io.in(code).emit("end");
              console.log("Deleting Room:", code);
              console.log("No. of Rooms Now:", gs.length);
            }
          }
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
              votes: null,
            },
          });
          io.in(code).emit("players", newGame.players);
        }
      }
    });

    socket.on("start", (code) => {
      const game = findGame(code);
      if (
        game.owner.toString() == socket.user._id.toString() &&
        game.players.length >= 3
      ) {
        const round = getRound(game.categories, game.prevQs);
        const newGame = {
          ...game,
          started: true,
          currentRound: 1,
          prevQs: [...game.prevQs, round],
        };
        updateGame(code, newGame);
        io.in(code).emit("next-round", { round: 1, details: round });
      }
    });

    socket.on("submit", ({ code, roast }) => {
      const game = findGame(code);
      if (!game.rounds[game.currentRound]) {
        game.rounds[game.currentRound] = [];
      }

      const hasSubmitted = game.rounds[game.currentRound].find(
        (sub) => sub.userid === socket.user._id.toString()
      );

      if (!hasSubmitted) {
        game.rounds[game.currentRound].push({
          userid: socket.user._id.toString(),
          roast,
          votes: 0,
        });
        updateGame(code, game);
        if (game.rounds[game.currentRound].length >= game.players.length) {
          setTimeout(() => {
            io.in(code).emit("voting", game.rounds[game.currentRound]);
          }, 1000);
        }
      }
    });

    socket.on("vote", ({ code, vote }) => {
      const game = findGame(code);
      if (!game.votes[game.currentRound]) {
        game.votes[game.currentRound] = [];
      }

      const hasVoted = game.votes[game.currentRound].find(
        (vote) => vote.voter === socket.user._id.toString()
      );

      if (!hasVoted) {
        game.votes[game.currentRound].push({
          voter: socket.user._id.toString(),
          vote: vote,
        });
        updateGame(code, game);

        if (game.votes[game.currentRound].length >= game.players.length) {
          const game = findGame(code);
          const voters = [];
          game.votes[game.currentRound].forEach((v) => {
            if (v.vote.replaceAll(" ", "").trim().length > 0) {
              voters.push(v.voter);
            }
          });
          game.votes[game.currentRound].forEach((v) => {
            if (voters.includes(v.vote)) {
              const i = game.players.findIndex((p) => p.id === v.vote);
              const playerToIncreaseScore = { ...game.players[i] };
              playerToIncreaseScore.score += 50;
              game.players[i] = playerToIncreaseScore;
            }
          });

          updateGame(code, game);
          setTimeout(() => {
            io.in(code).emit("score", game.players);
          }, 1000);
        }
      }
    });

    socket.on("next-round", (code) => {
      const game = findGame(code);
      if (game.owner === socket.user._id.toString()) {
        const nextRound = game.currentRound + 1;

        if (nextRound > 5) {
          const winners = game.players.sort((a, b) => {
            return -(a.score - b.score);
          });
          io.in(code).emit("results", winners);
        } else {
          const round = getRound(game.categories, game.prevQs);
          const newGame = {
            ...game,
            started: true,
            currentRound: nextRound,
            prevQs: [...game.prevQs, round],
          };
          updateGame(code, newGame);
          io.in(code).emit("next-round", { round: nextRound, details: round });
        }
      }
    });

    socket.on("end", (code) => {
      const gameIndex = state.games.findIndex((g) => g.code === code);
      const gs = [...state.games];
      gs.splice(gameIndex, 1);
      state.setGames(gs);
      state.setSockets({ ...state.sockets, [socket.id]: null });
      io.in(code).emit("end");
    });

    socket.on("remove-player", ({ code, id }) => {
      const game = findGame(code);

      if (game.owner === socket.user._id.toString()) {
        const i = game.players.findIndex((p) => p.id === id);
        const playerToRemove = game.players[i];
        if (playerToRemove && playerToRemove.socketId) {
          const newPlayers = [...game.players];
          newPlayers.splice(i, 1);
          game.players = newPlayers;
          updateGame(code, game);

          io.to(playerToRemove.socketId).emit("game-details", {
            success: false,
            message: "You have been removed from this game!",
          });
          io.in(code).emit("players", newPlayers);
        }
      }
    });
  });
};
