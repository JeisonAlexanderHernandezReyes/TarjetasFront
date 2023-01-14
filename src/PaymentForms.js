import React, { useState, useEffect } from "react";
import { Grid, TextField } from "@mui/material";
import Cards from "react-credit-cards";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import "react-credit-cards/es/styles-compiled.css";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";

const PaymentForms = () => {
  /* A hook that allows us to use the state of the component. */
  const [state, setState] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: 0,
    focus: "",
  });

  /* A hook that allows us to use the state of the component. */
  const [dataTable, setDataTable] = useState([]);

  /* A hook that allows us to use the state of the component. */
  const [isValidateNumber, setIsValidateNumber] = useState(true);
  const [isValidateCVV, setIsValidateCVV] = useState(true);
  const [isValidateDate, setIsValidateDate] = useState(true);

  /**
   * `handleInputChange` is a function that takes an event as an argument, and sets the state of the
   * component to the value of the input field
   * @param e - the event object
   */
  const handleInputChange = (e) => {
    validateInputNumber(e);
    validateInputCVV(e);
    validateInputDate(e);
    if (e.target.name) {
      setState({
        ...state,
        [e.target.name]: e.target.value,
      });
    }
  };

  /**
   * If the input name is "number" and the input value length is 16, then set the isValidateNumber state
   * to true, otherwise set it to false
   * @param e - the event object
   */
  const validateInputNumber = (e) => {
    if (
      e.target.name === "number" &&
      e.target.value.length >= 15 &&
      e.target.value.length <= 16
    ) {
      setIsValidateNumber(true);
      setState({
        ...state,
        [e.target.name]: e.target.value,
      });
    } else if (e.target.name === "number") {
      setIsValidateNumber(false);
    }
  };

  /**
   * If the input name is cvv and the input value is greater than 3, set the isValidateCVV state to true,
   * otherwise set it to false
   * @param e - the event object
   */
  const validateInputCVV = (e) => {
    if (e.target.name === "cvv" && e.target.value.length >= 3) {
      setIsValidateCVV(true);
      setState({
        ...state,
        [e.target.name]: e.target.value,
      });
    } else if (e.target.name === "cvv") {
      setIsValidateCVV(false);
    }
  };

  /**
   * If the input is a valid date, set the state of isValidateDate to true
   * @param e - the event object
   */
  const validateInputDate = (e) => {
    const inputMonth = e.target.value[0] + e.target.value[1];
    const inputYear = 20 + e.target.value[2] + e.target.value[3];
    const currentYear = new Date().getFullYear();
    if (e.target.name === "expiry") {
      if (inputYear > currentYear && inputMonth > 0 && inputMonth < 13) {
        setIsValidateDate(true);
        setState({
          ...state,
          [e.target.name]: e.target.value,
        });
      } else {
        setIsValidateDate(false);
      }
    } else if (e.target.name === "expiry") {
      setIsValidateDate(false);
    }
  };

  /**
   * It takes an event as an argument, and then sets the focus property of the state object to the name
   * of the input that was focused
   * @param e - the event object
   */
  const handleFocusChange = (e) => {
    setState({
      ...state,
      focus: e.target.name,
    });
    if (e.target.name === "number" && e.target.value.length === 16) {
      setIsValidateNumber(true);
    } else if (
      e.target.name === "cvv" &&
      e.target.value.length >= 3 &&
      e.target.value.length <= 4
    ) {
      setIsValidateCVV(true);
    } else if (e.target.name === "expiry" && e.target.value.length === 4) {
      setIsValidateCVV(true);
    }
  };

  const submitInformation = () => {
    const information = {
      number: state.number,
      name: state.name,
      expiry: state.expiry,
    };
    const hideNumber = "XXXX XXXX XXXX " + information.number.slice(12, 16);
    setDataTable([
      ...dataTable,
      {
        number: hideNumber,
        name: information.name,
        expiry: information.expiry,
      },
    ]);
    sendData(...information, state.cvv);
  };

  /* A hook that allows us to use the state of the component. */
  useEffect(() => {}, [dataTable]);

  const sendData = async (data) => {
    try {
      await axios.post(
        "http://localhost:3001/api/customerCard",
        {
          cardNumber: data.cardNumber,
          placeHolderName: data.placeHolderName,
          expirationDate: data.expiry,
          cvv: data.cvv,
        },
        {
          headers: {
            "content-type": "text/json",
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: "20vh" }}
      >
        <Cards
          number={state.number}
          name={state.name}
          expiry={state.expiry}
          cvc={state.cvv}
          focused={state.focus}
        />
      </Grid>
      <form>
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
          style={{ minHeight: "10vh" }}
        >
          <TextField
            size="small"
            margin="dense"
            name="number"
            id="number"
            label="Número de la tarjeta"
            pattern="[0-9]{0,13}"
            type="search"
            onChange={handleInputChange}
            onFocus={handleFocusChange}
            inputProps={{ maxLength: 16, pattern: "[0-9]{0,13}" }}
            error={!isValidateNumber ? true : false}
            helperText={
              !isValidateNumber ? "Se requiere un número de tarjeta valido" : ""
            }
          />
        </Grid>
        <Grid
          container
          spacing={0}
          alignItems="center"
          justifyContent="center"
          style={{ minHeight: "10vh" }}
        >
          <TextField
            size="small"
            margin="dense"
            name="name"
            id="name"
            label="Nombre"
            type="search"
            onChange={handleInputChange}
            onFocus={handleFocusChange}
          />
        </Grid>
        <Grid
          container
          spacing={0}
          alignItems="center"
          justifyContent="center"
          style={{ minHeight: "10vh" }}
        >
          <TextField
            size="small"
            margin="dense"
            name="expiry"
            id="expiry"
            label="Fecha de expiración"
            type="search"
            onChange={handleInputChange}
            onFocus={handleFocusChange}
            inputProps={{ maxLength: 4 }}
            error={!isValidateDate ? true : false}
            helperText={!isValidateDate ? "Se requiere una fecha valida" : ""}
          />
        </Grid>
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
          style={{ minHeight: "10vh" }}
        >
          <TextField
            size="small"
            margin="dense"
            name="cvv"
            id="cvv"
            label="CVV"
            type="search"
            onChange={handleInputChange}
            onFocus={handleFocusChange}
            inputProps={{ maxLength: 4 }}
            error={!isValidateCVV ? true : false}
            helperText={!isValidateCVV ? "Se requiere un CVV valido" : ""}
          />
        </Grid>
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
          style={{ minHeight: "10vh" }}
        >
          <Button
            variant="contained"
            onClick={submitInformation}
            endIcon={<SendIcon />}
          >
            Enviar
          </Button>
        </Grid>
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
          style={{ minHeight: "10vh" }}
        >
          <TableContainer component={Paper}>
            <Table
              sx={{ minWidth: 600, width: "100%" }}
              aria-label="simple table"
            >
              <TableHead>
                <TableRow>
                  <TableCell>Número de Tarjeta</TableCell>
                  <TableCell align="right">Nombre Titular</TableCell>
                  <TableCell align="right">Fecha de expiración</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataTable.map((row) => (
                  <TableRow
                    key={row.name}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.number}
                    </TableCell>
                    <TableCell align="right">{row.name}</TableCell>
                    <TableCell align="right">{row.expiry}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </form>
    </div>
  );
};

export default PaymentForms;
