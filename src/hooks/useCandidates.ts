
import { useState } from 'react';
import { toast } from 'sonner';

export interface Candidate {
    id: number;
    name: string;
    email: string;
    position: string;
    election: string;
    status: 'Pending' | 'Approved' | 'Rejected' | 'Disabled';
    appliedDate: string;
    year: number;
}

const initialCandidates: Candidate[] = [
    {
        id: 1,
        name: 'John Smith',
        email: 'john.smith@college.edu',
        position: 'President',
        election: 'Student Guild Elections 2025',
        status: 'Pending',
        appliedDate: '2025-04-15',
        year: 4,
    },
    {
        id: 2,
        name: 'Sarah Johnson',
        email: 'sarah.j@college.edu',
        position: 'Vice President',
        election: 'Student Guild Elections 2025',
        status: 'Approved',
        appliedDate: '2025-04-12',
        year: 3,
    },
    {
        id: 3,
        name: 'Mike Wilson',
        email: 'mike.w@college.edu',
        position: 'Secretary',
        election: 'Student Guild Elections 2025',
        status: 'Rejected',
        appliedDate: '2025-04-10',
        year: 2,
    }
];

export const useCandidates = () => {
    const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);

    const handleDeleteClick = (candidateId: number) => {
        const candidateToDisable = candidates.find(c => c.id === candidateId);
        if (!candidateToDisable) return;

        const originalCandidates = [...candidates];
        setCandidates(current => current.map(c =>
            c.id === candidateId ? { ...c, status: 'Disabled' as const } : c
        ));

        toast.warning(`Candidate "${candidateToDisable.name}" has been disabled.`, {
            duration: 60000,
            action: {
                label: "Undo",
                onClick: () => {
                    setCandidates(originalCandidates);
                    toast.success("Disabling candidate has been reverted.");
                }
            }
        });
    };

    const handleRestoreClick = (candidateId: number) => {
        const candidateToRestore = candidates.find(c => c.id === candidateId);
        if (!candidateToRestore) return;

        const originalCandidates = [...candidates];
        setCandidates(current => current.map(c =>
            c.id === candidateId ? { ...c, status: 'Pending' as const } : c
        ));

        toast.success(`Candidate "${candidateToRestore.name}" has been restored to Pending.`, {
            duration: 60000,
            action: {
                label: "Undo",
                onClick: () => {
                    setCandidates(originalCandidates);
                    toast.info("Restoring candidate has been reverted.");
                }
            }
        });
    };

    return {
        candidates,
        handleDeleteClick,
        handleRestoreClick
    };
};
