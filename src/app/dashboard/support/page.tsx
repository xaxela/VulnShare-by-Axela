
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LifeBuoy, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Laugh } from 'lucide-react';

export default function SupportChatPage() {
    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground font-code p-4">
            <Card className="w-full max-w-2xl border-primary/50 shadow-lg shadow-primary/20">
                <CardHeader className="text-center">
                     <div className="flex justify-center items-center gap-2 mb-2">
                        <LifeBuoy className="w-8 h-8 text-primary" />
                        <CardTitle className="text-3xl font-bold font-headline text-primary">Support Chat</CardTitle>
                    </div>
                    <CardDescription className="text-accent">
                        Need help? Drop a message for the admin.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                    <Alert className="bg-accent/10 border-accent text-accent">
                        <Laugh className="h-4 w-4" />
                        <AlertTitle>Just Kidding!</AlertTitle>
                        <AlertDescription>
                           But you can leave a message here. 😂
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
            <div className="mt-6">
                 <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary/10 hover:text-primary">
                    <Link href="/dashboard">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                    </Link>
                </Button>
            </div>
        </main>
    );
}
