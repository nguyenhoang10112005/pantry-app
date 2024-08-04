'use client'

import { useState, useEffect } from 'react'
import { Box, Stack, Typography, Button, Modal, TextField } from '@mui/material'
import { firestore } from '../firebase'
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#1B263B',
  color: '#E0E1DD',
  border: '2px solid #E0E1DD',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
}

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [filteredInventory, setFilteredInventory] = useState([])

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() })
    })
    setInventory(inventoryList)
    setFilteredInventory(inventoryList) // Update filtered inventory as well
  }

  useEffect(() => {
    updateInventory()
  }, [])

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    } else {
      await setDoc(docRef, { quantity: 1 })
    }
    await updateInventory()
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }
    await updateInventory()
  }

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleSearchInputChange = (e) => {
    const input = e.target.value.toLowerCase()
    setSearchInput(input)
    setFilteredInventory(
      inventory.filter(item =>
        item.name.toLowerCase().includes(input)
      )
    )
  }

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      flexDirection="column"
      alignItems="center"
      gap={2}
      bgcolor="#0D1B2A"
      padding={3}
    >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              sx={{
                input: { color: '#E0E1DD' },
                label: { color: '#E0E1DD' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#E0E1DD' },
                  '&:hover fieldset': { borderColor: '#E0E1DD' },
                  '&.Mui-focused fieldset': { borderColor: '#E0E1DD' },
                }
              }}
            />
            <Button
              variant="outlined"
              sx={{ color: '#E0E1DD', borderColor: '#E0E1DD', '&:hover': { bgcolor: '#E0E1DD', color: '#1B263B' } }}
              onClick={() => {
                addItem(itemName)
                setItemName('')
                handleClose()
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <TextField
        id="search-input"
        label="Search"
        variant="outlined"
        fullWidth
        value={searchInput}
        onChange={handleSearchInputChange}
        sx={{
          input: { color: '#E0E1DD' },
          label: { color: '#E0E1DD' },
          '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: '#E0E1DD' },
            '&:hover fieldset': { borderColor: '#E0E1DD' },
            '&.Mui-focused fieldset': { borderColor: '#E0E1DD' },
          },
          marginBottom: 2,
          maxWidth: '800px',
        }}
      />
      <Button
        variant="contained"
        sx={{ bgcolor: '#1B263B', color: '#E0E1DD', '&:hover': { bgcolor: '#E0E1DD', color: '#1B263B' } }}
        onClick={handleOpen}
      >
        Add New Item
      </Button>
      <Box border="1px solid #E0E1DD" width="800px">
        <Box
          width="100%"
          height="100px"
          bgcolor="#415A77"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant="h4" color="#E0E1DD" textAlign="center">
            Inventory Items
          </Typography>
        </Box>
        <Stack width="100%" height="300px" spacing={2} overflow="auto" bgcolor="#0D1B2A" padding={2}>
          {filteredInventory.length > 0 ? (
            filteredInventory.map(({ name, quantity }) => (
              <Box
                key={name}
                width="100%"
                minHeight="100px"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                bgcolor="#1B263B"
                padding={2}
                borderRadius={2}
              >
                <Typography variant="h5" color="#E0E1DD" textAlign="center">
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant="h5" color="#E0E1DD" textAlign="center">
                  Quantity: {quantity}
                </Typography>
                <Box display="flex" gap={1}>
                  <Button
                    variant="contained"
                    sx={{ bgcolor: '#415A77', color: '#E0E1DD', '&:hover': { bgcolor: '#E0E1DD', color: '#1B263B' } }}
                    onClick={() => addItem(name)}
                  >
                    Add
                  </Button>
                  <Button
                    variant="contained"
                    sx={{ bgcolor: '#415A77', color: '#E0E1DD', '&:hover': { bgcolor: '#E0E1DD', color: '#1B263B' } }}
                    onClick={() => removeItem(name)}
                  >
                    Remove
                  </Button>
                </Box>
              </Box>
            ))
          ) : (
            <Typography variant="h6" color="#E0E1DD" textAlign="center">
              No items found.
            </Typography>
          )}
        </Stack>
      </Box>
    </Box>
  )
}
