import "./sidebar.scss";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { Link, useNavigate } from "react-router-dom";
import { DarkModeContext } from "../../context/darkModeContext";
import { useContext } from "react";
import { useState } from "react";
import { prodUrl } from "../../config";
import { useEffect } from "react";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";

const Sidebar = () => {
  const { dispatch } = useContext(DarkModeContext);
  const [clubsList, setclubsList] = useState([]);
  const navigate = useNavigate();
  useEffect(async () => {
    const response = await fetch(`${prodUrl}/clubs`, { method: "GET" });
    const json = await response.json();
    setclubsList(json);
  }, []);

  return (
    <div className="sidebar">
      <div className="top">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">Sonabyss Admin</span>
        </Link>
      </div>
      <hr />
      <div className="center">
        <ul>
          <p className="title">MAIN</p>
          <Link to="/home">
            <li>
              <DashboardIcon className="icon" />
              <span>Dashboard</span>
            </li>
          </Link>
          <Link
            to={`/events/${clubsList[0]?._id}`}
            style={{ textDecoration: "none" }}>
            <p className="title">CLUBS</p>
          </Link>
          <Link to="/createClub">
            <Button variant="content">
              <Add />
              Add Club
            </Button>
          </Link>
          {clubsList?.map((ele, i) => {
            return (
              <Link
                key={i}
                to={`/events/${ele._id}`}
                style={{ textDecoration: "none" }}>
                <li>
                  <PersonOutlineIcon className="icon" />
                  <span>{ele.name}</span>
                </li>
              </Link>
            );
          })}

          <p className="title">USER</p>

          <li
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}>
            <ExitToAppIcon className="icon" />
            <span>Logout</span>
          </li>
        </ul>
      </div>
      <div className="bottom">
        <div
          className="colorOption"
          onClick={() => dispatch({ type: "LIGHT" })}></div>
        <div
          className="colorOption"
          onClick={() => dispatch({ type: "DARK" })}></div>
      </div>
    </div>
  );
};

export default Sidebar;
