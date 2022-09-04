import { useRecoilState } from 'recoil';
import PrimaryButton from '../../components/Button/Primary';
import { userState } from '../../utils/userAtom';
import styles from './score.module.scss';

const Score = ({ scores, owner, nextRound, currentRound }) => {
  const [user, setUser] = useRecoilState(userState);

  return (
    <div className={styles.main}>
      <h1>Scorecheck</h1>
      <div className={styles.scores}></div>
      <div>
        {scores.map((score) => {
          return (
            <p>
              {score.username} - {score.score}
            </p>
          );
        })}
      </div>
      <div className={styles.bottom}>
        <div className={styles.position}>Congrats! You are on 1st place!</div>
        <div className={styles.button}>
          {user._id === owner ? (
            <PrimaryButton
              onClick={() => {
                console.log('next round');
                nextRound();
              }}
            >
              {currentRound == 5 ? 'View Results!' : 'Next Round'}
            </PrimaryButton>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Score;
