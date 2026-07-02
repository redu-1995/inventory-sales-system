import React, { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';

export default function ImageUpload({ onImageSelected }) {
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const processFile = (file) => {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("File exceeds maximum allowed size parameter (2MB)");
      return;
    }
    onImageSelected(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onImageSelected(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">Product Asset Image</label>
      <div 
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-gray-200 hover:border-blue-500 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer bg-gray-50/50 transition-colors h-36 relative overflow-hidden"
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={(e) => processFile(e.target.files[0])} 
        />

        {preview ? (
          <div className="absolute inset-0 w-full h-full bg-white z-10 flex items-center justify-center">
            <img src={preview} alt="Upload Preview" className="w-full h-full object-contain" />
            <button 
              type="button" 
              onClick={handleClear} 
              className="absolute top-2 right-2 p-1.5 bg-gray-900/80 hover:bg-red-600 text-white rounded-full transition-colors backdrop-blur-sm"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center">
            <Upload className="w-5 h-5 text-gray-400 mb-1" />
            <p className="text-xs text-gray-600 font-medium">Click to upload product image</p>
            <p className="text-[10px] text-gray-400">PNG, JPG up to 2MB</p>
          </div>
        )}
      </div>
    </div>
  );
}