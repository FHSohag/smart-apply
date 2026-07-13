"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FileText, Loader2, Upload } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  uploadResumeSchema,
  type UploadResumeInput,
} from "@/lib/validations/resume";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UploadResumeFormProps {
  onSuccess?: () => void;
}

export function UploadResumeForm({ onSuccess }: UploadResumeFormProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UploadResumeInput>({
    resolver: zodResolver(uploadResumeSchema),
    defaultValues: {
      title: "",
    },
  });

  function handleChooseFile() {
    if (isUploading) return;
    inputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];

    if (!selected) return;

    setFile(selected);
  }

  async function onSubmit(data: UploadResumeInput) {
    if (!file) {
      toast.error("Please select a resume.");
      return;
    }

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("file", file);

    try {
      setIsUploading(true);

      const response = await fetch("/api/resumes", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      toast.success("Resume uploaded successfully!");

      reset();
      setFile(null);

      if (inputRef.current) {
        inputRef.current.value = "";
      }

      router.refresh();

      onSuccess?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Resume Title</Label>

        <Input
          id="title"
          placeholder="Software Engineer Resume"
          disabled={isUploading}
          {...register("title")}
        />

        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Resume File</Label>

        <div className="rounded-lg border-2 border-dashed p-8 text-center">
          <FileText className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />

          {file ? (
            <>
              <p className="font-medium">{file.name}</p>

              <p className="mt-1 text-sm text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>

              <p className="mt-2 text-sm font-medium text-green-600">
                ✓ Ready to upload
              </p>
            </>
          ) : (
            <>
              <p className="font-medium">Choose your resume</p>

              <p className="mt-1 text-sm text-muted-foreground">
                PDF or DOCX • Maximum 10MB
              </p>
            </>
          )}

          <input
            ref={inputRef}
            hidden
            type="file"
            accept=".pdf,.docx"
            onChange={handleFileChange}
          />

          <Button
            type="button"
            variant="outline"
            className="mt-6"
            disabled={isUploading}
            onClick={handleChooseFile}
          >
            <Upload className="mr-2 h-4 w-4" />
            Choose File
          </Button>
        </div>
      </div>

      <Button className="w-full" type="submit" disabled={isUploading}>
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          "Upload Resume"
        )}
      </Button>
    </form>
  );
}
