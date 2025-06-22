import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2, Calendar, Clock } from 'lucide-react';
import { Election, ElectionStatus } from '@/hooks/useElections';

interface ElectionListProps {
    elections: Election[];
    onEdit: (election: Election) => void;
    onDelete: (id: number) => void;
    onPublish: (id: number) => void;
}

export const ElectionList: React.FC<ElectionListProps> = ({ elections, onEdit, onDelete, onPublish }) => {
    const getStatusColor = (status: ElectionStatus) => {
        switch (status) {
            case 'Ongoing':
                return 'bg-blue-100 text-blue-800';
            case 'Published':
                return 'bg-green-100 text-green-800';
            case 'Completed':
                return 'bg-gray-100 text-gray-800';
            case 'Draft':
            default:
                return 'bg-orange-100 text-orange-800';
        }
    };

    return (
        <Card>
        <CardHeader>
          <CardTitle>All Elections</CardTitle>
          <CardDescription>Manage existing elections</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Application Dates</TableHead>
                <TableHead>Voting Dates</TableHead>
                <TableHead>Positions</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {elections.map((election) => (
                <TableRow key={election.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{election.title}</p>
                      <p className="text-sm text-gray-500">{election.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(election.status)}`}>
                      {election.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <Calendar className="mr-2 h-4 w-4 text-gray-400 flex-shrink-0" />
                      <div>
                        <p>{election.applicationStartDate ? new Date(election.applicationStartDate).toLocaleString() : 'N/A'}</p>
                        <p>{election.applicationEndDate ? new Date(election.applicationEndDate).toLocaleString() : 'N/A'}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <Clock className="mr-2 h-4 w-4 text-gray-400 flex-shrink-0" />
                       <div>
                        <p>{election.startDate ? new Date(election.startDate).toLocaleString() : 'N/A'}</p>
                        <p>{election.endDate ? new Date(election.endDate).toLocaleString() : 'N/A'}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {election.positions.map((position, index) => (
                        <span key={index} className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                          {position}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {(election.status === 'Draft' || election.status === 'Published') && (
                        <Button title={election.status === 'Draft' ? 'Publish' : 'Unpublish'} size="sm" variant="outline" onClick={() => onPublish(election.id)}>
                            {election.status === 'Draft' ? 'Publish' : 'Unpublish'}
                        </Button>
                      )}
                      <Button size="sm" variant="outline" onClick={() => onEdit(election)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => onDelete(election.id)}>
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
