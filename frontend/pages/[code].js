import Layout from "../components/Layout";
import ProtectedRoute from "../components/Auth/ProtectedRoute";
import Content from "../modules/Game";

const Game = () => {
  return (
    <ProtectedRoute>
      <Layout
        page={{
          title: "Game",
        }}
        showNav={true}
        isGame={true}
      >
        <Content />
      </Layout>
    </ProtectedRoute>
  );
};

export default Game;
