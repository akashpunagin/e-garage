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
  FormLabel,
  FormControlLabel,
  RadioGroup,
  Radio,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import { DashboardSkeleton } from "../DashboardSkeleton";

import WorkerModel from "../../../models/Worker";
import { getWorkers } from "../../../services/supabase/worker";

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
  const [addWorkerFormOpen, setAddWorkerFormOpen] = useState(false);
  const handleAddWorkerFormOpen = () => setAddWorkerFormOpen(true);
  const handleAddWorkerFormClose = () => setAddWorkerFormOpen(false);

  const [updateWorkerFormOpen, setUpdateWorkerFormOpen] = useState(false);
  const handleUpdateWorkerFormOpen = () => setUpdateWorkerFormOpen(true);
  const handleupdateWorkerFormClose = () => setUpdateWorkerFormOpen(false);

  const [workers, setWorkers] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const setWorkersData = async () => {
    setLoading(true);
    const workersRes = await fetchWorkers();
    setWorkers((prev) => workersRes);
    setLoading(false);
  };

  useEffect(() => {
    setWorkersData();
  }, []);

  const handleDeleteWorker = async (worker) => {
    console.log("delete worker: ", worker.id);
    const apiResponse = await worker.delete();

    if (apiResponse.isError) {
      alert(`Error while deleting worker: ${apiResponse.errorMessage}`);
    } else {
      alert(`Worker deleted successfully`);
      setWorkersData();
    }
  };

  const AddWorkerModal = () => {
    const nameRef = useRef();
    const ageRef = useRef();
    const [gender, setGender] = useState("male");

    const handleRadioChange = (e) => {
      setGender((prev) => e.target.value);
    };

    async function handleAddWorkerSubmit(e) {
      e.preventDefault();

      const name = nameRef.current.value;
      const age = ageRef.current.value;

      console.log("Add worker", { name, age, gender });

      const apiResponse = await WorkerModel.insert(
        name,
        age,
        WorkerModel.isMaleBooleanFromString(gender)
      );

      if (apiResponse.isError) {
        alert(`Error while inserting worker: ${apiResponse.errorMessage}`);
      } else {
        alert(`Worker inserted successfully`);
        handleAddWorkerFormClose();
        setWorkersData();
      }
    }

    return (
      <Modal
        open={addWorkerFormOpen}
        onClose={handleAddWorkerFormClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h5" component="h5">
            Add Worker
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <Box
              component="form"
              noValidate
              autoComplete="off"
              onSubmit={handleAddWorkerSubmit}
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
                id="age"
                label="Age"
                variant="outlined"
                margin="normal"
                required
                fullWidth
                type="number"
                name="age"
                multiline
                inputRef={ageRef}
              />
              <FormControl>
                <FormLabel id="demo-radio-buttons-group-label">
                  Gender
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-radio-buttons-group-label"
                  defaultValue="male"
                  onChange={handleRadioChange}
                  name="radio-buttons-group"
                >
                  <FormControlLabel
                    value="male"
                    control={<Radio />}
                    label="Male"
                  />
                  <FormControlLabel
                    value="female"
                    control={<Radio />}
                    label="Female"
                  />
                </RadioGroup>
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

  const UpdateWorkerModal = ({ worker }) => {
    const nameRef = useRef();
    const ageRef = useRef();
    const [gender, setGender] = useState(worker.isMale ? "male" : "female");

    const handleRadioChange = (e) => {
      setGender((prev) => e.target.value);
    };

    async function handleUpdateWorkerSubmit(e) {
      e.preventDefault();

      const name = nameRef.current.value;
      const age = ageRef.current.value;

      const apiResponse = await worker.update(
        name,
        age,
        WorkerModel.isMaleBooleanFromString(gender)
      );

      if (apiResponse.isError) {
        alert(`Error while updating worker: ${apiResponse.errorMessage}`);
      } else {
        alert(`Worker updated successfully`);
        handleupdateWorkerFormClose();
        setWorkersData();
      }
    }

    return (
      <Modal
        open={updateWorkerFormOpen}
        onClose={handleupdateWorkerFormClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h5" component="h5">
            Update Worker
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <Box
              component="form"
              noValidate
              autoComplete="off"
              onSubmit={handleUpdateWorkerSubmit}
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
                defaultValue={worker.name}
              />
              <TextField
                id="age"
                label="Age"
                variant="outlined"
                margin="normal"
                required
                fullWidth
                type="number"
                name="age"
                multiline
                inputRef={ageRef}
                defaultValue={worker.age}
              />
              <FormControl>
                <FormLabel id="demo-radio-buttons-group-label">
                  Gender
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-radio-buttons-group-label"
                  defaultValue={gender}
                  onChange={handleRadioChange}
                  name="radio-buttons-group"
                >
                  <FormControlLabel
                    value="male"
                    control={<Radio />}
                    label="Male"
                  />
                  <FormControlLabel
                    value="female"
                    control={<Radio />}
                    label="Female"
                  />
                </RadioGroup>
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

  const WorkersList = ({ workers }) => {
    return (
      <List>
        {workers.map((worker, i) => (
          <Card
            key={worker.id}
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
                      onClick={handleUpdateWorkerFormOpen}
                    >
                      Update
                    </Button>
                    <UpdateWorkerModal worker={worker}></UpdateWorkerModal>
                    <IconButton
                      edge="end"
                      aria-label="comments"
                      onClick={() => handleDeleteWorker(worker)}
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
                <ListItemText primary={worker.name} secondary={worker.age} />
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
          <Typography variant="h2">Workers</Typography>
        </Grid>
        <Grid item>
          <Button onClick={handleAddWorkerFormOpen}>Add Worker</Button>
          <AddWorkerModal></AddWorkerModal>
        </Grid>
      </Grid>
      {!loading ? (
        <WorkersList workers={workers}></WorkersList>
      ) : (
        <p>Loading</p>
      )}
    </Container>
  );
}

export function Worker() {
  return <DashboardSkeleton component={Component}></DashboardSkeleton>;
}
