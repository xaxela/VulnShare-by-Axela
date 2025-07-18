
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';
import { Skull, ShieldAlert, KeyRound, User, UserPlus } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-background text-foreground p-4 font-code overflow-hidden">
       <div className="absolute inset-0 z-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={`led-drop-${i}`}
            className="absolute top-0 h-full w-px"
            style={{
              left: `${Math.random() * 100}%`,
              animation: `fall ${Math.random() * 10 + 5}s linear infinite`,
              animationDelay: `${Math.random() * 10}s`,
            }}
          >
            <div
              className="absolute h-2 w-1 rounded-full"
              style={{
                top: `${Math.random() * -50}%`,
                animation: `flicker-color ${Math.random() * 3 + 1}s infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          </div>
        ))}
      </div>
      <Card className="w-full max-w-2xl border-primary/50 shadow-lg shadow-primary/20 bg-card/80 backdrop-blur-sm z-10">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center gap-4 mb-4">
            <Skull className="w-12 h-12 text-primary" />
            <h1 className="text-5xl font-bold font-headline text-primary" style={{ textShadow: '0 0 10px hsl(var(--primary))' }}>
              VulnShare
            </h1>
            <Skull className="w-12 h-12 text-primary" />
          </div>
          <CardDescription className="text-accent font-bold">
            A Secure File Sharing System
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert variant="destructive" className="bg-accent/10 border-accent text-accent">
            <ShieldAlert className="h-4 w-4" />
            <AlertTitle className="font-headline">WARNING</AlertTitle>
            <AlertDescription>
              This is a secure file sharing system. Unauthorized access is strictly prohibited.
            </AlertDescription>
          </Alert>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button asChild variant="outline" className="h-14 border-primary text-primary hover:bg-primary/10 hover:text-primary font-bold text-lg">
              <Link href="/admin/login">
                <KeyRound className="mr-2 h-5 w-5" /> Admin Login
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-14 border-primary text-primary hover:bg-primary/10 hover:text-primary font-bold text-lg">
              <Link href="/login">
                <User className="mr-2 h-5 w-5" /> User Login
              </Link>
            </Button>
            <Button asChild variant="default" className="md:col-span-2 h-14 bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-lg">
              <Link href="/register">
                <UserPlus className="mr-2 h-5 w-5" /> Register
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
