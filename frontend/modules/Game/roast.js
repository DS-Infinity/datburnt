import { useState, useEffect } from "react";

const Roast = ({ round, details, submitRoast }) => {
  const [myRoast, setMyRoast] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    const interval = setInterval(() => {
      if (countdown <= 0) {
        clearInterval(interval);
        setSubmitted(true);
        const interval2 = setInterval(() => {
          submitRoast("");
          clearInterval(interval2);
        }, 2000);
      } else {
        setCountdown(countdown - 1);
        clearInterval(interval);
      }

      return () => clearInterval(interval);
    }, 1000);
  }, [countdown]);

  return (
    <div>
      <p>Round {round}</p> <img src={details.image} />
      {countdown <= 0 ? (
        <p>Time's Up!</p>
      ) : submitted ? (
        <p>I bet that one hurt!</p>
      ) : (
        <div>
          <input value={myRoast} onChange={(e) => setMyRoast(e.target.value)} />
          <button
            onClick={() => {
              if (myRoast.length > 0) {
                submitRoast(myRoast);
                setSubmitted(true);
              }
            }}
          >
            Roast!
          </button>
        </div>
      )}
      <div>{countdown}</div>
    </div>
  );
};

export default Roast;
