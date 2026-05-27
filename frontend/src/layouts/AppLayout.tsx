import type { ReactNode } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

type AppLayoutProps = {
  children: ReactNode;
  showFooter?: boolean;
};

const AppLayout = ({ children, showFooter = true }: AppLayoutProps) => {
  return (
    <>
      <Header />
      {children}
      {showFooter ? <Footer /> : null}
    </>
  );
};

export default AppLayout;
