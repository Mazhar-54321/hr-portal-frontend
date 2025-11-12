import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../components/axiosBaseQuery";
export interface Employee {
  id: string;
  name: string;
  username: string;
  email: string;
  phone?: string;
  website?: string;
  role: "Admin" | "Editor" | "Viewer";
  isActive: boolean;
  skills: string[];
  availableSlots: string[];
  address: {
    street: string;
    city: string;
    zipcode: string;
  };
  company: {
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface GetEmployeesParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}

export const employeeApi = createApi({
  reducerPath: "employeeApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Employees"],
  endpoints: (builder) => ({
    getEmployees: builder.query<{ employees: Employee[]; total: number }, GetEmployeesParams>({
      query: (params) => ({
        url: "/employees",
        method: "GET",
        params,
      }),
      providesTags: ["Employees"],
    }),
    addEmployee: builder.mutation<Employee, Employee>({
      query: (body) => ({
        url: "/employees",
        method: "POST",
        data:body,
      }),
      invalidatesTags: ["Employees"],
    }),
    updateEmployee: builder.mutation<Employee, { id: string; data: Partial<Employee> }>({
      query: ({ id, data }) => ({
        url: `/employees/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: ["Employees"],
    }),
    deleteEmployee: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/employees/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Employees"],
    }),
  }),
});

export const {
  useGetEmployeesQuery,
  useAddEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
} = employeeApi;
