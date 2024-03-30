import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import List from "./pages/list/List";
import CreateClub from "./pages/club/clubRegister";
import ClubEvent from "./pages/events/clubEvent";
import EditEvent from "./pages/events/EditEvent";
import "./style/dark.scss";
import { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { user } from "./localStore";
import Single1 from "./pages/single/Single1";
import { useEffect } from "react";
import RequireAuth from "./RequireAuth";
import { useRef } from "react";

function App() {
  const { darkMode } = useContext(DarkModeContext);

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <BrowserRouter>
        <Routes>
          {/* <Route path="/">
            <Route path="login" element={<Login />} />
          </Route> */}
          <Route path="/login" element={<Login />} />

          <Route exact path='/edit' element={<EditEvent />} />
          {/* <Route path="/login" element={admin.current ? <Home /> : <Login />} /> */}
          {/* <Route path="/downloadPdf" element={<DownloadPdf />} /> */}
          <Route
            path="/createClub"
            element={
              // <RequireAuth>
              <CreateClub />
              // </RequireAuth>
            }
          />
          <Route path="/clubEvent" element={<ClubEvent />} />

          {/* <Route
            path="/"
            element={<Navigate to={admin.current ? "/home" : "/login"} />}
          /> */}
          <Route
            path="/"
            element={<Home />}
          />


          <Route
            path="/home"
            element={
              // <RequireAuth>
              <Home />
              // </RequireAuth>
            }
          />
          <Route path="/events">
            <Route
              path=":clubId"
              element={
                // <RequireAuth>
                <Single1 />
                // </RequireAuth>
              }
            />
          </Route>
          <Route path="/registration">
            <Route
              path=":eventId"
              element={
                // <RequireAuth>
                <List />
                // </RequireAuth>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;