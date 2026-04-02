/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Loader2,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function InterviewDisplayPage() {
  const { id } = useParams();
  const router = useRouter();
  const [interview, setInterview] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/interview/${id}`);
        setInterview(res.data.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load interview details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchInterview();
    }
  }, [id]);

  const handleNext = () => {
    if (currentQuestionIndex < interview.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setShowAnswer(false);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setShowAnswer(false);
    }
  };

  const deleteInterview = async () => {
    if (!confirm("Are you sure you want to delete this interview?")) return;
    try {
      await api.delete(`/interview/${id}`);
      toast.success("Interview deleted");
      router.push("/interview");
    } catch (error) {
      toast.error("Failed to delete interview");
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h2 className="text-2xl font-bold">Interview Not Found</h2>
        <Button onClick={() => router.push("/interview")} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  const currentQuestion = interview.questions[currentQuestionIndex];

  return (
    <div className="container mx-auto p-4 max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push("/interview")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{interview.role} Interview</h1>
            <p className="text-muted-foreground">
              {interview.experienceLevel} Level • {interview.questions.length}{" "}
              Questions
            </p>
          </div>
        </div>
        <Button variant={"destructive"} onClick={deleteInterview}>
          Delete
        </Button>
      </div>

      <Card className="min-h-[400px] flex flex-col">
        <CardHeader className="bg-muted/50 border-b">
          <div className="flex justify-between items-center">
            <CardTitle>
              Question {currentQuestionIndex + 1} of{" "}
              {interview.questions.length}
            </CardTitle>
            <div className="flex gap-2">
              <Badge variant="outline">
                {currentQuestion.topic || "General"}
              </Badge>
              {currentQuestion.difficulty && (
                <Badge>{currentQuestion.difficulty}</Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-6 flex flex-col justify-between space-y-8">
          <div className="space-y-6">
            <h2 className="text-xl font-semibold leading-relaxed">
              {currentQuestion.questionText}
            </h2>

            {showAnswer ? (
              <div className="bg-muted p-4 rounded-md mt-4 whitespace-pre-wrap">
                <h3 className="font-semibold mb-2">
                  Suggested Answer/Approach:
                </h3>
                <p className="text-muted-foreground">
                  {currentQuestion.suggestedAnswer}
                </p>
              </div>
            ) : (
              <div className="flex justify-center py-10">
                <Button
                  variant="outline"
                  onClick={() => setShowAnswer(true)}
                  className="gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Reveal Answer
                </Button>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center pt-8 border-t mt-auto">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={currentQuestionIndex === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              {currentQuestionIndex + 1} / {interview.questions.length}
            </span>
            <Button
              variant="outline"
              onClick={handleNext}
              disabled={currentQuestionIndex === interview.questions.length - 1}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
