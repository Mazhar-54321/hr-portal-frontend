import { useFormik } from "formik";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { useLoginMutation } from "../store/authApi";
import { useNavigate } from "react-router-dom";
import { loginSchema } from "../zod/Login";
import { z } from "zod";
type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const [loginUser, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();

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
        await loginUser(values).unwrap();
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
