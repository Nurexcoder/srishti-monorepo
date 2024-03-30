import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./home.scss";
import { useEffect, useRef } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Dashboard from "../Dashboard/Dashboard";

const Home = () => {
  let navigate = useNavigate();
  let admin = useRef("");
  // useEffect(() => {
  useEffect(() => {
    admin.current = JSON.parse(localStorage.getItem("user"));
    if (!admin.current?.authToken) navigate("/login");
  }, []);

  // console.log(JSON.parse(localStorage.getItem("user")), admin.current)
  // }, []);
  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <Dashboard />
      </div>
    </div>
  );
};

export default Home;
