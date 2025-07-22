
'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, LogIn, TriangleAlert, Home, Loader2, CheckCircle, XCircle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { verifyUser } from '@/lib/user-store';
import { addActivityLog } from '@/lib/activity-log';

export default function UserLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState<{ type: 'error' | 'pending' | 'success'; message: string } | null>(null);
    const [showTerms, setShowTerms] = useState(false);
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            setStatus({ type: 'error', message: 'Please enter email and password.' });
            return;
        }
        setStatus({ type: 'pending', message: 'Authenticating...' });

        // Mock API call
        setTimeout(() => {
            if (verifyUser(email, password)) {
                setStatus({ type: 'success', message: 'Login successful! Welcome back.' });
                addActivityLog({ type: 'USER_LOGIN', text: `User logged in: ${email}` });

                const hasAcceptedTerms = localStorage.getItem('termsAccepted');
                if (!hasAcceptedTerms) {
                    setShowTerms(true);
                } else {
                    router.push('/dashboard');
                }
            } else {
              setStatus({ type: 'error', message: 'Invalid email or password.' });
            }
        }, 1000);
    };

    const handleAcceptTerms = () => {
        localStorage.setItem('termsAccepted', 'true');
        setShowTerms(false);
        router.push('/dashboard');
    }

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
                        <User className="w-8 h-8 text-primary" />
                        <CardTitle className="text-3xl font-bold font-headline text-primary">User Login</CardTitle>
                    </div>
                    <CardDescription className="text-accent">
                        Access your secure files
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" placeholder="user@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-background" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required className="bg-background" />
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
                            {status?.type === 'pending' ? 'Authenticating...' : 'Login'}
                        </Button>
                    </form>
                    <p className="mt-4 text-center text-sm text-muted-foreground">
                        Don't have an account?{' '}
                        <Link href="/register" className="underline text-primary hover:text-primary/80">
                            Register here
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

            <AlertDialog open={showTerms}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Terms and Conditions</AlertDialogTitle>
                        <AlertDialogDescription>
                            Please read and accept the terms and conditions to continue.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <ScrollArea className="h-60 w-full rounded-md border p-4">
                        <p className="text-sm">
                            Welcome to SecureShare. These terms and conditions outline the rules and regulations for the use of SecureShare's Website.
                            <br /><br />
                            By accessing this website we assume you accept these terms and conditions. Do not continue to use SecureShare if you do not agree to take all of the terms and conditions stated on this page.
                            <br /><br />
                            <strong>Cookies:</strong> We employ the use of cookies. By accessing SecureShare, you agreed to use cookies in agreement with the SecureShare's Privacy Policy.
                            <br /><br />
                            <strong>License:</strong> Unless otherwise stated, SecureShare and/or its licensors own the intellectual property rights for all material on SecureShare. All intellectual property rights are reserved. You may access this from SecureShare for your own personal use subjected to restrictions set in these terms and conditions.
                            <br /><br />
                            You must not:
                        </p>
                        <ul className="list-disc list-inside text-sm space-y-1 my-2">
                            <li>Republish material from SecureShare</li>
                            <li>Sell, rent or sub-license material from SecureShare</li>
                            <li>Reproduce, duplicate or copy material from SecureShare</li>
                            <li>Redistribute content from SecureShare</li>
                        </ul>
                        <p className="text-sm">
                            This Agreement shall begin on the date hereof.
                            <br /><br />
                            Parts of this website offer an opportunity for users to post and exchange opinions and information in certain areas of the website. SecureShare does not filter, edit, publish or review Comments prior to their presence on the website. Comments do not reflect the views and opinions of SecureShare,its agents and/or affiliates. Comments reflect the views and opinions of the person who post their views and opinions. To the extent permitted by applicable laws, SecureShare shall not be liable for the Comments or for any liability, damages or expenses caused and/or suffered as a result of any use of and/or posting of and/or appearance of the Comments on this website.
                        </p>
                    </ScrollArea>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={handleAcceptTerms}>I Accept</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </main>
    );
}
