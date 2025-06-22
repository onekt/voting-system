
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Edit2, Save, X } from "lucide-react";
import { toast } from "sonner";

interface StudentProfileProps {
  email: string;
  role: string;
}

export const StudentProfile = ({ email, role }: StudentProfileProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: email,
    role: role,
    department: "Computer Science",
    school: "School of Engineering",
    year: "4th Year",
    studentId: "CS/2020/001",
    phone: "+1234567890",
    bio: "Passionate about technology and student governance.",
  });

  const [editedData, setEditedData] = useState(profileData);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData(profileData);
  };

  const handleSave = () => {
    setProfileData(editedData);
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData(profileData);
  };

  const handleInputChange = (field: string, value: string) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">My Profile</h2>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="text-lg">
                  {profileData.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{profileData.name}</CardTitle>
                <p className="text-gray-600">{profileData.email}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant="outline">{profileData.role}</Badge>
                  <Badge variant="secondary">{profileData.year}</Badge>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              {!isEditing ? (
                <Button onClick={handleEdit} variant="outline">
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button onClick={handleSave} size="sm">
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button onClick={handleCancel} variant="outline" size="sm">
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={editedData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                ) : (
                  <p className="text-gray-700 mt-1">{profileData.name}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="studentId">Student ID</Label>
                <p className="text-gray-700 mt-1">{profileData.studentId}</p>
              </div>
              
              <div>
                <Label htmlFor="department">Department</Label>
                {isEditing ? (
                  <Input
                    id="department"
                    value={editedData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                  />
                ) : (
                  <p className="text-gray-700 mt-1">{profileData.department}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="school">School</Label>
                {isEditing ? (
                  <Input
                    id="school"
                    value={editedData.school}
                    onChange={(e) => handleInputChange('school', e.target.value)}
                  />
                ) : (
                  <p className="text-gray-700 mt-1">{profileData.school}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <p className="text-gray-700 mt-1">{profileData.email}</p>
              </div>
              
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    value={editedData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                ) : (
                  <p className="text-gray-700 mt-1">{profileData.phone}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="year">Academic Year</Label>
                {isEditing ? (
                  <Input
                    id="year"
                    value={editedData.year}
                    onChange={(e) => handleInputChange('year', e.target.value)}
                  />
                ) : (
                  <p className="text-gray-700 mt-1">{profileData.year}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="role">Role</Label>
                <p className="text-gray-700 mt-1">{profileData.role}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <Label htmlFor="bio">Bio</Label>
            {isEditing ? (
              <Textarea
                id="bio"
                value={editedData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                rows={4}
                className="mt-1"
              />
            ) : (
              <p className="text-gray-700 mt-1">{profileData.bio}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
