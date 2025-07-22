
'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Users, File, Wifi, UploadCloud, LogOut, RefreshCw, UserCheck, UserPlus, ShieldCheck, KeyRound, AlertCircle, Loader2, Copy } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getFiles } from '@/lib/file-store';
import { useToast } from '@/hooks/use-toast';
import { getRegisteredUsers } from '@/lib/user-store';

const MOCK_PASSWORD = "SECURE_PASSWORD";

export default function AdminManagementPage() {
    const [stats, setStats] = useState({ totalUsers: 0, totalFiles: 0, activeSessions: 1 });
    const [currentSecret, setCurrentSecret] = useState('');
    const [newSecret, setNewSecret] = useState('');
    const [status, setStatus] = useState<{ type: 'error' | 'success' | 'pending'; message: string } | null>(null);
    const { toast } = useToast();

    const [recentActivity, setRecentActivity] = useState([
        { text: 'Admin logged in. Session started.', icon: <UserCheck className="h-4 w-4 text-primary" /> },
    ]);

    const refreshStats = () => {
        const users = getRegisteredUsers();
        const files = getFiles();
        setStats({
            totalUsers: users.length,
            totalFiles: files.length,
            activeSessions: 1, // Mocked value
        });

        const newActivity = [];
        if (files.length > (stats.totalFiles || 0)) {
            newActivity.push({ text: 'A new file was just uploaded.', icon: <UploadCloud className="h-4 w-4 text-primary" /> });
        }
        if (users.length > (stats.totalUsers || 0)) {
             newActivity.push({ text: 'A new user has registered.', icon: <UserPlus className="h-4 w-4 text-primary" /> });
        }
        if (newActivity.length > 0) {
            setRecentActivity(prev => [...newActivity, ...prev].slice(0, 3));
        }
    };

    useEffect(() => {
        refreshStats();
    }, []);

    const handleKeyChange = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus({ type: 'pending', message: 'Updating secret key...' });

        // In a real app, you would have a secure backend endpoint for this.
        // For this demo, we'll simulate the process.
        setTimeout(() => {
            if (currentSecret !== process.env.NEXT_PUBLIC_ADMIN_SECRET) {
                setStatus({ type: 'error', message: 'Current secret key is incorrect.' });
                return;
            }
            if (newSecret.length < 8) {
                setStatus({ type: 'error', message: 'New secret must be at least 8 characters long.' });
                return;
            }
            // In a real app, this would trigger a backend process to update the .env file
            // and restart the server. Here, we just show a success message.
            console.log(`Simulating admin key change to: ${newSecret}`);
            setStatus({ type: 'success', message: 'Admin key has been updated successfully! You will be logged out.' });

            setTimeout(() => {
                // Simulate logout
                window.location.href = '/admin/login';
            }, 3000);

        }, 1500);
    };

    const handleCopyPassword = () => {
        navigator.clipboard.writeText(MOCK_PASSWORD);
        toast({
            variant: 'default',
            title: 'Copied!',
            description: 'User download password copied to clipboard.',
            className: 'bg-primary/10 border-primary text-primary',
        });
    };

    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground font-code p-4">
            <Card className="w-full max-w-6xl border-primary/50 shadow-lg shadow-primary/20">
                <CardHeader className="text-center">
                     <div className="flex justify-center items-center gap-2 mb-2">
                        <Users className="w-8 h-8 text-primary" />
                        <CardTitle className="text-3xl font-bold font-headline text-primary">Admin Management</CardTitle>
                    </div>
                    <CardDescription className="text-accent">
                        Monitor system statistics, recent activity, and manage security settings.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 grid md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <h3 className="text-xl font-headline text-primary border-b-2 border-primary/30 pb-2">System Statistics</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-card rounded-md border border-border">
                                    <div className="flex items-center gap-3">
                                        <Users className="text-primary"/> <span>Total Users</span>
                                    </div>
                                    <span className="font-bold text-lg">{stats.totalUsers}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-card rounded-md border border-border">
                                    <div className="flex items-center gap-3">
                                        <File className="text-primary"/> <span>Total Files</span>
                                    </div>
                                    <span className="font-bold text-lg">{stats.totalFiles}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-card rounded-md border border-border">
                                    <div className="flex items-center gap-3">
                                        <Wifi className="text-primary"/> <span>Active Sessions</span>
                                    </div>
                                    <span className="font-bold text-lg">{stats.activeSessions}</span>
                                </div>
                            </div>
                            <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10 hover:text-primary" onClick={refreshStats}>
                                <RefreshCw className="mr-2 h-4 w-4" /> Refresh Stats
                            </Button>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-xl font-headline text-primary border-b-2 border-primary/30 pb-2">Recent Activity</h3>
                            <div id="activity-log" className="space-y-3">
                                {recentActivity.map((activity, index) => (
                                    <div key={index} className="flex items-center p-3 bg-card rounded-md border border-border text-sm">
                                        {activity.icon}
                                        <span className="ml-3">{activity.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-xl font-headline text-primary border-b-2 border-primary/30 pb-2 flex items-center gap-2"><KeyRound/> Security Settings</h3>
                        <Card className="bg-card/50 border-border">
                            <CardHeader>
                                <CardTitle className="text-lg text-primary">User File Password</CardTitle>
                                <CardDescription>Share this password with users to allow file downloads.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="p-2 rounded-md bg-muted text-muted-foreground text-center font-bold tracking-widest">
                                    {MOCK_PASSWORD}
                                </div>
                                <Button onClick={handleCopyPassword} variant="outline" size="sm" className="w-full text-primary hover:bg-primary/10">
                                    <Copy className="mr-2 h-4 w-4" />
                                    Copy Password
                                </Button>
                            </CardContent>
                        </Card>
                        <Card className="bg-card/50 border-border">
                            <CardHeader>
                                <CardTitle className="text-lg text-primary">Change Admin Secret</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleKeyChange} className="space-y-4">
                                    <div className="space-y-1">
                                        <Label htmlFor="current-secret">Current Secret Key</Label>
                                        <Input id="current-secret" type="password" value={currentSecret} onChange={(e) => setCurrentSecret(e.target.value)} required />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="new-secret">New Secret Key</Label>
                                        <Input id="new-secret" type="password" value={newSecret} onChange={(e) => setNewSecret(e.target.value)} required />
                                    </div>
                                    {status && (
                                        <Alert variant={status.type === 'error' ? 'destructive' : 'default'}
                                            className={`${status.type === 'pending' ? 'bg-accent/10 border-accent text-accent' : ''} ${status.type === 'success' ? 'bg-primary/10 border-primary text-primary' : ''}`}>
                                            {status.type === 'pending' ? <Loader2 className="h-4 w-4 animate-spin" /> : status.type === 'success' ? <ShieldCheck className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                                            <AlertTitle>{status.type.charAt(0).toUpperCase() + status.type.slice(1)}</AlertTitle>
                                            <AlertDescription>{status.message}</AlertDescription>
                                        </Alert>
                                    )}
                                    <Button type="submit" className="w-full" disabled={status?.type === 'pending'}>
                                        {status?.type === 'pending' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
                                        Update Secret Key
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </CardContent>
            </Card>
            <div className="mt-6 flex gap-4">
                <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary/10 hover:text-primary">
                    <Link href="/admin/dashboard">
                        <UploadCloud className="mr-2 h-4 w-4" /> Upload Files
                    </Link>
                </Button>
                 <Button asChild variant="destructive">
                    <Link href="/">
                        <LogOut className="mr-2 h-4 w-4" /> Logout
                    </Link>
                </Button>
            </div>
        </main>
    );
