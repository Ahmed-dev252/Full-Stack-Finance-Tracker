import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader } from 'lucide-react';
import { toast } from 'sonner';
import api from '../../lib/api/apiClient';
import { extractErrorMessages } from '../../util/errorUtils';

const CATEGORIES = ['Food', 'Rent', 'Utilities', 'Entertainment', 'Salary', 'Freelance', 'Investments', 'Others'];

const TaskForm = ({ task: transaction, open = true, onOpenChange }) => {
    const queryClient = useQueryClient();
    const [formValues, setFormValues] = useState({
        title: '',
        amount: '',
        type: 'expense',
        category: 'Food',
        date: new Date().toISOString().split('T')[0]
    });
    const [validationError, setValidationError] = useState(null);

    useEffect(() => {
        if (transaction) {
            setFormValues({
                title: transaction.title || '',
                amount: transaction.amount || '',
                type: transaction.type || 'expense',
                category: transaction.category || 'Food',
                date: transaction.date ? new Date(transaction.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
            });
        } else {
            setFormValues({ title: '', amount: '', type: 'expense', category: 'Food', date: new Date().toISOString().split('T')[0] });
        }
        setValidationError(null);
    }, [transaction, open]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const createTaskMutation = useMutation({
        mutationFn: async (data) => {
            const response = await api.post('/transactions', data);
            return response.data;
        },
        onSuccess: () => {
            toast.success('Transaction added successfully');
            queryClient.invalidateQueries(['transactions']);
            onOpenChange?.(false);
        },
        onError: (error) => {
            setValidationError(extractErrorMessages(error));
        }
    });

    const updateTaskMutation = useMutation({
        mutationFn: async (data) => {
            const response = await api.put(`/transactions/${transaction._id}`, data);
            return response.data;
        },
        onSuccess: () => {
            toast.success('Transaction updated successfully');
            queryClient.invalidateQueries(['transactions']);
            onOpenChange?.(false);
        },
        onError: (error) => {
            setValidationError(extractErrorMessages(error));
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formValues.title || !formValues.amount) {
            setValidationError('Title and Amount are required');
            return;
        }

        const payload = {
            title: formValues.title.trim(),
            amount: Number(formValues.amount),
            type: formValues.type,
            category: formValues.category,
            date: new Date(formValues.date).toISOString()
        };

        if (transaction) {
            updateTaskMutation.mutate(payload);
        } else {
            createTaskMutation.mutate(payload);
        }
    };

    const isLoading = createTaskMutation.isPending || updateTaskMutation.isPending;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle className="text-left">{transaction ? 'Edit Transaction' : 'Add New Transaction'}</DialogTitle>
                    <DialogDescription className="text-left">Track your incomes and expenses smoothly.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {validationError && <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md text-left">{validationError}</div>}

                    <div className="space-y-1 text-left">
                        <Label htmlFor="title">Title *</Label>
                        <Input id="title" name="title" value={formValues.title} onChange={handleInputChange} placeholder="e.g., Grocery Shopping" required />
                    </div>

                    <div className="space-y-1 text-left">
                        <Label htmlFor="amount">Amount ($) *</Label>
                        <Input id="amount" name="amount" type="number" value={formValues.amount} onChange={handleInputChange} placeholder="0.00" required />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-left">
                        <div className="space-y-1">
                            <Label>Type</Label>
                            <Select value={formValues.type} onValueChange={(v) => setFormValues({ ...formValues, type: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="expense">Expense</SelectItem>
                                    <SelectItem value="income">Income</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1">
                            <Label>Category</Label>
                            <Select value={formValues.category} onValueChange={(v) => setFormValues({ ...formValues, category: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-1 text-left">
                        <Label htmlFor="date">Date</Label>
                        <Input id="date" name="date" type="date" value={formValues.date} onChange={handleInputChange} />
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange?.(false)} disabled={isLoading}>Cancel</Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                            {transaction ? 'Update' : 'Add'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default TaskForm;
