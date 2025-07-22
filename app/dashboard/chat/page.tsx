
'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, MessageSquare, Paperclip, Send, CornerDownLeft, X } from 'lucide-react';
import Link from 'next/link';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getMessages, addMessage, type Message } from '@/lib/chat-store';

export default function UserChatPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [attachedFile, setAttachedFile] = useState<File | null>(null);
    const [replyingTo, setReplyingTo] = useState<Message | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMessages(getMessages());

        const interval = setInterval(() => {
            setMessages(getMessages());
        }, 1000); // Poll for new messages every second

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (scrollAreaRef.current) {
            const scrollableView = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
            if (scrollableView) {
                scrollableView.scrollTop = scrollableView.scrollHeight;
            }
        }
    }, [messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() === '' && !attachedFile) return;

        const newMsg: Omit<Message, 'id' | 'time'> = {
            user: 'You',
            avatar: 'You',
            text: newMessage,
            sent: true,
            ...(attachedFile && { file: { name: attachedFile.name, size: `${(attachedFile.size / 1024).toFixed(2)} KB` } }),
            ...(replyingTo && { replyTo: replyingTo }),
        };

        addMessage(newMsg);
        setMessages(getMessages());

        setNewMessage('');
        setAttachedFile(null);
        setReplyingTo(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAttachedFile(file);
        }
    };

    const handleReply = (message: Message) => {
        setReplyingTo(message);
    }

    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground font-code p-4">
            <Card className="w-full max-w-3xl border-primary/50 shadow-lg shadow-primary/20 flex flex-col h-[90vh] md:h-[80vh]">
                <CardHeader className="text-center border-b border-border">
                     <div className="flex justify-center items-center gap-2 mb-2">
                        <MessageSquare className="w-8 h-8 text-primary" />
                        <CardTitle className="text-3xl font-bold font-headline text-primary">Secure Chat</CardTitle>
                    </div>
                    <CardDescription className="text-accent">
                        Communicate and share files securely with other users.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col p-0">
                   <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
                        <div className="space-y-6">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`group flex items-end gap-3 animate-in fade-in slide-in-from-bottom-4 ${msg.sent ? 'justify-end' : 'justify-start'}`}>
                                     {!msg.sent && (
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback className="bg-muted text-muted-foreground">{msg.avatar}</AvatarFallback>
                                        </Avatar>
                                    )}
                                    <div className={`relative max-w-xs md:max-w-md p-3 rounded-lg ${msg.sent ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                                        {msg.replyTo && (
                                            <div className="p-2 text-xs rounded-md bg-black/10 mb-2 opacity-80">
                                                <p className="font-bold">{msg.replyTo.user}</p>
                                                <p className="truncate">{msg.replyTo.text}</p>
                                            </div>
                                        )}
                                        <p className="text-sm">{msg.text}</p>
                                        {msg.file && (
                                             <div className="mt-2 p-2 bg-background/20 rounded-md text-xs flex items-center gap-2">
                                                <Paperclip className="h-4 w-4"/>
                                                <div>
                                                    <p className="font-bold">{msg.file.name}</p>
                                                    <p>{msg.file.size}</p>
                                                </div>
                                            </div>
                                        )}
                                        <p className={`text-xs mt-1 ${msg.sent ? 'text-primary-foreground/70' : 'text-muted-foreground/70'} ${msg.sent ? 'text-right' : 'text-left'}`}>{msg.time}</p>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className={`absolute top-0 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${msg.sent ? '-left-8' : '-right-8'}`}
                                            onClick={() => handleReply(msg)}
                                        >
                                            <CornerDownLeft className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    {msg.sent && (
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback className="bg-primary/50 text-primary-foreground">{msg.avatar}</AvatarFallback>
                                        </Avatar>
                                    )}
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                     <div className="p-4 border-t border-border bg-background/50">
                        {replyingTo && (
                            <div className="flex items-center justify-between text-xs p-2 mb-2 rounded-md bg-muted text-muted-foreground animate-in fade-in">
                                <div>
                                    <p>Replying to <span className="font-bold">{replyingTo.user}</span></p>
                                    <p className="truncate">{replyingTo.text}</p>
                                </div>
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setReplyingTo(null)}>
                                    <X className="h-4 w-4"/>
                                </Button>
                            </div>
                        )}
                         {attachedFile && (
                            <div className="flex items-center justify-between text-xs p-2 mb-2 rounded-md bg-muted text-muted-foreground animate-in fade-in">
                                <div className="flex items-center gap-2">
                                     <Paperclip className="h-4 w-4"/>
                                    <p>Attached: <span className="font-bold">{attachedFile.name}</span></p>
                                </div>
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => {setAttachedFile(null); if(fileInputRef.current) fileInputRef.current.value = '';}}>
                                    <X className="h-4 w-4"/>
                                </Button>
                            </div>
                        )}
                        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                             <Button type="button" variant="ghost" size="icon" className="text-primary hover:bg-primary/10" onClick={() => fileInputRef.current?.click()}>
                                <Paperclip className="h-5 w-5" />
                                <span className="sr-only">Attach file</span>
                            </Button>
                            <Input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <Input
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 bg-background"
                            />
                            <Button type="submit" size="icon" disabled={newMessage.trim() === '' && !attachedFile}>
                                <Send className="h-5 w-5" />
                                <span className="sr-only">Send</span>
                            </Button>
                        </form>
                    </div>
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
