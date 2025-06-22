import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, Users, Vote, Trophy, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { StudentElectionCard } from "@/components/student/StudentElectionCard";
import { StudentProfile } from "@/components/student/StudentProfile";
import { ElectionAnalytics } from "@/components/student/ElectionAnalytics";
import { useStudentElections } from "@/hooks/useStudentElections";
import { ElectionCarousel } from "@/components/student/ElectionCarousel";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("elections");
  const { elections, candidates, votes, castVote, revokeVote } = useStudentElections();

  const studentEmail = sessionStorage.getItem('studentEmail');
  const studentRole = sessionStorage.getItem('studentRole');
  const studentName = sessionStorage.getItem('studentName');

  useEffect(() => {
    if (!studentEmail || !studentRole) {
      navigate("/student-login");
    }
  }, [studentEmail, studentRole, navigate]);

  if (!studentEmail || !studentRole) {
    return null;
  }

  const handleLogout = () => {
    sessionStorage.removeItem('studentEmail');
    sessionStorage.removeItem('studentRole');
    navigate("/student-login");
  };

  const ongoingElections = elections.filter(e => e.status === 'Ongoing');
  const completedElections = elections.filter(e => e.status === 'Completed');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome back, {studentName || studentEmail}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline">{studentRole}</Badge>
              <Button variant="ghost" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Elections</CardTitle>
              <Vote className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ongoingElections.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Votes Cast</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{votes.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Elections</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedElections.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{candidates.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="elections">Elections</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="elections" className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Active Elections</h2>
              {ongoingElections.length > 0 ? (
                <div className="grid gap-6">
                  {ongoingElections.map(election => {
                    const filteredCandidates = candidates.filter(c => c.election === election.title);
                    const groupedCandidates = filteredCandidates.reduce((acc, candidate) => {
                      (acc[candidate.position] = acc[candidate.position] || []).push(candidate);
                      return acc;
                    }, {} as Record<string, typeof filteredCandidates>);
                    const electionVotes = votes.filter(v => v.electionId === election.id);

                    return (
                      <Card key={election.id}>
                        <CardHeader>
                          <CardTitle>{election.title}</CardTitle>
                          <CardDescription>{election.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-8">
                            {Object.entries(groupedCandidates).map(([position, positionCandidates]) => {
                              const candidateIdsForPosition = positionCandidates.map(c => c.id);
                              const totalVotesForPosition = electionVotes.filter(v => candidateIdsForPosition.includes(v.candidateId)).length;
                              const userVoteForPosition = electionVotes.find(v => candidateIdsForPosition.includes(v.candidateId));

                              return (
                                <div key={position}>
                                  <div className="flex justify-between items-baseline mb-4">
                                    <div className="flex items-baseline space-x-3">
                                      <h3 className="text-2xl font-bold tracking-tight">{position}</h3>
                                      <span className="text-sm text-muted-foreground">{positionCandidates.length} {position.toLowerCase()} candidates</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{totalVotesForPosition} Total Votes</p>
                                  </div>
                                  <ElectionCarousel
                                    position={position}
                                    candidates={positionCandidates}
                                    votes={electionVotes}
                                    totalVotesForPosition={totalVotesForPosition}
                                    showVoting={true}
                                    userVote={userVoteForPosition}
                                    onVote={castVote}
                                    onRevoke={revokeVote}
                                    electionId={election.id}
                                    isElectionEnded={election.status !== 'Ongoing'}
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No active elections at the moment</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="space-y-4">
              {elections.map((election) => (
                <Card key={election.id}>
                  <CardHeader>
                    <div>
                      <CardTitle>{election.name}</CardTitle>
                      <CardDescription>{election.description}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ElectionAnalytics
                      election={election}
                      candidates={candidates.filter((c) => c.election === election.title)}
                      votes={votes}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Election Results</h2>
              {completedElections.length > 0 ? (
                <div className="space-y-6">
                  {completedElections.map(election => (
                    <Card key={election.id}>
                      <CardHeader>
                        <CardTitle>{election.title}</CardTitle>
                        <Badge variant="secondary">Completed</Badge>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {election.positions.map(position => (
                            <div key={position} className="border-l-4 border-green-500 pl-4">
                              <h4 className="font-semibold">{position}</h4>
                              <p className="text-sm text-gray-600">Winner: John Doe (245 votes)</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No completed elections yet</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <StudentProfile email={studentEmail} role={studentRole} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StudentDashboard;
