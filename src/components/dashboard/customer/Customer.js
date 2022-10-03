import React, { useState, useRef, useEffect } from "react";

import {
  Button,
  Box,
  Typography,
  Modal,
  Grid,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton,
  Container,
  Card,
  CardContent,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import { DashboardSkeleton } from "../DashboardSkeleton";

import CustomerModel from "../../../models/Customer";
import {
  getCustomer,
  deleteCustomerWithId,
  updateCustomerById,
} from "../../../services/supabase/customer";

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
  const [addCustomerFormOpen, setAddCustomerFormOpen] = useState(false);
  const handleAddCustomerFormOpen = () => setAddCustomerFormOpen(true);
  const handleAddCustomerFormClose = () => setAddCustomerFormOpen(false);

  const [updateCustomerFormOpen, setUpdateCustomerFormOpen] = useState(false);
  const handleUpdateCustomerFormOpen = () => setUpdateCustomerFormOpen(true);
  const handleupdateCustomerFormClose = () => setUpdateCustomerFormOpen(false);

  const [customers, setCustomers] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    const apiResponse = await getCustomer();
    if (apiResponse.error) {
      alert(
        `There was some error while fetching customers: ${apiResponse.errorMessage}`
      );
      return [];
    } else {
      return apiResponse.data;
    }
  };

  const setCustomersData = async () => {
    setLoading(true);
    const customersRes = await fetchCustomers();
    setCustomers((prev) => customersRes);
    setLoading(false);
  };

  useEffect(() => {
    setCustomersData();
  }, []);

  const handleDeleteCustomer = async (customer) => {
    console.log("delete customer: ", customer.id);
    const apiResponse = await customer.delete();

    if (apiResponse.isError) {
      alert(`Error while deleting customer: ${apiResponse.errorMessage}`);
    } else {
      alert(`Customer deleted successfully`);
      setCustomersData();
    }
  };

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
        setCustomersData();
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

  const UpdateCustomerModal = ({ customer }) => {
    const nameRef = useRef();
    const addressRef = useRef();
    const contactRef = useRef();
    const aadharRef = useRef();

    async function handleUpdateCustomerSubmit(e) {
      e.preventDefault();

      const name = nameRef.current.value;
      const address = addressRef.current.value;
      const contact = contactRef.current.value;
      const aadhar = aadharRef.current.value;

      console.log("Update customer", { name, address, contact, aadhar });

      const apiResponse = await customer.update(name, address, contact, aadhar);

      if (apiResponse.isError) {
        alert(`Error while updating customer: ${apiResponse.errorMessage}`);
      } else {
        alert(`Customer updated successfully`);
        handleupdateCustomerFormClose();
        setCustomersData();
      }
    }

    return (
      <Modal
        open={updateCustomerFormOpen}
        onClose={handleupdateCustomerFormClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h5" component="h5">
            Update Customer
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <Box
              component="form"
              noValidate
              autoComplete="off"
              onSubmit={handleUpdateCustomerSubmit}
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
                defaultValue={customer.name}
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
                defaultValue={customer.address}
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
                defaultValue={customer.contact}
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
                defaultValue={customer.aadhar}
              />
              <Button type="submit" fullWidth variant="contained">
                Update
              </Button>
            </Box>
          </Typography>
        </Box>
      </Modal>
    );
  };

  const CustomersList = ({ customers }) => {
    return (
      <List>
        {customers.map((customer, i) => (
          <Card
            key={customer.id}
            variant="outlined"
            sx={{
              marginBottom: "5px",
              border: "1px solid grey",
              borderRadius: "10px",
            }}
          >
            <CardContent>
              <ListItem
                disablePadding
                secondaryAction={
                  <React.Fragment>
                    <Button
                      edge="end"
                      aria-label="comments"
                      onClick={handleUpdateCustomerFormOpen}
                    >
                      Update
                    </Button>
                    <UpdateCustomerModal
                      customer={customer}
                    ></UpdateCustomerModal>
                    <IconButton
                      edge="end"
                      aria-label="comments"
                      onClick={() => handleDeleteCustomer(customer)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </React.Fragment>
                }
              >
                <ListItemAvatar>
                  <Typography variant="h5" component="h5">
                    {i + 1}
                  </Typography>
                </ListItemAvatar>
                <ListItemText
                  primary={customer.name}
                  secondary={customer.contact}
                />
              </ListItem>
            </CardContent>
          </Card>
        ))}
      </List>
    );
  };

  return (
    <Container sx={{ width: "90vw" }}>
      <Grid
        container
        component="main"
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Grid item>
          <Typography variant="h2">Customers</Typography>
        </Grid>
        <Grid item>
          <Button onClick={handleAddCustomerFormOpen}>Add Customer</Button>
          <AddCustomerModal></AddCustomerModal>
        </Grid>
      </Grid>
      {!loading ? (
        <CustomersList customers={customers}></CustomersList>
      ) : (
        <p>Loading</p>
      )}
    </Container>
  );
}

export function Customer() {
  return <DashboardSkeleton component={Component}></DashboardSkeleton>;
}
