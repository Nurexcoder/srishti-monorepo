export const userColumns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "user",
      headerName: "User",
      width: 230,
      renderCell: (params) => {
        return (
          <div className="cellWithImg">
            <img className="cellImg" src='https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500' alt="avatar" />
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
      field: "clubName",
      headerName: "Club Name",
      width: 230,
    },
    {
      field: "date",
      headerName: "Date",
      width: 110,
    }
  ];

  
  