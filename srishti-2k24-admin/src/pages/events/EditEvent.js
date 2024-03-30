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
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Close, MicExternalOffRounded } from "@mui/icons-material";
import moment from "moment";

const ClubSelect = styled(Select)`
  width: 100%;
  /* margin: 1rem 0; */
`;
const Paid = styled(TextField)`
  display: ${(props) => (props.paid ? "block" : "none")};
  padding: 5px;
`;
const ChooseFile = styled.input``;

const EditElub = () => {
    const location = useLocation();
    const navigate = useNavigate();
    let stateEvent
    let setEventList
    // let eventList;
    stateEvent = location.state[0];
    setEventList = location?.state[1]
    let eventList = location?.state[2]
    console.log(setEventList)
    useEffect(() => {
        getClub();
        // if (stateEvent.isPaid) {
        //     console.log('clicked')
        //     console.log(pd.current)
        //     pd.current.click()
        // }
        if (!stateEvent.isOpen) open.current.click()
        if (stateEvent.isMainEvent) mRef.current.click()
    }, []);


    const [userInfo, setuserInfo] = useState({
        desc: stateEvent.desc
    });
    const ondescription = (value) => {
        setuserInfo({
            ...userInfo,
            desc: value,
        });
    };
    const newTime = moment().hours(Number(stateEvent?.time.slice(0, 2))).minute(Number(stateEvent?.time.slice(3, 5)))

    const str = stateEvent.date;

    const [day, month, year] = str.split('/');

    const newDate = new Date(+year, +month - 1, +day);


    const [date, setDate] = useState(newDate);
    console.log(stateEvent.isOpen)
    const [time, setTime] = useState(newTime);
    const [club, setClub] = useState(stateEvent?.club);
    const [checked, setChecked] = useState(stateEvent.isOpen);
    const [paid, setPaid] = useState(stateEvent.isPaid);
    const [isMainEvent, setIsMainEvent] = useState(stateEvent?.isMainEvent);
    const [differentPrice, setDifferentPrice] = useState(stateEvent.priceO ? true : false);
    const [otherPrice, setOtherPrice] = useState(stateEvent?.priceO);
    const [price, setPrice] = useState(stateEvent?.priceN);

    const [loading, setLoading] = useState(false);
    const [touched, setTouched] = useState(false)
    const [clubData, setClubData] = useState([]);
    const [userCurrent, setUser] = useState();
    const [openBd, setOpenBd] = useState(false);



    const handleChange = (event) => {
        setChecked(event.target.checked);
    };
    const pd = useRef();
    const open = useRef();
    const mRef = useRef();


    // Handle Form Submit
    var myHeaders = new Headers();
    const { authToken } = JSON.parse(localStorage.getItem("user"));
    myHeaders.append("Authorization", `Bearer ${authToken}`);

    const editRequest = (id, formdata) => {

        const requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: formdata,
            redirect: 'follow'
        }
        fetch(`${prodUrl}/events/edit/${id}`, requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log(result)
                // const newEvent = eventList.forEach(event => {
                //     if (event._id === id) {
                //         event.name = result.name;
                //         event.date = result.date;
                //         event.time = result.time;
                //         event.club = result.clubId;
                //         event.clubName = result.clubName;
                //         event.desc = result.desc;
                //         event.date = result.date;
                //         event.time = result.time;
                //         event.duration = result.duration;
                //         event.venue = result.venue;
                //         event.isOpen = result.isOpen;
                //         event.isPaid = result.isPaid;
                //         event.priceO = result.priceO ? result.priceO : "";
                //         event.priceN = result.priceN ? result.priceN : "";
                //         event.isMainEvent = result.isMainEvent
                //         event.image = result.image
                //     }
                //     console.log(newEvent)
                //     setEventList(newEvent)
                // })
            })
            .catch(error => console.log('error', error));
        // setEventList()

    }


    const handleSubmit = (e) => {
        e.preventDefault();
        let selectedDate = stateEvent.date

        if (touched) {
            selectedDate = String(date?.$D).padStart(2, 0) + "/" + String(date?.$M + 1).padStart(2, 0) + "/" + date?.$y;;

        }

        // console.log(tempdate)

        const selectedClub = clubData.find((clubData) => clubData.value === club);
        let newSelectedTime = stateEvent.time
        console.log(stateEvent.time, time)
        if (newTime.hour() !== time.hour() || newTime.minute() !== time.minute()) {
            let tempdate = time.$d;
            console.log(time.$d)
            const hrs =
                tempdate.getHours() < 10 ? "0" + tempdate.getHours() : tempdate.getHours();
            const mins =
                tempdate.getMinutes() < 10
                    ? "0" + tempdate.getMinutes()
                    : tempdate.getMinutes();
            newSelectedTime = hrs + ":" + mins;
            // console.log(newSelectedTime)
        }

        var formdata = new FormData();
        formdata.append("name", e.target.name.value);

        // formdata.append("date", date);
        formdata.append("date", selectedDate);

        // formdata.append("date", "13-10-2022");
        formdata.append("time", newSelectedTime);
        // formdata.append("time", "12:00");
        formdata.append("clubId", club);
        formdata.append("clubName", selectedClub.label);
        formdata.append("desc", userInfo.desc);

        formdata.append("file", e.target.pic.files[0]);

        formdata.append("venue", e.target.venue.value);

        formdata.append("isPaid", paid);
        formdata.append("priceN", price === '' ? 0 : price);

        formdata.append("isOpen", checked);
        formdata.append("isMainEvent", isMainEvent);
        formdata.append("differentPrice", differentPrice);
        formdata.append("priceO", otherPrice === '' ? 0 : otherPrice);




        editRequest(stateEvent._id, formdata)

        if (!checked) open.current.click();
        if (paid) pd.current.click();
        if (isMainEvent) mRef.current.click()

        setDate(null);
        setuserInfo("");
        setTime(null);
        setClub([]);
        setPrice("");
        setChecked(true);
        setPaid(false);
        e.target.reset();
        e.target.venue.value = ''
        e.target.name.value = ''
        navigate(-1)


    }

    const handlePaidChange = (e) => {
        // paid && setDifferentPrice(false)
        paid ? setPaid(false) : setPaid(true);
        if (paid === false) {
            setPrice('')
            setOtherPrice('')
            setDifferentPrice(false)
        }
    };
    const handleisMainEvent = (e) => {
        // console.log(e)
        setIsMainEvent(e.target.checked);
    };
    // console.log(paid)
    const handlePriceChange = (e) => {
        if (paid)
            setPrice(e.target.value);
    };
    const handleDifferentPrice = (e) => {
        // console.log(e)
        if (paid) {
            setDifferentPrice(e.target.checked);
            if (differentPrice === false) {
                setOtherPrice('')
            }
        }
    };
    // console.log(paid)
    const handleOtherPriceChange = (e) => {
        if (differentPrice)
            setOtherPrice(e.target.value);
    };

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
    const handleOpen = () => {
        setOpenBd(true);
    };

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setOpenBd(false);
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
                Edit Event
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
                                defaultValue={stateEvent?.name}
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
                                    label="Pick Date (mm/dd/yy)"
                                    placeholder="MM/DD/YYYY"
                                    value={date}
                                    onChange={(newValue) => {
                                        // console.log(newValue.D)
                                        setTouched(true)
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
                                    // value={moment().hours(11).minute(33)}
                                    value={time}
                                    onChange={(newValue) => {
                                        setTime(newValue);
                                        console.log(newValue)
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
                                defaultValue={stateEvent.venue}
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
                                    <span className="text">{stateEvent ? 'Change Pic' : 'Upload Pic'}</span>
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
                                        ref={mRef}
                                        name="isMainEvent"
                                        value={isMainEvent}
                                        onChange={handleisMainEvent}
                                        inputProps={{ "aria-label": "controlled" }}
                                    />
                                }
                                label={isMainEvent ? "Main Event" : "Pre Event"}

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
                                        defaultChecked={stateEvent.isPaid}
                                        ref={pd}
                                    />
                                }
                                label={paid ? "Event is paid" : "Event is NOT Paid"}
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
                                        onChange={handleDifferentPrice}
                                        inputProps={{ "aria-label": "controlled" }}
                                        value={differentPrice}
                                        defaultChecked={stateEvent.paidO}
                                    />
                                }
                                label={
                                    differentPrice
                                        ? "Price is different for others"
                                        : "Price is same for other"
                                }

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
                                // paid={(paid && differentPrice) ? true : false}
                                // paid={differentPrice}
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
                                Commit Changes
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
}

export default EditElub