import { useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import PrimaryButton from "../../components/Button/Primary";
import { userState } from "../../utils/userAtom";
import styles from "./score.module.scss";

import useSound from "use-sound";

const colors = [
  "#DA8C18",
  "#DA3B18",
  "#2A5FE8",
  "#5715E2",
  "#3CDA14",
  "#07C269",
  "#F35B05",
  "#9018DA",
];

const Score = ({ scores, owner, nextRound, currentRound }) => {
  const [user, setUser] = useRecoilState(userState);
  const [highestScore, setHighestScore] = useState(0);
  const containerRef = useRef(null);

  const [play, { isPlaying }] = useSound("/sounds/monkeys.mp3");

  useEffect(() => {
    if (play && !isPlaying) {
      play();
    }
  }, [play, isPlaying]);

  useEffect(() => {
    let h = 0;
    scores.forEach((s) => {
      if (s.score > h) {
        h = s.score;
      }
    });
    setHighestScore(h);
  }, [scores]);

  return (
    <div className={styles.main}>
      <h1>Scorecheck</h1>
      <div className={styles.scores}></div>
      <div className={styles["score-chart"]} ref={containerRef}>
        <div className={styles["score-chart__bars"]}>
          {scores.map((score, i) => {
            return (
              <div
                style={{
                  height: "100%",
                  width: `${100 / scores.length}%`,
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "center",
                  //   background: c,
                  maxWidth: "180px",
                }}
              >
                <div
                  style={{
                    height: `${(score.score / highestScore) * 100}%`,
                    width: `calc(100% - 40px)`,
                    background: colors[i],
                    borderRadius: "14px 14px 0 0",
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "center",
                    paddingBottom: "20px",
                    fontSize: "2em",
                    fontWeight: 700,
                    color: score.score === 0 ? "#5E5E5E" : "#fff",
                    // minWidth: "80px",
                  }}
                >
                  {score.score}
                </div>
              </div>
            );
          })}
        </div>
        <div className={styles["score-chart__line"]}></div>
        <div className={styles["score-chart__avatars"]}>
          {scores.map((s) => {
            return (
              <div
                style={{
                  height: "90px",
                  width: `${100 / scores.length}%`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img src={s.avatarUrl} />
              </div>
            );
          })}
        </div>
      </div>
      <div className={styles.bottom}>
        <div className={styles.position}>The game's not over yet ;)</div>
        <div className={styles.button}>
          {user._id === owner ? (
            <PrimaryButton
              onClick={() => {
                // ("next round");
                nextRound();
              }}
            >
              {currentRound == 5 ? "View Results!" : "Next Round"}
            </PrimaryButton>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Score;
