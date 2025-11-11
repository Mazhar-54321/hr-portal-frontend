import React, { useState } from "react";
import { Container, Box, Button, Typography, Paper, Snackbar, Alert } from "@mui/material";
import Login from "./Login";
import Register from "./Registration";

const MainLayout = () => {
  const [showLogin, setShowLogin] = useState(true);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage,setToastMessage] = useState('');
  const toggleForm = () => setShowLogin((prev) => !prev);
  const onRegister = ()=>{
    setToastMessage('Registration Successful');
    setToastOpen(true);
    toggleForm();
  }
  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        <Paper elevation={3} sx={{ p: 4, width: "100%" }}>
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Button
              variant={showLogin ? "contained" : "outlined"}
              onClick={() => setShowLogin(true)}
              fullWidth
              sx={{ mr: 1 }}
            >
              Login
            </Button>
            <Button
              variant={!showLogin ? "contained" : "outlined"}
              onClick={() => setShowLogin(false)}
              fullWidth
              sx={{ ml: 1 }}
            >
              Register
            </Button>
          </Box>

          <Box mt={2}>
            {showLogin ? <Login /> : <Register onRegister={onRegister} />}
          </Box>
        </Paper>
      </Box>
      <Snackbar
              open={toastOpen}
              autoHideDuration={3000}
              onClose={() => setToastOpen(false)}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
              <Alert severity="success" onClose={() => setToastOpen(false)} sx={{ width: "100%" }}>
                {toastMessage}
              </Alert>
            </Snackbar>
    </Container>
  );
};

export default MainLayout;
