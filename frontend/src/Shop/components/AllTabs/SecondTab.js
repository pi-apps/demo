import React from "react";
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
  } from "@mui/material";
const SecondTab = (props) => {
    return (
      <div className="SecondTab">
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <h1> Certificates received </h1>
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>
                <h3>Created at</h3>
              </TableCell>
              <TableCell align="right">
                <h3>Certificate Id</h3>
              </TableCell>
              <TableCell align="right">
                <h3>Email</h3>
              </TableCell>
              <TableCell align="right">
                <h3>Awarded to</h3>
              </TableCell>
              <TableCell align="right">
                <h3>Issuer</h3>
              </TableCell>
              <TableCell align="right">
                <h3>Payment Id</h3>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.certificateList.map((certi) => (
              <TableRow
                key={certi.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {certi.created_at}
                </TableCell>
                <TableCell align="right">{certi.product_id}</TableCell>
                <TableCell align="right">{certi.email}</TableCell>
                <TableCell align="right">{certi.receiverUid}</TableCell>
                <TableCell align="right">{certi.issuerUid}</TableCell>
                <TableCell align="right">{certi.paymentId}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
    );
  };
  export default SecondTab;
