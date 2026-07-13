"use client";

import { useState } from "react";
import { Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UploadResumeForm } from "./upload-resume-form";

export function UploadResumeDialog() {
  const [open, setOpen] = useState(false);

  function handleUploadSuccess() {
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Upload Resume
          </Button>
        }
      />

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload Resume</DialogTitle>

          <DialogDescription>
            Upload a PDF or DOCX resume to your SmartApply account.
          </DialogDescription>
        </DialogHeader>

        <UploadResumeForm onSuccess={handleUploadSuccess} />
      </DialogContent>
    </Dialog>
  );
}
