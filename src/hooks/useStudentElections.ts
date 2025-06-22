import { useState, useRef } from 'react';
import { toast } from 'sonner';

export interface StudentElection {
  id: number;
  title: string;
  description: string;
  applicationStartDate: string;
  applicationEndDate: string;
  startDate: string;
  endDate: string;
  status: 'Draft' | 'Published' | 'Ongoing' | 'Completed';
  positions: string[];
}

export interface StudentCandidate {
  id: number;
  name: string;
  email: string;
  position: string;
  election: string;
  department: string;
  school: string;
  gender: string;
  manifesto: string;
  image?: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Disabled';
}

export interface StudentVote {
  id: number;
  electionId: number;
  candidateId: number;
  voterEmail: string;
  timestamp: string;
}

// Mock data - in real app this would come from API
const initialElections: StudentElection[] = [
  {
    id: 1,
    title: 'Student Guild Elections 2025',
    description: 'Vote for your student representatives for the 2025-2026 academic year',
    applicationStartDate: '2025-04-20T09:00',
    applicationEndDate: '2025-05-05T17:00',
    startDate: '2025-05-10T09:00',
    endDate: '2025-05-15T17:00',
    status: 'Ongoing',
    positions: ['President', 'Vice President', 'Secretary', 'Treasurer', 'Sports Captain', 'Vice Captain']
  },
];

const initialCandidates: StudentCandidate[] = [
  // President candidates
  ...Array.from({ length: 10 }, (_, i) => ({
    id: 100 + i,
    name: `President Candidate ${i + 1}`,
    email: `president${i + 1}@college.edu`,
    position: 'President',
    election: 'Student Guild Elections 2025',
    department: 'Department ' + ((i % 3) + 1),
    school: 'School of Engineering',
    gender: i % 2 === 0 ? 'Male' : 'Female',
    manifesto: `I am President Candidate ${i + 1} and I will serve you well!`,
    status: 'Approved' as const,
  })),
  // Vice President candidates
  ...Array.from({ length: 10 }, (_, i) => ({
    id: 200 + i,
    name: `Vice President Candidate ${i + 1}`,
    email: `vp${i + 1}@college.edu`,
    position: 'Vice President',
    election: 'Student Guild Elections 2025',
    department: 'Department ' + ((i % 3) + 1),
    school: 'School of Business',
    gender: i % 2 === 0 ? 'Female' : 'Male',
    manifesto: `I am Vice President Candidate ${i + 1} and I will serve you well!`,
    status: 'Approved' as const,
  })),
  // Secretary candidates
  ...Array.from({ length: 10 }, (_, i) => ({
    id: 300 + i,
    name: `Secretary Candidate ${i + 1}`,
    email: `secretary${i + 1}@college.edu`,
    position: 'Secretary',
    election: 'Student Guild Elections 2025',
    department: 'Department ' + ((i % 3) + 1),
    school: 'School of Humanities',
    gender: i % 2 === 0 ? 'Male' : 'Female',
    manifesto: `I am Secretary Candidate ${i + 1} and I will serve you well!`,
    status: 'Approved' as const,
  })),
  // Treasurer candidates
  ...Array.from({ length: 10 }, (_, i) => ({
    id: 400 + i,
    name: `Treasurer Candidate ${i + 1}`,
    email: `treasurer${i + 1}@college.edu`,
    position: 'Treasurer',
    election: 'Student Guild Elections 2025',
    department: 'Department ' + ((i % 3) + 1),
    school: 'School of Business',
    gender: i % 2 === 0 ? 'Female' : 'Male',
    manifesto: `I am Treasurer Candidate ${i + 1} and I will serve you well!`,
    status: 'Approved' as const,
  })),
  // Sports Captain candidates
  ...Array.from({ length: 10 }, (_, i) => ({
    id: 500 + i,
    name: `Sports Captain Candidate ${i + 1}`,
    email: `sportscaptain${i + 1}@college.edu`,
    position: 'Sports Captain',
    election: 'Student Guild Elections 2025',
    department: 'Department ' + ((i % 3) + 1),
    school: 'School of Sports',
    gender: i % 2 === 0 ? 'Male' : 'Female',
    manifesto: `I am Sports Captain Candidate ${i + 1} and I will serve you well!`,
    status: 'Approved' as const,
  })),
  // Vice Captain candidates
  ...Array.from({ length: 10 }, (_, i) => ({
    id: 600 + i,
    name: `Vice Captain Candidate ${i + 1}`,
    email: `vicecaptain${i + 1}@college.edu`,
    position: 'Vice Captain',
    election: 'Student Guild Elections 2025',
    department: 'Department ' + ((i % 3) + 1),
    school: 'School of Sports',
    gender: i % 2 === 0 ? 'Female' : 'Male',
    manifesto: `I am Vice Captain Candidate ${i + 1} and I will serve you well!`,
    status: 'Approved' as const,
  })),
];

export const useStudentElections = () => {
  const [elections] = useState<StudentElection[]>(initialElections);
  const [candidates] = useState<StudentCandidate[]>(initialCandidates);
  const [votes, setVotes] = useState<StudentVote[]>([]);

  const castVote = (electionId: number, candidateId: number) => {
    const voterEmail = sessionStorage.getItem('studentEmail') || '';
    const candidateToVoteFor = candidates.find(c => c.id === candidateId);
    if (!candidateToVoteFor) return;

    const positionOfVote = candidateToVoteFor.position;

    const userVotesInThisElection = votes.filter(v => v.electionId === electionId && v.voterEmail === voterEmail);
    const votedCandidateIds = userVotesInThisElection.map(v => v.candidateId);
    const votedCandidates = candidates.filter(c => votedCandidateIds.includes(c.id));
    const existingVoteInPosition = votedCandidates.find(c => c.position === positionOfVote);

    if (existingVoteInPosition) {
      toast.error(`You have already voted for a ${positionOfVote}. You must unvote before casting a new vote.`);
      return;
    }

    const newVote: StudentVote = {
      id: Date.now(),
      electionId,
      candidateId,
      voterEmail,
      timestamp: new Date().toISOString(),
    };

    setVotes(prev => [...prev, newVote]);
    toast.success(`Voted for ${candidateToVoteFor.name}!`);
  };

  const revokeVote = (voteId: number) => {
    setVotes(prev => prev.filter(v => v.id !== voteId));
    toast.info("Your vote has been revoked.");
  };

  const candidateRowRef = useRef<HTMLDivElement>(null);

  return {
    elections,
    candidates,
    votes,
    castVote,
    revokeVote,
    candidateRowRef,
  };
};
