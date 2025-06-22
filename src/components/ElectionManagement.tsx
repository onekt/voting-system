
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useElections } from '@/hooks/useElections';
import { ElectionForm } from './ElectionForm';
import { ElectionList } from './ElectionList';


export const ElectionManagement = () => {
  const {
    showForm,
    elections,
    editingElection,
    formData,
    handleInputChange,
    handleCancel,
    handleCreateClick,
    handleEditClick,
    handleDeleteClick,
    handleSubmit,
    handleTogglePublishStatus,
  } = useElections();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Election Management</h2>
          <p className="text-gray-600">Create, update, and manage elections</p>
        </div>
        <Button onClick={handleCreateClick}>
          <Plus className="mr-2 h-4 w-4" />
          Create Election
        </Button>
      </div>

      {showForm && (
        <ElectionForm
          formData={formData}
          editingElection={editingElection}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}

      <ElectionList
        elections={elections}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        onPublish={handleTogglePublishStatus}
      />
    </div>
  );
};
