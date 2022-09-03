import PageStyles from '../../styles/pages/index.module.scss';
import { useState, useEffect } from 'react';
import Loader from '../../components/Loader';
import io from 'socket.io-client';
import { useRecoilState } from 'recoil';
import { userState } from '../../utils/userAtom';
import { Popup, useOnClickOutside } from '../../components/Popup';
import styles from './index.module.scss';
import PrimaryButton from '../../components/Button/Primary';
import InputRange from 'react-input-range';
import Slider from 'react-input-slider';
import { useRouter } from 'next/router';
// import 'react-input-range/lib/css/index.css';

export default function Content() {
  const router = useRouter();

  const popupRef = useState();
  const [visibility, setVisibility] = useState('public');
  const [playerNumber, setPlayerNumber] = useState(3);
  const [categories, setCategories] = useState([
    'Politics',
    'Sports',
    'Celebs',
    'Companies',
  ]);
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState(null);
  const [user, setUser] = useRecoilState(userState);
  const [popupState, setPopupState] = useState(false);

  const [games, setGames] = useState([]);

  useOnClickOutside(popupRef, () => {
    setPopupState(false);
  });

  // useEffect(() => {
  //   //disconnect socket when the component unmounts
  //   if (!socket) return;
  //   return () => {
  //     console.log("disconnecting socket");
  //     socket.disconnect();
  //   };
  // }, []);

  useEffect(() => {
    console.log('useEffect run ');
    if (user && !socket) {
      const sock = io(`${process.env.NEXT_PUBLIC_API_URL}/home`, {
        withCredentials: true,
      });
      setSocket(sock);
    }

    window.addEventListener('beforeunload', (e) => {
      //e.preventDefault()
      socket?.disconnect();
    });

    return socket?.disconnect();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('games', (data) => {
        console.log(data.games);
        setGames(data.games);
      });

      socket.on('redirect', (code) => {
        router.push(`/${code}`);
      });
    }
  }, [socket]);

  return (
    <>
      {loading || !socket ? (
        <div
          style={{
            display: 'flex',
            height: '80vh',
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
              <div className={styles.codeRoom}>
                <input placeholder='Enter Code' />
                <PrimaryButton>Join</PrimaryButton>
              </div>
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
                      console.log('join room');
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
                  <span
                    className={
                      visibility === 'public'
                        ? styles.selected
                        : styles.deselected
                    }
                    onClick={() => setVisibility('public')}
                  >
                    Public
                  </span>
                  <span
                    className={
                      visibility === 'private'
                        ? styles.selected
                        : styles.deselected
                    }
                    onClick={() => setVisibility('private')}
                  >
                    Private
                  </span>
                </div>
              </div>
              <div className={styles.createSetting}>
                <div className={styles.createSubtitle}>
                  No. of Players - {playerNumber}
                </div>
                <Slider
                  axis='x'
                  xstep={0.1}
                  xmin={3}
                  xmax={8}
                  x={playerNumber}
                  styles={{
                    active: {
                      background: '#e93131',
                    },
                  }}
                  style={{ width: '100%', marginTop: '16px' }}
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
                        categories.includes('Politics')
                          ? {}
                          : { background: '#0b50b826', color: '#0b50b8' }
                      }
                      onClick={() => {
                        if (categories.includes('Politics')) {
                          setCategories(
                            categories.filter((cat) => cat !== 'Politics')
                          );
                        } else {
                          setCategories([...categories, 'Politics']);
                        }
                      }}
                    >
                      Politics
                    </div>
                    <div
                      className={styles.sports}
                      style={
                        categories.includes('Sports')
                          ? {}
                          : { background: '#0bb85026', color: '#0bb850' }
                      }
                      onClick={() => {
                        if (categories.includes('Sports')) {
                          setCategories(
                            categories.filter((cat) => cat !== 'Sports')
                          );
                        } else {
                          setCategories([...categories, 'Sports']);
                        }
                      }}
                    >
                      Sports
                    </div>
                    <div
                      className={styles.celebs}
                      style={
                        categories.includes('Celebs')
                          ? {}
                          : { background: '#ee2a2a26', color: '#ee2a2a' }
                      }
                      onClick={() => {
                        if (categories.includes('Celebs')) {
                          setCategories(
                            categories.filter((cat) => cat !== 'Celebs')
                          );
                        } else {
                          setCategories([...categories, 'Celebs']);
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
                        categories.includes('Companies')
                          ? {}
                          : { background: '#ed981926', color: '#ed9819' }
                      }
                      onClick={() => {
                        if (categories.includes('Companies')) {
                          setCategories(
                            categories.filter((cat) => cat !== 'Companies')
                          );
                        } else {
                          setCategories([...categories, 'Companies']);
                        }
                      }}
                    >
                      Companies
                    </div>
                    <div
                      className={styles.chats}
                      style={
                        categories.includes('Chats')
                          ? {}
                          : { background: '#d51de526', color: '#d51de5' }
                      }
                      onClick={() => {
                        if (categories.includes('Chats')) {
                          setCategories(
                            categories.filter((cat) => cat !== 'Chats')
                          );
                        } else {
                          setCategories([...categories, 'Chats']);
                        }
                      }}
                    >
                      Chats
                    </div>
                    <div
                      className={styles.random}
                      style={
                        categories.includes('Random')
                          ? {}
                          : { background: '#f412c326', color: '#f412c3' }
                      }
                      onClick={() => {
                        if (categories.includes('Random')) {
                          setCategories(
                            categories.filter((cat) => cat !== 'Random')
                          );
                        } else {
                          setCategories([...categories, 'Random']);
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
                  private: visibility === 'private',
                  maxPlayers: playerNumber,
                  categories: categories,
                };

                socket.emit('newgame', payload);
                setPopupState(false);
              }}
            >
              Create Game
            </PrimaryButton>
          </Popup>
        </div>
      )}
    </>
  );
}
