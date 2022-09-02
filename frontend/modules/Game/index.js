import { useState, useEffect } from "react";
import Loader from "../../components/Loader";
import io from "socket.io-client";
import { useRecoilState } from "recoil";
import { userState } from "../../utils/userAtom";
import { useRouter } from "next/router";
import WaitingRoom from "./waiting";
import Roast from "./roast";
import Voting from "./voting";
let socket = null;

const GameContent = () => {
  const router = useRouter();

  const [user, setUser] = useRecoilState(userState);
  //   const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  const [players, setPlayers] = useState([]);
  const [details, setDetails] = useState({});
  const [currentRound, setCurrentRound] = useState(0);
  const [roundDetails, setRoundDetails] = useState({});
  const [showVoting, setShowVoting] = useState(false);
  const [showScores, setShowScores] = useState(false);

  useEffect(() => {
    if (user && router.query.code) {
      console.log(router.query.code);
      socket = io(`${process.env.NEXT_PUBLIC_API_URL}/game`, {
        withCredentials: true,
      });
      socket.emit("join-game", router.query.code);

      socket.on("game-details", (payload) => {
        if (!payload.success) {
          setLoading(false);
          setErrorMsg(payload.message);
        } else {
          setLoading(false);
          setErrorMsg(null);
          setPlayers(payload.game.players);
          setDetails(payload.game);
          console.log(payload);
        }
      });

      socket.on("players", (players) => {
        console.log(players);
        setPlayers(players);
      });

      socket.on("next-round", (data) => {
        console.log(data);
        setCurrentRound(data.round);
        setRoundDetails(data.details);
        setShowVoting(false);
        setShowScores(false);
      });

      socket.on("voting", (data) => {
        setShowVoting(true);
        setShowScores(false);
      });
    }

    window.addEventListener("beforeunload", (e) => {
      //e.preventDefault()
      socket.emit("leave-game", router.query.code);
      socket?.disconnect();
    });

    return () => {
      if (router.query.code) {
        socket.emit("leave-game", router.query.code);
        socket.disconnect();
      }
    };
  }, [router.query.code]);

  useEffect(() => {
    console.log(players);
  }, [players]);
  return (
    <>
      {loading || !socket ? (
        <div
          style={{
            display: "flex",
            height: "80vh",
            width: "100vw",
          }}
        >
          <Loader center />
        </div>
      ) : (
        <div>
          {errorMsg ? (
            <div>{errorMsg}</div>
          ) : currentRound != 0 ? (
            !showVoting && !showScores ? (
              <Roast
                details={roundDetails}
                round={currentRound}
                submitRoast={(roast) =>
                  socket.emit("submit", {
                    code: router.query.code,
                    roast: roast,
                  })
                }
              />
            ) : showVoting ? (
              <Voting />
            ) : (
              <div></div>
            )
          ) : (
            <WaitingRoom
              details={details}
              onStart={() => {
                socket.emit("start", router.query.code);
              }}
              players={players}
            />
          )}
        </div>
      )}
    </>
  );
};

export default GameContent;
