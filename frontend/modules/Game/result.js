import PrimaryButton from "../../components/Button/Primary";
import styles from "./result.module.scss";
import { useRecoilState } from "recoil";
import { userState } from "../../utils/userAtom";

const Result = ({ owner, results }) => {
  const [user, setUser] = useRecoilState(userState);

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
      <div className={styles.bottom}>
        <div className={styles.position}>
          Congratulations! You are on{" "}
          {results.findIndex((p) => p.id === user._id) + 1}
          {getEnding(results.findIndex((p) => p.id === user._id) + 1)} place!
        </div>
        <div style={{ flex: 1 }} />
        {owner == user._id && (
          <PrimaryButton className={styles["end-button"]}>
            End Game
          </PrimaryButton>
        )}
      </div>
    </div>
  );
};

export default Result;
