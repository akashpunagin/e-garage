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

import ItemModel from "../../../models/Item";
import { getItems } from "../../../services/supabase/item";

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
  const [addItemFormOpen, setAddItemFormOpen] = useState(false);
  const handleAddItemFormOpen = () => setAddItemFormOpen(true);
  const handleAddItemFormClose = () => setAddItemFormOpen(false);

  const [updateItemFormOpen, setUpdateItemFormOpen] = useState(false);
  const handleUpdateItemFormOpen = () => setUpdateItemFormOpen(true);
  const handleupdateItemFormClose = () => setUpdateItemFormOpen(false);

  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const setItemsData = async () => {
    setLoading(true);
    const itemsRes = await fetchItems();
    setItems((prev) => itemsRes);
    setLoading(false);
  };

  useEffect(() => {
    setItemsData();
  }, []);

  const handleDeleteItem = async (item) => {
    console.log("delete item: ", item.id);
    const apiResponse = await item.delete();

    if (apiResponse.isError) {
      alert(`Error while deleting item: ${apiResponse.errorMessage}`);
    } else {
      alert(`Item deleted successfully`);
      setItemsData();
    }
  };

  const AddItemModal = () => {
    const nameRef = useRef();
    const prizeRef = useRef();
    const qtyRef = useRef();

    async function handleAddItemSubmit(e) {
      e.preventDefault();

      const name = nameRef.current.value;
      const price = prizeRef.current.value;
      const qty = qtyRef.current.value;

      console.log("Add item", { name, price, qty });

      const apiResponse = await ItemModel.insert(name, price, qty);

      if (apiResponse.isError) {
        alert(`Error while inserting item: ${apiResponse.errorMessage}`);
      } else {
        alert(`Item inserted successfully`);
        handleAddItemFormClose();
        setItemsData();
      }
    }

    return (
      <Modal
        open={addItemFormOpen}
        onClose={handleAddItemFormClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h5" component="h5">
            Add Item
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <Box
              component="form"
              noValidate
              autoComplete="off"
              onSubmit={handleAddItemSubmit}
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
                id="price"
                label="price"
                variant="outlined"
                margin="normal"
                required
                fullWidth
                type="number"
                name="price"
                inputRef={prizeRef}
              />
              <TextField
                id="qty"
                label="Quantity"
                variant="outlined"
                margin="normal"
                required
                fullWidth
                type="number"
                name="qty"
                inputRef={qtyRef}
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

  const UpdateItemModal = ({ item }) => {
    const nameRef = useRef();
    const prizeRef = useRef();
    const qtyRef = useRef();

    async function handleUpdateItemSubmit(e) {
      e.preventDefault();

      const name = nameRef.current.value;
      const price = prizeRef.current.value;
      const qty = qtyRef.current.value;

      console.log("Update item", { name, price, qty });

      const apiResponse = await item.update(name, price, qty);

      if (apiResponse.isError) {
        alert(`Error while updating item: ${apiResponse.errorMessage}`);
      } else {
        alert(`Item updated successfully`);
        handleupdateItemFormClose();
        setItemsData();
      }
    }

    return (
      <Modal
        open={updateItemFormOpen}
        onClose={handleupdateItemFormClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h5" component="h5">
            Update Item
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <Box
              component="form"
              noValidate
              autoComplete="off"
              onSubmit={handleUpdateItemSubmit}
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
                defaultValue={item.name}
              />
              <TextField
                id="price"
                label="price"
                variant="outlined"
                margin="normal"
                required
                fullWidth
                type="number"
                name="price"
                inputRef={prizeRef}
                defaultValue={item.price}
              />
              <TextField
                id="qty"
                label="Quantity"
                variant="outlined"
                margin="normal"
                required
                fullWidth
                type="number"
                name="qty"
                inputRef={qtyRef}
                defaultValue={item.qty}
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

  const ItemsList = ({ items }) => {
    return (
      <List>
        {items.map((item, i) => (
          <Card
            key={item.id}
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
                      onClick={handleUpdateItemFormOpen}
                    >
                      Update
                    </Button>
                    <UpdateItemModal item={item}></UpdateItemModal>
                    <IconButton
                      edge="end"
                      aria-label="comments"
                      onClick={() => handleDeleteItem(item)}
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
                <ListItemText primary={item.name} secondary={item.qty} />
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
          <Typography variant="h2">Items</Typography>
        </Grid>
        <Grid item>
          <Button onClick={handleAddItemFormOpen}>Add Item</Button>
          <AddItemModal></AddItemModal>
        </Grid>
      </Grid>
      {!loading ? <ItemsList items={items}></ItemsList> : <p>Loading</p>}
    </Container>
  );
}

export function Item() {
  return <DashboardSkeleton component={Component}></DashboardSkeleton>;
}
