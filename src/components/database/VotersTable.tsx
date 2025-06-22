
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UserPlus, Edit, Trash2 } from 'lucide-react';

interface Voter {
  id: number;
  name: string;
  email: string;
  studentId: string;
  year: number;
  department: string;
  status: string;
  faceId: string | null;
  school: string;
}

interface VotersTableProps {
  voters: Voter[];
  searchTerm: string;
  handleDeleteVoter: (id: number) => void;
}

export const VotersTable: React.FC<VotersTableProps> = ({ voters, searchTerm, handleDeleteVoter }) => {
  const filteredVoters = voters.filter(voter =>
    voter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    voter.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    voter.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    voter.school.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Registered Voters</CardTitle>
            <CardDescription>Manage student voter database</CardDescription>
          </div>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Voter
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>School</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Face ID</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVoters.map((voter) => (
              <TableRow key={voter.id}>
                <TableCell className="font-mono">{voter.studentId}</TableCell>
                <TableCell className="font-medium">{voter.name}</TableCell>
                <TableCell>{voter.email}</TableCell>
                <TableCell>{voter.school}</TableCell>
                <TableCell>{voter.department}</TableCell>
                <TableCell>{voter.year}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    voter.status === 'Active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {voter.status}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    voter.faceId
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {voter.faceId ? 'Registered' : 'Not Set'}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteVoter(voter.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
