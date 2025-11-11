import { createSlice } from "@reduxjs/toolkit";
import  type { PayloadAction } from "@reduxjs/toolkit";
import type { Employee } from "./employeeApi";

interface EmployeeState {
  employees: Employee[];
  selectedEmployee: Employee | null;
}

const initialState: EmployeeState = {
  employees: [],
  selectedEmployee: null,
};

const employeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {
    setEmployees: (state, action: PayloadAction<Employee[]>) => {
      state.employees = action.payload;
    },
    setSelectedEmployee: (state, action: PayloadAction<Employee | null>) => {
      state.selectedEmployee = action.payload;
    },
    clearEmployees: (state) => {
      state.employees = [];
      state.selectedEmployee = null;
    },
  },
});

export const { setEmployees, setSelectedEmployee, clearEmployees } = employeeSlice.actions;
export default employeeSlice.reducer;
