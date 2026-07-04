import React, { useState } from 'react';
import { Upload, X, Loader2, AlertCircle } from 'lucide-react';
import { productAPI } from '../../services/productService';

export default function ProductImportModal({ isOpen, onClose, onImportComplete }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState([]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setErrors([]); // Reset any historical parsing errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setErrors([]);
    
    try {
      const response = await productAPI.importProducts(file);
      alert(`Import completed! Added: ${response.created_count}, Updated: ${response.updated_count}`);
      onImportComplete(); // Refresh main inventory table state
      onClose();
    } catch (err) {
      console.error("Import failure: ", err);
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors); // Grab row validation logs from server
      } else {
        alert(err.response?.data?.error || "Failed to process the spreadsheet.");
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
        
        <h3 className="text-xl font-semibold mb-4 text-gray-900">Import Products Spreadsheet</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
            <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
            <input 
              type="file" 
              accept=".csv, .xlsx" 
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="text-xs text-gray-400 mt-2">Accepted formats: CSV, Excel (.xlsx)</p>
          </div>

          {errors.length > 0 && (
            <div className="bg-red-50 text-red-700 text-xs p-3 rounded-md max-h-36 overflow-y-auto border border-red-200">
              <div className="flex items-center gap-1 font-bold mb-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Row Validation Errors Found:</span>
              </div>
              <ul className="list-disc pl-4 space-y-1">
                {errors.map((err, idx) => <li key={idx}>{err}</li>)}
              </ul>
            </div>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg text-gray-700 text-sm">Cancel</button>
            <button 
              type="submit" 
              disabled={!file || uploading} 
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm flex items-center disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : "Begin Upload"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}