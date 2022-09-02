import { useRecoilState } from "recoil";
import { userState } from "../../utils/userAtom";

const WaitingRoom = ({ details, players, onStart }) => {
  const [user, setUser] = useRecoilState(userState);

  return (
    <div>
      {JSON.stringify(details)}
      <br />
      <br />
      <br />
      Players -
      {players.map((p) => {
        return <p>{p.username}</p>;
      })}
      <div>
        {details.owner === user._id && <button onClick={onStart}>Start</button>}
      </div>
    </div>
  );
};

export default WaitingRoom;
