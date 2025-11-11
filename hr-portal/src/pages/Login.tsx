import { useFormik } from "formik";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { useLoginMutation, useLogoutMutation } from "../store/authApi";
import { useNavigate } from "react-router-dom";
import { loginSchema } from "../zod/Login";

import { z } from "zod";
import { useDispatch } from "react-redux";
import { logout, setCredentials } from "../store/authSlice";
import { useEffect } from "react";
import { useAppSelector } from "../store/hook";
type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const [loginUser, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();
const dispatch = useDispatch();
const user = useAppSelector((state) => state.auth.user);
  const [logoutApi, { isLoading: isLoggingOut }] = useLogoutMutation();

  useEffect(() => {
     if(user){
      const handleLogout = async () => {
          try {
            await logoutApi().unwrap();
            dispatch(logout());
          } catch (err) {
            console.error("Logout failed", err);
          }
        };
        handleLogout();
     }
  }, [user])
  const formik = useFormik<LoginFormValues>({
    initialValues: { email: "", password: "" },
    validate: (values) => {
      try {
        loginSchema.parse(values);
        return {};
      } catch (err: any) {
        const errors: Record<string, string> = {};
        err.errors.forEach((e: any) => {
          if (e.path && e.path[0]) errors[e.path[0]] = e.message;
        });
        return errors;
      }
    },
    onSubmit: async (values) => {
      try {
        const response = await loginUser(values).unwrap();
         dispatch(setCredentials({ 
        user: response.user, 
        accessToken: response.accessToken 
      }));
        navigate("/dashboard");
      } catch (err: any) {
        alert(err.data?.message || "Login failed");
      }
    },
  });

  return (
    <Container maxWidth="sm">
      <Box mt={8}>
        <Typography variant="h4" mb={3}>
          Login
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            id="email"
            name="email"
            label="Email"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={!!formik.errors.email && formik.touched.email}
            helperText={formik.touched.email && formik.errors.email}
          />
          <TextField
            fullWidth
            margin="normal"
            id="password"
            name="password"
            label="Password"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={!!formik.errors.password && formik.touched.password}
            helperText={formik.touched.password && formik.errors.password}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isLoading}
            sx={{ mt: 2 }}
          >
            Login
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Login;
