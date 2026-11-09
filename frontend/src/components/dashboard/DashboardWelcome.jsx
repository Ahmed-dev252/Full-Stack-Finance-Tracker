import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import CardStatus from './CardStatus' 

const DashboardWelcome = ({ onCreateTask: onCreateTransaction, transactions = [] }) => {
    return (
        <Card className="border border-border shadow-sm bg-gradient-to-r from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/20">
            <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1 flex flex-col items-start">
                        <CardTitle className="text-2xl font-bold text-foreground">Welcome back!</CardTitle>
                        <CardDescription className="text-base text-muted-foreground text-left">
                            Here is a snapshot of your personal finance and transactions today.
                        </CardDescription>
                    </div>
                    
                  
                    <Button
                        onClick={onCreateTransaction}
                        className="cursor-pointer gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
                    >
                        <PlusCircle className="h-4 w-4" />
                        Add Transaction
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="p-4 pt-0">
               
                <CardStatus transactions={transactions} />
            </CardContent>
        </Card>
    )
}

export default DashboardWelcome;
