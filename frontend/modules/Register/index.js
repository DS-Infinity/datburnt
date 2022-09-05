import styles from "./index.module.scss";
import { useState } from "react";
import axios from "../../utils/axios";
import { userState } from "../../utils/userAtom";
import { useRecoilState } from "recoil";
import PrimaryButton from "../../components/Button/Primary";

export default function Content() {
  const [userName, setUserName] = useState("");
  const [userPass, setUserPass] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useRecoilState(userState);

  const [registering, setRegistering] = useState(false);

  const generateRandomNum = () => {
    let num1 = Math.floor(Math.random() * 10).toString();
    let num2 = Math.floor(Math.random() * 10).toString();
    let num3 = Math.floor(Math.random() * 10).toString();
    let num4 = Math.floor(Math.random() * 10).toString();
    let num5 = Math.floor(Math.random() * 10).toString();
    let num = num1 + num2 + num3 + num4 + num5;
    return num;
  };
  const [avatar, setAvatar] = useState(
    `https://avatars.dicebear.com/api/adventurer-neutral/${generateRandomNum()}.svg`
  );
  return (
    <div className={styles.container}>
      {/* <Navbar /> */}
      <div className={styles.register__card}>
        <div className={styles.register__title}>Create an Account</div>
        <div className={styles.register__form}>
          <div className={styles.register__form__section}>Username</div>
          <input
            className={styles.register__form__input}
            value={userName}
            onChange={(e) => {
              setUserName(e.target.value);
            }}
            type="text"
          />
          <div className={styles.register__form__section}>Email</div>
          <input
            className={styles.register__form__input}
            value={userEmail}
            onChange={(e) => {
              setUserEmail(e.target.value);
            }}
            type="email"
          />
          <div className={styles.register__form__section}>Password</div>
          <input
            className={styles.register__form__input}
            value={userPass}
            onChange={(e) => {
              setUserPass(e.target.value);
            }}
            type="password"
          />
          <PrimaryButton
            className={styles.register__form__button}
            onClick={async () => {
              // // ('clicked');
              setRegistering(true);
              const { data } = await axios.post("/auth/register", {
                username: userName,
                avatar: avatar,
                email: userEmail,
                password: userPass,
              });

              // // (data);

              if (data.success) {
                setUser(data.user);
                return (window.location.href = "/home");
              } else {
                setError(data.message);
                setRegistering(false);
              }
            }}
            loading={registering}
          >
            Create Account
          </PrimaryButton>
          <div className={styles.error}>{error}</div>
        </div>
      </div>
    </div>
  );
}
