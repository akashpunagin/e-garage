import React, { useState, useRef } from "react";

import { Button, Box, Typography, Modal, Grid, TextField } from "@mui/material";

import { DashboardSkeleton } from "../DashboardSkeleton";

import CustomerModel from "../../../models/Customer";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function Component() {
  const [addCustomerFormOpen, setAddCustomrtFormOpen] = useState(false);
  const handleAddCustomerFormOpen = () => setAddCustomrtFormOpen(true);
  const handleAddCustomerFormClose = () => setAddCustomrtFormOpen(false);

  const AddCustomerModal = () => {
    const nameRef = useRef();
    const addressRef = useRef();
    const contactRef = useRef();
    const aadharRef = useRef();

    async function handleAddCustomerSubmit(e) {
      e.preventDefault();

      const name = nameRef.current.value;
      const address = addressRef.current.value;
      const contact = contactRef.current.value;
      const aadhar = aadharRef.current.value;

      console.log("Add customer", { name, address, contact, aadhar });

      const apiResponse = await CustomerModel.insert(
        name,
        address,
        contact,
        aadhar
      );

      if (apiResponse.isError) {
        alert(`Error while inserting customer: ${apiResponse.errorMessage}`);
      } else {
        alert(`Customer inserted successfully`);
        handleAddCustomerFormClose();
      }
    }

    return (
      <Modal
        open={addCustomerFormOpen}
        onClose={handleAddCustomerFormClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h5" component="h5">
            Add Customer
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <Box
              component="form"
              noValidate
              autoComplete="off"
              onSubmit={handleAddCustomerSubmit}
            >
              <TextField
                id="name"
                label="Name"
                variant="outlined"
                margin="normal"
                required
                fullWidth
                type="text"
                name="name"
                autoFocus
                inputRef={nameRef}
              />
              <TextField
                id="address"
                label="Address"
                variant="outlined"
                margin="normal"
                required
                fullWidth
                type="text"
                name="address"
                multiline
                inputRef={addressRef}
              />
              <TextField
                id="contact"
                label="Contact"
                variant="outlined"
                margin="normal"
                required
                fullWidth
                type="number"
                name="contact"
                inputRef={contactRef}
              />
              <TextField
                id="aadhar"
                label="Aadhar"
                variant="outlined"
                margin="normal"
                required
                fullWidth
                type="number"
                name="aadhar"
                inputRef={aadharRef}
              />
              <Button type="submit" fullWidth variant="contained">
                Add
              </Button>
            </Box>
          </Typography>
        </Box>
      </Modal>
    );
  };

  return (
    <Grid
      container
      component="main"
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{ width: "90vw" }}
    >
      <Grid item>
        <Typography variant="h2">Cusomers</Typography>
      </Grid>
      <Grid item>
        <Button onClick={handleAddCustomerFormOpen}>Add Customer</Button>
        <AddCustomerModal></AddCustomerModal>
      </Grid>
    </Grid>
  );
}

export function Customer() {
  return <DashboardSkeleton component={Component}></DashboardSkeleton>;
}
