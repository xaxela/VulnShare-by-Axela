'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { KeyRound, LogIn, ShieldAlert, ShieldCheck, ShieldX, Home, Loader2 } from 'lucide-react';

const ADMIN_SECRET = process.env.NEXT_PUBLIC_ADMIN_SECRET;

export default function AdminLoginPage() {
    const [secret, setSecret] = useState('');
    const [status, setStatus] = useState<{ type: 'error' | 'pending' | 'success'; message: string } | null>(null);
    const router = useRouter();

    const handleVerify = (e: React.FormEvent) => {
        e.preventDefault();
        if (!secret) {
            setStatus({ type: 'error', message: 'Please enter the admin secret key.' });
            return;
        }
        if (!ADMIN_SECRET) {
            setStatus({ type: 'error', message: 'Admin secret is not configured in the environment.' });
            return;
        }
        setStatus({ type: 'pending', message: 'Verifying admin credentials...' });

        setTimeout(() => {
            if (secret === ADMIN_SECRET) {
                setStatus({ type: 'success', message: 'Admin verification successful! Redirecting...' });
                setTimeout(() => router.push('/admin/dashboard'), 1500);
            } else {
                setStatus({ type: 'error', message: 'Invalid admin key. Access denied.' });
                setSecret('');
            }
        }, 2000);
    };

    const getStatusIcon = () => {
      if (!status) return <ShieldAlert className="h-4 w-4" />;
      switch (status.type) {
        case 'pending': return <Loader2 className="h-4 w-4 animate-spin" />;
        case 'success': return <ShieldCheck className="h-4 w-4" />;
        case 'error': return <ShieldX className="h-4 w-4" />;
        default: return <ShieldAlert className="h-4 w-4" />;
      }
    }

    return (
        <main className="flex items-center justify-center min-h-screen bg-background text-foreground font-code p-4">
            <Card className="w-full max-w-md border-primary/50 shadow-lg shadow-primary/20">
                <CardHeader className="text-center">
                    <div className="flex justify-center items-center gap-2 mb-2">
                        <KeyRound className="w-8 h-8 text-primary" />
                        <CardTitle className="text-3xl font-bold font-headline text-primary">Admin Login</CardTitle>
                    </div>
                    <CardDescription className="text-accent">
                        Enter the secret key for administrative access.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleVerify} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="admin-secret">Admin Secret Key</Label>
                            <Input id="admin-secret" type="password" placeholder="••••••••••••••••••••••••" value={secret} onChange={(e) => setSecret(e.target.value)} required className="bg-background" />
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
                            <LogIn className="mr-2 h-4 w-4" />
                            {status?.type === 'pending' ? 'Verifying...' : 'Verify Admin'}
                        </Button>
                    </form>
                    <div className="mt-6 text-center">
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
