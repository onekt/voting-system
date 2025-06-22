import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BarChart3, Users, Vote, TrendingUp } from 'lucide-react';

export const ElectionMonitoring = () => {
  // Mock monitoring data
  const electionData = {
    totalVoters: 1250,
    votedCount: 456,
    turnoutPercentage: 36.5,
    activeElections: [
      {
        id: 1,
        title: 'Student Guild Elections 2025',
        totalVotes: 456,
        positions: [
          {
            name: 'President',
            candidates: [
              { name: 'John Smith', votes: 180, percentage: 39.5 },
              { name: 'Emily Davis', votes: 156, percentage: 34.2 },
              { name: 'Robert Brown', votes: 120, percentage: 26.3 }
            ]
          },
          {
            name: 'Vice President',
            candidates: [
              { name: 'Sarah Johnson', votes: 200, percentage: 43.9 },
              { name: 'Michael Chen', votes: 156, percentage: 34.2 },
              { name: 'Lisa Anderson', votes: 100, percentage: 21.9 }
            ]
          }
        ]
      }
    ]
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Election Monitoring</h2>
        <p className="text-gray-600">Real-time election progress and results</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Registered Voters</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{electionData.totalVoters.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Votes Cast</CardTitle>
            <Vote className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{electionData.votedCount.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Voter Turnout</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{electionData.turnoutPercentage}%</div>
            <Progress value={electionData.turnoutPercentage} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Elections</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{electionData.activeElections.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Live Results */}
      {electionData.activeElections.map((election) => (
        <Card key={election.id}>
          <CardHeader>
            <CardTitle>{election.title}</CardTitle>
            <CardDescription>Live voting results - Total votes: {election.totalVotes}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {election.positions.map((position, index) => (
                <div key={index}>
                  <h4 className="font-semibold mb-3">{position.name}</h4>
                  <div className="space-y-3">
                    {position.candidates.map((candidate, candidateIndex) => (
                      <div key={candidateIndex} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{candidate.name}</span>
                          <span className="text-sm text-gray-600">
                            {candidate.votes} votes ({candidate.percentage}%)
                          </span>
                        </div>
                        <Progress value={candidate.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Voting Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Voting Activity</CardTitle>
          <CardDescription>Hourly voting activity for today</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-8 gap-2">
              {Array.from({ length: 8 }, (_, i) => (
                <div key={i} className="text-center">
                  <div
                    className="bg-blue-600 rounded mb-1"
                    style={{ height: `${Math.random() * 60 + 20}px` }}
                  ></div>
                  <span className="text-xs text-gray-500">{9 + i}:00</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-600 text-center">
              Peak voting hours: 12:00 - 14:00
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
