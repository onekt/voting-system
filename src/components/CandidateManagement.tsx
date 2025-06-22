import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UserCheck, UserX, Mail, Trash2, RefreshCw } from 'lucide-react';
import { useCandidates } from '@/hooks/useCandidates';

export const CandidateManagement = () => {
  const {
    candidates,
    handleDeleteClick,
    handleRestoreClick,
  } = useCandidates();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'Pending':
        return 'bg-orange-100 text-orange-800';
      case 'Disabled':
        return 'bg-gray-200 text-gray-500';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const pendingCount = candidates.filter(c => c.status === 'Pending').length;
  const approvedCount = candidates.filter(c => c.status === 'Approved').length;
  const rejectedCount = candidates.filter(c => c.status === 'Rejected').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Candidate Management</h2>
          <p className="text-gray-600">Review and manage candidate applications</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
            <UserCheck className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Candidates</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedCount}</div>
            <p className="text-xs text-muted-foreground">Ready for election</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected Applications</CardTitle>
            <UserX className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rejectedCount}</div>
            <p className="text-xs text-muted-foreground">Did not meet criteria</p>
          </CardContent>
        </Card>
      </div>

      {/* Candidates Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Candidate Applications</CardTitle>
          <CardDescription>Review, edit, and manage all candidate records</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Election</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applied Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {candidates.map((candidate) => (
                <TableRow key={candidate.id} className={candidate.status === 'Disabled' ? 'bg-gray-50 opacity-60' : ''}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{candidate.name}</p>
                      <p className="text-sm text-gray-500 flex items-center">
                        <Mail className="mr-1 h-3 w-3" />
                        {candidate.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{candidate.position}</span>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">{candidate.election}</p>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{candidate.year}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(candidate.status)}`}>
                      {candidate.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">{new Date(candidate.appliedDate).toLocaleDateString()}</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {candidate.status === 'Disabled' ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRestoreClick(candidate.id)}
                          title="Restore Candidate"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteClick(candidate.id)}
                            title="Disable Candidate"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
