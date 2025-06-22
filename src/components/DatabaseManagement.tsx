import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Download, MoreHorizontal, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { VotersTable } from './database/VotersTable';
import { ElectionsTable } from './database/ElectionsTable';
import { CandidatesTable } from './database/CandidatesTable';
import { Admin } from '@/components/AdminRequestManagement';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Card, CardContent } from '@/components/ui/card';

const AdminsTable = ({ admins, handleDeleteAdmin }: { admins: Admin[]; handleDeleteAdmin: (id: number) => void; }) => {
  if (admins.length === 0) {
    return <p className="text-center text-muted-foreground p-4">No admins found.</p>;
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Full Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Student ID</TableHead>
              <TableHead>Admission Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {admins.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell className="font-medium">{admin.fullName}</TableCell>
                <TableCell>{admin.email}</TableCell>
                <TableCell>{admin.studentId}</TableCell>
                <TableCell>{admin.admissionDate}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleDeleteAdmin(admin.id)} className="text-red-600 hover:!text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export const DatabaseManagement = ({ admins, handleDeleteAdmin, userRole }: { admins: Admin[]; handleDeleteAdmin: (id: number) => void; userRole?: string | null; }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data moved to state for CRUD operations
  const [voters, setVoters] = useState([
    { id: 1, name: 'Alice Johnson', email: 'alice@college.edu', studentId: '210012345', year: 4, department: 'Computer Science', status: 'Active', faceId: 'registered', school: 'School of Engineering' },
    { id: 2, name: 'Bob Smith', email: 'bob@college.edu', studentId: '220054321', year: 3, department: 'Engineering', status: 'Active', faceId: 'registered', school: 'School of Engineering' },
    { id: 3, name: 'Carol Davis', email: 'carol@college.edu', studentId: '230098765', year: 2, department: 'Business', status: 'Inactive', faceId: null, school: 'School of Business' },
    { id: 4, name: 'David Rodriguez', email: 'david@college.edu', studentId: '210011223', year: 4, department: 'Information Technology', status: 'Active', faceId: 'registered', school: 'School of ICT' },
    { id: 5, name: 'Eve Williams', email: 'eve@college.edu', studentId: '240033445', year: 1, department: 'Physics', status: 'Active', faceId: 'registered', school: 'School of Science' }
  ]);

  const [elections, setElections] = useState([
    { id: 1, title: 'Student Guild Elections 2025', status: 'Active', totalVotes: 456, createdDate: '2025-04-01' },
    { id: 2, title: 'Sports Committee Elections', status: 'Upcoming', totalVotes: 0, createdDate: '2025-04-15' }
  ]);

  const [candidates, setCandidates] = useState([
    { id: 1, name: 'John Smith', position: 'President', election: 'Student Guild Elections 2025', status: 'Approved' },
    { id: 2, name: 'Sarah Johnson', position: 'Vice President', election: 'Student Guild Elections 2025', status: 'Approved' }
  ]);

  const handleDeleteVoter = (id: number) => {
    setVoters(currentVoters => currentVoters.filter(voter => voter.id !== id));
    toast.success("Voter has been deleted successfully.");
  };

  const handleDeleteElection = (id: number) => {
    setElections(currentElections => currentElections.filter(election => election.id !== id));
    toast.success("Election has been deleted successfully.");
  };

  const handleDeleteCandidate = (id: number) => {
    setCandidates(currentCandidates => currentCandidates.filter(candidate => candidate.id !== id));
    toast.success("Candidate has been deleted successfully.");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Database Management</h2>
          <p className="text-gray-600">Manage system data and records</p>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search records..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Database Tables */}
      <Tabs defaultValue="voters" className="w-full">
        <TabsList className={`grid w-full ${userRole === 'head-admin' ? 'grid-cols-4' : 'grid-cols-3'}`}>
          <TabsTrigger value="voters">Voters ({voters.length})</TabsTrigger>
          <TabsTrigger value="elections">Elections ({elections.length})</TabsTrigger>
          <TabsTrigger value="candidates">Candidates ({candidates.length})</TabsTrigger>
          {userRole === 'head-admin' && <TabsTrigger value="admins">Admins ({admins.length})</TabsTrigger>}
        </TabsList>

        <TabsContent value="voters" className="space-y-4">
          <VotersTable voters={voters} searchTerm={searchTerm} handleDeleteVoter={handleDeleteVoter} />
        </TabsContent>

        <TabsContent value="elections" className="space-y-4">
          <ElectionsTable elections={elections} handleDeleteElection={handleDeleteElection} />
        </TabsContent>

        <TabsContent value="candidates" className="space-y-4">
          <CandidatesTable candidates={candidates} handleDeleteCandidate={handleDeleteCandidate} />
        </TabsContent>

        {userRole === 'head-admin' && (
          <TabsContent value="admins" className="space-y-4">
            <AdminsTable admins={admins} handleDeleteAdmin={handleDeleteAdmin} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};
