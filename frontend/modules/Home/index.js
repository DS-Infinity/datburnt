import PageStyles from "../../styles/pages/index.module.scss";
import { useState, useEffect } from "react";
import Loader from "../../components/Loader";
import io from "socket.io-client";
import { useRecoilState } from "recoil";
import { userState } from "../../utils/userAtom";
import { Popup, useOnClickOutside } from "../../components/Popup";
import styles from "./index.module.scss";
import PrimaryButton from "../../components/Button/Primary";
import InputRange from "react-input-range";
import Slider from "react-input-slider";
import { useRouter } from "next/router";
import classNames from "classnames";
import { hop } from "@onehop/client";
import { useChannelMessage, useReadChannelState } from "@onehop/react";
import axios from "../../utils/axios";
const cx = classNames.bind(styles);

const channelId = "online_users";

import PublicIcon from "../../public/icons/public.svg";
import PrivateIcon from "../../public/icons/private.svg";
import Image from "next/image";
// import 'react-input-range/lib/css/index.css';

export default function Content() {
  const { state } = useReadChannelState(channelId);
  const [onlineUsers, setOnlineUsers] = useState([]);
  hop.init({
    projectId: "project_NDYyNjgzMTExOTM4NDU4MTc", // replace with your project ID
  });
  const router = useRouter();

  const popupRef = useState();
  const popupRef2 = useState();
  const [visibility, setVisibility] = useState("public");
  const [playerNumber, setPlayerNumber] = useState(3);
  const [categories, setCategories] = useState([
    "Politics",
    "Sports",
    "Celebs",
    "Companies",
  ]);
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState(null);
  const [user, setUser] = useRecoilState(userState);
  const [popupState, setPopupState] = useState(false);
  const [popupState2, setPopupState2] = useState(false);
  const [friendUsername, setFriendUsername] = useState("");
  const [friends, setFriends] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);

  const [games, setGames] = useState([]);

  const [codeInput, setCodeInput] = useState("");

  // useChannelMessage(channelId, 'USER_JOIN', (user) => {
  // 	// this will be called every time the USER_MESSAGE event is sent to this channel
  // 	setChatMessages(m => [...m, message]);
  // });

  useOnClickOutside(popupRef, () => {
    setPopupState(false);
  });
  useOnClickOutside(popupRef2, () => {
    setPopupState2(false);
  });
  // useEffect(() => {
  //   //disconnect socket when the component unmounts
  //   if (!socket) return;
  //   return () => {
  //     // ("disconnecting socket");
  //     socket.disconnect();
  //   };
  // }, []);

  useEffect(() => {
    user.friends.forEach((element) => {
      axios.post("/auth/getUserFromID", { userId: element }).then((res) => {
        setFriends((f) => [...f, res.data.user]);
        // (res.data.user);
      });
    });

    // ('friendss', friends);

    // ('online friends', onlineFriends);

    // ('useEffect run ');
    if (user && !socket) {
      const sock = io(`${process.env.NEXT_PUBLIC_API_URL}/home`, {
        withCredentials: true,
      });
      setSocket(sock);
    }

    window.addEventListener("beforeunload", (e) => {
      //e.preventDefault()
      socket?.disconnect();
    });

    return socket?.disconnect();
  }, []);

  useEffect(() => {
    if (state) {
      // (state.users);
      setOnlineFriends(
        friends.filter(
          (friend) =>
            state.users.filter(
              (usera) => usera._id.toString() === friend._id.toString()
            ).length > 0
        )
      );
    }
  }, [state]);

  useEffect(() => {
    if (socket) {
      socket.on("games", (data) => {
        // (data.games);
        setGames(data.games);
      });

      socket.on("redirect", (code) => {
        router.push(`/${code}`);
      });
    }
  }, [socket]);

  return (
    <>
      {loading || !socket ? (
        <div
          style={{
            display: "flex",
            height: "80vh",
          }}
        >
          <Loader center />
        </div>
      ) : (
        <div className={PageStyles.content}>
          <div className={styles.container}>
            <div className={styles.header}>
              <h1 className={styles.title}>Play Now!</h1>
              <div
                className={styles.create}
                onClick={() => setPopupState(true)}
              >
                <span>Create New Room </span>+
              </div>
            </div>
            <div className={styles.join}>
              <div className={styles.randomRoom}>
                <PrimaryButton
                  onClick={() => {
                    if (games.length > 0) {
                      const randomGame =
                        games[Math.floor(Math.random() * games.length)];
                      router.push(`/${randomGame.code}`);
                    }
                  }}
                >
                  Join Random Room
                </PrimaryButton>
              </div>
              <form
                className={styles.codeRoom}
                onSubmit={(e) => {
                  e.preventDefault();
                  if (codeInput.replaceAll(" ", "").length > 0) {
                    router.push(`/${codeInput.replaceAll(" ", "")}`);
                  }
                }}
              >
                <input
                  placeholder="Enter Code"
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value)}
                />
                <PrimaryButton>Join</PrimaryButton>
              </form>
            </div>
            <div className={styles.friendsTitle}>Friends</div>
            <div className={styles.friends}>
              <div
                className={styles.addFriend}
                onClick={() => {
                  setPopupState2(true);
                }}
              >
                <div className={styles.add}>+</div>
                <div className={styles.friendName}>Add New</div>
              </div>
              {friends.map((friend) => (
                <div className={styles.friend}>
                  <div
                    className={styles.avatarContainer}
                    style={{
                      border: `${
                        onlineFriends.filter(
                          (e) => e._id.toString() === friend._id.toString()
                        ).length > 0
                          ? "6px solid #24eb5c"
                          : null
                      }`,
                    }}
                  >
                    <Image
                      className={styles.avatar}
                      src={friend?.avatar}
                      height={80}
                      width={80}
                    />
                  </div>
                  <div className={styles.friendName}>{friend?.name}</div>
                </div>
              ))}
            </div>
            <div className={styles.publicTitle}>Public Rooms</div>
            <div className={styles.publicRooms}>
              {games.map((game) => (
                <div className={styles.room}>
                  <div className={styles.roomInfo}>
                    <div className={styles.roomCode}>{game.code}</div>
                    <div className={styles.roomPlayers}>
                      {game.players.length} Players
                    </div>
                  </div>
                  <button
                    className={styles.roomJoin}
                    onClick={() => {
                      // ('join room');
                      router.push(`/${game.code}`);
                    }}
                  >
                    Join
                  </button>
                </div>
              ))}
            </div>
          </div>
          {/* <PrimaryButton onClick={() => setPopupState(true)}>
            Create Game
          </PrimaryButton>
          <div style={{ marginTop: '30px' }}>
            Games :
            {games.map((g) => {
              return <p>{g.code}</p>;
            })}
          </div> */}
          <Popup
            popupState={popupState}
            ref={popupRef}
            center
            className={styles.popup}
          >
            <div>
              <h2 className={styles.createTitle}>Create New Game</h2>
              <div className={styles.createSetting}>
                <div className={styles.createSubtitle}>Visibility</div>
                <div className={styles.visibility}>
                  <div
                    className={cx(styles.visibility__option, {
                      [styles["visibility__option--selected"]]:
                        visibility === "public",
                    })}
                    onClick={() => setVisibility("public")}
                  >
                    <PublicIcon />
                    <div style={{ width: "5px" }} /> Public
                  </div>
                  <div
                    className={cx(styles.visibility__option, {
                      [styles["visibility__option--selected"]]:
                        visibility === "private",
                    })}
                    onClick={() => setVisibility("private")}
                  >
                    <PrivateIcon />
                    <div style={{ width: "5px" }} />
                    Private
                  </div>
                  {/* <span
                    className={
                      visibility === "public"
                        ? styles.selected
                        : styles.deselected
                    }
                    onClick={() => setVisibility("public")}
                  >
                    Public
                  </span>
                  <span
                    className={
                      visibility === "private"
                        ? styles.selected
                        : styles.deselected
                    }
                    onClick={() => setVisibility("private")}
                  >
                    Private
                  </span> */}
                </div>
              </div>
              <div className={styles.createSetting}>
                <div className={styles.createSubtitle}>
                  No. of Players - {playerNumber}
                </div>
                <Slider
                  axis="x"
                  xstep={0.1}
                  xmin={3}
                  xmax={8}
                  x={playerNumber}
                  styles={{
                    active: {
                      background: "#e93131",
                    },
                  }}
                  style={{ width: "100%", marginTop: "16px" }}
                  onChange={({ x }) =>
                    setPlayerNumber(parseFloat(x.toFixed(0)))
                  }
                />
                <div className={styles.sliderNum}>
                  <div>3</div>
                  <div>8</div>
                </div>
              </div>
              <div className={styles.createSetting}>
                <div className={styles.createSubtitle}>Categories</div>
                <div className={styles.categories}>
                  <div className={styles.categoryLine}>
                    <div
                      className={styles.politics}
                      style={
                        categories.includes("Politics")
                          ? {}
                          : { background: "#0b50b826", color: "#0b50b8" }
                      }
                      onClick={() => {
                        if (categories.includes("Politics")) {
                          setCategories(
                            categories.filter((cat) => cat !== "Politics")
                          );
                        } else {
                          setCategories([...categories, "Politics"]);
                        }
                      }}
                    >
                      Politics
                    </div>
                    <div
                      className={styles.sports}
                      style={
                        categories.includes("Sports")
                          ? {}
                          : { background: "#0bb85026", color: "#0bb850" }
                      }
                      onClick={() => {
                        if (categories.includes("Sports")) {
                          setCategories(
                            categories.filter((cat) => cat !== "Sports")
                          );
                        } else {
                          setCategories([...categories, "Sports"]);
                        }
                      }}
                    >
                      Sports
                    </div>
                    <div
                      className={styles.celebs}
                      style={
                        categories.includes("Celebs")
                          ? {}
                          : { background: "#ee2a2a26", color: "#ee2a2a" }
                      }
                      onClick={() => {
                        if (categories.includes("Celebs")) {
                          setCategories(
                            categories.filter((cat) => cat !== "Celebs")
                          );
                        } else {
                          setCategories([...categories, "Celebs"]);
                        }
                      }}
                    >
                      Celebs
                    </div>
                  </div>
                  <div className={styles.categoryLine}>
                    <div
                      className={styles.companies}
                      style={
                        categories.includes("Companies")
                          ? {}
                          : { background: "#ed981926", color: "#ed9819" }
                      }
                      onClick={() => {
                        if (categories.includes("Companies")) {
                          setCategories(
                            categories.filter((cat) => cat !== "Companies")
                          );
                        } else {
                          setCategories([...categories, "Companies"]);
                        }
                      }}
                    >
                      Companies
                    </div>
                    <div
                      className={styles.chats}
                      style={
                        categories.includes("Chats")
                          ? {}
                          : { background: "#d51de526", color: "#d51de5" }
                      }
                      onClick={() => {
                        if (categories.includes("Chats")) {
                          setCategories(
                            categories.filter((cat) => cat !== "Chats")
                          );
                        } else {
                          setCategories([...categories, "Chats"]);
                        }
                      }}
                    >
                      Chats
                    </div>
                    <div
                      className={styles.random}
                      style={
                        categories.includes("Random")
                          ? {}
                          : { background: "#f412c326", color: "#f412c3" }
                      }
                      onClick={() => {
                        if (categories.includes("Random")) {
                          setCategories(
                            categories.filter((cat) => cat !== "Random")
                          );
                        } else {
                          setCategories([...categories, "Random"]);
                        }
                      }}
                    >
                      Random
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <PrimaryButton
              onClick={() => {
                const payload = {
                  private: visibility === "private",
                  maxPlayers: playerNumber,
                  categories: categories,
                };

                socket.emit("newgame", payload);
                setPopupState(false);
              }}
            >
              Create Game
            </PrimaryButton>
          </Popup>
          <Popup
            popupState={popupState2}
            ref={popupRef2}
            center
            className={styles.friendPopup}
          >
            <h2 className={styles.addTitle}>Add Friend</h2>
            <div className={styles.addFriendStuff}>
              <input
                type="text"
                placeholder="Enter username"
                value={friendUsername}
                onChange={(e) => setFriendUsername(e.target.value)}
              />
              <PrimaryButton
                className={styles.addFriendButton}
                onClick={() => {
                  axios
                    .post("/auth/getUser", {
                      username: friendUsername,
                    })
                    .then((res) => {
                      if (res.data.success) {
                        // (res.data.user);
                        setFriends([...friends, res.data.user]);
                        axios
                          .post("/auth/add-frand", {
                            userId: user._id.toString(),
                            friendId: res.data.user._id.toString(),
                          })
                          .then((res) => {
                            // (`results lmao ${res.data.message}`);
                          });
                      }
                    });
                  // axios
                  //   .post('/auth/add-frand', {
                  //     username: friendUsername,
                  //   })
                  //   .then((res) => {
                  //     // (res.data);
                  //     setFriendUsername('');
                  //   });
                  // hop.channels.setState(channelId, (s) => ({
                  //   ...s,
                  //   name: 'My Channel',
                  // }));
                  // socket.emit('addfriend', friendUsername);
                  // setPopupState2(false);
                }}
              >
                Add Friend
              </PrimaryButton>
            </div>
          </Popup>
        </div>
      )}
    </>
  );
}
