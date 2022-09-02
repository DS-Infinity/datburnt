import Layout from "../components/Layout";
import Content from "../modules/Register";
import ProtectedRoute from "../components/Auth/ProtectedRoute";

export default function Register() {
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
