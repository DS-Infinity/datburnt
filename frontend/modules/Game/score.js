import { useRecoilState } from "recoil";
import { userState } from "../../utils/userAtom";

const Score = ({ scores, owner, nextRound, currentRound }) => {
  const [user, setUser] = useRecoilState(userState);

  return (
    <div>
      Scorecheck
      <div>
        {scores.map((score) => {
          return (
            <p>
              {score.username} - {score.score}
            </p>
          );
        })}
      </div>
      <div>
        {user._id === owner && (
          <button onClick={() => nextRound()}>
            {currentRound == 5 ? "View Results!" : "Next Round"}
          </button>
        )}
      </div>
    </div>
  );
};

export default Score;
