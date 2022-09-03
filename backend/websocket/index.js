const homeSocket = require("./home");
const gameSocket = require("./game");

/*
{
    code: "xwerfe",
    private: false,
    started: false, 
    currentRound: 0,
    maxPlayers: 5,
    owner: "id",
    players: [
        {
            id: "userid",
            username: "username",
            avatar: "avatarurl",
            score: 0
        }
    ],
    rounds: [
        [
            {
                userId: "userid",
                submission: "submission string",
                votes: 0
            }
        ]
    ],
    votes: [[voter: "userid", vote: "userid"]]
    categories: ["politics", "sports", "celebs"]
*/

module.exports = {
  server: (io) => {
    const home = io.of("/home");
    homeSocket(home);

    const game = io.of("/game");
    gameSocket(game);
  },
};
