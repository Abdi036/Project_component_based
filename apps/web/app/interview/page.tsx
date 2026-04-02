/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

export default function InterviewPage() {
  const router = useRouter();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form State
  const [role, setRole] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("Intermediate");
  const [amountOfQuestions, setAmountOfQuestions] = useState(5);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const res = await api.get("/interview/mine");
      setInterviews(res.data.data || []);
    } catch (error: any) {
      console.error(error);
      toast.error("Failed to load interviews");
    }
  };

  const generateInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/interview/generate", {
        role,
        experienceLevel,
        amountOfQuestions: Number(amountOfQuestions),
      });
      toast.success("Interview questions generated successfully!");
      router.push(`/interview/${res.data.data?._id}`);
    } catch (error: any) {
      console.error(error);
      toast.error(
        error.response?.data?.error || "Failed to generate interview",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Mock Interviews</h1>

      <Tabs defaultValue="generate">
        <TabsList className="mb-4">
          <TabsTrigger value="generate">Generate Interview</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="generate">
          <Card>
            <CardHeader>
              <CardTitle>Create a New Interview</CardTitle>
              <CardDescription>
                Enter details to get AI-generated mock interview questions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={generateInterview} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">Job Role</Label>
                    <Input
                      id="role"
                      placeholder="e.g. Frontend Developer"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experienceLevel">Experience Level</Label>
                    <Input
                      id="experienceLevel"
                      placeholder="e.g. Beginner, Intermediate, Advanced, Expert"
                      value={experienceLevel}
                      onChange={(e) => setExperienceLevel(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amountOfQuestions">
                      Number of Questions
                    </Label>
                    <Input
                      id="amountOfQuestions"
                      type="number"
                      min="1"
                      max="15"
                      value={amountOfQuestions}
                      onChange={(e) =>
                        setAmountOfQuestions(Number(e.target.value))
                      }
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-4"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate Questions"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Your Past Interviews</CardTitle>
              <CardDescription>
                View and practice past interviews
              </CardDescription>
            </CardHeader>
            <CardContent>
              {interviews.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No interviews found. Generate one first!
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {interviews.map((interview: any) => (
                    <Card
                      key={interview._id}
                      className="cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
                      onClick={() => router.push(`/interview/${interview._id}`)}
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">
                          {interview.role}
                        </CardTitle>
                        <CardDescription>
                          {interview.experienceLevel} •{" "}
                          {interview.amountOfQuestions} questions
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="text-sm text-muted-foreground">
                        Generated on{" "}
                        {new Date(interview.createdAt).toLocaleDateString()}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
