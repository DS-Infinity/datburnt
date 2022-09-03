import { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { userState } from "../../utils/userAtom";

const Voting = ({ voteCandidates, submitVote }) => {
  const [candidates, setCandidates] = useState([]);
  const [user, setUser] = useRecoilState(userState);

  const [startCountdown, setStartCountdown] = useState(false);
  const [voted, setVoted] = useState(false);
  const [vote, setVote] = useState("");

  useEffect(() => {
    const c = [];
    voteCandidates.forEach((can) => {
      if (can.roast.replaceAll(" ", "").length > 0 && can.userid != user._id) {
        c.push(can);
      }
    });
    setCandidates(c);
    if (c.length < 2) {
      if (!voted) {
        setTimeout(() => {
          if (!voted) {
            submitVote("NEO");
          }
          setVoted(true);
          // clearInterval(interval);
        }, 2000);
      }
    }

    if (voteCandidates.length >= 2) {
      setStartCountdown(true);
    }
  }, [voteCandidates]);

  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    if (startCountdown) {
      const interval = setInterval(() => {
        if (countdown <= 0) {
          clearInterval(interval);
          if (!voted) {
            //   setSubmitted(true);
            const interval2 = setInterval(() => {
              submitVote("");
              clearInterval(interval2);
            }, 2000);
          }
        } else {
          setCountdown(countdown - 1);
          clearInterval(interval);
        }

        return () => clearInterval(interval);
      }, 1000);
    }
  }, [countdown, startCountdown]);

  return (
    <div>
      Voting{" "}
      <div>
        {candidates.length < 2 ? (
          <div>Not enough people submitted a roast :(</div>
        ) : (
          candidates.map((candidate) => {
            return (
              <div
                key={candidate.userid}
                style={{
                  background: candidate.userid === vote ? "#f00" : "#fff",
                }}
                onClick={() => {
                  if (!voted) {
                    setVoted(true);
                    setVote(candidate.userid);
                    submitVote(candidate.userid);
                  }
                }}
              >
                {candidate.roast}
              </div>
            );
          })
        )}
      </div>
      <div>{countdown}</div>
    </div>
  );
};

export default Voting;
