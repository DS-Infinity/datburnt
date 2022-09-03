const Score = ({ scores }) => {
  return (
    <div>
      {scores.map((score) => {
        return (
          <p>
            {score.username} - {score.score}
          </p>
        );
      })}
    </div>
  );
};

export default Score;
