import Image from "next/image";
import { useRecoilState } from "recoil";
import { userState } from "../../utils/userAtom";
import styles from "./waiting.module.scss";
import PrimaryButton from "../../components/Button/Primary";
import { useEffect, useState } from "react";
import RemoveIcon from "../../public/icons/cross.svg";

const WaitingRoom = ({ details, players, onStart, removePlayer }) => {
  const [user, setUser] = useRecoilState(userState);

  const [ps, setPs] = useState([]);

  useEffect(() => {
    const mIndex = players.findIndex((p) => p.id === user._id);
    const newPlayers = [...players];
    newPlayers.splice(mIndex, 1);

    const newPs = [players[mIndex], ...newPlayers];

    setPs(newPs);
  }, [players]);

  return (
    <div className={styles.container}>
      <h1>Waiting for more players...</h1>
      <div className={styles.card}>
        <div className={styles.cardTop}>
          <div className={styles.info}>
            No. of Players: <span>{players.length}</span>
          </div>
          <div className={styles.info}>
            Maximum Players: <span>{details.maxPlayers}</span>
          </div>
          <div className={styles.visibility}>
            {details.private ? '⠀⠀⠀⠀⠀⠀Private' : `⠀⠀⠀⠀⠀⠀⠀Public`}
          </div>
        </div>
        <div className={styles.cardBottom}>
          <div className={styles.infoCategory}>Categories: </div>
          <div className={styles.categories}>
            {details.categories.map((category) => {
              return (
                <div
                  key={category}
                  className={`${styles.category} ${
                    category === 'Politics'
                      ? styles.politics
                      : category === 'Sports'
                      ? styles.sports
                      : category === 'Celebs'
                      ? styles.celebs
                      : category === 'Companies'
                      ? styles.companies
                      : category === 'Chats'
                      ? styles.chats
                      : category === 'Random'
                      ? styles.random
                      : ''
                  }`}
                >
                  {category}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className={styles.players}>
        {ps.map((player) => {
          return (
            <div className={styles.playerCard} key={player.id}>
              <div className={styles.playerImageContainer}>
                <img
                  className={styles.playerImage}
                  src={player.avatarUrl}
                  width={55}
                  height={55}
                />
              </div>
              <div>
                <div className={styles.playerName}>{player.username}</div>
                <div className={styles["you-label"]}>
                  {player.id === user._id && "You"}
                </div>
              </div>
              <div style={{ width: "100%" }} />
              {details.owner === user._id && player.id != user._id && (
                <div
                  onClick={() => removePlayer(player.id)}
                  className={styles["remove-player"]}
                >
                  <RemoveIcon />
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className={styles.bottom}>
        <div className={styles.gameCode}>
          Game Code:⠀<span>{details.code}</span>
        </div>
        <div className={styles.bottomRight}>
          {players.length < 3 && (
            <div className={styles.playersNeeded}>
              You need {3 - players.length} player
              {3 - players.length == 1 ? '' : 's'} more to start the game
            </div>
          )}
          {details.owner === user._id && (
            <PrimaryButton
              className={styles['start-button']}
              onClick={onStart}
              disabled={players.length < 3}
            >
              Start Game
            </PrimaryButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default WaitingRoom;
