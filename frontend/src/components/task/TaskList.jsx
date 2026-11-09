import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Edit2, Trash2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { toast } from 'sonner';
import api from '../../lib/api/apiClient';

const TaskList = ({ tasks: transactions, isLoading, onEdit }) => {
    const queryClient = useQueryClient();

    // Mutation-ka loogu talagalay in lagu tirtiro Transaction
    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            const response = await api.delete(`/transactions/${id}`);
            return response.data;
        },
        onSuccess: () => {
            toast.success('Transaction deleted successfully');
            queryClient.invalidateQueries(['transactions']);
        },
        onError: (err) => {
            toast.error('Failed to delete transaction');
        }
    });

    if (isLoading) return <div className="text-center py-6 text-muted-foreground">Loading transactions...</div>;
    if (!transactions || transactions.length === 0) {
        return <div className="text-center py-10 border border-dashed rounded-lg text-muted-foreground">No transactions found. Add some above!</div>;
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-left">Recent Transactions</h3>
            <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
                <div className="divide-y">
                    {transactions.map((tx) => (
                        <div key={tx._id} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-full ${tx.type === 'income' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-destructive/10 text-destructive'}`}>
                                    {tx.type === 'income' ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownRight className="h-5 w-5" />}
                                </div>
                                <div className="text-left">
                                    <p className="font-medium text-foreground">{tx.title}</p>
                                    <p className="text-xs text-muted-foreground">{tx.category} • {new Date(tx.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4">
                                <span className={`font-semibold ${tx.type === 'income' ? 'text-emerald-500' : 'text-destructive'}`}>
                                    {tx.type === 'income' ? '+' : '-'}${Math.abs(tx.amount)}
                                </span>
                                <div className="flex items-center gap-1">
                                    <button onClick={() => onEdit(tx)} className="p-2 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground cursor-pointer">
                                        <Edit2 className="h-4 w-4" />
                                    </button>
                                    <button onClick={() => { if(confirm('Are you sure?')) deleteMutation.mutate(tx._id); }} className="p-2 hover:bg-destructive/10 rounded-md text-muted-foreground hover:text-destructive cursor-pointer" disabled={deleteMutation.isPending}>
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TaskList;
