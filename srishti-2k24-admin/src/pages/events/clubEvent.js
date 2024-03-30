import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  Switch,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Backdrop,
  CircularProgress,
  IconButton,
  Snackbar,
} from "@mui/material";
// import dayjs from 'dayjs/locale/*'
import ReactQuill from "react-quill";
import EditorToolbar, { modules, formats } from "../Quill/EditorToolbar";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import styled from "styled-components";
import { prodUrl } from "../../config";
import { user } from "../../localStore";
import { clubs } from "../../data";
import "react-quill/dist/quill.snow.css";
import "../Quill/TextEditor.css";
import FormControlLabel from "@mui/material/FormControlLabel";
import Sidebar from "../../components/sidebar/Sidebar";
import "./clubevent.css";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { Close } from "@mui/icons-material";
// const ChooseFile = styled.input`
// position: absolute;
// z-index: -1;
// top: 10px;
// left: 8px;
// font-size: 17px;
// color: black;

// `;
const ChooseFile = styled.input``;

// margin: 10px 0;
// outline:none;
// padding:10px;
// font-family:'Roboto';
// font-weight:bold;
// font-size:1rem;
// border:2px solid tomato;
// button{
//   color:white;
// }
const EventDesc = styled(TextField)`
  margin-bottom: 10px !important;
`;

const ClubSelect = styled(Select)`
  width: 100%;
  /* margin: 1rem 0; */
`;
const Paid = styled(TextField)`
  display: ${(props) => (props.paid ? "block" : "none")};
  padding: 5px;
`;
const ClubEvent = () => {
  const [userInfo, setuserInfo] = useState({
    desc: "",
  });
  const ondescription = (value) => {
    setuserInfo({
      ...userInfo,
      desc: value,
    });
  };

  // Handling DatePicker
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [club, setClub] = useState([]);
  const [checked, setChecked] = useState(true);
  const [paid, setPaid] = useState(false);
  const [isMainEvent, setIsMainEvent] = useState(false);
  const [differentPrice, setDifferentPrice] = useState(false);
  const [otherPrice, setOtherPrice] = useState("");
  const [price, setPrice] = useState("");
  const [event, setEvent] = useState("Open for all");
  const [loading, setLoading] = useState(false);

  const [clubData, setClubData] = useState([]);
  const [userCurrent, setUser] = useState();
  const [openBd, setOpenBd] = useState(false);
  const handleOpen = () => {
    setOpenBd(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenBd(false);
  };

  useEffect(() => {
    setUser(user);
  }, []);

  const getClub = () => {
    fetch(prodUrl + "/clubs")
      .then((data) => data.json())
      .then((data) => {
        let clubsList = [];
        data.map((club) => {
          clubsList.push({
            label: club.name,
            value: club["_id"],
          });
        });
        setClubData(clubsList);
      });
  };
  useEffect(() => {
    getClub();
  }, []);

  // For Switch
  const handleChange = (event) => {
    setChecked(event.target.checked);
  };
  const pd = useRef();
  const open = useRef();
  // Handle Form Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + user.authToken);
    var selectedDate = date.$D + "/" + (date.$M + 1) + "/" + date.$y;
    const hrs =
      time.$d.getHours() < 10 ? "0" + time.$d.getHours() : time.$d.getHours();
    const mins =
      time.$d.getMinutes() < 10
        ? "0" + time.$d.getMinutes()
        : time.$d.getMinutes();
    const newSelectedTime = hrs + ":" + mins;
    const selectedClub = clubData.find((clubData) => clubData.value === club);
    var formdata = new FormData();
    formdata.append("name", e.target.name.value);

    formdata.append("date", selectedDate);

    // formdata.append("date", "13-10-2022");
    formdata.append("time", newSelectedTime);
    // formdata.append("time", "12:00");
    formdata.append("clubId", club);
    formdata.append("clubName", selectedClub.label);
    formdata.append("desc", userInfo.desc);

    formdata.append("file", e.target.pic.files[0]);

    formdata.append("venue", e.target.venue.value);
    if (paid) {
      formdata.append("isPaid", paid);
      formdata.append("price", price);
    }
    formdata.append("isOpen", checked);
    formdata.append("isMainEvent", isMainEvent);
    formdata.append("differentPrice", differentPrice);
    formdata.append("otherPrice", otherPrice);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetch(prodUrl + "/events", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setLoading(false);
        setOpenBd(true)
      })
      .catch((error) => {
        setLoading(false);
      });

    if (!checked) open.current.click();
    if (paid) pd.current.click();

    setDate(null);
    setuserInfo("");
    setTime(null);
    setClub([]);
    setPrice("");
    setChecked(true);
    setPaid(false);
    e.target.reset();

    // e.target.paid.checked = false
    // e.target.open.checked = true

    // console.log(e.target.paid.checked)
  };
  // console.log(club);
  const handlePaidChange = (e) => {
    paid ? setPaid(false) : setPaid(true);
  };
  const handleisMainEvent = (e) => {
    // console.log(e)
    setIsMainEvent(e.target.checked);
  };
  // console.log(paid)
  const handlePriceChange = (e) => {
    setPrice(e.target.value);
  };
  const handleDifferentPrice = (e) => {
    // console.log(e)
    setDifferentPrice(e.target.checked);
  };
  // console.log(paid)
  const handleOtherPriceChange = (e) => {
    setOtherPrice(e.target.value);
  };
  const action = (
    <React.Fragment>
      <Link to="/home">
        <Button color="primary" size="small" onClick={handleClose}>
          Goto to Home
        </Button>
      </Link>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <Close fontSize="small" />
      </IconButton>
    </React.Fragment>
  );
  return (
    <div>
      <Typography
        gutterBottom
        variant="h3"
        align="center"
        sx={{ fontFamily: "Roboto", margin: "2rem 0" }}
      >
        Club Events
      </Typography>
      <Backdrop
        sx={{ color: "#7451f8", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Card
        sx={{
          maxWidth: "80vw",
          margin: "0 auto",
          padding: "0px 5px",
          border: "1px solid #673ab7;",
        }}
      >
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={1}></Grid>
            <Grid item xs={12}>
              <TextField
                sx={{ margin: "10px auto" }}
                name="name"
                label="Event Name"
                placeholder="Enter Name"
                variant="outlined"
                fullWidth
              // required
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl
                fullWidth
                sx={{ minWidth: "100%", margin: "10px 0" }}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  Club
                </InputLabel>
                <ClubSelect
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  // label="Club"
                  label="Club"
                  value={club}
                  onChange={(e) => {
                    setClub(e.target.value);
                  }}
                >
                  {clubData.length !== 0 &&
                    clubData.map((club, i) => (
                      <MenuItem value={club.value} key={i}>
                        {club.label}
                      </MenuItem>
                    ))}
                </ClubSelect>
              </FormControl>
            </Grid>

            <Grid item xs={12} sx={{ margin: "10px 0" }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Pick Date"
                  placeholder="MM/DD/YYYY"
                  value={date}
                  onChange={(newValue) => {
                    // console.log(newValue.D)
                    setDate(newValue);
                  }}
                  isClearable
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      sx={{ marginBottom: "10px" }}
                      fullWidth
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} sx={{ margin: "10px 0" }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimePicker
                  label="Pick Time"
                  placeholder="Pick time of event"
                  value={time}
                  onChange={(newValue) => {
                    setTime(newValue);
                  }}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12}>
              <TextField
                sx={{ margin: "10px auto" }}
                name="venue"
                label="Venue"
                placeholder="Enter the venue"
                variant="outlined"
                fullWidth
              // required
              />
            </Grid>

            <Grid item xs={12} sx={{ margin: "10px auto" }}>
              <label className="font-weight-bold">
                {" "}
                Description <span className="required"> * </span>{" "}
              </label>
              <EditorToolbar toolbarId={"t1"} />
              <ReactQuill
                theme="snow"
                value={userInfo.desc}
                onChange={ondescription}
                placeholder={"Write something awesome..."}
                modules={modules("t1")}
                formats={formats}
              />
            </Grid>

            <Grid item xs={12}>
              <div style={{ position: "relative" }}>
                <label
                  className="custom-file-upload"
                  style={{
                    display: "block",
                    margin: "0.5rem 0",
                  }}
                >
                  {/* <input type="file" /> */}
                  <span className="text">Upload Pic</span>
                </label>
                <ChooseFile name="pic" type="file" accept="image/*" />
              </div>
            </Grid>

            <Grid item xs={12} sx={{ margin: "10px auto" }}>
              <FormControlLabel
                control={
                  <Switch
                    ref={open}
                    name="open"
                    defaultChecked
                    value={checked}
                    onChange={handleChange}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                }
                label={checked ? "Open for all" : "Only for Neristians"}
              />
            </Grid>
            <Grid item xs={12} sx={{ margin: "10px auto" }}>
              <FormControlLabel
                control={
                  <Switch
                    name="isMainEvent"
                    value={isMainEvent}
                    onChange={handleisMainEvent}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                }
                label={isMainEvent ? "Main Event" : "Pre Event"}
                ref={pd}
              />
            </Grid>
            <Grid item xs={12} sx={{ margin: "10px auto" }}>
              <FormControlLabel
                control={
                  <Switch
                    name="paid"
                    value={paid}
                    onChange={handlePaidChange}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                }
                label={paid ? "Event is paid" : "Event is NOT Paid"}
                ref={pd}
              />
            </Grid>

            <Grid
              item
              xs={12}
              sx={{
                margin: "10px auto",
                minHeight: "4.2rem",
              }}
            >
              <Paid
                type="number"
                paid={paid}
                name="price"
                label="Price"
                value={price}
                placeholder="Enter Price"
                variant="outlined"
                onChange={handlePriceChange}
                fullWidth
                onWheel={(e) => e.target.blur()}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sx={{ margin: "10px auto", display: paid ? "block" : "none" }}
            >
              <FormControlLabel
                control={
                  <Switch
                    name="differentPrice"
                    value={differentPrice}
                    onChange={handleDifferentPrice}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                }
                label={
                  differentPrice
                    ? "Price is different for other"
                    : "Price is same for other"
                }
                ref={pd}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sx={{
                margin: "10px auto",
                minHeight: "4.2rem",
              }}
            >
              <Paid
                type="number"
                paid={paid && differentPrice}
                name="otherPrice"
                label="otherPrice"
                value={otherPrice}
                required={(paid && differentPrice) ? true : false}
                placeholder="Enter Price for Others"
                variant="outlined"
                onChange={handleOtherPriceChange}
                fullWidth
                onWheel={(e) => e.target.blur()}

              />
            </Grid>
            <Grid item xs={12} sx={{ margin: "10px auto" }}>
              <Button
                sx={{
                  color: "#fff",
                  backgroundColor: "#673ab7",
                }}
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Submit
              </Button>
              <Snackbar
                open={openBd}
                autoHideDuration={6000}
                onClose={handleClose}
                message="Event Created"
                action={action}
              />
            </Grid>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClubEvent;
