import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, ArrowUpRight, ArrowDownRight, Percent } from 'lucide-react';

const CardStatus = ({ transactions = [] }) => {

    const totalIncome = transactions
        .filter(tx => tx.type === 'income')
        .reduce((sum, tx) => sum + tx.amount, 0);


    const totalExpense = transactions
        .filter(tx => tx.type === 'expense')
        .reduce((sum, tx) => sum + tx.amount, 0);

  
    const netBalance = totalIncome - totalExpense;

  
    const expensePercentage = totalIncome > 0 
        ? Math.min(Math.round((totalExpense / totalIncome) * 100), 100) 
        : 0;

    const statsData = [
        {
            label: 'Total Balance',
            value: `$${netBalance.toLocaleString()}`,
            icon: <Wallet className="h-4 w-4" />,
            color: netBalance >= 0 ? 'text-emerald-600' : 'text-rose-600',
            desc: 'Current available funds'
        },
        {
            label: 'Total Income',
            value: `$${totalIncome.toLocaleString()}`,
            icon: <ArrowUpRight className="h-4 w-4" />,
            color: 'text-emerald-500',
            desc: 'All earnings tracked'
        },
        {
            label: 'Total Expenses',
            value: `$${totalExpense.toLocaleString()}`,
            icon: <ArrowDownRight className="h-4 w-4" />,
            color: 'text-rose-500',
            desc: 'All spending tracked'
        },
        {
            label: 'Expense Rate',
            value: `${expensePercentage}%`,
            icon: <Percent className="h-4 w-4" />,
            color: expensePercentage > 75 ? 'text-amber-600' : 'text-muted-foreground',
            desc: 'Of income spent'
        }
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {statsData.map((stat, index) => (
                <Card key={index} className="border border-border shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            {stat.label}
                        </CardTitle>
                        <div className={`${stat.color} p-1.5 bg-muted rounded-md`}>
                            {stat.icon}
                        </div>
                    </CardHeader>
                    <CardContent className="text-left">
                        <div className={`text-2xl font-bold ${stat.color}`}>
                            {stat.value}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {stat.desc}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default CardStatus;
