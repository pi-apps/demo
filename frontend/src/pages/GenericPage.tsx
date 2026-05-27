import AppLayout from "../layouts/AppLayout";

type GenericPageProps = {
  title: string;
  description: string;
};

const GenericPage = ({ title, description }: GenericPageProps) => {
  return (
    <AppLayout>
      <main className="home-page">
        <section className="home-section">
          <div className="home-section-head">
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
        </section>
      </main>
    </AppLayout>
  );
};

export default GenericPage;
