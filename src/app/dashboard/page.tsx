
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { FolderKanban, FileText, Download, Mail, LogOut, CheckCircle, FolderX, FileArchive, FilePieChart, KeyRound, MessageSquare, LifeBuoy, Bot } from 'lucide-react';
import { useState, useEffect } from 'react';
import { fetchFiles, type StoredFile } from '@/lib/client-file-store';

const iconMap: { [key: string]: React.ReactNode } = {
    txt: <FileText className="h-5 w-5 mr-3 text-primary" />,
    zip: <FileArchive className="h-5 w-5 mr-3 text-primary" />,
    pdf: <FilePieChart className="h-5 w-5 mr-3 text-primary" />,
    default: <FileText className="h-5 w-5 mr-3 text-primary" />,
};

const getFileIcon = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase() || 'default';
    return iconMap[extension] || iconMap.default;
};

const MOCK_PASSWORD = "SECURE_PASSWORD";

export default function UserHomePage() {
    const [files, setFiles] = useState<StoredFile[]>([]);
    const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<StoredFile | null>(null);
    const [password, setPassword] = useState('');
    const { toast } = useToast();
    
    useEffect(() => {
        const fetchFilesFromApi = async () => {
            try {
                const files = await fetchFiles();
                setFiles(files);
            } catch (error) {
                console.error('Failed to fetch files:', error);
            }
        };
        fetchFilesFromApi(); // Initial fetch

        const interval = setInterval(fetchFilesFromApi, 2000); // Poll for new files every 2 seconds

        return () => clearInterval(interval); // Cleanup on component unmount
    }, []);
    
    const handleDownloadClick = (file: StoredFile) => {
        setSelectedFile(file);
        setIsPasswordDialogOpen(true);
    };

    const handlePasswordSubmit = () => {
        if (!selectedFile) return;

        if (password === MOCK_PASSWORD) {
            // Simulate file download
            const fileContent = `This is a mock file for: ${selectedFile.name}\n\nDescription: ${selectedFile.description}`;
            const blob = new Blob([fileContent], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = selectedFile.name;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            toast({
                title: 'Download Started',
                description: `Downloading ${selectedFile.name}`,
                className: 'bg-primary/10 border-primary text-primary',
            });
        } else {
             toast({
                variant: 'destructive',
                title: 'Access Denied',
                description: 'Incorrect password provided.',
            });
        }
        // Reset state
        setIsPasswordDialogOpen(false);
        setPassword('');
        setSelectedFile(null);
    };

    return (
        <main className="flex items-center justify-center min-h-screen bg-background text-foreground font-code p-4">
            <Card className="w-full max-w-3xl border-primary/50 shadow-lg shadow-primary/20">
                <CardHeader className="text-center">
                    <div className="flex justify-center items-center gap-2 mb-2">
                        <FolderKanban className="w-8 h-8 text-primary" />
                        <CardTitle className="text-3xl font-bold font-headline text-primary">User Dashboard</CardTitle>
                    </div>
                    <CardDescription className="text-accent">
                        Your personal secure file repository and communication hub.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Alert className="bg-primary/10 border-primary text-primary">
                        <CheckCircle className="h-4 w-4" />
                        <AlertTitle className="font-headline">Welcome!</AlertTitle>
                        <AlertDescription>
                            You have access to the encrypted files and communication channels below.
                        </AlertDescription>
                    </Alert>
                    
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-primary text-xl">Encrypted Files</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div id="files-list" className="space-y-3 min-h-[150px] flex flex-col">
                                {files.length > 0 ? (
                                    files.map((file) => (
                                        <div key={file.name} className="flex items-center justify-between bg-card p-3 rounded-md border border-border hover:border-primary/50 transition-colors">
                                            <div className="flex items-center">
                                                {getFileIcon(file.name)}
                                                <div>
                                                    <p className="font-bold text-primary">{file.name}</p>
                                                    <p className="text-sm text-muted-foreground">{file.description}</p>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="icon" onClick={() => handleDownloadClick(file)}>
                                                <Download className="h-5 w-5 text-primary" />
                                            </Button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground p-4 border-2 border-dashed border-border rounded-md">
                                        <FolderX className="w-12 h-12 mb-2" />
                                        <h3 className="text-lg font-headline text-primary">No Files Uploaded</h3>
                                        <p className="text-sm">An administrator has not uploaded any files yet.</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>


                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
                        <Button asChild>
                             <Link href="/dashboard/chat">
                                <MessageSquare /> User Chat
                             </Link>
                        </Button>
                        <Button asChild>
                            <Link href="/dashboard/support">
                                <LifeBuoy /> Support Chat
                            </Link>
                        </Button>
                        <Button disabled>
                           <Bot /> AI Assistant (Soon)
                        </Button>
                        <Button asChild variant="outline" className="text-primary border-primary">
                            <Link href="/dashboard/request-access">
                                <Mail /> Request File Access
                            </Link>
                        </Button>
                         <Button asChild variant="destructive" className="lg:col-span-2">
                            <Link href="/">
                                <LogOut/> Logout
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
            <AlertDialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                           <KeyRound className="text-primary"/> Enter Password to Download
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            To download the file "{selectedFile?.name}", please enter the password provided by the administrator.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="py-2">
                        <Input 
                            type="password" 
                            placeholder="•••••••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                        />
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handlePasswordSubmit}>Download</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </main>
    );
}
