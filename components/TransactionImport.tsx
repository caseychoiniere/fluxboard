import React, { useState, useRef, useCallback } from 'react';
import { UploadCloud, FileText, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { uploadTransactionsCSV } from '../services/transactionService';

interface TransactionImportProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const TransactionImport: React.FC<TransactionImportProps> = ({ onClose, onSuccess }) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "text/csv" || droppedFile.name.endsWith('.csv')) {
        setFile(droppedFile);
        setStatus('idle');
        setMessage('');
      } else {
        setStatus('error');
        setMessage('Please upload a valid CSV file.');
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus('idle');
      setMessage('');
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setStatus('uploading');
    try {
      const result = await uploadTransactionsCSV(file);
      setStatus('success');
      setMessage(`Successfully imported ${result.count} transactions.`);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Upload failed');
    }
  };

  const removeFile = () => {
    setFile(null);
    setStatus('idle');
    setMessage('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-900">Import Transactions</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {!file ? (
            <div 
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                dragActive ? 'border-brand-500 bg-brand-50' : 'border-slate-300 hover:border-slate-400 bg-slate-50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input 
                ref={inputRef}
                type="file" 
                className="hidden" 
                accept=".csv"
                onChange={handleChange}
              />
              <div className="flex flex-col items-center justify-center gap-3">
                <div className="p-3 bg-white rounded-full shadow-sm text-brand-600">
                  <UploadCloud size={32} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    <button 
                      onClick={() => inputRef.current?.click()}
                      className="text-brand-600 hover:underline font-bold"
                    >
                      Click to upload
                    </button>
                    {' '}or drag and drop
                  </p>
                  <p className="text-xs text-slate-500 mt-1">CSV files only (max 10MB)</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg border border-slate-200 text-brand-600">
                    <FileText size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{file.name}</p>
                    <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                {status !== 'uploading' && status !== 'success' && (
                  <button 
                    onClick={removeFile}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              {status === 'error' && (
                <div className="mt-3 flex items-center gap-2 text-xs text-red-600 bg-red-50 p-2 rounded-lg">
                  <AlertCircle size={14} />
                  {message}
                </div>
              )}

              {status === 'success' && (
                <div className="mt-3 flex items-center gap-2 text-xs text-green-600 bg-green-50 p-2 rounded-lg">
                  <CheckCircle size={14} />
                  {message}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
            disabled={status === 'uploading'}
          >
            Cancel
          </button>
          <button 
            onClick={handleUpload}
            disabled={!file || status === 'uploading' || status === 'success'}
            className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {status === 'uploading' ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Uploading...
              </>
            ) : status === 'success' ? (
              <>
                <CheckCircle size={16} />
                Done
              </>
            ) : (
              'Import Transactions'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};