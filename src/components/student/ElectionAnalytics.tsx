import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Election {
    id: number;
    title: string;
    description: string;
}

interface Candidate {
    id: number;
    name: string;
    position: string;
    election_id: number;
    manifesto: string;
    photo_url?: string;
}

interface Vote {
    id: number;
    election_id: number;
    candidate_id: number;
}

interface AnalyticsCandidateCarouselProps {
    position: string;
    candidates: Candidate[];
    votes: Vote[];
    totalVotesForPosition: number;
    potentialWinnerId: number | null;
}

interface ElectionAnalyticsProps {
    election: Election;
    candidates: Candidate[];
    votes: Vote[];
}

const AnalyticsCandidateCarousel = ({ position, candidates, votes, totalVotesForPosition, potentialWinnerId }: AnalyticsCandidateCarouselProps) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setShowLeftArrow(scrollLeft > 0);
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
        }
    };

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = (scrollRef.current.clientWidth / 3) * 3; // Scroll by 3 cards
            scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        handleScroll();
        const currentRef = scrollRef.current;
        currentRef?.addEventListener('scroll', handleScroll);
        return () => currentRef?.removeEventListener('scroll', handleScroll);
    }, [candidates]);

    if (candidates.length === 0) {
        return <p className="text-muted-foreground">No candidates for this position.</p>;
    }

    return (
        <div className="relative">
            <div
                ref={scrollRef}
                className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide"
            >
                {candidates.map((candidate) => {
                    const candidateVotes = votes.filter(v => v.candidate_id === candidate.id).length;
                    const votePercentage = totalVotesForPosition > 0 ? (candidateVotes / totalVotesForPosition) * 100 : 0;
                    const isPotentialWinner = candidate.id === potentialWinnerId;

                    return (
                        <Card key={candidate.id} className="w-[300px] flex-shrink-0 snap-center flex flex-col relative">
                            {isPotentialWinner && (
                                <Badge variant="destructive" className="absolute top-2 right-2 z-20 animate-pulse">
                                    Potential {position}
                                </Badge>
                            )}
                            <CardHeader>
                                <div className="flex items-start space-x-4">
                                    <Avatar className="h-20 w-20">
                                        <AvatarImage src={candidate.photo_url || '/placeholder.svg'} alt={candidate.name} />
                                        <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <CardTitle className="text-lg">{candidate.name}</CardTitle>
                                        <CardDescription>{position}</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <p className="text-sm text-muted-foreground min-h-[40px] line-clamp-2">
                                    {candidate.manifesto}
                                </p>
                            </CardContent>
                            <CardFooter className="flex-col items-start space-y-2 pt-4">
                                <div className="w-full">
                                    <div className="flex w-full justify-between text-xs text-muted-foreground mb-1">
                                        <span>{`${candidateVotes} Votes`}</span>
                                        <span>{`${votePercentage.toFixed(1)}%`}</span>
                                    </div>
                                    <Progress value={votePercentage} className="w-full h-2" indicatorClassName="bg-blue-600" />
                                </div>
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>
            {showLeftArrow && (
                <Button variant="outline" size="icon" className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full h-8 w-8" onClick={() => scroll('left')}>
                    <ChevronLeft className="h-4 w-4" />
                </Button>
            )}
            {showRightArrow && (
                <Button variant="outline" size="icon" className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rounded-full h-8 w-8" onClick={() => scroll('right')}>
                    <ChevronRight className="h-4 w-4" />
                </Button>
            )}
        </div>
    );
};

export const ElectionAnalytics = ({ election, candidates, votes: realVotes }: ElectionAnalyticsProps) => {
    const [mockVotes, setMockVotes] = useState<Vote[]>([]);

    useEffect(() => {
        const generateMockVotes = () => {
            const generated: Vote[] = [];
            if (candidates.length > 0) {
                candidates.forEach(candidate => {
                    const voteCount = Math.floor(Math.random() * 451) + 50; // Random votes between 50 and 500
                    for (let i = 0; i < voteCount; i++) {
                        generated.push({
                            id: Math.random(),
                            election_id: election.id,
                            candidate_id: candidate.id,
                        });
                    }
                });
            }
            setMockVotes(generated);
        };

        generateMockVotes();
    }, [candidates, election.id]);

    const groupedCandidates = candidates.reduce((acc, candidate) => {
        (acc[candidate.position] = acc[candidate.position] || []).push(candidate);
        return acc;
    }, {} as Record<string, Candidate[]>);

    const electionVotes = mockVotes.filter(v => v.election_id === election.id);

    return (
        <div className="space-y-8">
            {Object.entries(groupedCandidates).map(([position, positionCandidates]) => {
                const candidateIdsForPosition = positionCandidates.map(c => c.id);
                const totalVotesForPosition = electionVotes.filter(v => candidateIdsForPosition.includes(v.candidate_id)).length;

                let potentialWinnerId: number | null = null;
                if (positionCandidates.length > 0 && totalVotesForPosition > 0) {
                    const votesByCandidate = positionCandidates.map(candidate => ({
                        id: candidate.id,
                        votes: electionVotes.filter(v => v.candidate_id === candidate.id).length
                    }));

                    if (votesByCandidate.length > 0) {
                        const maxVotes = Math.max(...votesByCandidate.map(c => c.votes));
                        const potentialWinners = votesByCandidate.filter(c => c.votes === maxVotes);
                        if (potentialWinners.length === 1) { // Only show badge if there's a single leader
                            potentialWinnerId = potentialWinners[0].id;
                        }
                    }
                }

                const sortedCandidates = [...positionCandidates].sort((a, b) => {
                    const votesA = electionVotes.filter(v => v.candidate_id === a.id).length;
                    const votesB = electionVotes.filter(v => v.candidate_id === b.id).length;
                    return votesB - votesA;
                });

                return (
                    <div key={position}>
                        <div className="flex justify-between items-baseline mb-4">
                            <div className="flex items-baseline space-x-3">
                                <h3 className="text-2xl font-bold tracking-tight">{position}</h3>
                                <span className="text-sm text-muted-foreground">{positionCandidates.length} {position.toLowerCase()} candidates</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{totalVotesForPosition} Total Votes</p>
                        </div>
                        <AnalyticsCandidateCarousel
                            position={position}
                            candidates={sortedCandidates}
                            votes={electionVotes}
                            totalVotesForPosition={totalVotesForPosition}
                            potentialWinnerId={potentialWinnerId}
                        />
                    </div>
                );
            })}
        </div>
    );
};
