'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card-enhanced';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Camera, X, RotateCcw, ZoomIn, Download, Edit3 } from 'lucide-react';
import { toast } from 'sonner';

interface RealTimeImageUploaderProps {
  onImageChange: (file: File) => void;
  currentImageUrl?: string;
  aspectRatio?: number;
  maxSize?: number; // in MB
  className?: string;
}

const RealTimeImageUploader: React.FC<RealTimeImageUploaderProps> = ({
  onImageChange,
  currentImageUrl,
  aspectRatio = 1,
  maxSize = 5,
  className = ''
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 100, height: 100 });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (currentImageUrl && !previewUrl) {
      setPreviewUrl(currentImageUrl);
    }
  }, [currentImageUrl, previewUrl]);

  const handleFileChange = (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.match('image/jpeg|image/png|image/jpg|image/webp')) {
      toast.error("Please upload a valid image (JPG, PNG, WEBP)", {
        description: "Invalid file type"
      });
      return;
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`File size exceeds ${maxSize}MB limit`, {
        description: "File too large"
      });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
      setIsEditing(true);
    };
    reader.readAsDataURL(file);

    // Notify parent component
    onImageChange(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileChange(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const resetUploader = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setIsEditing(false);
  };

  const handleCrop = () => {
    // In a real implementation, this would crop the image
    // For now, we'll just finalize the image
    setIsEditing(false);
    toast("Image updated", {
      description: "Your image has been updated successfully!"
    });
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div 
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
          isDragging 
            ? 'border-indigo-500 bg-indigo-500/10' 
            : 'border-white/10 hover:border-indigo-500/50 hover:bg-white/5'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileSelect}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/jpeg,image/png,image/jpg,image/webp"
          className="hidden"
        />
        
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="p-4 bg-indigo-500/10 rounded-2xl">
            <Upload className="w-8 h-8 text-indigo-400" />
          </div>
          
          <div className="space-y-2">
            <p className="font-medium text-white">
              <span className="text-indigo-400">Click to upload</span> or drag and drop
            </p>
            <p className="text-sm text-slate-400">
              PNG, JPG, WEBP (Max {maxSize}MB)
            </p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {previewUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <Card className="overflow-hidden glass border-white/5">
              <CardContent className="p-0">
                <div className="relative group">
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="w-full h-auto max-h-80 object-contain"
                  />
                  
                  {isEditing && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="bg-indigo-600 hover:bg-indigo-500 text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCrop();
                          }}
                        >
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Apply
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="bg-slate-700 hover:bg-slate-600 text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            resetUploader();
                          }}
                        >
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                className="flex-1 border-white/10 hover:bg-white/5 text-slate-300 rounded-xl"
                onClick={triggerFileSelect}
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Change
              </Button>
              
              <Button
                variant="outline"
                className="border-white/10 hover:bg-white/5 text-slate-300 rounded-xl"
                onClick={resetUploader}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RealTimeImageUploader;