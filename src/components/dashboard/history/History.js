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
  Container,
  Card,
  CardContent,
} from "@mui/material";

import { DashboardSkeleton } from "../DashboardSkeleton";

import { getVehicleLog } from "../../../services/supabase/readyVehicleLog";

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
  const [logs, setLogs] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    const apiResponse = await getVehicleLog();
    if (apiResponse.error) {
      alert(
        `There was some error while fetching log: ${apiResponse.errorMessage}`
      );
      return [];
    } else {
      return apiResponse.data;
    }
  };

  const setLogsData = async () => {
    setLoading(true);
    const logsRes = await fetchLogs();
    setLogs((prev) => logsRes);
    setLoading(false);
  };

  useEffect(() => {
    setLogsData();
  }, []);

  const LogsList = ({ logs }) => {
    return (
      <List>
        {logs.map((log, i) => (
          <Card
            key={log.id}
            variant="outlined"
            sx={{
              marginBottom: "5px",
              border: "1px solid grey",
              borderRadius: "10px",
            }}
          >
            <CardContent>
              <ListItem disablePadding>
                <ListItemAvatar>
                  <Typography variant="h5" component="h5">
                    {i + 1}
                  </Typography>
                </ListItemAvatar>
                <ListItemText
                  primary={`Register No: ${log.regNo}, Prize: ${log.totalPrize}`}
                  secondary={`Delivered On: ${log.deliveredOn}`}
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
          <Typography variant="h2">History</Typography>
        </Grid>
      </Grid>
      {!loading ? <LogsList logs={logs}></LogsList> : <p>Loading</p>}
    </Container>
  );
}

export function History() {
  return <DashboardSkeleton component={Component}></DashboardSkeleton>;
}
