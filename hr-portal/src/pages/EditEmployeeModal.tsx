import React from "react";
import {
  Dialog,
} from "@mui/material";
import { employeeSchema } from "../zod/Employee";
import type { z } from "zod";
import Employee from "./Employee";

type EmployeeFormValues = z.infer<typeof employeeSchema>;

interface Props {
  currentUserRole: "Admin" | "Editor" | "Viewer";
  open: boolean;
  onClose: () => void;
  employeeData: EmployeeFormValues;
}

const EditEmployeeModal: React.FC<Props> = ({
  currentUserRole,
  open,
  onClose,
  employeeData,
}) => {


  if (!["Admin", "Editor"].includes(currentUserRole)) return null;

  

  return (
    <Dialog open={open} onClose={onClose}  fullWidth maxWidth="sm">
      <Employee mode="edit" employeeData={employeeData} onDialogClose={()=>{onClose()}}/>
    </Dialog>
  );
};

export default EditEmployeeModal;
