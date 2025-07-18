
import { UploadForm } from './upload-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCog, UploadCloud, LogOut } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { ShieldAlert } from 'lucide-react';

export default function AdminUploadPage() {
    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground font-code p-4">
            <Card className="w-full max-w-2xl border-primary/50 shadow-lg shadow-primary/20">
                <CardHeader className="text-center">
                     <div className="flex justify-center items-center gap-2 mb-2">
                        <UploadCloud className="w-8 h-8 text-primary" />
                        <CardTitle className="text-3xl font-bold font-headline text-primary">Admin Upload Panel</CardTitle>
                    </div>
                    <CardDescription className="text-accent">
                        Upload encrypted files for verified users.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <UploadForm />
                    <Alert variant="destructive" className="bg-accent/10 border-accent text-accent">
                        <ShieldAlert className="h-4 w-4" />
                        <AlertTitle className="font-headline">Admin Note</AlertTitle>
                        <AlertDescription>
                            All uploaded files will be encrypted and available to verified users.
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
            <div className="mt-6 flex gap-4">
                <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary/10 hover:text-primary">
                    <Link href="/admin/dashboard/manage">
                        <UserCog className="mr-2 h-4 w-4" /> Manage System
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
}
