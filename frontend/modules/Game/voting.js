import { useState, useEffect } from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { useRecoilState } from 'recoil';
import { userState } from '../../utils/userAtom';
import styles from './voting.module.scss';

const Voting = ({ details, voteCandidates, submitVote }) => {
  const [candidates, setCandidates] = useState([]);
  const [user, setUser] = useRecoilState(userState);

  const [startCountdown, setStartCountdown] = useState(false);
  const [voted, setVoted] = useState(false);
  const [vote, setVote] = useState('');

  useEffect(() => {
    const c = [];
    voteCandidates.forEach((can) => {
      if (can.roast.replaceAll(' ', '').length > 0 && can.userid != user._id) {
        c.push(can);
      }
    });
    setCandidates(c);
    if (c.length < 2) {
      if (!voted) {
        setTimeout(() => {
          if (!voted) {
            submitVote('NEO');
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
              submitVote('');
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
    <div className={styles.main}>
      <h1>Voting!</h1>
      <div className={styles.description}>
        Vote for the roast you think would have hurt the most!
      </div>
      <div className={styles.mainContainer}>
        <div className={styles.ImageContainer}>
          <img src={details.image} />
          <span>Category: {details.category}</span>
        </div>
        <div className={styles.candidates}>
          {candidates.length < 2 ? (
            <div className={styles.notEnough}>
              Not enough people submitted a roast :(
            </div>
          ) : (
            candidates.map((candidate) => {
              return (
                <div
                  className={styles.candidate}
                  key={candidate.userid}
                  style={
                    // background: candidate.userid === vote ? '#e93131' : '#fff',
                    candidate.userid === vote
                      ? {
                          background: '#e93131',
                          boxShadow: 'none',
                          color: '#fff',
                          transform: 'translateY(8px)',
                        }
                      : {}
                  }
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
      </div>
      <div className={styles.bottom}>
        <div className={styles.hurry}>HURRY UP</div>
        <div className={styles.timer}>
          <CountdownCircleTimer
            size={84}
            isPlaying
            duration={30}
            rea
            colors={'#E93131'}
            strokeWidth={8}
          >
            {({ remainingTime }) => countdown}
          </CountdownCircleTimer>
        </div>
      </div>
    </div>
  );
};

export default Voting;
