import React, { useEffect } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  CircularProgress,
} from "@mui/material";
import { useFormik, FieldArray, FormikProvider, getIn } from "formik";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useUpdateEmployeeMutation } from "../store/employeeApi";
import { employeeSchema } from "../zod/employee";
import type { z } from "zod";

type EmployeeFormValues = z.infer<typeof employeeSchema>;

interface Props {
  currentUserRole: "Admin" | "Editor" | "Viewer";
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  employeeData: EmployeeFormValues;
}

const EditEmployeeModal: React.FC<Props> = ({
  currentUserRole,
  open,
  onClose,
  onSuccess,
  employeeData,
}) => {
  const [updateEmployee, { isLoading }] = useUpdateEmployeeMutation();

  if (!["Admin", "Editor"].includes(currentUserRole)) return null;

  const initialValues: EmployeeFormValues = {
    ...employeeData,
    availableSlots: employeeData.availableSlots.map((slot) =>
      slot ? new Date(slot) : null
    ),
  };

  const formik = useFormik<EmployeeFormValues>({
    initialValues,
    enableReinitialize: true, 
    validateOnBlur: true,
    validateOnChange: true,
    validate: (values) => {
      try {
        const schema = employeeSchema.pick({
          skills: true,
          availableSlots: true,
        });

        const valuesToValidate = {
          ...values,
          availableSlots: values.availableSlots.map((d) =>
            d instanceof Date ? d.toISOString() : ""
          ),
        };

        schema.parse(valuesToValidate);
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
        const payload = {
          ...values,
          availableSlots: values.availableSlots.map((d) =>
            d instanceof Date ? d.toISOString() : ""
          ),
        };
        console.log(payload,employeeData)
        await updateEmployee({id:employeeData?._id,data:payload}).unwrap();
        onSuccess();
        onClose();
      } catch (err: any) {
        alert(err.data?.message || "Failed to update employee");
      }
    },
  });

  const errors = formik.errors as Record<string, any>;
  const touched = formik.touched as Record<string, any>;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Employee</DialogTitle>

      <FormikProvider value={formik}>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            {["name", "username", "email", "phone", "website", "role"].map(
              (field) => (
                <TextField
                  key={field}
                  fullWidth
                  margin="normal"
                  label={field[0].toUpperCase() + field.slice(1)}
                  name={field}
                  value={(formik.values as any)[field]}
                  disabled
                />
              )
            )}

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
                            error={
                              !!getIn(errors, fieldName) &&
                              !!getIn(touched, fieldName)
                            }
                            helperText={
                              getIn(touched, fieldName) && getIn(errors, fieldName)
                            }
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
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <FieldArray name="availableSlots">
                  {({ push, remove }) => (
                    <div>
                      {formik.values.availableSlots.map((slot, index) => {
                        const fieldName = `availableSlots.${index}`;
                        return (
                          <Box
                            key={index}
                            display="flex"
                            mb={1}
                            gap={1}
                            alignItems="center"
                          >
                            <DateTimePicker
                              label={`Slot ${index + 1}`}
                              value={formik.values.availableSlots[index] || null}
                              onChange={(date) =>
                                formik.setFieldValue(fieldName, date)
                              }
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  error={
                                    !!getIn(errors, fieldName) &&
                                    !!getIn(touched, fieldName)
                                  }
                                  helperText={
                                    getIn(touched, fieldName) && getIn(errors, fieldName)
                                  }
                                  fullWidth
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
                      <Button type="button" onClick={() => push(null)} variant="outlined">
                        Add Slot
                      </Button>
                    </div>
                  )}
                </FieldArray>
              </LocalizationProvider>
            </Box>
          </DialogContent>

          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={isLoading}>
              {isLoading ? <CircularProgress size={24} /> : "Update Employee"}
            </Button>
          </DialogActions>
        </form>
      </FormikProvider>
    </Dialog>
  );
};

export default EditEmployeeModal;
