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
          <Button className="cursor-pointer py-6 px-5 bg-[#3FA796] text-[#0B1220] hover:bg-[#3FA796]/90">
            <Upload className="mr-2 h-4 w-4" />
            Upload Resume
          </Button>
        }
      />

      <DialogContent className="border-[rgba(246,244,236,0.12)] bg-[#0B1220] text-[#F6F4EC] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle
            className="text-[#F6F4EC]"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            Upload Resume
          </DialogTitle>

          <DialogDescription className="text-[#A8B0C3]">
            Upload a PDF or DOCX resume to your SmartApply account.
          </DialogDescription>
        </DialogHeader>

        <UploadResumeForm onSuccess={handleUploadSuccess} />
      </DialogContent>
    </Dialog>
  );
}
