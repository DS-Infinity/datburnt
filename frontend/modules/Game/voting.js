import { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { userState } from "../../utils/userAtom";

const Voting = ({ voteCandidates }) => {
  const [candidates, setCandidates] = useState([]);
  const [user, setUser] = useRecoilState(userState);

  useEffect(() => {
    const c = [];
    voteCandidates.forEach((can) => {
      if (can.roast.replaceAll(" ", "").length > 0 && can.userid != user._id) {
        c.push(can);
      }
      setCandidates(c);
    });
  }, [voteCandidates]);

  return (
    <div>
      Voting{" "}
      <div>
        {candidates.map((candidate) => {
          return <div key={candidate.userid}>{candidate.roast}</div>;
        })}
      </div>
    </div>
  );
};

export default Voting;
