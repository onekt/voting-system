<<<<<<< HEAD
import { useState, useEffect, useRef } from "react";
=======

import { useState, useEffect } from "react";
>>>>>>> 0aeb99f2412d878b2fc50f9caf34d5ab9cfd6b3d
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, Vote, RotateCcw } from "lucide-react";
import { toast } from "sonner";
<<<<<<< HEAD
import { ScrollableCandidateRow } from "./ScrollableCandidateRow";
=======
>>>>>>> 0aeb99f2412d878b2fc50f9caf34d5ab9cfd6b3d

interface Election {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  positions: string[];
}

interface Candidate {
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
}

interface Vote {
  id: number;
  electionId: number;
  candidateId: number;
  voterEmail: string;
  timestamp: string;
}

interface StudentElectionCardProps {
  election: Election;
  candidates: Candidate[];
  userVote?: Vote;
  onVote: (electionId: number, candidateId: number) => void;
  onRevoke: (voteId: number) => void;
}

export const StudentElectionCard = ({ election, candidates, userVote, onVote, onRevoke }: StudentElectionCardProps) => {
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [isElectionEnded, setIsElectionEnded] = useState(false);
<<<<<<< HEAD
  const candidateRowRef = useRef<HTMLDivElement>(null);
=======
>>>>>>> 0aeb99f2412d878b2fc50f9caf34d5ab9cfd6b3d

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime();
      const endTime = new Date(election.endDate).getTime();
      const distance = endTime - now;

      if (distance < 0) {
        setTimeRemaining("Election Ended");
        setIsElectionEnded(true);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeRemaining(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, [election.endDate]);

  const handleVote = (candidateId: number) => {
    if (isElectionEnded) {
      toast.error("Election has ended. Voting is no longer allowed.");
      return;
    }
<<<<<<< HEAD

=======
    
>>>>>>> 0aeb99f2412d878b2fc50f9caf34d5ab9cfd6b3d
    onVote(election.id, candidateId);
    toast.success("Vote cast successfully!");
  };

  const handleRevoke = () => {
    if (userVote && !isElectionEnded) {
      onRevoke(userVote.id);
      toast.success("Vote revoked successfully!");
    }
  };

  const groupedCandidates = candidates.reduce((acc, candidate) => {
    if (!acc[candidate.position]) {
      acc[candidate.position] = [];
    }
    acc[candidate.position].push(candidate);
    return acc;
  }, {} as Record<string, Candidate[]>);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{election.title}</CardTitle>
            <p className="text-gray-600 mt-2">{election.description}</p>
          </div>
          <div className="text-right">
            <Badge variant={isElectionEnded ? "destructive" : "default"}>
              <Clock className="h-3 w-3 mr-1" />
              {timeRemaining}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(groupedCandidates).map(([position, positionCandidates]) => (
<<<<<<< HEAD
            <div key={position} className="border rounded-lg p-4 mb-6 max-w-screen-lg w-full mx-auto">
              <h3 className="font-semibold text-lg mb-4">{position}</h3>
              <ScrollableCandidateRow
                candidates={positionCandidates}
                election={election}
                userVote={userVote}
                onVote={onVote}
                onRevoke={onRevoke}
                isElectionEnded={isElectionEnded}
              />
=======
            <div key={position} className="border rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-4">{position}</h3>
              <div className="grid gap-4">
                {positionCandidates.map(candidate => {
                  const hasVotedForThisCandidate = userVote?.candidateId === candidate.id;
                  
                  return (
                    <div key={candidate.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={candidate.image} />
                          <AvatarFallback>{candidate.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{candidate.name}</h4>
                          <p className="text-sm text-gray-600">{candidate.department} - {candidate.school}</p>
                          <p className="text-sm text-gray-500">{candidate.gender}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {hasVotedForThisCandidate && (
                          <Badge variant="default">Voted</Badge>
                        )}
                        {!isElectionEnded && (
                          <>
                            {!hasVotedForThisCandidate && !userVote && (
                              <Button onClick={() => handleVote(candidate.id)} size="sm">
                                <Vote className="h-4 w-4 mr-1" />
                                Vote
                              </Button>
                            )}
                            {hasVotedForThisCandidate && (
                              <Button variant="outline" onClick={handleRevoke} size="sm">
                                <RotateCcw className="h-4 w-4 mr-1" />
                                Revoke
                              </Button>
                            )}
                          </>
                        )}
                        {isElectionEnded && (
                          <Badge variant="secondary">Election Ended</Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
>>>>>>> 0aeb99f2412d878b2fc50f9caf34d5ab9cfd6b3d
            </div>
          ))}
        </div>
      </CardContent>
<<<<<<< HEAD
    </Card >
=======
    </Card>
>>>>>>> 0aeb99f2412d878b2fc50f9caf34d5ab9cfd6b3d
  );
};
