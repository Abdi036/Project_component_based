"use client";

import { useAuth } from "@/context/auth-context";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back, {user.name}! Let's prep for your next interview.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">0</div>
            <p className="text-xs text-muted-foreground mb-4">
              Active learning paths
            </p>
            <Button asChild className="w-full">
              <Link href="/study-plan">View Study Plans</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mock Interviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">0</div>
            <p className="text-xs text-muted-foreground mb-4">
              Completed sessions
            </p>
            <Button asChild className="w-full" variant="outline">
              <Link href="/interview">Generate Questions</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">Just Started</div>
            <p className="text-xs text-muted-foreground mb-4">
              Complete more sessions to see stats
            </p>
            <Button asChild className="w-full" variant="secondary">
              <Link href="/profile">View Profile</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
