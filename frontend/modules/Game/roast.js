import { useState, useEffect } from "react";
import PrimaryButton from "../../components/Button/Primary";
import styles from "./roast.module.scss";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import useSound from "use-sound";

const Roast = ({ round, details, submitRoast }) => {
  const [countdown, setCountdown] = useState(3);
  const [playCountdown, { stop, isPlaying }] = useSound(
    "/sounds/countdown.mp3"
  );
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (countdown < 0) {
        stop();
        clearInterval(interval);
      } else {
        setCountdown(countdown - 1);
        clearInterval(interval);
      }
    }, 1000);
  }, [countdown]);

  useEffect(() => {
    if (playCountdown && !isPlaying) {
      playCountdown();
    }
  }, [playCountdown, isPlaying]);

  return (
    <div
      style={{
        height: "80vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {countdown < 0 ? (
        <RoastForm round={round} details={details} submitRoast={submitRoast} />
      ) : (
        <div className={styles.mainCountdown}>
          {countdown == 0 ? "Go!" : countdown}
        </div>
      )}
    </div>
  );
};

const RoastForm = ({ round, details, submitRoast }) => {
  const [myRoast, setMyRoast] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [countdown, setCountdown] = useState(30);

  const [playOof, { stop: stopOof }] = useSound("/sounds/oof.mp3");
  const [playTicking, { stop: stopTicking }] = useSound("/sounds/ticking.mp3");
  const [playBeep] = useSound("/sounds/beep.mp3");

  useEffect(() => {
    const interval = setInterval(() => {
      if (countdown == 0) {
        clearInterval(interval);
        if (!submitted) {
          const interval2 = setInterval(() => {
            stopOof();
            submitRoast("");
            clearInterval(interval2);
          }, 2000);
        }
      } else {
        if (countdown == 11) {
          if (!submitted) {
            playTicking();
          }
        }

        if (submitted) {
          stopTicking();
        }

        if (countdown == 1) {
          stopTicking();
          playOof();
        }
        setCountdown(countdown - 1);
        clearInterval(interval);
      }

      return () => {
        clearInterval(interval);
        stopTicking();
        stopOof();
      };
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
          <form
            className={styles.roastForm}
            onSubmit={(e) => {
              e.preventDefault();
              if (myRoast.length > 0) {
                playBeep();
                submitRoast(myRoast);
                stopTicking();
                setSubmitted(true);
              }
            }}
          >
            <input
              placeholder="Your Roast"
              value={myRoast}
              onChange={(e) => setMyRoast(e.target.value)}
            />
            <PrimaryButton
              onClick={() => {
                if (myRoast.length > 0) {
                  playBeep();
                  submitRoast(myRoast);
                  stopTicking();
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
        <div className={styles.timer}>
          <CountdownCircleTimer
            size={84}
            isPlaying
            duration={30}
            rea
            colors={"#E93131"}
            strokeWidth={8}
          >
            {({ remainingTime }) => countdown}
          </CountdownCircleTimer>
        </div>
      </div>
    </div>
  );
};

export default Roast;
