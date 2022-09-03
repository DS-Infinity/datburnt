import { useState, useEffect } from 'react';
import PrimaryButton from '../../components/Button/Primary';
import styles from './roast.module.scss';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';

const Roast = ({ round, details, submitRoast }) => {
  const [myRoast, setMyRoast] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    const interval = setInterval(() => {
      if (countdown <= 0) {
        clearInterval(interval);
        if (!submitted) {
          //   setSubmitted(true);
          const interval2 = setInterval(() => {
            submitRoast('');
            clearInterval(interval2);
          }, 2000);
        }
      } else {
        setCountdown(countdown - 1);
        clearInterval(interval);
      }

      return () => clearInterval(interval);
    }, 1000);
  }, [countdown]);

  return (
    <div>
      <div className={styles.main}>
        <h1>Round {round}</h1>
        <div className={styles.roastImg}>
          <img src={details.image} className={styles.roastImage} />
          <p>Category: {details.category}</p>
        </div>
        {countdown <= 0 && !submitted ? (
          <div className={styles.done}>Time's Up!</div>
        ) : submitted ? (
          <div className={styles.done}>I bet that one hurt</div>
        ) : (
          <form className={styles.roastForm}>
            <input
              placeholder='Your Roast'
              value={myRoast}
              onChange={(e) => setMyRoast(e.target.value)}
            />
            <PrimaryButton
              onClick={() => {
                if (myRoast.length > 0) {
                  submitRoast(myRoast);
                  setSubmitted(true);
                }
              }}
            >
              Roast!
            </PrimaryButton>
          </form>
        )}
      </div>

      <div className={styles.bottom}>
        <div className={styles.hurry}>
          {countdown <= 0 && !submitted ? (
            <span>Waiting for others to submit...</span>
          ) : submitted ? (
            <span>Waiting for others to submit...</span>
          ) : (
            <span>Hurry Up Bruv! People are submitting!</span>
          )}
        </div>
        {countdown <= 0 && !submitted ? null : submitted ? null : (
          <div className={styles.timer}>
            <CountdownCircleTimer
              size={84}
              isPlaying
              duration={30}
              colors={'#E93131'}
            >
              {({ remainingTime }) => remainingTime}
            </CountdownCircleTimer>
          </div>
        )}
      </div>
    </div>
  );
};

export default Roast;
