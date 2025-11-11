import React from "react";
import {
  Button,
  TextField,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useFormik, FieldArray, FormikProvider, getIn } from "formik";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useAddEmployeeMutation } from "../store/employeeApi";
import { employeeSchema } from "../zod/employee";
import type { z } from "zod";
import { useAppSelector } from "../store/hook";
import { useNavigate } from "react-router-dom";


type EmployeeFormValues = z.infer<typeof employeeSchema>;



const Employee = () => {
  const [createEmployee, { isLoading }] = useAddEmployeeMutation();
const user = useAppSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const currentUserRole = user?.role;
  if (!["Admin", "Editor"].includes(currentUserRole)) return null;

  const formik = useFormik<EmployeeFormValues>({
    initialValues: {
      name: "",
      username: "",
      email: "",
      phone: "",
      website: "",
      role: "Viewer",
      isActive: true,
      skills: [""],
      availableSlots: [""],
      address: { street: "", city: "", zipcode: "" },
      company: { name: "" },
    },
    validateOnBlur: true,
    validateOnChange: true,
    validate: (values) => {
      try {
        employeeSchema.parse(values);
        return {};
      } catch (err: any) {
        const errors: Record<string, any> = {};
        (err as z.ZodError).issues.forEach((issue) => {
          let curr = errors;
          issue.path.forEach((key, i) => {
            if (i === issue.path.length - 1) {
              curr[key] = issue.message;
            } else {
              if (!curr[key]) curr[key] = {};
              curr = curr[key];
            }
          });
        });
        return errors;
      }
    },
    onSubmit: async (values) => {
      try {
        const filteredValues = {
          ...values,
          availableSlots: values.availableSlots.filter((s) => s),
        };
        await createEmployee(filteredValues).unwrap();
        navigate("/dashboard",{replace:true})
      } catch (err: any) {
        alert(err.data?.message || "Failed to add employee");
      }
    },
  });

  const errors = formik.errors as Record<string, any>;
  const touched = formik.touched as Record<string, any>;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Typography>Add Employee</Typography>

        <FormikProvider value={formik}>
          <form onSubmit={formik.handleSubmit}>
              {["name", "username", "email", "phone", "website"].map((field) => (
                <TextField
                  key={field}
                  fullWidth
                  margin="normal"
                  label={field[0].toUpperCase() + field.slice(1)}
                  name={field}
                  value={(formik.values as any)[field]}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={!!getIn(errors, field) && !!getIn(touched, field)}
                  helperText={getIn(touched, field) && getIn(errors, field)}
                />
              ))}

              <TextField
                select
                fullWidth
                label="Role"
                margin="normal"
                name="role"
                value={formik.values.role}
                onChange={formik.handleChange}
              >
                {["Admin", "Editor", "Viewer"].map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </TextField>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={formik.values.isActive}
                    onChange={formik.handleChange}
                    name="isActive"
                  />
                }
                label="Active"
              />

              <Box mt={2}>
                <FieldArray name="skills">
                  {({ push, remove }) => (
                    <div>
                      {formik.values.skills.map((skill, index) => {
                        const fieldName = `skills.${index}`;
                        return (
                          <Box key={index} display="flex" mb={1} gap={1}>
                            <TextField
                              fullWidth
                              label={`Skill ${index + 1}`}
                              name={fieldName}
                              value={formik.values.skills[index]}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              error={!!getIn(errors, fieldName) && !!getIn(touched, fieldName)}
                              helperText={getIn(touched, fieldName) && getIn(errors, fieldName)}
                            />
                            <Button
                              type="button"
                              onClick={() => remove(index)}
                              variant="outlined"
                              color="error"
                            >
                              X
                            </Button>
                          </Box>
                        );
                      })}
                      <Button type="button" onClick={() => push("")} variant="outlined">
                        Add Skill
                      </Button>
                    </div>
                  )}
                </FieldArray>
              </Box>

              <Box mt={2}>
                <FieldArray name="availableSlots">
                  {({ push, remove }) => (
                    <div>
                      {formik.values.availableSlots.map((slot, index) => {
                        const fieldName = `availableSlots.${index}`;
                        return (
                          <Box key={index} display="flex" mb={1} gap={1}>
                            <DateTimePicker
                              label={`Slot ${index + 1}`}
                              value={slot ? new Date(slot) : null}
                              onChange={(date) =>
                                formik.setFieldValue(fieldName, date ? date.toISOString() : "")
                              }
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  fullWidth
                                  error={!!getIn(errors, fieldName) && !!getIn(touched, fieldName)}
                                  helperText={getIn(touched, fieldName) && getIn(errors, fieldName)}
                                />
                              )}
                            />
                            <Button
                              type="button"
                              onClick={() => remove(index)}
                              variant="outlined"
                              color="error"
                            >
                              X
                            </Button>
                          </Box>
                        );
                      })}
                      <Button type="button" onClick={() => push("")} variant="outlined">
                        Add Slot
                      </Button>
                    </div>
                  )}
                </FieldArray>
              </Box>

              {["street", "city", "zipcode"].map((field) => {
                const fieldName = `address.${field}`;
                return (
                  <TextField
                    key={field}
                    fullWidth
                    margin="normal"
                    label={field[0].toUpperCase() + field.slice(1)}
                    name={fieldName}
                    value={(formik.values.address as any)[field]}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={!!getIn(errors, fieldName) && !!getIn(touched, fieldName)}
                    helperText={getIn(touched, fieldName) && getIn(errors, fieldName)}
                  />
                );
              })}

              <TextField
                fullWidth
                label="Company Name"
                margin="normal"
                name="company.name"
                value={formik.values.company.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={!!getIn(errors, "company.name") && !!getIn(touched, "company.name")}
                helperText={getIn(touched, "company.name") && getIn(errors, "company.name")}
              />

            <Box>
              <Button onClick={()=>{navigate("/dashboard",{replace:true})}}>Cancel</Button>
              <Button type="submit" variant="contained" disabled={isLoading}>
                {isLoading ? <CircularProgress size={24} /> : "Add Employee"}
              </Button>
            </Box>
          </form>
        </FormikProvider>
    </LocalizationProvider>
  );
};

export default Employee;
