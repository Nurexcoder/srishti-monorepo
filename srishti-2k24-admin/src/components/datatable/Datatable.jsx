import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { userColumns } from "../../datatablesource";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { prodUrl } from "../../config";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  Backdrop,
  Button,
  CircularProgress,
  TextField,
  Tooltip,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import styled from "styled-components";
import { Cancel } from "@mui/icons-material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Swal from "sweetalert2";

const VerifyDiv = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;
const VerifyButtons = styled.button``;
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-evenly",
  flexDirection: "column",
  p: 4,
};
const Datatable = () => {
  // const [data, setData] = useState([]);
  const [newData, setNewData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const handleClose = () => setModal(false);
  const location = useLocation();
  var myHeaders = new Headers();
  const { authToken } = JSON.parse(localStorage.getItem("user"));
  myHeaders.append("Authorization", `Bearer ${authToken}`);
  const update = () => {
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setNewData(data.map((e, i) => ({ ...e, id: e["_id"] })));
        setLoading(false);
      })
      .catch((error) => console.log("error", error));
  };
  const submitTransaction = async (
    isVerified,
    registrationId,
    transactionId
  ) => {
    console.log(isVerified, registrationId);
    setModal(false);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + authToken);
    myHeaders.append("Content-Type", "application/json");

    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();

    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;

    const formattedToday = dd + "/" + mm + "/" + yyyy;
    var raw = JSON.stringify({
      verifiedDate: formattedToday,
      isVerified: isVerified,
      transactionId: transactionId,
      eventId: event["_id"],
      eventName: event.name,
      clubName: event.clubName,
    });
    setPaymentLoading(true);
    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    try {
      const res = await fetch(
        prodUrl + "/registration/verify/" + registrationId,
        requestOptions
      );
      const status = res.status;
      const result = await res.json();
      console.log(status, result);
      update();
      setPaymentLoading(false);
      if (status === 202) {
        Swal.fire(
          `${isVerified === 1 ? "Verified" : "Rejected"}`,
          `Transaction is ${isVerified === 1 ? "Verified" : "Rejected"}`,
          "success"
        );
      } else if (status === 226) {
        Swal.fire("Rejected", result.message, "success");
      } else if (status === 402) {
        Swal.fire("Error", result.message, "error");
      } else if (status === 400) {
        Swal.fire("Error", result.message, "error");
      }
    } catch (error) {
      setPaymentLoading(false);
      Swal.fire("Error", error.error, "error");
    }
    // await result.json()
  };
  const userColumnsPaid = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "user",
      headerName: "User",
      width: 230,
      renderCell: (params) => {
        return (
          <div className="cellWithImg">
            <img
              className="cellImg"
              src="https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
              alt="avatar"
            />
            {params.row.name}
          </div>
        );
      },
    },
    {
      field: "phoneNo",
      headerName: "Phone No.",
      width: 230,
    },

    {
      field: "regNo",
      headerName: "Registration No.",
      width: 230,
    },
    {
      field: "eventName",
      headerName: "Event Name",
      width: 230,
    },

    {
      field: "date",
      headerName: "Date",
      width: 110,
    },
    {
      field: "screenshot",
      headerName: "Screenshot",
      width: 110,
      renderCell: (params) => {
        return (
          // <div className="cellWithImg">
          <a href={params.row.screenshot || "/images"} target="_blank">
            <img
              className="cellImg"
              src={params.row.screenshot || "/images/favicon.ico"}
            />
          </a>
          // </div>
        );
      },
    },
    {
      field: "isVerified",
      headerName: "Is Verified",
      width: 150,
      renderCell: (params) => {
        return (
          <>
            {params.row.isVerified === 0 ? (
              <VerifyDiv>
                <Tooltip title="Reject">
                  <Button
                    variant="outlined"
                    onClick={() => submitTransaction(2, params.row.id)}
                    color="error">
                    <Cancel />
                  </Button>
                </Tooltip>
                <Tooltip title="Accept">
                  <Button
                    variant="outlined"
                    onClick={() => setModal(true)}
                    color="success">
                    <CheckCircleOutlineIcon />
                  </Button>
                </Tooltip>
                <Modal
                  open={modal}
                  onClose={handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description">
                  <Box sx={style}>
                    <TextField
                      name="transactionId"
                      label="Transaction Id"
                      variant="outlined"
                      value={transactionId}
                      onChange={(e) => {
                        setTransactionId(e.target.value);
                      }}
                      required
                    />

                    <Button
                      sx={{ margin: "1rem 0 !important" }}
                      variant="contained"
                      color="success"
                      onClick={() =>
                        submitTransaction(1, params.row.id, transactionId)
                      }>
                      Submit
                    </Button>
                  </Box>
                </Modal>
              </VerifyDiv>
            ) : (
              <Button
                variant="contained"
                color={params.row.isVerified === 1 ? "success" : "error"}>
                {params.row.isVerified === 1 ? "Accepted" : "Rejected"}
              </Button>
            )}
          </>
        );
      },
    },
  ];
  const exportPDF = () => {
    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "portrait"; // portrait or landscape

    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);

    doc.setFontSize(15);

    const title = `Event Name::${event.name}`;
    const headers = [["NAME", "RegNo", "Phone No"]];

    const data = newData.map((elt) => [elt.name, elt.regNo, elt.phoneNo]);

    let content = {
      startY: 50,
      head: headers,
      body: data,
    };

    doc.text(title, marginLeft, 40);
    doc.autoTable(content);
    doc.save(`${event.name}.pdf`);
  };

  var myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${authToken}`);
  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  let url = prodUrl + location.pathname;
  let event = location.state;
  useEffect(() => {
    const update = () => {
      fetch(url, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setNewData(data.map((e, i) => ({ ...e, id: i + 1 })));
          setLoading(false);
        })
        .catch((error) => console.log("error", error));
    };
    update();
  }, [url]);

  return !loading ? (
    <div className="datatable">
      <div className="datatableTitle">
        <span style={{ fontWeight: "bold" }}>
          Participants of {event?.name}
        </span>
        <Button onClick={exportPDF} className="link">
          Download PDF
        </Button>
      </div>

      <DataGrid
        className="datagrid"
        rows={newData}
        columns={event?.isPaid ? userColumnsPaid : userColumns}
        pageSize={9}
        rowsPerPageOptions={[9]}
      />
      <Backdrop
        sx={{ color: "#7451f8", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={paymentLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  ) : (
    <Backdrop
      sx={{ color: "#7451f8", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={loading}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default Datatable;
