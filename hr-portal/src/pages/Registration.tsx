import { useFormik } from "formik";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { useRegisterMutation } from "../store/authApi";
import { useNavigate } from "react-router-dom";
import { registrationSchema } from "../zod/Registration";
import { z } from "zod";

type RegisterFormValues = z.infer<typeof registrationSchema>;

const Register = () => {
  const [registerUser, { isLoading }] = useRegisterMutation();
  const navigate = useNavigate();

  const formik = useFormik<RegisterFormValues>({
    initialValues: { username: "", email: "", password: "" },
    validate: (values) => {
      try {
        registrationSchema.parse(values);
        return {};
      } catch (err) {
        const zodError = err as z.ZodError;
        const errors: Record<string, string> = {};
        zodError.issues.forEach((issue) => {
          if (issue.path && issue.path[0]) {
            errors[issue.path[0]] = issue.message;
          }
        });
        return errors;
      }
    },
    onSubmit: async (values) => {
      try {
        await registerUser(values).unwrap();
        navigate("/login");
      } catch (err: any) {
        alert(err.data?.message || "Registration failed");
      }
    },
  });

  return (
    <Container maxWidth="sm">
      <Box mt={8}>
        <Typography variant="h4" mb={3}>
          Register
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            id="username"
            name="username"
            label="Username"
            value={formik.values.username}
            onChange={formik.handleChange}
            error={!!formik.errors.username && formik.touched.username}
            helperText={formik.touched.username && formik.errors.username}
          />
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
            Register
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Register;
