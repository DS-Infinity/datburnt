import Layout from "../components/Layout";
import ProtectedRoute from "../components/Auth/ProtectedRoute";
import Content from "../modules/Home";

export default function Home() {
  return (
    <ProtectedRoute>
      <Layout
        page={{
          title: "Home",
        }}
      >
        <Content />
      </Layout>
    </ProtectedRoute>
  );
}
