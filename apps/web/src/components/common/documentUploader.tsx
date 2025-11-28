"use client";

import axios from "axios";
import React, { useCallback } from "react";
import { Upload, FileText, X, CheckCircle, AlertCircle } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { useState } from "../../hooks";

const SUPPORTED_FORMATS = {
  "application/pdf": { extension: ".pdf", label: "PDF" },
};

const acceptedFormats = Object.keys(SUPPORTED_FORMATS).join(",");

interface UploadFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
  status: "uploading" | "success" | "error";
  progress?: number; // 0 - 100
  file?: File;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

type DocumentUploaderProps = {
  title: string;
  subtitle?: string;
};

export function DocumentUploader({
  title,
  subtitle = "Upload your documents",
}: DocumentUploaderProps) {
  const files = useState<UploadFile[]>([]);
  const isDragging = useState(false);

  const uploadFileToServer = useCallback(
    async (file: File, id: string) => {
      const fd = new FormData();
      fd.append("file", file);

      try {
        files.setValue((prev) =>
          prev.map((f) =>
            f.id === id ? { ...f, status: "uploading", progress: 0 } : f,
          ),
        );

        const res = await axios.post("/api/upload", fd, {
          onUploadProgress: (progressEvent) => {
            if (!progressEvent.total) return;
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            files.setValue((prev) =>
              prev.map((f) => (f.id === id ? { ...f, progress: percent } : f)),
            );
          },
          timeout: 30_000,
        });

        if (res.status >= 200 && res.status < 300) {
          files.setValue((prev) =>
            prev.map((f) =>
              f.id === id ? { ...f, status: "success", progress: 100 } : f,
            ),
          );
        } else {
          files.setValue((prev) =>
            prev.map((f) => (f.id === id ? { ...f, status: "error" } : f)),
          );
        }
      } catch (err) {
        console.error("Upload error", err);
        files.setValue((prev) =>
          prev.map((f) => (f.id === id ? { ...f, status: "error" } : f)),
        );
      }
    },
    [files],
  );

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList) return;

      const validFiles: UploadFile[] = [];
      const toUpload: { file: File; id: string }[] = [];

      for (const file of Array.from(fileList)) {
        if (
          !Object.prototype.hasOwnProperty.call(SUPPORTED_FORMATS, file.type)
        ) {
          continue;
        }
        const id = uuidv4();
        validFiles.push({
          id,
          name: file.name,
          size: file.size,
          type: file.type,
          uploadedAt: new Date(),
          status: "uploading",
          progress: 0,
          file,
        });
        toUpload.push({ file, id });
      }

      if (validFiles.length === 0) return;
      files.setValue((prev) => [...prev, ...validFiles]);

      toUpload.forEach(({ file, id }) => {
        void uploadFileToServer(file, id);
      });
    },
    [files, uploadFileToServer],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      isDragging.setValue(false);
      handleFiles(e.dataTransfer.files);
    },
    [isDragging, handleFiles],
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      isDragging.setValue(true);
    },
    [isDragging],
  );

  const handleDragLeave = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      isDragging.setValue(false);
    },
    [isDragging],
  );

  const removeFile = (id: string) => {
    files.setValue((prev) => prev.filter((file) => file.id !== id));
  };

  const retryUpload = (id: string) => {
    const target = files.value.find((f) => f.id === id);
    if (!target || !target.file) return;
    files.setValue((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, status: "uploading", progress: 0 } : f,
      ),
    );
    void uploadFileToServer(target.file, id);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-foreground mb-2">{title}</h2>
        <p className="text-muted-foreground">{subtitle}</p>
      </div>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
            border-2 border-dashed rounded-lg p-12 text-center transition-all
            ${isDragging.value ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/50 hover:bg-card/50"}
          `}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 rounded-full bg-primary/10">
            <Upload className="w-8 h-8 text-primary" />
          </div>

          <div>
            <label htmlFor="file-upload" className="cursor-pointer">
              <span className="text-primary font-medium hover:underline">
                Click to upload
              </span>
              <span className="text-muted-foreground"> or drag and drop</span>
            </label>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              accept={acceptedFormats}
              // multiple
              onChange={(e) => handleFiles(e.target.files)}
            />
          </div>

          <p className="text-sm text-muted-foreground">
            Supported formats:{" "}
            {Object.values(SUPPORTED_FORMATS)
              .map((f) => f.label)
              .join(", ")}
          </p>
        </div>
      </div>

      {files.value.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-medium text-foreground mb-4">
            Uploaded Documents ({files.value.length})
          </h3>

          <div className="space-y-3">
            {files.value.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-4 p-4 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors"
              >
                <div className="p-2 rounded bg-primary/10">
                  <FileText className="w-5 h-5 text-primary" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)} •{" "}
                    {file.uploadedAt.toLocaleDateString()}
                  </p>

                  {/* Progress bar */}
                  {file.status === "uploading" && (
                    <div className="mt-2 h-2 w-full bg-gray-200 rounded overflow-hidden">
                      <div
                        className="h-full rounded bg-primary transition-all"
                        style={{ width: `${file.progress ?? 0}%` }}
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {file.status === "uploading" && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                      <span className="text-xs">Uploading...</span>
                    </div>
                  )}

                  {file.status === "success" && (
                    <div className="flex items-center gap-2 text-green-500">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-xs">Complete</span>
                    </div>
                  )}

                  {file.status === "error" && (
                    <div className="flex items-center gap-2 text-red-500">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-xs">Failed</span>
                    </div>
                  )}

                  {file.status === "error" && (
                    <button
                      onClick={() => retryUpload(file.id)}
                      className="px-2 py-1 rounded bg-primary/10 text-primary text-xs hover:bg-primary/20 transition-colors mr-2"
                    >
                      Retry
                    </button>
                  )}

                  <button
                    onClick={() => removeFile(file.id)}
                    className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                    aria-label="Remove file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
