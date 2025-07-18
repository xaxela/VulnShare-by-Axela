'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';
import { Mail, Send, FolderKanban, Loader2, CheckCircle, XCircle, TriangleAlert } from 'lucide-react';

export default function RequestAccessPage() {
    const [requestedFile, setRequestedFile] = useState('');
    const [reason, setReason] = useState('');
    const [status, setStatus] = useState<{ type: 'error' | 'pending' | 'success'; message: string } | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!requestedFile || !reason) {
            setStatus({ type: 'error', message: 'Please fill in all fields.' });
            return;
        }
        setStatus({ type: 'pending', message: 'Submitting request...' });
        setTimeout(() => {
            setStatus({ type: 'success', message: 'Access request submitted successfully! You will be notified when reviewed.' });
            setRequestedFile('');
            setReason('');
        }, 1500);
    };

    const getStatusIcon = () => {
        if (!status) return <TriangleAlert className="h-4 w-4" />;
        switch (status.type) {
            case 'pending': return <Loader2 className="h-4 w-4 animate-spin" />;
            case 'success': return <CheckCircle className="h-4 w-4" />;
            case 'error': return <XCircle className="h-4 w-4" />;
            default: return <TriangleAlert className="h-4 w-4" />;
        }
    }

    return (
        <main className="flex items-center justify-center min-h-screen bg-background text-foreground font-code p-4">
            <Card className="w-full max-w-2xl border-primary/50 shadow-lg shadow-primary/20">
                <CardHeader className="text-center">
                    <div className="flex justify-center items-center gap-2 mb-2">
                        <Mail className="w-8 h-8 text-primary" />
                        <CardTitle className="text-3xl font-bold font-headline text-primary">Request File Access</CardTitle>
                    </div>
                    <CardDescription className="text-accent">
                        Request access to specific encrypted files or additional privileges.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Input 
                                id="requested-file" 
                                placeholder="File name or description" 
                                value={requestedFile}
                                onChange={(e) => setRequestedFile(e.target.value)}
                                className="bg-background"
                            />
                        </div>
                        <div>
                            <Textarea 
                                id="access-reason" 
                                placeholder="Reason for access request..." 
                                rows={4}
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                className="bg-background"
                            />
                        </div>
                        
                        {status && (
                            <Alert variant={status.type === 'error' ? 'destructive' : 'default'}
                                   className={`${status.type === 'pending' ? 'bg-accent/10 border-accent text-accent' : ''} ${status.type === 'success' ? 'bg-primary/10 border-primary text-primary' : ''}`}>
                                {getStatusIcon()}
                                <AlertTitle>{status.type.toUpperCase()}</AlertTitle>
                                <AlertDescription>
                                    {status.message}
                                </AlertDescription>
                            </Alert>
                        )}
                        
                        <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={status?.type === 'pending'}>
                           <Send className="mr-2 h-4 w-4" />
                           {status?.type === 'pending' ? 'Submitting...' : 'Submit Request'}
                        </Button>
                    </form>
                    <div className="mt-6 text-center">
                        <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                            <Link href="/dashboard">
                                <FolderKanban className="mr-2 h-4 w-4" />
                                Back to Files
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </main>
    );
}
