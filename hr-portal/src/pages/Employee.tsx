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
import { useAddEmployeeMutation, useUpdateEmployeeMutation } from "../store/employeeApi";
import { employeeSchema } from "../zod/Employee";
import type { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

type EmployeeFormValues = z.infer<typeof employeeSchema>;

interface EmployeeProps {
  mode: "add" | "edit";
  employeeData?: EmployeeFormValues;
  onDialogClose?: () => void;
}

const Employee: React.FC<EmployeeProps> = ({ mode="add", employeeData,onDialogClose }) => {
  const [createEmployee, { isLoading: adding }] = useAddEmployeeMutation();
  const [updateEmployee, { isLoading: updating }] = useUpdateEmployeeMutation();
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  const currentUserRole = user?.role;
  if (!["Admin", "Editor"].includes(currentUserRole)) return null;
  const isEdit = mode === "edit";

  const formik = useFormik<EmployeeFormValues>({
    initialValues: isEdit
      ? {
          ...employeeData!,
          availableSlots: employeeData?.availableSlots.map((s) =>
            s ? new Date(s).toISOString() : ""
          ) || [""],
        }
      : {
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
    enableReinitialize: true,
    validate: (values) => {
      try {
        employeeSchema.parse(values);
        return {};
      } catch (err: any) {
        const errors: Record<string, any> = {};
        (err as z.ZodError).issues.forEach((issue) => {
          let curr = errors;
          issue.path.forEach((key, i) => {
            if (i === issue.path.length - 1) curr[key] = issue.message;
            else {
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
        const payload = {
          ...values,
          availableSlots: values.availableSlots.filter(Boolean),
        };
        if (isEdit && employeeData?._id) {
          await updateEmployee({ id: employeeData._id, data: payload }).unwrap();
          onDialogClose();
        } else {
          await createEmployee(payload).unwrap();
        }
        navigate("/dashboard", { replace: true });
      } catch (err: any) {
        alert(err.data?.message || "Failed to save employee");
      }
    },
  });

  const errors = formik.errors as Record<string, any>;
  const touched = formik.touched as Record<string, any>;
  const loading = adding || updating;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div style={{padding:'20px'}}>
      <Typography variant="h6" gutterBottom>
        {isEdit ? "Edit Employee" : "Add Employee"}
      </Typography>

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
              disabled={isEdit}
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
            disabled={isEdit}
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
                disabled={isEdit}
              />
            }
            label="Active"
          />

          <Box mt={2}>
            <FieldArray name="skills">
              {({ push, remove }) => (
                <div>
                  {formik.values.skills.map((_, index) => {
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
                        <Button onClick={() => remove(index)} color="error" variant="outlined">
                          X
                        </Button>
                      </Box>
                    );
                  })}
                  <Button onClick={() => push("")} variant="outlined">
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
                        <Button onClick={() => remove(index)} color="error" variant="outlined">
                          X
                        </Button>
                      </Box>
                    );
                  })}
                  <Button onClick={() => push("")} variant="outlined">
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
                disabled={isEdit}
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
            disabled={isEdit}
            error={!!getIn(errors, "company.name") && !!getIn(touched, "company.name")}
            helperText={getIn(touched, "company.name") && getIn(errors, "company.name")}
          />

          <Box mt={2} display="flex" gap={2}>
            <Button onClick={() => {mode==="edit"?onDialogClose():navigate("/dashboard", { replace: true })}}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : isEdit ? "Update" : "Add"}
            </Button>
          </Box>
        </form>
      </FormikProvider>
      </div>
    </LocalizationProvider>
  );
};

export default Employee;
