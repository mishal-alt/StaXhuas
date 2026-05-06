import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Stack, 
  Button, 
  TextField, 
  InputAdornment, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Avatar,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Divider as MuiDivider,
  TablePagination
} from '@mui/material';
import { 
  Search, 
  Visibility,
  Edit,
  Delete,
  Message,
  Gavel,
  History,
  Send,
  Email,
  Badge,
  CalendarMonth,
  School,
  FilterList,
  Sort
} from '@mui/icons-material';

const INITIAL_STUDENTS = [
  { id: 1, name: 'Hrithic Raj', email: 'hrithic.raj@staxhaus.com', status: 'Active', batch: 'B-1', joinDate: '2023-10-12', course: 'Full Stack Development', attendance: '92%' },
  { id: 2, name: 'Ananya S', email: 'ananya.s@staxhaus.com', status: 'Active', batch: 'B-1', joinDate: '2023-10-15', course: 'UI/UX Design', attendance: '95%' },
  { id: 3, name: 'Mohammad Mishal', email: 'mishal@staxhaus.com', status: 'Inactive', batch: 'B-2', joinDate: '2023-09-20', course: 'Data Science', attendance: '45%' },
  { id: 4, name: 'Sneha Kapoor', email: 'sneha.k@staxhaus.com', status: 'Active', batch: 'B-1', joinDate: '2023-10-12', course: 'Full Stack Development', attendance: '88%' },
  { id: 5, name: 'Rahul V', email: 'rahul.v@staxhaus.com', status: 'Active', batch: 'B-3', joinDate: '2024-01-05', course: 'Mobile App Development', attendance: '91%' },
  { id: 6, name: 'Priya Mani', email: 'priya.m@staxhaus.com', status: 'Active', batch: 'B-1', joinDate: '2023-10-12', course: 'Full Stack Development', attendance: '97%' },
  { id: 7, name: 'Arun Kumar', email: 'arun@staxhaus.com', status: 'Active', batch: 'B-2', joinDate: '2023-11-05', course: 'Cyber Security', attendance: '85%' },
  { id: 8, name: 'Divya Nair', email: 'divya@staxhaus.com', status: 'Active', batch: 'B-3', joinDate: '2023-12-10', course: 'Cloud Computing', attendance: '90%' },
  { id: 9, name: 'Karthik Raja', email: 'karthik@staxhaus.com', status: 'Active', batch: 'B-1', joinDate: '2024-01-15', course: 'Full Stack Development', attendance: '82%' },
  { id: 10, name: 'Meera Jasmine', email: 'meera@staxhaus.com', status: 'Inactive', batch: 'B-2', joinDate: '2023-08-25', course: 'Data Science', attendance: '30%' },
  { id: 11, name: 'Sanjay Dutt', email: 'sanjay@staxhaus.com', status: 'Active', batch: 'B-3', joinDate: '2024-02-01', course: 'Mobile App Development', attendance: '88%' },
  { id: 12, name: 'Lekshmi S', email: 'lekshmi@staxhaus.com', status: 'Active', batch: 'B-1', joinDate: '2023-10-12', course: 'Full Stack Development', attendance: '94%' },
];

const AttendanceRoster = ({ batchId, searchQuery = '', sortBy = 'name', statusFilter = 'all' }) => {
  const [students, setStudents] = useState(INITIAL_STUDENTS);

  const [selectedStudent, setSelectedStudent] = useState(null);
  
  // Pagination State
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  
  // Dialog States
  const [openActionDialog, setOpenActionDialog] = useState(false);
  const [openMessageDialog, setOpenMessageDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // Form States
  const [adminAction, setAdminAction] = useState('');
  const [actionReason, setActionReason] = useState('');
  const [messageText, setMessageText] = useState('');
  const [editForm, setEditForm] = useState({ name: '', email: '', status: '', batch: '' });

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         s.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBatch = batchId === 'all' || s.batch === batchId;
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesBatch && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'joinDate') return new Date(b.joinDate) - new Date(a.joinDate);
    if (sortBy === 'attendance') return parseInt(b.attendance) - parseInt(a.attendance);
    return 0;
  });

  const paginatedStudents = filteredStudents.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenAction = (student) => {
    setSelectedStudent(student);
    setOpenActionDialog(true);
  };

  const handleOpenMessage = (student) => {
    setSelectedStudent(student);
    setOpenMessageDialog(true);
  };

  const handleOpenView = (student) => {
    setSelectedStudent(student);
    setOpenViewDialog(true);
  };

  const handleOpenEdit = (student) => {
    setSelectedStudent(student);
    setEditForm({ name: student.name, email: student.email, status: student.status, batch: student.batch });
    setOpenEditDialog(true);
  };

  const handleOpenDelete = (student) => {
    setSelectedStudent(student);
    setOpenDeleteDialog(true);
  };

  const handleClose = () => {
    setOpenActionDialog(false);
    setOpenMessageDialog(false);
    setOpenViewDialog(false);
    setOpenEditDialog(false);
    setOpenDeleteDialog(false);
    setAdminAction('');
    setActionReason('');
    setMessageText('');
  };

  // Real actions
  const handleSaveEdit = () => {
    setStudents(prev => prev.map(s => s.id === selectedStudent.id ? { ...s, ...editForm } : s));
    handleClose();
  };

  const handleDeleteConfirm = () => {
    setStudents(prev => prev.filter(s => s.id !== selectedStudent.id));
    handleClose();
  };

  const handleConfirmAction = () => {
    if (adminAction === 'terminate') {
      setStudents(prev => prev.map(s => s.id === selectedStudent.id ? { ...s, status: 'Terminated' } : s));
    } else if (adminAction === 'suspend') {
      setStudents(prev => prev.map(s => s.id === selectedStudent.id ? { ...s, status: 'Suspended' } : s));
    }
    handleClose();
  };

  const handleSendMessage = () => {
    console.log(`Sending message to ${selectedStudent.name}: ${messageText}`);
    handleClose();
  };

  return (
    <>
      <Card sx={{ borderRadius: 1, overflow: 'hidden', boxShadow: 'none', border: '1px solid rgba(0,0,0,0.05)' }}>
        <Box sx={{ 
          p: 3, 
          background: 'rgba(0, 0, 0, 0.02)',
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: 2
        }}>
          <Box>
            <Typography variant="subtitle1" fontWeight={700}>Student List</Typography>
            <Typography variant="caption" color="text.secondary">
              {batchId === 'all' ? 'All active students' : `Current students in ${batchId}`}
            </Typography>
          </Box>

        </Box>

        <CardContent sx={{ p: 0 }}>


          <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 0 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', py: 3 }}>Student Info</TableCell>
                  <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Batch</TableCell>
                  <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Status</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', pr: 4 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedStudents.map((student) => (
                  <TableRow 
                    key={student.id} 
                    sx={{ 
                      '&:hover': { bgcolor: 'action.hover' },
                      opacity: student.status === 'Terminated' ? 0.6 : 1,
                      filter: student.status === 'Terminated' ? 'grayscale(0.8)' : 'none',
                      bgcolor: student.status === 'Terminated' ? 'rgba(0,0,0,0.02)' : 'inherit'
                    }}
                  >
                    <TableCell sx={{ py: 3 }}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{ bgcolor: student.status === 'Terminated' ? '#9e9e9e' : 'secondary.main', fontWeight: 900, borderRadius: 2 }}>{student.name[0]}</Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={800} sx={{ textDecoration: student.status === 'Terminated' ? 'line-through' : 'none' }}>{student.name}</Typography>
                          <Typography variant="caption" color="text.secondary" fontWeight={600}>{student.email}</Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                       <Chip label={student.batch} size="small" sx={{ fontWeight: 900, borderRadius: 1 }} />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={student.status} 
                        size="small" 
                        sx={{ 
                          fontWeight: 900, 
                          bgcolor: 
                            student.status === 'Active' ? '#2e7d3215' : 
                            student.status === 'Terminated' ? '#d32f2f15' : 
                            student.status === 'Suspended' ? '#ed6c0215' : '#9e9e9e15', 
                          color: 
                            student.status === 'Active' ? '#2e7d32' : 
                            student.status === 'Terminated' ? '#d32f2f' : 
                            student.status === 'Suspended' ? '#ed6c02' : '#9e9e9e',
                          minWidth: 80
                        }} 
                      />
                    </TableCell>
                    <TableCell align="right" sx={{ pr: 2 }}>
                      <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                        <Tooltip title={student.status === 'Terminated' ? "Cannot message terminated student" : "Send Message"}>
                          <span>
                            <IconButton 
                              size="small" 
                              color="primary" 
                              onClick={() => handleOpenMessage(student)} 
                              disabled={student.status === 'Terminated'}
                            >
                              <Message fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                        <Tooltip title="Administrative Action">
                          <IconButton size="small" color="warning" onClick={() => handleOpenAction(student)}><Gavel fontSize="small" /></IconButton>
                        </Tooltip>
                        <Tooltip title="View Profile">
                          <IconButton size="small" onClick={() => handleOpenView(student)}><Visibility fontSize="small" /></IconButton>
                        </Tooltip>
                        <Tooltip title={student.status === 'Terminated' ? "Cannot edit terminated student" : "Edit Info"}>
                          <span>
                            <IconButton 
                              size="small" 
                              onClick={() => handleOpenEdit(student)} 
                              disabled={student.status === 'Terminated'}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                        <Tooltip title="Delete Record">
                          <IconButton size="small" color="error" onClick={() => handleOpenDelete(student)}><Delete fontSize="small" /></IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
                {paginatedStudents.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
                      <Typography variant="body2" color="text.secondary">No students found.</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredStudents.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              bgcolor: 'action.hover',
              borderTop: '1px solid',
              borderColor: 'divider',
              '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                fontWeight: 800,
                textTransform: 'uppercase',
                fontSize: '0.75rem',
                letterSpacing: '0.05em'
              },
              '& .MuiTablePagination-select': {
                fontWeight: 900
              }
            }}
          />
        </CardContent>
      </Card>

      {/* View Profile Dialog */}
      <Dialog open={openViewDialog} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle sx={{ fontWeight: 900, bgcolor: 'secondary.main', color: 'white' }}>
          Student Profile: {selectedStudent?.name}
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          <Grid container spacing={4} sx={{ mt: 1 }}>
            <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
               <Avatar sx={{ width: 120, height: 120, mx: 'auto', bgcolor: 'primary.main', fontSize: '3rem', fontWeight: 900, mb: 2 }}>
                  {selectedStudent?.name[0]}
               </Avatar>
               <Typography variant="h5" fontWeight={900}>{selectedStudent?.name}</Typography>
               <Chip label={selectedStudent?.status} color={selectedStudent?.status === 'Active' ? 'success' : 'error'} sx={{ fontWeight: 800, mt: 1 }} />
            </Grid>
            <Grid item xs={12} md={8}>
               <Stack spacing={2}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Email color="action" />
                    <Box>
                      <Typography variant="caption" fontWeight={800} color="text.secondary">EMAIL ADDRESS</Typography>
                      <Typography variant="body1" fontWeight={700}>{selectedStudent?.email}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <School color="action" />
                    <Box>
                      <Typography variant="caption" fontWeight={800} color="text.secondary">COURSE ENROLLED</Typography>
                      <Typography variant="body1" fontWeight={700}>{selectedStudent?.course}</Typography>
                    </Box>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Badge color="action" />
                        <Box>
                          <Typography variant="caption" fontWeight={800} color="text.secondary">BATCH</Typography>
                          <Typography variant="body1" fontWeight={700}>{selectedStudent?.batch}</Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <CalendarMonth color="action" />
                        <Box>
                          <Typography variant="caption" fontWeight={800} color="text.secondary">JOIN DATE</Typography>
                          <Typography variant="body1" fontWeight={700}>{selectedStudent?.joinDate}</Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                  <MuiDivider />
                  <Box>
                    <Typography variant="caption" fontWeight={800} color="text.secondary">ATTENDANCE PERFORMANCE</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                       <Box sx={{ flex: 1, height: 8, bgcolor: 'action.hover', borderRadius: 4, overflow: 'hidden' }}>
                          <Box sx={{ 
                            width: selectedStudent?.attendance, 
                            height: '100%', 
                            background: 'linear-gradient(90deg, #E8391D 0%, #FF5A36 100%)' 
                          }} />
                       </Box>
                       <Typography variant="body2" fontWeight={900}>{selectedStudent?.attendance}</Typography>
                    </Box>
                  </Box>
               </Stack>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose} variant="contained" color="secondary" sx={{ borderRadius: 2, fontWeight: 900 }}>Close Profile</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Student Dialog */}
      <Dialog open={openEditDialog} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 900 }}>Edit Student Information</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField 
              label="Full Name" 
              fullWidth 
              value={editForm.name} 
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <TextField 
              label="Email Address" 
              fullWidth 
              value={editForm.email} 
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={editForm.status}
                    label="Status"
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                 <TextField 
                  label="Batch" 
                  fullWidth 
                  value={editForm.batch} 
                  onChange={(e) => setEditForm({ ...editForm, batch: e.target.value })}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
            </Grid>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose} color="secondary" sx={{ fontWeight: 800 }}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained" color="primary" sx={{ borderRadius: 2, fontWeight: 900 }}>Save Changes</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleClose}>
        <DialogTitle sx={{ fontWeight: 900 }}>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete <b>{selectedStudent?.name}</b>? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose} color="secondary" sx={{ fontWeight: 800 }}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error" sx={{ borderRadius: 2, fontWeight: 900 }}>Yes, Delete Student</Button>
        </DialogActions>
      </Dialog>

      {/* Administrative Action Dialog */}
      <Dialog open={openActionDialog} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 900, textTransform: 'uppercase' }}>
          Administrative Action: {selectedStudent?.name}
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Action Type</InputLabel>
              <Select
                value={adminAction}
                label="Action Type"
                onChange={(e) => setAdminAction(e.target.value)}
                sx={{ borderRadius: 1.5 }}
              >
                <MenuItem value="warn">Official Warning</MenuItem>
                <MenuItem value="suspend">Temporary Suspension</MenuItem>
                <MenuItem value="terminate">Termination (Expel)</MenuItem>
                <MenuItem value="transfer">Batch Transfer</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Reason for Action"
              multiline
              rows={4}
              fullWidth
              value={actionReason}
              onChange={(e) => setActionReason(e.target.value)}
              placeholder="Provide detailed notes regarding this decision..."
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose} color="secondary" sx={{ fontWeight: 800 }}>Cancel</Button>
          <Button 
            onClick={handleConfirmAction} 
            variant="contained" 
            color="error" 
            disableElevation
            disabled={!adminAction}
            sx={{ borderRadius: 1.5, fontWeight: 900 }}
          >
            Confirm Action
          </Button>
        </DialogActions>
      </Dialog>

      {/* Message Dialog */}
      <Dialog open={openMessageDialog} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 900, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 1 }}>
          <Message /> Message Student: {selectedStudent?.name}
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            autoFocus
            margin="dense"
            label="Message Content"
            type="text"
            fullWidth
            multiline
            rows={6}
            variant="outlined"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type your message here..."
            sx={{ mt: 1, '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose} color="secondary" sx={{ fontWeight: 800 }}>Discard</Button>
          <Button 
            onClick={handleSendMessage} 
            variant="contained" 
            color="primary" 
            disableElevation
            startIcon={<Send />}
            disabled={!messageText}
            sx={{ borderRadius: 1.5, fontWeight: 900 }}
          >
            Send Message
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AttendanceRoster;
