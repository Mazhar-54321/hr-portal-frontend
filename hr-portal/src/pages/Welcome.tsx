import { Box, Button, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      p={2}
    >
      <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 400, textAlign: "center" }}>
        <Typography variant="h4" mb={3}>
          Welcome to HR Portal
        </Typography>
        <Box display="flex" gap={2} justifyContent="center">
          <Button variant="contained" onClick={() => navigate("/login")}>
            Login
          </Button>
          <Button variant="outlined" onClick={() => navigate("/register")}>
            Register
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Welcome;
