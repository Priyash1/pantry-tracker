'use client'
import { useState, useEffect } from "react";
import { firestore } from '@/firebase'
import { Box, Stack, Typography, Button, Modal, TextField } from '@mui/material'
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'

export default function Dashboard() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState('');

  const updateInventory = async () => {
    try {
      const snapshot = collection(firestore, 'inventory');
      const docs = await getDocs(snapshot);
      const inventoryList = docs.docs.map(doc => ({
        name: doc.id,
        ...doc.data()
      }));
      setInventory(inventoryList);
    } catch (error) {
      console.error("Error fetching inventory: ", error);
    }
  };

  const addItem = async (item) => {
    if (!item) return;

    try {
      const docRef = doc(collection(firestore, 'inventory'), item.toLowerCase());
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const { quantity } = docSnap.data();
        await setDoc(docRef, { quantity: quantity + 1 });
      } else {
        await setDoc(docRef, { quantity: 1 });
      }

      await updateInventory();
    } catch (error) {
      console.error("Error adding item: ", error);
    }
  };

  const updateItem = async (item, quantity) => {
    if (!item || !quantity) return;

    try {
      const docRef = doc(collection(firestore, 'inventory'), item.toLowerCase());
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        await setDoc(docRef, { quantity: parseInt(quantity, 10) });
        await updateInventory();
      } else {
        console.log("Item does not exist.");
      }
    } catch (error) {
      console.error("Error updating item: ", error);
    }
  };

  const deleteItem = async (item) => {
    if (!item) return;

    try {
      const docRef = doc(collection(firestore, 'inventory'), item.toLowerCase());
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        await deleteDoc(docRef);
        await updateInventory();
      } else {
        console.log("Item does not exist.");
      }
    } catch (error) {
      console.error("Error deleting item: ", error);
    }
  };

  const incrementQuantity = async (item) => {
    try {
      const docRef = doc(collection(firestore, 'inventory'), item.toLowerCase());
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const { quantity } = docSnap.data();
        await setDoc(docRef, { quantity: quantity + 1 });
        await updateInventory();
      }
    } catch (error) {
      console.error("Error incrementing quantity: ", error);
    }
  };

  const decrementQuantity = async (item) => {
    try {
      const docRef = doc(collection(firestore, 'inventory'), item.toLowerCase());
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const { quantity } = docSnap.data();
        if (quantity > 1) {
          await setDoc(docRef, { quantity: quantity - 1 });
        } else {
          await deleteDoc(docRef);
        }
        await updateInventory();
      }
    } catch (error) {
      console.error("Error decrementing quantity: ", error);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    updateInventory();
  }, []);

  return (
    <Box
      width="100vw"
      height="100vh"
      display={'flex'}
      justifyContent={'center'}
      flexDirection={'column'}
      alignItems={'center'}
      gap={2}
    >
      <Button variant="contained" onClick={handleOpen}>
        Add New Item
      </Button>

      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%,-50%)"
          width={400}
          bgcolor='white'
          border='2px solid #000'
          boxShadow={24}
          p={4}
          display='flex'
          flexDirection='column'
          gap={3}
          
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Manage Item
          </Typography>

          <TextField
            id="outlined-basic"
            label="Item"
            variant="outlined"
            fullWidth
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
          <TextField
            id="outlined-quantity"
            label="Quantity"
            variant="outlined"
            fullWidth
            type="number"
            value={itemQuantity}
            onChange={(e) => setItemQuantity(e.target.value)}
          />

          <Stack direction={'row'} spacing={2} justifyContent={'space-between'}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                addItem(itemName);
                setItemName('');
                setItemQuantity('');
                handleClose();
              }}
            >
              Add
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => {
                updateItem(itemName, itemQuantity);
                setItemName('');
                setItemQuantity('');
                handleClose();
              }}
            >
              Update
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => {
                deleteItem(itemName);
                setItemName('');
                setItemQuantity('');
                handleClose();
              }}
            >
              Delete
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Box border={'1px solid #333'}>
        <Box
          width="800px"
          height="100px"
          bgcolor={'#ADC8E9'}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Typography variant={'h2'} color={'#333'} textAlign={'center'}>
            Grocery Items
          </Typography>
        </Box>
        <Stack width="800px" height="300px" spacing={2} overflow={'auto'}>
          {inventory.length > 0 ? (
            inventory.map(({ name, quantity }) => (
              <Box
                key={name}
                width="100%"
                minHeight="150px"
                display={'flex'}
                justifyContent={'space-between'}
                alignItems={'center'}
                bgcolor={'#f0f0f0'}
                paddingX={5}
              >
                <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
                  Quantity: {quantity}
                </Typography>
                <Box display="flex" alignItems="center" gap={2}>
                  <Button variant="contained" onClick={() => decrementQuantity(name)}>
                    -
                  </Button>
                  <Button variant="contained" onClick={() => incrementQuantity(name)}>
                    +
                  </Button>
                </Box>
              </Box>
            ))
          ) : (
            <Typography variant="h6" color="textSecondary" textAlign="center">
              No items found
            </Typography>
          )}
        </Stack>
      </Box>
    </Box>
  );
}
