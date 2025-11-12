import React, { useState, useEffect } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  TablePagination,
  TextField,
  Select,
  MenuItem,
  Box,
  Typography,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useGetEmployeesQuery, useDeleteEmployeeMutation } from "../store/employeeApi";
import EditEmployeeModal from "./EditEmployeeModal";
import type { EmployeeFormValues } from "../zod/employee";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";
import { useLogoutMutation } from "../store/authApi";
import type { RootState } from "../store/store";

const Dashboard = () => {
  const user = useSelector((state:RootState) => state.auth.user);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedEmployeeDetails, setSelectedEmployeeDetails] = useState<EmployeeFormValues>({});
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [deleteEmployee, { isLoading: isDeleting }] = useDeleteEmployeeMutation();
  const [logoutApi, { isLoading: isLoggingOut }] = useLogoutMutation();

  const { data, isFetching, refetch } = useGetEmployeesQuery(
    { page: page + 1, limit, search, role: roleFilter },
    { refetchOnMountOrArgChange: true }
  );

  const handlePageChange = (event: unknown, newPage: number) => setPage(newPage);
  const handleLimitChange = (event: React.ChangeEvent<HTMLInputElement>) => { setLimit(parseInt(event.target.value, 10)); setPage(0); };
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => { setSearch(event.target.value); setPage(0); };
  const handleRoleFilterChange = (event: React.ChangeEvent<{ value: unknown }>) => { setRoleFilter(event.target.value as string); setPage(0); };

  useEffect(() => { refetch(); }, [page, limit, search, roleFilter]);


  const onEdit = (employeeDetails: EmployeeFormValues) => { setSelectedEmployeeDetails(employeeDetails); setOpenEditModal(true); };
  const onDeleteClick = (employeeId: string) => { setSelectedEmployeeId(employeeId); setDeleteDialogOpen(true); };
  const handleConfirmDelete = async () => {
    if (!selectedEmployeeId) return;
    try {
      await deleteEmployee(selectedEmployeeId).unwrap();
      refetch();
      setDeleteDialogOpen(false);
      setSelectedEmployeeId(null);
    } catch (err: any) {
      alert(err.data?.message || "Failed to delete employee");
    }
  };

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
      dispatch(logout());
      navigate("/login",{replace:true});
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <Box p={3}>
      {isFetching && (
        <Box position="absolute" top={0} left={0} width="100%" height="100%" display="flex" justifyContent="center" alignItems="center" bgcolor="rgba(255, 255, 255, 0.6)" zIndex={10}>
          <CircularProgress />
        </Box>
      )}

      {openEditModal && (
        <EditEmployeeModal
          currentUserRole={user?.role}
          employeeData={selectedEmployeeDetails}
          onClose={() => setOpenEditModal(false)}
          onSuccess={() => setOpenEditModal(false)}
          open={openEditModal}
        />
      )}

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Welcome, {user?.username} ({user?.role})</Typography>
        <Button variant="outlined" color="secondary" onClick={handleLogout} disabled={isLoggingOut}>
          {isLoggingOut ? <CircularProgress size={24} /> : "Logout"}
        </Button>
      </Box>

      <Box display="flex" gap={2} mb={2}>
        <TextField label="Search by name/email" value={search} onChange={handleSearchChange} />
        <Select value={roleFilter} onChange={handleRoleFilterChange} displayEmpty>
          <MenuItem value="">All Roles</MenuItem>
          <MenuItem value="Admin">Admin</MenuItem>
          <MenuItem value="Editor">Editor</MenuItem>
          <MenuItem value="Viewer">Viewer</MenuItem>
        </Select>
        {user?.role !== "Viewer" && (
          <Button variant="contained" onClick={() => navigate("/employees")}>Add Employee</Button>
        )}
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Active</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.employees?.length ? (
              data.employees.map((emp: any) => (
                <TableRow key={emp._id}>
                  <TableCell>{emp.name}</TableCell>
                  <TableCell>{emp.username}</TableCell>
                  <TableCell>{emp.email}</TableCell>
                  <TableCell>{emp.role}</TableCell>
                  <TableCell>{emp.isActive ? "Yes" : "No"}</TableCell>
                  <TableCell>
                    {user?.role !== "Viewer" && <Button size="small" onClick={() => onEdit(emp)}>Edit</Button>}
                    {user?.role === "Admin" && <Button size="small" color="error" onClick={() => onDeleteClick(emp._id)}>Delete</Button>}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">No employees found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={data?.total || 0}
        page={page}
        onPageChange={handlePageChange}
        rowsPerPage={limit}
        onRowsPerPageChange={handleLimitChange}
        rowsPerPageOptions={[5, 10, 20, 50]}
      />

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this employee? This action cannot be undone.</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleConfirmDelete} disabled={isDeleting}>
            {isDeleting ? <CircularProgress size={24} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;
