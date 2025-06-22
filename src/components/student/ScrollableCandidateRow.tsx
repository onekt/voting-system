import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Vote, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";

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

interface Election {
    id: number;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    status: string;
    positions: string[];
}

interface VoteType {
    id: number;
    electionId: number;
    candidateId: number;
    voterEmail: string;
    timestamp: string;
}

interface ScrollableCandidateRowProps {
    candidates: Candidate[];
    election: Election;
    userVote?: VoteType;
    onVote: (electionId: number, candidateId: number) => void;
    onRevoke: (voteId: number) => void;
    isElectionEnded: boolean;
}

export const ScrollableCandidateRow = ({
    candidates,
    election,
    userVote,
    onVote,
    onRevoke,
    isElectionEnded,
}: ScrollableCandidateRowProps) => {
    const cardWidth = 240;
    const gap = 16;
    const visibleCount = 3;
    const containerWidth = visibleCount * cardWidth + (visibleCount - 1) * gap;
    const rowRef = useRef<HTMLDivElement>(null);
    const [showLeft, setShowLeft] = useState(false);
    const [showRight, setShowRight] = useState(false);
    const votedCandidateId = userVote && candidates.some(c => c.id === userVote.candidateId)
        ? userVote.candidateId
        : null;
    const [isDragging, setIsDragging] = useState(false);
    const [scrollPos, setScrollPos] = useState(0);
    const [maxScroll, setMaxScroll] = useState(0);
    const [page, setPage] = useState(0);
    const totalPages = Math.ceil(candidates.length / visibleCount);
    const paginatedCandidates = candidates.slice(page * visibleCount, page * visibleCount + visibleCount);
    const canScrollLeft = page > 0;
    const canScrollRight = page < totalPages - 1;

    // Update scroll indicators
    const updateScrollIndicators = () => {
        const el = rowRef.current;
        if (!el) return;
        setShowLeft(el.scrollLeft > 0);
        setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    };

    useEffect(() => {
        updateScrollIndicators();
        const el = rowRef.current;
        if (!el) return;
        el.addEventListener('scroll', updateScrollIndicators);
        return () => el.removeEventListener('scroll', updateScrollIndicators);
    }, [candidates]);

    useEffect(() => {
        const el = rowRef.current;
        if (!el) return;
        setMaxScroll(el.scrollWidth - el.clientWidth);
        const onScroll = () => setScrollPos(el.scrollLeft);
        el.addEventListener('scroll', onScroll);
        return () => el.removeEventListener('scroll', onScroll);
    }, [candidates.length]);

    // Drag/Swipe support
    useEffect(() => {
        const el = rowRef.current;
        if (!el) return;
        let isDown = false;
        let startX = 0;
        let scrollLeft = 0;
        const onMouseDown = (e: MouseEvent) => {
            isDown = true;
            setIsDragging(true);
            startX = e.pageX - el.offsetLeft;
            scrollLeft = el.scrollLeft;
            el.classList.add('cursor-grabbing');
        };
        const onMouseLeave = () => {
            isDown = false;
            setIsDragging(false);
            el.classList.remove('cursor-grabbing');
        };
        const onMouseUp = () => {
            isDown = false;
            setIsDragging(false);
            el.classList.remove('cursor-grabbing');
        };
        const onMouseMove = (e: MouseEvent) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - el.offsetLeft;
            const walk = (x - startX) * 1.2;
            el.scrollLeft = scrollLeft - walk;
        };
        el.addEventListener('mousedown', onMouseDown);
        el.addEventListener('mouseleave', onMouseLeave);
        el.addEventListener('mouseup', onMouseUp);
        el.addEventListener('mousemove', onMouseMove);
        // Touch events for mobile
        let touchStartX = 0;
        let touchScrollLeft = 0;
        const onTouchStart = (e: TouchEvent) => {
            touchStartX = e.touches[0].pageX;
            touchScrollLeft = el.scrollLeft;
        };
        const onTouchMove = (e: TouchEvent) => {
            const x = e.touches[0].pageX;
            const walk = (x - touchStartX) * 1.2;
            el.scrollLeft = touchScrollLeft - walk;
        };
        el.addEventListener('touchstart', onTouchStart);
        el.addEventListener('touchmove', onTouchMove);
        return () => {
            el.removeEventListener('mousedown', onMouseDown);
            el.removeEventListener('mouseleave', onMouseLeave);
            el.removeEventListener('mouseup', onMouseUp);
            el.removeEventListener('mousemove', onMouseMove);
            el.removeEventListener('touchstart', onTouchStart);
            el.removeEventListener('touchmove', onTouchMove);
        };
    }, [candidates.length]);

    // Arrow navigation: scroll by 1 card
    const scrollByCard = (dir: 'left' | 'right') => {
        const el = rowRef.current;
        if (!el) return;
        const scrollAmount = cardWidth + gap;
        el.scrollBy({ left: dir === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    };

    return (
        <div className="relative flex items-center justify-center w-full">
            {/* Left arrow */}
            {canScrollLeft && (
                <button
                    className="absolute left-0 top-1/2 -translate-y-1/2 bg-white border rounded-full shadow p-1 z-20"
                    onClick={() => setPage(page - 1)}
                    aria-label="Scroll left"
                    style={{ left: '-28px' }}
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
            )}
            {/* Candidate row with horizontal scrollbar and only 3 visible cards */}
            <div
                ref={rowRef}
                className={`flex flex-nowrap gap-4 justify-center items-center overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100${isDragging ? ' cursor-grabbing' : ' cursor-grab'}`}
                style={{ minHeight: 370, width: containerWidth, margin: '0 auto', scrollBehavior: 'smooth' }}
            >
                {paginatedCandidates.map(candidate => {
                    const hasVotedForThisCandidate = votedCandidateId === candidate.id;
                    return (
                        <div key={candidate.id} className="flex flex-col items-center border rounded-lg p-4 bg-white shadow-md" style={{ width: cardWidth, height: '370px', position: 'relative' }}>
                            {/* Candidate Image */}
                            <div className="w-28 h-28 mb-3 flex items-center justify-center bg-gray-100 rounded-full overflow-hidden">
                                <Avatar className="w-28 h-28">
                                    <AvatarImage src={candidate.image} />
                                    <AvatarFallback className="text-2xl">{candidate.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                            </div>
                            {/* Name */}
                            <h4 className="font-semibold text-lg text-center mb-1">{candidate.name}</h4>
                            {/* School and Department */}
                            <p className="text-sm text-gray-600 text-center mb-1">{candidate.school} - {candidate.department}</p>
                            {/* Position */}
                            <p className="text-xs text-gray-500 text-center mb-1">Running for: <span className="font-semibold">{candidate.position}</span></p>
                            {/* Manifesto */}
                            <p className="text-xs text-gray-700 text-center mb-2 italic line-clamp-3">{candidate.manifesto}</p>
                            {/* Voted badge */}
                            <div className="mt-1">
                                {hasVotedForThisCandidate && !isElectionEnded && (
                                    <Badge variant="default">Voted</Badge>
                                )}
                            </div>
                            {/* Bottom area: Vote/Unvote buttons and election time */}
                            <div className="absolute left-0 right-0 bottom-0 flex flex-col items-center p-2 bg-white">
                                <div className="flex w-full space-x-2 mb-1">
                                    <Button
                                        onClick={() => onVote(election.id, candidate.id)}
                                        size="sm"
                                        className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                                        disabled={isElectionEnded || !!votedCandidateId || hasVotedForThisCandidate}
                                        style={{ cursor: (isElectionEnded || !!votedCandidateId || hasVotedForThisCandidate) ? 'not-allowed' : 'pointer' }}
                                    >
                                        <Vote className="h-4 w-4 mr-1" />
                                        Vote
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => userVote && onRevoke(userVote.id)}
                                        size="sm"
                                        className="flex-1 border-red-500 text-red-600 hover:bg-red-50"
                                        disabled={isElectionEnded || !hasVotedForThisCandidate}
                                        style={{ cursor: (isElectionEnded || !hasVotedForThisCandidate) ? 'not-allowed' : 'pointer' }}
                                    >
                                        <RotateCcw className="h-4 w-4 mr-1" />
                                        Unvote
                                    </Button>
                                </div>
                                {/* Election period timer, only if election ongoing and buttons are clickable */}
                                {!isElectionEnded && (
                                    <div className="flex justify-center w-full">
                                        <span className="text-xs text-blue-600 text-center">
                                            {new Date(election.startDate).toLocaleString()}&nbsp;to&nbsp;{new Date(election.endDate).toLocaleString()}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
            {/* Right arrow */}
            {canScrollRight && (
                <button
                    className="absolute right-0 top-1/2 -translate-y-1/2 bg-white border rounded-full shadow p-1 z-20"
                    onClick={() => setPage(page + 1)}
                    aria-label="Scroll right"
                    style={{ right: '-28px' }}
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            )}
        </div>
    );
}; 