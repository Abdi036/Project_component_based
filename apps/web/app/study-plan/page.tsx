/* eslint-disable @typescript-eslint/no-explicit-any */
// app/study-plan/page.tsx
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

export default function StudyPlanPage() {
  const router = useRouter();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form State
  const [jobRole, setJobRole] = useState("");
  const [interviewType, setInterviewType] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState(0);
  const [durationValue, setDurationValue] = useState(7);
  const [durationUnit, setDurationUnit] = useState("day");
  const [tools, setTools] = useState("");

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await api.get("/studyplan/mine");
      setPlans(res.data.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load study plans");
    }
  };

  const generatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/studyplan/generate", {
        jobRole,
        interviewType,
        yearsOfExperience,
        duration: { value: durationValue, unit: durationUnit },
        tools: tools.split(",").map((t) => t.trim()),
      });
      toast.success("Study plan generated successfully!");
      router.push(`/study-plan/${res.data.data?._id}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Study Plans</h1>

      <Tabs defaultValue="generate">
        <TabsList className="mb-4">
          <TabsTrigger value="generate">Generate New Plan</TabsTrigger>
          <TabsTrigger value="my-plans">My Plans</TabsTrigger>
        </TabsList>

        <TabsContent value="generate">
          <Card>
            <CardHeader>
              <CardTitle>Create a new Study Plan</CardTitle>
              <CardDescription>
                Enter details to get a personalized interview preparation plan
                from AI.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={generatePlan} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="jobRole">Job Role</Label>
                    <Input
                      id="jobRole"
                      placeholder="e.g. Frontend Developer"
                      value={jobRole}
                      onChange={(e) => setJobRole(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="interviewType">Interview Type</Label>
                    <Input
                      id="interviewType"
                      placeholder="e.g. System Design, Behavioral"
                      value={interviewType}
                      onChange={(e) => setInterviewType(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tools">
                      Tools / Tech Stack (comma separated)
                    </Label>
                    <Input
                      id="tools"
                      placeholder="React, Next.js, TypeScript"
                      value={tools}
                      onChange={(e) => setTools(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="yearsOfExperience">
                      Years of Experience
                    </Label>
                    <Input
                      id="yearsOfExperience"
                      type="number"
                      min="0"
                      value={yearsOfExperience}
                      onChange={(e) =>
                        setYearsOfExperience(Number(e.target.value))
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="durationValue">Duration Length</Label>
                    <Input
                      id="durationValue"
                      type="number"
                      min="1"
                      value={durationValue}
                      onChange={(e) => setDurationValue(Number(e.target.value))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="durationUnit">Duration Unit</Label>
                    <select
                      id="durationUnit"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={durationUnit}
                      onChange={(e) => setDurationUnit(e.target.value)}
                    >
                      <option value="day">Days</option>
                      <option value="week">Weeks</option>
                    </select>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {loading
                    ? "Generating Plan (This might take a while)..."
                    : "Generate Plan"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="my-plans">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {plans.map((plan: any) => (
              <Card
                key={plan._id}
                className="cursor-pointer hover:shadow-md transition"
                onClick={() => router.push(`/study-plan/${plan._id}`)}
              >
                <CardHeader>
                  <CardTitle>{plan.inputs?.jobRole || "Custom Plan"}</CardTitle>
                  <CardDescription>
                    {plan.inputs?.interviewType} ({plan.inputs?.experienceLevel}
                    )
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    Duration: {plan.inputs?.duration?.value}{" "}
                    {plan.inputs?.duration?.unit}(s)
                  </p>
                  <p className="text-sm text-gray-500 line-clamp-2 mt-2">
                    Tools: {plan.inputs?.tools?.join(", ")}
                  </p>
                </CardContent>
              </Card>
            ))}
            {plans.length === 0 && (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                No study plans found. Generate one to get started!
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
