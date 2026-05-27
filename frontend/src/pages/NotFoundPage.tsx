import { Link } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";

const NotFoundPage = () => {
  return (
    <AppLayout>
      <main className="home-page">
        <section className="home-section">
          <div className="home-section-head">
            <h1>Page Not Found</h1>
            <p>The page you requested is not available yet.</p>
            <Link to="/">Return to Home</Link>
          </div>
        </section>
      </main>
    </AppLayout>
  );
};

export default NotFoundPage;
