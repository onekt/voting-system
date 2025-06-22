
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export interface AdminRequest {
  id: number;
  studentId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  school: string;
  department: string;
  password?: string;
  status: 'pending' | 'approved' | 'denied';
}

export interface Admin {
  id: number;
  studentId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  school: string;
  department: string;
  password?: string;
  admissionDate: string;
}

interface AdminRequestManagementProps {
  requests: AdminRequest[];
  onApprove: (id: number) => void;
  onDeny: (id: number) => void;
}

export const AdminRequestManagement = ({ requests, onApprove, onDeny }: AdminRequestManagementProps) => {
  const pendingRequests = requests.filter(req => req.status === 'pending');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Registration Requests</CardTitle>
        <CardDescription>
          Review and approve or deny requests for admin access. You have {pendingRequests.length} pending requests.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pendingRequests.length > 0 ? (
            pendingRequests.map((request) => (
              <div key={request.id} className="border p-4 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex-1">
                  <p className="font-bold text-lg">{request.fullName}</p>
                  <div className="text-sm text-muted-foreground grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                    <p><strong>Email:</strong> {request.email}</p>
                    <p><strong>Student ID:</strong> {request.studentId}</p>
                    <p><strong>School:</strong> {request.school}</p>
                    <p><strong>Department:</strong> {request.department}</p>
                    <p><strong>Phone:</strong> {request.phoneNumber}</p>
                  </div>
                </div>
                <div className="flex space-x-2 flex-shrink-0">
                  <Button onClick={() => onApprove(request.id)} variant="default" size="sm">Approve</Button>
                  <Button onClick={() => onDeny(request.id)} variant="destructive" size="sm">Deny</Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <p>No pending admin requests.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
