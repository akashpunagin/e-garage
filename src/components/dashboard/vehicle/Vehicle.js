import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "@mui/material/styles";

import {
  Button,
  ButtonGroup,
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
  Chip,
  OutlinedInput,
  ListItemButton,
  ListItemIcon,
  Checkbox,
  FormLabel,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import { DashboardSkeleton } from "../DashboardSkeleton";

import VehicleModel from "../../../models/Vehicle";
import { getVehicles } from "../../../services/supabase/vehicle";
import { getCustomers } from "../../../services/supabase/customer";
import { getWorkers } from "../../../services/supabase/worker";
import { getItems } from "../../../services/supabase/item";

const boxStyle = {
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

//Multi select style
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getWorkerStyles(worker, selectedWorkers, theme) {
  const workerId = worker.id;
  const foundWorker = selectedWorkers.find((worker) => worker.id === workerId);

  let currentTheme;
  if (foundWorker) {
    currentTheme = theme.typography.fontWeightMedium;
  } else {
    currentTheme = theme.typography.fontWeightRegular;
  }

  return {
    fontWeight: currentTheme,
  };
}

function getItemStyles(item, selectedItem, theme) {
  const itemId = item.id;
  const foundItem = selectedItem.find((item) => item.id === itemId);

  let currentTheme;
  if (foundItem) {
    currentTheme = theme.typography.fontWeightMedium;
  } else {
    currentTheme = theme.typography.fontWeightRegular;
  }

  return {
    fontWeight: currentTheme,
  };
}

function Component() {
  const [addVehicleFormOpen, setAddVehicleFormOpen] = useState(false);
  const handleAddVehicleFormOpen = () => setAddVehicleFormOpen(true);
  const handleAddVehicleFormClose = () => setAddVehicleFormOpen(false);

  const [updateVehicleFormOpen, setUpdateVehicleFormOpen] = useState(false);
  const handleUpdateVehicleFormOpen = () => setUpdateVehicleFormOpen(true);
  const handleupdateVehicleFormClose = () => setUpdateVehicleFormOpen(false);

  const [vehicles, setVehicles] = useState(null);
  const [customers, setCustomers] = useState(null);
  const [workers, setWorkers] = useState(null);
  const [items, setItems] = useState(null);
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

  const fetchWorkers = async () => {
    const apiResponse = await getWorkers();
    if (apiResponse.error) {
      alert(
        `There was some error while fetching workers: ${apiResponse.errorMessage}`
      );
      return [];
    } else {
      return apiResponse.data;
    }
  };

  const fetchItems = async () => {
    const apiResponse = await getItems();
    if (apiResponse.error) {
      alert(
        `There was some error while fetching items: ${apiResponse.errorMessage}`
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

  const setItemsData = async () => {
    setLoading(true);
    const itemsRes = await fetchItems();
    setItems((prev) => itemsRes);
    setLoading(false);
  };

  const setWorkersData = async () => {
    setLoading(true);
    const workersRes = await fetchWorkers();
    setWorkers((prev) => workersRes);
    setLoading(false);
  };

  useEffect(() => {
    setVehiclesData();
    setCustomersData();
    setWorkersData();
    setItemsData();
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

  const AddVehicleModal = ({ customers, workers, items }) => {
    const theme = useTheme();
    const [selectedWorkers, setSelectedWorkers] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);

    const regNoRef = useRef();
    const modelRef = useRef();
    const [selectedCustomerIndex, setSelectedCustomerIndex] = useState(0);

    const handleCustomerChange = (event) => {
      setSelectedCustomerIndex((prev) => event.target.value);
    };

    const handleWorkerChange = (event) => {
      const currentWorkerAsArray = event.target.value;
      setSelectedWorkers((prev) => currentWorkerAsArray);
    };

    const handleItemChange = (event) => {
      const currentItemAsArray = event.target.value;
      setSelectedItems((prev) => currentItemAsArray);
    };

    async function handleAddVehicleSubmit(e) {
      e.preventDefault();

      const regNo = regNoRef.current.value;
      const model = modelRef.current.value;

      console.log("Add vehicle", {
        regNo,
        model,
        selectedWorkers,
        selectedItems,
      });

      const apiResponse = await VehicleModel.insert(
        regNo,
        model,
        customers[selectedCustomerIndex],
        selectedWorkers,
        selectedItems
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
        <Box sx={boxStyle}>
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
              <FormControl sx={{ m: 1, width: 300 }}>
                <InputLabel id="demo-multiple-chip-label">Workers</InputLabel>
                <Select
                  labelId="demo-multiple-chip-label"
                  id="demo-multiple-chip"
                  multiple
                  value={selectedWorkers}
                  onChange={handleWorkerChange}
                  input={
                    <OutlinedInput id="select-multiple-chip" label="Chip" />
                  }
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((worker) => (
                        <Chip key={worker} label={worker.name} />
                      ))}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {workers.map((worker) => (
                    <MenuItem
                      key={worker.id}
                      value={worker}
                      style={getWorkerStyles(worker, selectedWorkers, theme)}
                    >
                      {worker.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ m: 1, width: 300 }}>
                <InputLabel id="demo-multiple-chip-label">Items</InputLabel>
                <Select
                  labelId="demo-multiple-chip-label"
                  id="demo-multiple-chip"
                  multiple
                  value={selectedItems}
                  onChange={handleItemChange}
                  input={
                    <OutlinedInput id="select-multiple-chip" label="Chip" />
                  }
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((item) => (
                        <Chip key={item} label={item.name} />
                      ))}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {items.map((item) => (
                    <MenuItem
                      key={item.id}
                      value={item}
                      style={getItemStyles(item, selectedItems, theme)}
                    >
                      {item.name}
                    </MenuItem>
                  ))}
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

  const UpdateVehicleModal = ({ vehicle, customers, items }) => {
    const regNoRef = useRef();
    const modelRef = useRef();

    const [updatedItemIdQtyMaps, setUpdatedItemIdQtyMaps] = useState(
      vehicle.itemIdQtyMaps
    );

    const initialCustomer = customers.filter((customer) => {
      return customer.id === vehicle.customer.id;
    })[0];
    const initialCustomerIndex = customers.findIndex(
      (customer) => customer.id === initialCustomer.id
    );
    const [selectedCustomerIndex, setSelectedCustomerIndex] =
      useState(initialCustomerIndex);

    const initialCheckedWorkers = vehicle.workers.filter((worker) =>
      vehicle.completedWorkersIds.includes(worker.id)
    );
    const [checkedWorkers, setCheckedWorkers] = useState(initialCheckedWorkers);

    const handleWorkerCompletedToggle = (value) => () => {
      const currentIndex = checkedWorkers.indexOf(value);
      const newCheckedWorkers = [...checkedWorkers];

      if (currentIndex === -1) {
        newCheckedWorkers.push(value);
      } else {
        newCheckedWorkers.splice(currentIndex, 1);
      }

      setCheckedWorkers(newCheckedWorkers);
    };

    const handleCustomerChange = (event) => {
      setSelectedCustomerIndex((prev) => event.target.value);
    };

    async function handleUpdateVehicleSubmit(e) {
      e.preventDefault();

      const regNo = regNoRef.current.value;
      const model = modelRef.current.value;

      console.log("Update vehicle", {
        regNo,
        model,
        checkedWorkers,
        updatedItemIdQtyMaps,
      });

      const apiResponse = await vehicle.update(
        regNo,
        model,
        customers[selectedCustomerIndex],
        vehicle.workers,
        checkedWorkers,
        updatedItemIdQtyMaps
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
        <Box sx={boxStyle}>
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
              <FormLabel>Workers</FormLabel>
              <List
                sx={{
                  width: "100%",
                  maxWidth: 360,
                  bgcolor: "background.paper",
                }}
              >
                {vehicle.workers.map((worker) => {
                  const labelId = `checkbox-list-label-${worker.id}`;

                  return (
                    <ListItem disablePadding key={worker.id}>
                      <ListItemButton
                        role={undefined}
                        onClick={handleWorkerCompletedToggle(worker)}
                        dense
                      >
                        <ListItemIcon>
                          <Checkbox
                            edge="start"
                            checked={checkedWorkers.indexOf(worker) !== -1}
                            tabIndex={-1}
                            disableRipple
                            inputProps={{ "aria-labelledby": labelId }}
                          />
                        </ListItemIcon>
                        <ListItemText id={labelId} primary={worker.name} />
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>
              <FormLabel>Items</FormLabel>
              <List
                sx={{
                  width: "100%",
                  maxWidth: 360,
                  bgcolor: "background.paper",
                }}
              >
                {vehicle.itemIdQtyMaps.map((itemIdQtyMap, index) => {
                  const labelId = `label-${index}`;
                  console.log("INDEX HERE:", labelId);

                  return (
                    <ListItem disablePadding key={`item-qty-map-${index}`}>
                      <Typography varient="p">
                        ItemId : {itemIdQtyMap.itemId}
                      </Typography>
                      <TextField
                        key={Math.random()}
                        id={labelId}
                        label={`Qty-${index}`}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        type="number"
                        name={`qty-${index}`}
                        autoFocus
                        onChange={(event) => {
                          if (event.target.value < 0) {
                            event.target.value = 0;
                          }

                          setUpdatedItemIdQtyMaps((prev) => {
                            const currentQty = event.target.value;
                            const itemId = itemIdQtyMap.itemId;

                            const index = prev.findIndex(
                              (itemIdQtyMap) => itemIdQtyMap.itemId === itemId
                            );

                            prev[index].qty = parseInt(currentQty);
                            return prev;
                          });
                        }}
                        defaultValue={itemIdQtyMap.qty}
                      />
                    </ListItem>
                  );
                })}
              </List>
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
                      items={items}
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
            <AddVehicleModal
              customers={customers}
              workers={workers}
              items={items}
            ></AddVehicleModal>
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
