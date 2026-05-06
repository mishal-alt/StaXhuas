import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from "sonner";
import { format } from 'date-fns';
import {
  CircularProgress,
Box, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  Stack, 
  Chip, 
  Avatar, 
  Divider,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import { 
  CheckCircle, 
  Cancel, 
  Mail, 
  MoreVert, 
  History,
  Description
} from '@mui/icons-material';

import * as leaveApi from '../../api/leaves.api';
import { LEAVE_STATUS } from '../../utils/constants';

const LeaveInbox = ({ batchId }) => {
  const queryClient = useQueryClient();
  const [remarkOpen, setRemarkOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [pendingStatus, setPendingStatus] = useState('');
  const [remarkText, setRemarkText] = useState('');

  const { data: leavesRes, isLoading } = useQuery({
    queryKey: ['leaves', batchId],
    queryFn: () => leaveApi.getLeaves(batchId),
    enabled: !!batchId
  });

  const reviewMutation = useMutation({
    mutationFn: ({ leaveId, data }) => leaveApi.reviewLeave(leaveId, data),
    onSuccess: () => {
      toast.success('Leave request processed');
      queryClient.invalidateQueries(['leaves', batchId]);
      setRemarkOpen(false);
      setRemarkText('');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to process leave request');
    }
  });

  if (!batchId) return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="body1" color="text.secondary">Please select a batch to view leaves.</Typography>
    </Box>
  );

  if (isLoading) return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <CircularProgress size={40} />
    </Box>
  );

  const leaves = leavesRes?.data || [];

  const openReviewDialog = (leave, status) => {
    setSelectedLeave(leave);
    setPendingStatus(status);
    setRemarkOpen(true);
  };

  const handleReview = () => {
    reviewMutation.mutate({ 
      leaveId: selectedLeave._id, 
      data: { status: pendingStatus, remark: remarkText } 
    });
  };

  const getStatusProps = (status) => {
    switch(status) {
      case LEAVE_STATUS.APPROVED: return { color: 'success', label: 'Approved' };
      case LEAVE_STATUS.REJECTED: return { color: 'error', label: 'Rejected' };
      default: return { color: 'warning', label: 'Pending' };
    }
  };

  return (
    <Card sx={{ borderRadius: 6 }}>
      <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'action.hover' }}>
        <Typography variant="h6" fontWeight={900} color="secondary">Leave Requests Inbox</Typography>
      </Box>
      <CardContent sx={{ p: 0 }}>
        <Stack divider={<Divider />}>
          {leaves.map((leave) => {
            const statusProps = getStatusProps(leave.status);
            return (
              <Box key={leave._id} sx={{ p: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' } }}>
                <Box sx={{ flex: 1 }}>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'secondary.main', borderRadius: 2 }}>{leave.student?.name[0]}</Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={900}>{leave.student?.name}</Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <History sx={{ fontSize: 14, color: 'text.secondary' }} />
                        <Typography variant="caption" fontWeight={700} color="text.secondary">
                          {format(new Date(leave.startDate), 'MMM dd')} - {format(new Date(leave.endDate), 'MMM dd, yyyy')}
                        </Typography>
                      </Stack>
                    </Box>
                    <Chip 
                      label={statusProps.label} 
                      color={statusProps.color} 
                      size="small" 
                      sx={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '0.65rem' }} 
                    />
                  </Stack>

                  <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default', border: '1px solid', borderColor: 'divider', borderRadius: 4 }}>
                    <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                      <Description sx={{ fontSize: 16, color: 'primary.main' }} />
                      <Typography variant="caption" fontWeight={900} color="primary.main">REASON FOR ABSENCE</Typography>
                    </Stack>
                    <Typography variant="body2" sx={{ color: 'text.primary', fontStyle: 'italic' }}>
                      "{leave.reason}"
                    </Typography>
                  </Paper>

                  {leave.remark && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2, fontWeight: 700 }}>
                      FACILITATOR REMARK: {leave.remark}
                    </Typography>
                  )}
                </Box>

                {leave.status === LEAVE_STATUS.PENDING && (
                  <Stack direction="row" spacing={2}>
                    <Button 
                      variant="outlined" 
                      color="error" 
                      onClick={() => openReviewDialog(leave, LEAVE_STATUS.REJECTED)}
                      sx={{ borderRadius: 4 }}
                    >
                      Reject
                    </Button>
                    <Button 
                      variant="contained" 
                      color="success" 
                      onClick={() => openReviewDialog(leave, LEAVE_STATUS.APPROVED)}
                      disableElevation
                      sx={{ borderRadius: 4 }}
                    >
                      Approve
                    </Button>
                  </Stack>
                )}
              </Box>
            );
          })}

          {leaves.length === 0 && (
            <Box sx={{ p: 8, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">No leave requests found for this batch.</Typography>
            </Box>
          )}
        </Stack>
      </CardContent>

      <Dialog open={remarkOpen} onClose={() => setRemarkOpen(false)} PaperProps={{ sx: { borderRadius: 6 } }}>
        <DialogTitle sx={{ fontWeight: 900 }}>Review Leave Request</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            You are {pendingStatus === LEAVE_STATUS.APPROVED ? 'approving' : 'rejecting'} the leave request for <b>{selectedLeave?.student?.name}</b>.
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Facilitator Remark (Optional)"
            value={remarkText}
            onChange={(e) => setRemarkText(e.target.value)}
            placeholder="Add a reason or instruction..."
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setRemarkOpen(false)} color="secondary">Cancel</Button>
          <Button 
            variant="contained" 
            color={pendingStatus === LEAVE_STATUS.APPROVED ? 'success' : 'error'}
            onClick={handleReview}
            disableElevation
            disabled={reviewMutation.isPending}
          >
            Confirm {pendingStatus}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default LeaveInbox;
