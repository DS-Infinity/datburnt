var State = (module.exports = {
  games: [
    {
      code: "xwerfe",
      private: true,
      started: false,
      currentRound: 0,
      maxPlayers: 5,
      owner: "6303ac144024b5c0ea8ef4ba",
      players: [],
      rounds: [],
      categories: ["Politics", "Sports", "Celebs"],
      votes: [],
      prevQs: [],
    },
  ],
  setGames: function (newGames) {
    State.games = newGames;
  },
  sockets: {},
  setSockets: function (newSockets) {
    State.sockets = newSockets;
  },
});
