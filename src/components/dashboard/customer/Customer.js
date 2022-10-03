import React, { useState } from "react";

import { Button, Box, Typography, Modal, Grid } from "@mui/material";

import { DashboardSkeleton } from "../DashboardSkeleton";

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
    return (
      <Modal
        open={addCustomerFormOpen}
        onClose={handleAddCustomerFormClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Text in a modal
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
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
