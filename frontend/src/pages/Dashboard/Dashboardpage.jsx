import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import React, { useState } from "react";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import DashboardWelcome from "../../components/dashboard/DashboardWelcome";
import TaskForm from "../../components/task/TaskForm";
import TaskList from "../../components/task/TaskList";
import api from "../../lib/api/apiClient";

const DashboardPage = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const handleFormClose = () => {
    setShowCreateForm(false);
    setEditingTransaction(null);
  };

  const handleCreateTransactionClick = () => {
    setShowCreateForm(true);
  };
  const transactionsQuery = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const response = await api.get("/transactions");
      return response.data;
    },
    retry: 1,
  });

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setShowCreateForm(true);
  };

  const handleStatusChange = async (transactionId, statusData) => {};

  if (transactionsQuery.isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader className="animate-spin" />
      </div>
    );
  }

  if (transactionsQuery.isError) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-red-500">
          Error loading transactions: {transactionsQuery.error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* header */}
      <DashboardHeader />

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        
        {/* Welcome Section */}
        <DashboardWelcome
          showCreateForm={showCreateForm}
          onCreateTask={handleCreateTransactionClick}
          transactions={transactionsQuery.data || []}
        />

        {/* Transactions Section */}
        <div>
          <TaskList
            tasks={transactionsQuery.data || []}
            isLoading={transactionsQuery.isLoading}
            onEdit={handleEditTransaction}
            onStatusChange={handleStatusChange}
          />
        </div>
      </main>

      {/* Transaction Dialog Form */}
      <TaskForm
        task={editingTransaction}
        open={showCreateForm || !!editingTransaction}
        onOpenChange={handleFormClose}
      />
    </div>
  );
};

export default DashboardPage;
