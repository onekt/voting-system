import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Vote, RotateCcw, CheckCircle2 } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface Candidate {
    id: number;
    name: string;
    position: string;
    manifesto: string;
    image?: string;
}

interface VoteType {
    id: number;
    electionId: number;
    candidateId: number;
    voterEmail: string;
    timestamp: string;
}

interface ElectionCarouselProps {
    position: string;
    candidates: Candidate[];
    votes: VoteType[];
    totalVotesForPosition: number;
    showVoting?: boolean;
    userVote?: VoteType;
    onVote?: (electionId: number, candidateId: number) => void;
    onRevoke?: (voteId: number) => void;
    electionId?: number;
    isElectionEnded?: boolean;
}

export const ElectionCarousel = ({
    position,
    candidates,
    votes,
    totalVotesForPosition,
    showVoting = false,
    userVote,
    onVote,
    onRevoke,
    electionId,
    isElectionEnded = false,
}: ElectionCarouselProps) => {
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
            const scrollAmount = (scrollRef.current.clientWidth / 3) * 3;
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

    const votedCandidateId = userVote && candidates.some(c => c.id === userVote.candidateId)
        ? userVote.candidateId
        : null;

    return (
        <div className="relative">
            <div
                ref={scrollRef}
                className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide"
            >
                {candidates.map((candidate) => {
                    const candidateVotes = votes.filter(v => v.candidateId === candidate.id).length;
                    const votePercentage = totalVotesForPosition > 0 ? (candidateVotes / totalVotesForPosition) * 100 : 0;
                    const hasVotedForThisCandidate = votedCandidateId === candidate.id;
                    return (
                        <Card key={candidate.id} className="w-[300px] flex-shrink-0 snap-center flex flex-col">
                            <div className="relative flex-grow flex flex-col">
                                {hasVotedForThisCandidate && (
                                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/50 to-green-600/60 flex flex-col items-center justify-center z-10 rounded-t-lg">
                                        <CheckCircle2 className="w-16 h-16 text-white" />
                                        <span className="mt-2 text-white font-bold text-xl">Voted</span>
                                    </div>
                                )}
                                <CardHeader className={`${hasVotedForThisCandidate ? 'opacity-50' : ''}`}>
                                    <div className="flex items-start space-x-4">
                                        <Avatar className="h-20 w-20">
                                            <AvatarImage src={candidate.image || '/placeholder.svg'} alt={candidate.name} />
                                            <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <CardTitle className="text-lg">{candidate.name}</CardTitle>
                                            <CardDescription>{position}</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className={`flex-grow ${hasVotedForThisCandidate ? 'opacity-50' : ''}`}>
                                    <p className="text-sm text-muted-foreground min-h-[40px] line-clamp-2">
                                        {candidate.manifesto}
                                    </p>
                                </CardContent>
                            </div>

                            <CardFooter className="flex-col items-start space-y-2 pt-4 w-full">
                                <div className="w-full">
                                    <div className="flex w-full justify-between text-xs text-muted-foreground mb-1">
                                        <span>{`${candidateVotes} Votes`}</span>
                                        <span>{`${votePercentage.toFixed(1)}%`}</span>
                                    </div>
                                    <Progress value={votePercentage} className="w-full h-2" indicatorClassName="bg-blue-600" />
                                </div>
                                {showVoting && !isElectionEnded && (
                                    <div className="w-full pt-2 flex flex-col items-stretch">
                                        {hasVotedForThisCandidate ? (
                                            <Button
                                                variant="destructive"
                                                className="w-full mt-1"
                                                onClick={() => onRevoke && userVote && onRevoke(userVote.id)}
                                                disabled={!onRevoke}
                                            >
                                                <RotateCcw className="w-4 h-4 mr-1" /> Unvote
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="default"
                                                className="w-full mt-1 bg-green-600 hover:bg-green-700 text-white"
                                                onClick={() => onVote && electionId && onVote(electionId, candidate.id)}
                                                disabled={!!votedCandidateId || !onVote}
                                            >
                                                <Vote className="w-4 h-4 mr-1" /> Vote
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>
            {showLeftArrow && (
                <Button variant="outline" size="icon" className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full h-8 w-8 z-30" onClick={() => scroll('left')}>
                    <ChevronLeft className="h-4 w-4" />
                </Button>
            )}
            {showRightArrow && (
                <Button variant="outline" size="icon" className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rounded-full h-8 w-8 z-30" onClick={() => scroll('right')}>
                    <ChevronRight className="h-4 w-4" />
                </Button>
            )}
        </div>
    );
}; 