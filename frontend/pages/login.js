import Layout from "../components/Layout";
import Content from "../modules/Login";
import ProtectedRoute from "../components/Auth/ProtectedRoute";

export default function Login() {
  return (
    <ProtectedRoute inverse>
      <Layout
        page={{
          title: "Welcome",
        }}
      >
        <Content />
      </Layout>
    </ProtectedRoute>
  );
}
