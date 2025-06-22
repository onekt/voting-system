
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Election } from '@/hooks/useElections';

interface ElectionFormProps {
    formData: {
        title: string;
        description: string;
        applicationStartDate: string;
        applicationEndDate: string;
        startDate: string;
        endDate: string;
        positions: string;
    };
    editingElection: Election | null;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
}

export const ElectionForm: React.FC<ElectionFormProps> = ({ formData, editingElection, onInputChange, onSubmit, onCancel }) => {
    return (
        <Card>
          <CardHeader>
            <CardTitle>{editingElection ? 'Edit Election' : 'Create New Election'}</CardTitle>
            <CardDescription>{editingElection ? 'Update election details.' : 'Set up a new election.'}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Election Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={onInputChange}
                    placeholder="e.g. Student Guild Elections 2025"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="positions">Positions (comma-separated)</Label>
                  <Input
                    id="positions"
                    name="positions"
                    value={formData.positions}
                    onChange={onInputChange}
                    placeholder="President, Vice President, Secretary"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={onInputChange}
                  placeholder="Brief description of the election"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="applicationStartDate">Application Start Date & Time</Label>
                  <Input
                    id="applicationStartDate"
                    name="applicationStartDate"
                    type="datetime-local"
                    value={formData.applicationStartDate}
                    onChange={onInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="applicationEndDate">Application End Date & Time</Label>
                  <Input
                    id="applicationEndDate"
                    name="applicationEndDate"
                    type="datetime-local"
                    value={formData.applicationEndDate}
                    onChange={onInputChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Voting Start Date & Time</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={onInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">Voting End Date & Time</Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={onInputChange}
                    required
                  />
                </div>
              </div>

              <div className="flex space-x-2">
                <Button type="submit">{editingElection ? 'Update Election' : 'Create Election'}</Button>
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
    );
}
