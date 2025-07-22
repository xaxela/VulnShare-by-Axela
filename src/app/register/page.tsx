
'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserPlus, UserCheck, Home, Loader2, CheckCircle, XCircle, TriangleAlert } from 'lucide-react';
import { addUser, userExists } from '@/lib/user-store';
import { addActivityLog } from '@/lib/activity-log';

export default function UserRegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [status, setStatus] = useState<{ type: 'error' | 'pending' | 'success'; message: React.ReactNode } | null>(null);
    const router = useRouter();

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus(null);

        if (!email || !password || !confirm) {
            setStatus({ type: 'error', message: 'Please fill in all fields.' });
            return;
        }
        if (password !== confirm) {
            setStatus({ type: 'error', message: 'Passwords do not match.' });
            return;
        }
        if (password.length < 6) {
            setStatus({ type: 'error', message: 'Password must be at least 6 characters.' });
            return;
        }
        if (userExists(email)) {
            setStatus({ type: 'error', message: 'An account with this email already exists.' });
            return;
        }

        setStatus({ type: 'pending', message: 'Creating account...' });
        
        // Mock API call
        setTimeout(() => {
            addUser({ email, password });
            addActivityLog({ type: 'USER_REGISTER', text: `New user registration: ${email}` });
            setStatus({
              type: 'success',
              message: "Registration successful! You will be redirected to the login page shortly."
            });
            setTimeout(() => router.push('/login'), 1500);
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
            <Card className="w-full max-w-md border-primary/50 shadow-lg shadow-primary/20">
                <CardHeader className="text-center">
                    <div className="flex justify-center items-center gap-2 mb-2">
                        <UserPlus className="w-8 h-8 text-primary" />
                        <CardTitle className="text-3xl font-bold font-headline text-primary">Register</CardTitle>
                    </div>
                    <CardDescription className="text-accent">
                        Create a new secure account.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleRegister} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="reg-email">Email Address</Label>
                            <Input id="reg-email" type="email" placeholder="user@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-background" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="reg-password">Password</Label>
                            <Input id="reg-password" type="password" placeholder="Min 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} required className="bg-background" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="reg-confirm">Confirm Password</Label>
                            <Input id="reg-confirm" type="password" placeholder="Retype password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required className="bg-background" />
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
                            <UserCheck className="mr-2 h-4 w-4" />
                            {status?.type === 'pending' ? 'Registering...' : 'Register'}
                        </Button>
                    </form>
                    <p className="mt-4 text-center text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Link href="/login" className="underline text-primary hover:text-primary/80">
                            Login here
                        </Link>
                    </p>
                    <div className="mt-4 text-center">
                        <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                            <Link href="/">
                                <Home className="mr-2 h-4 w-4" />
                                Back to Home
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </main>
    );
}
