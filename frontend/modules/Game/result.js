import PrimaryButton from "../../components/Button/Primary";
import styles from "./result.module.scss";
import { useRecoilState } from "recoil";
import { userState } from "../../utils/userAtom";
import useSound from "use-sound";
import { useEffect } from "react";

const Result = ({ owner, results, endGame }) => {
  const [user, setUser] = useRecoilState(userState);
  const [playNyan, { isPlaying }] = useSound("/sounds/thug_life.mp3");

  useEffect(() => {
    let interval;
    if (playNyan && !isPlaying) {
      interval = setInterval(() => {
        // ('playing nyan');
      }, 17000);
      playNyan();
    }
    () => clearInterval(interval);
  }, [playNyan, isPlaying]);

  function getEnding(place) {
    if (place === 1) {
      return "st";
    } else if (place === 2) {
      return "nd";
    } else if (place === 3) {
      return "rd";
    } else {
      return "th";
    }
  }

  return (
    <div className={styles.main}>
      <h1>Results</h1>
      <div className={styles.results}>
        <div className={styles.second}>
          <img src={results[1].avatarUrl} className={styles["winner-avatar"]} />
          <p className={styles["winner-name"]}>{results[1].username}</p>
          <div className={styles.second_pedestal}>2nd</div>
        </div>
        <div className={styles.first}>
          <img src={results[0].avatarUrl} className={styles["winner-avatar"]} />
          <p className={styles["winner-name"]}>{results[0].username}</p>

          <div className={styles.first_pedestal}>1st</div>
        </div>
        <div className={styles.third}>
          <img src={results[2].avatarUrl} className={styles["winner-avatar"]} />
          <p className={styles["winner-name"]}>{results[2].username}</p>
          <div className={styles.third_pedestal}>3rd</div>
        </div>
      </div>
      <div className={styles.bottom}>
        <div className={styles.position}>
          Congratulations! You are on{" "}
          {results.findIndex((p) => p.id === user._id) + 1}
          {getEnding(results.findIndex((p) => p.id === user._id) + 1)} place!
        </div>
        <div style={{ flex: 1 }} />
        {owner == user._id && (
          <PrimaryButton className={styles["end-button"]} onClick={endGame}>
            End Game
          </PrimaryButton>
        )}
      </div>
    </div>
  );
};

export default Result;
