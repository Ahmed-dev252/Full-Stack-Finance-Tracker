import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader, Users, BarChart3, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api/apiClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const AdminOverview = () => {
    const navigate = useNavigate();

    // Ka soo qaad xogta Admin-ka backend-ka
    const { data: adminData, isLoading, isError, error } = useQuery({
        queryKey: ['adminOverview'],
        queryFn: async () => {
            const response = await api.get('/admin/overview');
            return response.data;
        },
        retry: 1
    });

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader className="animate-spin h-8 w-8 text-emerald-600" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex h-screen flex-col items-center justify-center gap-4">
                <p className="text-rose-500 font-medium">Access Denied: Admin users only.</p>
                <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
            </div>
        );
    }

    const { totalUsers, topSpendingCategories } = adminData?.data || { totalUsers: 0, topSpendingCategories: [] };

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-6xl mx-auto space-y-6">
                
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex flex-col items-start">
                        <h1 className="text-3xl font-bold text-foreground">Admin System Overview</h1>
                        <p className="text-muted-foreground">Global monitoring dashboard for platform management.</p>
                    </div>
                    <Button variant="outline" onClick={() => navigate('/dashboard')} className="gap-2 cursor-pointer">
                        <ArrowLeft className="h-4 w-4" /> Back
                    </Button>
                </div>

                {/* Top Cards */}
                <div className="grid gap-4 md:grid-cols-2">
                    <Card className="border-border">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users Registered</CardTitle>
                            <Users className="h-5 w-5 text-blue-500" />
                        </CardHeader>
                        <CardContent className="text-left">
                            <div className="text-3xl font-bold">{totalUsers}</div>
                            <p className="text-xs text-muted-foreground mt-1">Active regular user accounts</p>
                        </CardContent>
                    </Card>

                    <Card className="border-border">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Monitored Categories</CardTitle>
                            <BarChart3 className="h-5 w-5 text-emerald-500" />
                        </CardHeader>
                        <CardContent className="text-left">
                            <div className="text-3xl font-bold">{topSpendingCategories.length}</div>
                            <p className="text-xs text-muted-foreground mt-1">Top spending sectors active</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Spending Sectors List */}
                <Card className="border-border">
                    <CardHeader>
                        <CardTitle className="text-xl text-left">Top Platform Spending Categories</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {topSpendingCategories.length === 0 ? (
                            <p className="text-muted-foreground py-4 text-center">No platform spending recorded yet.</p>
                        ) : (
                            <div className="border rounded-lg overflow-hidden divide-y">
                                {topSpendingCategories.map((cat, idx) => (
                                    <div key={idx} className="p-4 flex justify-between items-center bg-card hover:bg-muted/20 transition-colors">
                                        <div className="text-left">
                                            <span className="font-semibold text-foreground text-base">{cat._id || 'Others'}</span>
                                            <p className="text-xs text-muted-foreground">{cat.transactionCount} total orders</p>
                                        </div>
                                        <span className="font-bold text-rose-500 text-lg">
                                            -${Math.abs(cat.totalAmount).toLocaleString()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

            </div>
        </div>
    );
};

export default AdminOverview;
