import { useState, useEffect } from "react";
import Loader from "../Loader";
import axios from "../../utils/axios";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { userState } from "../../utils/userAtom";

const ProtectedRoute = ({ children, inverse = false }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useRecoilState(userState);
  const router = useRouter();

  useEffect(() => {
    if (loading) {
      axios.get("/auth/me").then((res) => {
        if (res.data.success) {
          setUser(res.data.user);
          if (inverse) {
            router.push("/home");
          } else {
            setLoading(false);
          }
        } else {
          setUser(null);
          if (inverse) {
            setLoading(false);
          } else {
            router.push("/");
          }
        }
      });
    }
  }, [loading]);

  return (
    <div>
      {loading ? (
        <div
          style={{
            height: "100vh",
            width: "100%",
            display: "flex",
            jutsifyContent: "center",
            alignItems: "center",
          }}
        >
          <Loader center />
        </div>
      ) : (
        children
      )}
    </div>
  );
};

export default ProtectedRoute;
