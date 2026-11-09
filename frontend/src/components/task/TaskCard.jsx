import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '../ui/button';
import { Calendar, Edit2, Loader, MoreVertical, Trash, ArrowUpRight, ArrowDownRight, DollarSign } from 'lucide-react';
import { toast } from "sonner"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api/apiClient';

const TYPE_CONFIG = {
    'income': {
        variant: 'default',
        label: 'Income',
        color: 'text-emerald-600',
        bg: 'bg-emerald-500/10'
    },
    'expense': {
        variant: 'destructive',
        label: 'Expense',
        color: 'text-rose-600',
        bg: 'bg-rose-500/10'
    }
};

const TaskCard = ({
    task: transaction,
    onEdit,
    isLoading = false
}) => {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const typeConfig = TYPE_CONFIG[transaction.type] || TYPE_CONFIG['expense'];

    const formatDate = (dateString) => {
        if (!dateString) return null;
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: async () => {
            const response = await api.delete(`/transactions/${transaction._id}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['transactions']);
            toast.success('Transaction deleted successfully');
        },
        onError: (error) => {
            toast.error(`Error deleting transaction: ${error.message}`);
        }
    })

    const handleDeleteConfirm = async () => {
        try {
            await deleteMutation.mutateAsync();
            setShowDeleteDialog(false);
        } catch (error) {
            console.error("Error confirming delete:", error);
        }
    }

    return (
        <>
            <Card className="w-full transition-shadow hover:shadow-md border-border">
                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${typeConfig.bg} ${typeConfig.color}`}>
                                {transaction.type === 'income' ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownRight className="h-5 w-5" />}
                            </div>
                            <div className="text-left">
                                <CardTitle className="text-lg leading-tight font-semibold">{transaction?.title}</CardTitle>
                                <span className="text-xs text-muted-foreground">{transaction.category}</span>
                            </div>
                        </div>

                        <div className='flex items-center gap-2'>
                            <span className={`font-bold text-lg ${transaction.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {transaction.type === 'income' ? '+' : '-'}${Math.abs(transaction.amount)}
                            </span>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 cursor-pointer">
                                        <span className="sr-only">Open menu</span>
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => onEdit(transaction)} className="cursor-pointer">
                                        <Edit2 className="mr-2 h-4 w-4" />
                                        Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="cursor-pointer text-destructive focus:text-destructive">
                                        <Trash className="mr-2 h-4 w-4" />
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Date: {formatDate(transaction.date)}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                        <span>Created: {formatDate(transaction.createdAt)}</span>
                        <Badge variant={typeConfig.variant} className="text-xs capitalize">
                            {typeConfig.label}
                        </Badge>
                    </div>
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-left">Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription className="text-left">
                            This action cannot be undone. This will permanently delete the transaction "{transaction.title}".
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            className="bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 cursor-pointer"
                            disabled={deleteMutation.isPending}
                        >
                            {deleteMutation.isPending ? (
                                <span className="flex items-center gap-2">
                                    <Loader className="animate-spin h-4 w-4" />
                                    Deleting...
                                </span>
                            ) : (
                                'Delete'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

export default TaskCard;
