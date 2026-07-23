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

  const inputClass =
    "border-[rgba(246,244,236,0.15)] bg-[rgba(246,244,236,0.05)] text-[#F6F4EC] placeholder:text-[#A8B0C3]/60 focus-visible:ring-[#3FA796] focus-visible:border-[#3FA796]";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-[#F6F4EC]">
          Resume Title
        </Label>

        <Input
          id="title"
          placeholder="Software Engineer Resume"
          disabled={isUploading}
          className={inputClass}
          {...register("title")}
        />

        {errors.title && (
          <p className="text-sm text-red-400">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-[#F6F4EC]">Resume File</Label>

        <div className="rounded-lg border-2 border-dashed border-[rgba(246,244,236,0.15)] bg-[rgba(246,244,236,0.02)] p-8 text-center">
          <FileText className="mx-auto mb-4 h-10 w-10 text-[#A8B0C3]/60" />

          {file ? (
            <>
              <p className="font-medium text-[#F6F4EC]">{file.name}</p>

              <p className="mt-1 text-sm text-[#A8B0C3]">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>

              <p
                className={`mt-2 text-sm font-medium ${
                  isUploading ? "text-[#F3C77E]" : "text-[#3FA796]"
                }`}
              >
                {isUploading
                  ? "⏳ Uploading and analyzing..."
                  : "✓ Ready to upload"}
              </p>
            </>
          ) : (
            <>
              <p className="font-medium text-[#F6F4EC]">Choose your resume</p>

              <p className="mt-1 text-sm text-[#A8B0C3]">
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
            disabled={isUploading}
          />

          <Button
            type="button"
            variant="outline"
            className="cursor-pointer mt-6 border-[rgba(246,244,236,0.2)] bg-transparent text-[#F6F4EC] hover:bg-[rgba(246,244,236,0.08)] hover:text-[#F6F4EC]"
            disabled={isUploading}
            onClick={handleChooseFile}
          >
            <Upload className="mr-2 h-4 w-4" />
            Choose File
          </Button>
        </div>
      </div>

      <Button
        className="cursor-pointer w-full bg-[#3FA796] text-[#0B1220] hover:bg-[#3FA796]/90 disabled:opacity-60"
        type="submit"
        disabled={isUploading}
      >
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading and analyzing your resume...
          </>
        ) : (
          "Upload Resume"
        )}
      </Button>

      {isUploading && (
        <p className="text-center text-sm text-[#A8B0C3]">
          This usually takes 5–15 seconds. Please don&apos;t close this page.
        </p>
      )}
    </form>
  );
}
