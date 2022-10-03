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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import { DashboardSkeleton } from "../DashboardSkeleton";

import VehicleModel from "../../../models/Vehicle";
import { getVehicles } from "../../../services/supabase/vehicle";
import { getCustomers } from "../../../services/supabase/customer";

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
  const [addVehicleFormOpen, setAddVehicleFormOpen] = useState(false);
  const handleAddVehicleFormOpen = () => setAddVehicleFormOpen(true);
  const handleAddVehicleFormClose = () => setAddVehicleFormOpen(false);

  const [updateVehicleFormOpen, setUpdateVehicleFormOpen] = useState(false);
  const handleUpdateVehicleFormOpen = () => setUpdateVehicleFormOpen(true);
  const handleupdateVehicleFormClose = () => setUpdateVehicleFormOpen(false);

  const [vehicles, setVehicles] = useState(null);
  const [customers, setCustomers] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchVehicles = async () => {
    const apiResponse = await getVehicles();
    if (apiResponse.error) {
      alert(
        `There was some error while fetching vehicles: ${apiResponse.errorMessage}`
      );
      return [];
    } else {
      return apiResponse.data;
    }
  };

  const fetchCustomers = async () => {
    const apiResponse = await getCustomers();
    if (apiResponse.error) {
      alert(
        `There was some error while fetching customers: ${apiResponse.errorMessage}`
      );
      return [];
    } else {
      return apiResponse.data;
    }
  };

  const setVehiclesData = async () => {
    setLoading(true);
    const vehiclesRes = await fetchVehicles();
    setVehicles((prev) => vehiclesRes);
    setLoading(false);
  };

  const setCustomersData = async () => {
    setLoading(true);
    const customersRes = await fetchCustomers();
    setCustomers((prev) => customersRes);
    setLoading(false);
  };

  useEffect(() => {
    setVehiclesData();
    setCustomersData();
  }, []);

  const handleDeleteVehicle = async (vehicle) => {
    console.log("delete vehicle: ", vehicle.id);
    const apiResponse = await vehicle.delete();

    if (apiResponse.isError) {
      alert(`Error while deleting vehicle: ${apiResponse.errorMessage}`);
    } else {
      alert(`Vehicle deleted successfully`);
      setVehiclesData();
    }
  };

  const AddVehicleModal = ({ customers }) => {
    const regNoRef = useRef();
    const modelRef = useRef();
    const [selectedCustomerIndex, setSelectedCustomerIndex] = useState(0);

    const handleCustomerChange = (event) => {
      console.log("DROPDOWN :", event.target.value);
      setSelectedCustomerIndex((prev) => event.target.value);
    };

    async function handleAddVehicleSubmit(e) {
      e.preventDefault();

      const regNo = regNoRef.current.value;
      const model = modelRef.current.value;

      console.log("Add vehicle", { regNo, model });

      const apiResponse = await VehicleModel.insert(
        regNo,
        model,
        customers[selectedCustomerIndex]
      );

      if (apiResponse.isError) {
        alert(`Error while inserting vehicle: ${apiResponse.errorMessage}`);
      } else {
        alert(`Vehicle inserted successfully`);
        handleAddVehicleFormClose();
        setVehiclesData();
      }
    }

    return (
      <Modal
        open={addVehicleFormOpen}
        onClose={handleAddVehicleFormClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h5" component="h5">
            Add Vehicle
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <Box
              component="form"
              noValidate
              autoComplete="off"
              onSubmit={handleAddVehicleSubmit}
            >
              <TextField
                id="regNo"
                label="Register Number"
                variant="outlined"
                margin="normal"
                required
                fullWidth
                type="text"
                name="regNo"
                autoFocus
                inputRef={regNoRef}
              />
              <TextField
                id="model"
                label="Model"
                variant="outlined"
                margin="normal"
                required
                fullWidth
                type="text"
                name="model"
                multiline
                inputRef={modelRef}
              />
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Customer</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={selectedCustomerIndex}
                  label="Customer"
                  onChange={handleCustomerChange}
                >
                  {customers.map((customer, index) => {
                    return (
                      <MenuItem key={customer.id} value={index}>
                        {customer.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              <Button type="submit" fullWidth variant="contained">
                Add
              </Button>
            </Box>
          </Typography>
        </Box>
      </Modal>
    );
  };

  const UpdateVehicleModal = ({ vehicle, customers }) => {
    const regNoRef = useRef();
    const modelRef = useRef();

    const initialCustomer = customers.filter((customer) => {
      return customer.id === vehicle.customer.id;
    })[0];
    const initialCustomerIndex = customers.findIndex(
      (customer) => customer.id === initialCustomer.id
    );

    const [selectedCustomerIndex, setSelectedCustomerIndex] =
      useState(initialCustomerIndex);

    const handleCustomerChange = (event) => {
      console.log("DROPDOWN :", event.target.value);
      setSelectedCustomerIndex((prev) => event.target.value);
    };

    async function handleUpdateVehicleSubmit(e) {
      e.preventDefault();

      const regNo = regNoRef.current.value;
      const model = modelRef.current.value;

      console.log("Update vehicle", { regNo, model });

      const apiResponse = await vehicle.update(
        regNo,
        model,
        customers[selectedCustomerIndex]
      );

      if (apiResponse.isError) {
        alert(`Error while updating vehicle: ${apiResponse.errorMessage}`);
      } else {
        alert(`Vehicle updated successfully`);
        handleupdateVehicleFormClose();
        setVehiclesData();
      }
    }

    return (
      <Modal
        open={updateVehicleFormOpen}
        onClose={handleupdateVehicleFormClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h5" component="h5">
            Update Vehicle
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <Box
              component="form"
              noValidate
              autoComplete="off"
              onSubmit={handleUpdateVehicleSubmit}
            >
              <TextField
                id="regNo"
                label="Register Number"
                variant="outlined"
                margin="normal"
                required
                fullWidth
                type="text"
                name="regNo"
                autoFocus
                inputRef={regNoRef}
                defaultValue={vehicle.regNo}
              />
              <TextField
                id="model"
                label="Model"
                variant="outlined"
                margin="normal"
                required
                fullWidth
                type="text"
                name="model"
                multiline
                inputRef={modelRef}
                defaultValue={vehicle.model}
              />
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Customer</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={selectedCustomerIndex}
                  label="Customer"
                  onChange={handleCustomerChange}
                >
                  {customers.map((customer, index) => {
                    return (
                      <MenuItem key={customer.id} value={index}>
                        {customer.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              <Button type="submit" fullWidth variant="contained">
                Update
              </Button>
            </Box>
          </Typography>
        </Box>
      </Modal>
    );
  };

  const VehicleList = ({ vehicles }) => {
    return (
      <List>
        {vehicles.map((vehicle, i) => (
          <Card
            key={vehicle.id}
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
                      onClick={handleUpdateVehicleFormOpen}
                    >
                      Update
                    </Button>
                    <UpdateVehicleModal
                      vehicle={vehicle}
                      customers={customers}
                    ></UpdateVehicleModal>
                    <IconButton
                      edge="end"
                      aria-label="comments"
                      onClick={() => handleDeleteVehicle(vehicle)}
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
                  primary={
                    <Box sx={{ display: "flex" }}>
                      <Typography>{vehicle.regNo},</Typography>
                      <Typography ml={1}>{vehicle.model}</Typography>
                    </Box>
                  }
                  secondary={vehicle.customer.name}
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
          <Typography variant="h2">Vehicles</Typography>
        </Grid>
        <Grid item>
          <Button onClick={handleAddVehicleFormOpen}>Add Vehicle</Button>
          {!loading ? (
            <AddVehicleModal customers={customers}></AddVehicleModal>
          ) : (
            <p>Loading</p>
          )}
        </Grid>
      </Grid>
      {vehicles !== null ? (
        <VehicleList vehicles={vehicles}></VehicleList>
      ) : (
        <p>Loading</p>
      )}
    </Container>
  );
}

export function Vehicle() {
  return <DashboardSkeleton component={Component}></DashboardSkeleton>;
}
