/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/study-plan/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowLeft, Loader2, Trash } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function StudyPlanDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchPlan();
    }
  }, [id]);

  const fetchPlan = async () => {
    try {
      const res = await api.get(`/studyplan/${id}`);
      setPlan(res.data.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch plan details");
      router.push("/study-plan");
    } finally {
      setLoading(false);
    }
  };

  const deletePlan = async () => {
    if (!confirm("Are you sure you want to delete this plan?")) return;
    try {
      await api.delete(`/studyplan/${id}`);
      toast.success("Plan deleted successfully");
      router.push("/study-plan");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete plan");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!plan) return <div className="text-center p-8">Plan not found</div>;

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={() => router.push("/study-plan")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Plans
        </Button>
        <Button variant="destructive" onClick={deletePlan}>
          <Trash className="h-4 w-4 mr-2" />
          Delete Plan
        </Button>
      </div>

      <Card className="mb-8 bg-card border shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="text-3xl font-bold">
                {plan.inputs?.jobRole || "Custom"} Interview Prep
              </CardTitle>
              <div className="flex gap-2 mt-4 flex-wrap">
                <Badge variant="secondary">{plan.inputs?.interviewType}</Badge>
                <Badge variant="secondary">
                  {plan.inputs?.experienceLevel ||
                    `${plan.inputs?.yearsOfExperience} yrs exp`}
                </Badge>
                <Badge variant="secondary">
                  {plan.inputs?.duration?.value} {plan.inputs?.duration?.unit}
                  (s)
                </Badge>
              </div>
            </div>
            <div className="text-sm text-muted-foreground flex flex-col gap-1 items-end">
              <span>
                Created: {new Date(plan.createdAt).toLocaleDateString()}
              </span>
              <span>For: {plan.inputs?.tools?.join(", ")}</span>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="prose prose-invert max-w-none">
        <Card>
          <CardContent className="pt-6 whitespace-pre-wrap">
            {plan.planContent}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
