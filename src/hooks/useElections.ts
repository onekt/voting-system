import { useState } from 'react';
import { toast } from 'sonner';

export type ElectionStatus = 'Draft' | 'Published' | 'Ongoing' | 'Completed';

export interface Election {
  id: number;
  title: string;
  description: string;
  applicationStartDate: string;
  applicationEndDate: string;
  startDate: string;
  endDate: string;
  status: ElectionStatus;
  positions: string[];
}

const initialElections: Election[] = [
  {
    id: 1,
    title: 'Student Guild Elections 2025',
    description: 'Vote for your student representatives for the 2025-2026 academic year',
    applicationStartDate: '2025-04-20T09:00',
    applicationEndDate: '2025-05-05T17:00',
    startDate: '2025-05-10T09:00',
    endDate: '2025-05-15T17:00',
    status: 'Ongoing',
    positions: ['President', 'Vice President', 'Secretary', 'Treasurer']
  },
  {
    id: 2,
    title: 'Sports Committee Elections',
    description: 'Select representatives for the sports committee',
    applicationStartDate: '2025-05-15T09:00',
    applicationEndDate: '2025-05-25T17:00',
    startDate: '2025-06-01T09:00',
    endDate: '2025-06-05T17:00',
    status: 'Published',
    positions: ['Sports Captain', 'Vice Captain']
  },
  {
    id: 3,
    title: 'Library Committee Elections',
    description: 'Elect members for the library committee',
    applicationStartDate: '',
    applicationEndDate: '',
    startDate: '',
    endDate: '',
    status: 'Draft',
    positions: ['Head Librarian Student Rep', 'Member Rep']
  }
];

const emptyFormData = {
  title: '',
  description: '',
  applicationStartDate: '',
  applicationEndDate: '',
  startDate: '',
  endDate: '',
  positions: ''
};

export const useElections = () => {
  const [showForm, setShowForm] = useState(false);
  const [elections, setElections] = useState<Election[]>(initialElections);
  const [editingElection, setEditingElection] = useState<Election | null>(null);
  const [formData, setFormData] = useState(emptyFormData);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingElection(null);
    setFormData(emptyFormData);
  };

  const handleCreateClick = () => {
    setEditingElection(null);
    setFormData(emptyFormData);
    setShowForm(true);
  };

  const handleEditClick = (election: Election) => {
    setEditingElection(election);
    setFormData({
      ...election,
      positions: election.positions.join(', ')
    });
    setShowForm(true);
  };

  const handleDeleteClick = (electionId: number) => {
    const originalElections = [...elections];
    const electionToDelete = elections.find(e => e.id === electionId);
    if (!electionToDelete) return;

    setElections(currentElections => currentElections.filter(e => e.id !== electionId));

    toast.warning(`Election "${electionToDelete.title}" has been deleted.`, {
      duration: 60000,
      action: {
        label: "Undo",
        onClick: () => {
          setElections(originalElections);
          toast.success("Election deletion has been reverted.");
        }
      }
    });
  };

  const handleTogglePublishStatus = (electionId: number) => {
    const originalElections = [...elections];
    const election = elections.find(e => e.id === electionId);
    if (!election) return;

    if (election.status === 'Draft' || election.status === 'Published') {
      const newStatus = election.status === 'Draft' ? 'Published' : 'Draft';
      const actionText = newStatus === 'Published' ? 'published' : 'unpublished';
      const revertedActionText = newStatus === 'Published' ? 'Publishing' : 'Unpublishing';

      setElections(currentElections =>
        currentElections.map(e =>
          e.id === electionId ? { ...e, status: newStatus } : e
        )
      );

      toast.success(`Election "${election.title}" has been ${actionText}.`, {
        duration: 60000,
        action: {
          label: "Undo",
          onClick: () => {
            setElections(originalElections);
            toast.info(`${revertedActionText} election has been reverted.`);
          }
        }
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const positionsArray = formData.positions.split(',').map(p => p.trim()).filter(p => p);
    const originalElections = [...elections];

    if (editingElection) {
      const updatedElection: Election = {
        ...editingElection,
        ...formData,
        positions: positionsArray,
      };
      setElections(elections.map(e => e.id === editingElection.id ? updatedElection : e));
      toast.success("Election updated successfully.", {
        duration: 60000,
        action: {
          label: "Undo",
          onClick: () => {
            setElections(originalElections);
            toast.info("Election update has been reverted.");
          }
        }
      });
    } else {
      const newElection: Election = {
        id: Date.now(),
        status: 'Draft',
        ...formData,
        positions: positionsArray,
      };
      setElections([...elections, newElection]);
      toast.success("Election created successfully as a draft.", {
        duration: 60000,
        action: {
          label: "Undo",
          onClick: () => {
            setElections(originalElections);
            toast.info("Election creation has been reverted.");
          }
        }
      });
    }

    handleCancel();
  };

  return {
    showForm,
    elections,
    editingElection,
    formData,
    handleInputChange,
    handleCancel,
    handleCreateClick,
    handleEditClick,
    handleDeleteClick,
    handleSubmit,
    handleTogglePublishStatus,
  };
};
