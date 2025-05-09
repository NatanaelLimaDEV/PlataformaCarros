import { Outlet } from "react-router";
import Header from "../Header";
import Footer from "../Footer";

export default function Layout() {
    return (
      <div className="min-h-screen flex flex-col">
        <Header/>
        <Outlet/>
        <Footer/>
      </div>
    );
  }
  