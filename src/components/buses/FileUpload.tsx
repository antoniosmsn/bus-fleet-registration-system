
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { X } from 'lucide-react';

interface FileUploadProps {
  label: string;
  acceptTypes: string;
  id: string;
  required?: boolean;
  multiple?: boolean;
  onChange: (files: File[]) => void;
  helperText?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  label,
  acceptTypes,
  id,
  required = false,
  multiple = false,
  onChange,
  helperText,
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    const selectedFiles = Array.from(e.target.files);
    const validFiles = selectedFiles.filter(file => {
      const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
      const validExtensions = acceptTypes.split(',').map(type => 
        type.trim().replace('.', '').toLowerCase()
      );
      
      if (!validExtensions.includes(fileExtension)) {
        toast({
          title: "Invalid file type",
          description: `File "${file.name}" is not a valid type. Accepted types: ${acceptTypes}`,
          variant: "destructive"
        });
        return false;
      }
      return true;
    });

    if (validFiles.length) {
      const newFiles = multiple ? [...files, ...validFiles] : validFiles;
      setFiles(newFiles);
      onChange(newFiles);
      
      // Generate previews for image files
      const newPreviews = newFiles.map(file => {
        if (file.type.startsWith('image/')) {
          return URL.createObjectURL(file);
        }
        // For PDFs and other documents, use a placeholder
        if (file.type === 'application/pdf') {
          return '/placeholder.svg';
        }
        if (file.type.includes('word')) {
          return '/placeholder.svg';
        }
        return '/placeholder.svg';
      });
      
      // Clean up previous previews to avoid memory leaks
      previews.forEach(preview => {
        if (preview.startsWith('blob:')) {
          URL.revokeObjectURL(preview);
        }
      });
      
      setPreviews(newPreviews);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...files];
    const newPreviews = [...previews];
    
    // Clean up preview URL
    if (newPreviews[index].startsWith('blob:')) {
      URL.revokeObjectURL(newPreviews[index]);
    }
    
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setFiles(newFiles);
    setPreviews(newPreviews);
    onChange(newFiles);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className={`${required ? 'required-field' : ''}`}>
        {label}
      </Label>
      
      <div className="file-upload-area">
        <Input 
          type="file" 
          id={id} 
          accept={acceptTypes}
          multiple={multiple}
          onChange={handleFileChange}
          className="hidden"
        />
        
        <label htmlFor={id} className="flex flex-col items-center justify-center cursor-pointer text-sm">
          <div className="flex flex-col items-center justify-center w-full py-4">
            <svg className="w-8 h-8 mb-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
            <p className="mb-1 text-sm text-gray-700">Click to upload or drag and drop</p>
            <p className="text-xs text-gray-500">{acceptTypes.replace(/\./g, '').toUpperCase()} files only</p>
          </div>
        </label>
      </div>

      {helperText && (
        <p className="text-xs text-gray-500 mt-1">{helperText}</p>
      )}

      {/* Preview area */}
      {previews.length > 0 && (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
          {previews.map((src, index) => (
            <div key={index} className="relative border rounded-md p-2 bg-gray-50">
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6"
                onClick={() => removeFile(index)}
              >
                <X className="h-4 w-4" />
              </Button>
              {files[index].type.startsWith('image/') ? (
                <img src={src} alt={`Preview ${index}`} className="document-preview" />
              ) : (
                <div className="flex flex-col items-center p-4">
                  <img src={src} alt="Document" className="w-12 h-12 mb-2" />
                  <span className="text-xs truncate max-w-full">{files[index].name}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
