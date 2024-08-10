'use client'
import { useState } from "react";
import Link from 'next/link'
import { firestore } from '@/firebase'
import { Box, Button, TextField, InputAdornment, IconButton, Typography, AppBar, Toolbar, Container } from '@mui/material'
import { FaSearch } from 'react-icons/fa'
import {
  doc,
  getDoc
} from 'firebase/firestore'

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  const handleSearch = async () => {
    if (!searchQuery) {
      setSearchResult(null);
      return;
    }

    try {
      const normalizedQuery = searchQuery.toLowerCase();
      const docRef = doc(firestore, 'inventory', normalizedQuery);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const result = {
          name: docSnap.id,
          ...docSnap.data()
        };
        setSearchResult(result);
      } else {
        setSearchResult(null);
      }
    } catch (error) {
      console.error('Error searching documents:', error);
      setSearchResult(null);
    }
  };

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        backgroundImage: 'url(/grocery.webp)', // Replace with your image path
        backgroundSize: 'cover',
        backgroundPosition: 'right', // Position the image to the right
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
      }}
    >
      {/* Navbar */}
      {/* Navbar */}
<AppBar position="static" sx={{ backgroundColor: '#87CEEED', width: '100%' }}>
  <Toolbar>
    <Typography variant="h6" sx={{ flexGrow: 1, fontSize: '1.8rem', fontWeight: 'bold' }}>
      Grocery Tracker
    </Typography>
    <Link href="/dashboard" passHref>
      <Button sx={{ color: 'white' }}>Dashboard</Button>
    </Link>
    <Link href="/signin" passHref>
      <Button sx={{ color: 'white' }}>Sign In</Button>
    </Link>
    <Link href="/signup" passHref>
      <Button sx={{ color: 'white' }}>Sign Up</Button>
    </Link>
  </Toolbar>
</AppBar>


      {/* Main content container */}
      <Container
        sx={{
          mt: 8,  // Margin top to push content below the navbar
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 2,
          position: 'relative',
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          mb={2}
          gap={2}
          sx={{ width: '100%', maxWidth: '600px' }}
        >
          <TextField
            label="Search Items"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleSearch}>
                    <FaSearch />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              width: '100%',
              backgroundColor: 'rgba(255, 255, 255, 0.8)', // Light background color
              borderRadius: '8px', // Rounded corners
              padding: '8px', // Padding for better visibility
              border: '1px solid #ccc' // Border for better visibility
            }}
          />
        </Box>

        {searchResult ? (
          <Box
            width="300px"
            p={2}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            border="1px solid #333"
            borderRadius="8px"
            bgcolor="#f0f0f0"
          >
            <Typography variant="h4" color="#333" textAlign="center">
              {searchResult.name.charAt(0).toUpperCase() + searchResult.name.slice(1)}
            </Typography>
            <Typography variant="h6" color="#333" textAlign="center">
              Quantity: {searchResult.quantity}
            </Typography>
          </Box>
        ) : (
          searchQuery && (
            <Typography variant="h6" color="textSecondary" textAlign="center">
              No items found
            </Typography>
          )
        )}
      </Container>
    </Box>
  );
}
