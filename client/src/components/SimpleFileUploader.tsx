import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface SimpleFileUploaderProps {
  maxFiles?: number;
  maxFileSize?: number;
  onUploadComplete?: (urls: string[]) => void;
  variant?: "default" | "outline" | "ghost" | "destructive" | "secondary" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  testId?: string;
  children?: React.ReactNode;
  className?: string;
}

export function SimpleFileUploader({
  maxFiles = 5,
  maxFileSize = 10485760, // 10MB
  onUploadComplete,
  variant = "outline",
  size = "sm",
  testId,
  children,
  className,
}: SimpleFileUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length === 0) return;
    
    if (files.length > maxFiles) {
      toast({
        title: "Too many files",
        description: `Maximum ${maxFiles} files allowed`,
        variant: "destructive",
      });
      return;
    }
    
    const oversizedFiles = files.filter(f => f.size > maxFileSize);
    if (oversizedFiles.length > 0) {
      toast({
        title: "File too large",
        description: `Maximum file size is ${(maxFileSize / 1048576).toFixed(0)}MB`,
        variant: "destructive",
      });
      return;
    }
    
    setUploading(true);
    
    try {
      const uploadedUrls: string[] = [];
      
      for (const file of files) {
        // Get presigned URL
        const urlResponse = await fetch('/api/objects/upload', {
          method: 'POST',
        });
        const { uploadURL } = await urlResponse.json();
        
        // Upload file
        await fetch(uploadURL, {
          method: 'PUT',
          body: file,
          headers: {
            'Content-Type': file.type || 'application/octet-stream',
          },
        });
        
        uploadedUrls.push(uploadURL);
      }
      
      onUploadComplete?.(uploadedUrls);
      
      toast({
        title: "Upload complete",
        description: `${files.length} file(s) uploaded successfully`,
      });
      
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload files. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        multiple={maxFiles > 1}
        onChange={handleFileSelect}
        className="hidden"
        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.fig"
      />
      <Button
        onClick={() => fileInputRef.current?.click()}
        variant={variant}
        size={size}
        data-testid={testId}
        type="button"
        disabled={uploading}
        className={className}
      >
        {uploading ? "Uploading..." : children}
      </Button>
    </>
  );
}
