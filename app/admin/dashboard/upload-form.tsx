
'use client';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { generateFileDescription, type GenerateFileDescriptionOutput } from '@/ai/flows/generate-file-description';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Upload, FileText, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { addFile } from '@/lib/file-store';

export function UploadForm() {
    const [file, setFile] = useState<File | null>(null);
    const [description, setDescription] = useState<GenerateFileDescriptionOutput | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [status, setStatus] = useState<{ type: 'error' | 'success'; message: string } | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        setFile(selectedFile || null);
        setDescription(null);
        setStatus(null);
        if (selectedFile) {
            handleGenerateDescription(selectedFile);
        }
    };

    const handleGenerateDescription = async (selectedFile: File) => {
        setIsGenerating(true);
        setStatus(null);
        try {
            const fileType = selectedFile.name.split('.').pop() || 'unknown';
            // We don't pass fileContentSummary anymore, the AI will generate from name and type.
            const result = await generateFileDescription({
                fileName: selectedFile.name,
                fileType: fileType,
            });
            setDescription(result);
        } catch (err) {
            setStatus({ type: 'error', message: 'Failed to generate AI description.' });
            console.error(err);
        } finally {
            setIsGenerating(false);
        }
    };
    
    const handleUpload = () => {
        if (!file || !description) {
            setStatus({ type: 'error', message: 'Please select a file and wait for the description to be generated.' });
            return;
        }
        setIsUploading(true);
        setStatus(null);
        setTimeout(() => {
            // Add the file to our in-memory store
            addFile({ name: file.name, description: description.description });

            setIsUploading(false);
            setStatus({ type: 'success', message: `File '${file.name}' uploaded successfully!` });
            setFile(null);
            setDescription(null);
            // Reset file input
            const fileInput = document.getElementById('file-input') as HTMLInputElement;
            if(fileInput) fileInput.value = '';

        }, 1500);
    }

    const getStatusIcon = (type: 'error' | 'success') => {
        return type === 'success' ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />;
    }

    return (
        <div className="space-y-6">
            <div className="border-2 border-dashed border-primary/50 p-6 rounded-lg text-center space-y-4">
                <h3 className="text-xl font-headline text-primary">Select File to Upload</h3>
                <Input
                    id="file-input"
                    type="file"
                    onChange={handleFileChange}
                    disabled={isGenerating || isUploading}
                    className="text-foreground file:text-primary file:font-bold file:border-0 file:bg-primary/10 file:rounded-md file:px-2 file:py-1 hover:file:bg-primary/20 cursor-pointer"
                />
            </div>

            {isGenerating && (
                <div className="flex items-center justify-center space-x-2 text-primary">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Generating AI description...</span>
                </div>
            )}

            {status && (
                <Alert variant={status.type === 'error' ? 'destructive' : 'default'}
                       className={status.type === 'success' ? 'bg-primary/10 border-primary text-primary' : ''}>
                    {getStatusIcon(status.type)}
                    <AlertTitle>{status.type.toUpperCase()}</AlertTitle>
                    <AlertDescription>{status.message}</AlertDescription>
                </Alert>
            )}

            {description && !status?.type && (
                <Card className="bg-background/50 border-primary/30 animate-in fade-in-50">
                    <CardHeader>
                        <CardTitle className="text-primary flex items-center gap-2 font-headline">
                           <FileText /> AI Generated Description
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-foreground">{description.description}</p>
                    </CardContent>
                </Card>
            )}

            <Button onClick={handleUpload} disabled={!file || isGenerating || isUploading || !description} className="w-full">
                {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                {isUploading ? 'Uploading...' : 'Upload Selected File'}
            </Button>
        </div>
    );
}
