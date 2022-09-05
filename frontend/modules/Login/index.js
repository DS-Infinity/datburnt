import styles from "./index.module.scss";
import { useState } from "react";
import axios from "../../utils/axios";
import { useRecoilState } from "recoil";
import { userState } from "../../utils/userAtom";
import PrimaryButton from "../../components/Button/Primary";

export default function Content() {
  const [userEmail, setUserEmail] = useState("");
  const [error, setError] = useState("");
  const [userPass, setUserPass] = useState("");
  const [user, setUser] = useRecoilState(userState);
  const [loggingIn, setLoggingIn] = useState(false);

  return (
    <div className={styles.container}>
      {/* <Navbar /> */}
      <div className={styles.login__card}>
        <div className={styles.login__title}>Login to an account</div>
        <div className={styles.login__form}>
          <div className={styles.login__form__section}>Email</div>
          <input
            className={styles.login__form__input}
            value={userEmail}
            onChange={(e) => {
              setUserEmail(e.target.value);
            }}
            type="email"
          />
          <div className={styles.login__form__section}>Password</div>
          <input
            className={styles.login__form__input}
            value={userPass}
            onChange={(e) => {
              setUserPass(e.target.value);
            }}
            type="password"
          />
          <PrimaryButton
            className={styles.login__form__button}
            onClick={async () => {
              setLoggingIn(true);
              const { data } = await axios.post("/auth/login", {
                email: userEmail,
                password: userPass,
              });

              // (data);

              if (data.success) {
                setUser(data.user);
                return (window.location.href = "/home");
              } else {
                setError(data.message);
                setLoggingIn(false);
              }
            }}
            loading={loggingIn}
          >
            Login
          </PrimaryButton>
          <div className={styles.error}>{error}</div>
        </div>
      </div>
    </div>
  );
}
