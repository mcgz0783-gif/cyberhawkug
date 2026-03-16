import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ScanlineOverlay from "./ScanlineOverlay";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background dot-grid relative">
      <ScanlineOverlay />
      <Navbar />
      <main className="pt-16">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
