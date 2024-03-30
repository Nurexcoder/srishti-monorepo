import React, { useState } from "react";
import styled from "styled-components";
import {
  Paper,
  TextField,
  Button,
  Backdrop,
  CircularProgress,
  Snackbar,
  IconButton,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { user } from "../../localStore";
import { prodUrl } from "../../config";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const ClubForm = styled.form`
  display: flex;
  justify-content: center;
  margin: 10em 5em;
`;

const ClubPaper = styled(Paper)`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  /* background-color: red; */

  padding: 2em 3em;
  /* border: 2px solid red; */
`;

const Heading = styled.h1`
  text-align: center;
  margin-bottom: 10%;
`;

const ClubInput = styled(TextField)`
  margin: 20px;
`;

const ChoosePoster = styled.input`
  margin: 25px 0;
  /* font-family: sans-serif; */
  /* padding: 10px; */
`;

const ClubDescription = styled(TextField)`
  margin-bottom: 25px !important;
  border-radius: 5px !important;
  /* padding: 10px !important; */
`;

const ClubButton = styled(Button)`
  /* margin: 20px; */
`;

const CreateClub = () => {
  const [loading, setLoading] = useState(false);
  const [userCurrent, setUser] = useState();
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  useEffect(() => {
    setUser(user);
  }, []);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + userCurrent.authToken);
    // myHeaders.append("Content-Type", "application/json");
    console.log(e.target.poster.files);
    const formdata = new FormData();
    formdata.append("file", e.target.poster.files[0]);

    formdata.append("name", e.target.clubname.value);
    formdata.append("desc", e.target.desc.value);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
    };

    fetch(prodUrl + "/clubs", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        setLoading(false);
        handleOpen();
      })
      .catch((error) => {
        setLoading(false);
        // handleOpen();
      });
  };
  return (
    <ClubForm onSubmit={handleSubmit}>
      <ClubPaper>
        <Backdrop
          sx={{ color: "#7451f8", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <Heading>Club Registration</Heading>
        <ClubInput
          name="clubname"
          label="Club Name"
          variant="outlined"
          required
        />
        <ChoosePoster name="poster" type="file" accept="image/*" />
        <ClubDescription multiline rows={5} name="desc" label="Desc ..." />
        <ClubButton type="submit" variant="contained">
          Submit
        </ClubButton>
        <Snackbar
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
          message="Club Created"
          action={action}
        />
      </ClubPaper>
    </ClubForm>
  );
};

export default CreateClub;
