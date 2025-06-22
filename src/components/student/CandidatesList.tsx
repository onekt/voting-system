
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";

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

interface CandidatesListProps {
  candidates: Candidate[];
}

export const CandidatesList = ({ candidates }: CandidatesListProps) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">All Candidates</h2>
      {candidates.length > 0 ? (
        <div className="grid gap-6">
          {candidates.map(candidate => (
            <Card key={candidate.id}>
              <CardHeader>
                <div className="flex items-start space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={candidate.image} />
                    <AvatarFallback className="text-lg">
                      {candidate.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">{candidate.name}</CardTitle>
                      <Badge variant="outline">{candidate.position}</Badge>
                    </div>
                    <p className="text-gray-600 mt-1">{candidate.email}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span>{candidate.department}</span>
                      <span>•</span>
                      <span>{candidate.school}</span>
                      <span>•</span>
                      <span>{candidate.gender}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Election</h4>
                    <p className="text-gray-600">{candidate.election}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Manifesto</h4>
                    <p className="text-gray-600 leading-relaxed">{candidate.manifesto}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No candidates registered yet</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
