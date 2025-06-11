import { useState, useRef } from 'react';
import { X, Upload, FileText } from 'lucide-react';
import { useImportIcsFile } from '../hooks/useCalendarEvents';

interface ImportIcsModalProps {
  isOpen: boolean;
  onClose: () => void;
  organizationId: string;
  calendarId: string;
}

export default function ImportIcsModal({
  isOpen,
  onClose,
  organizationId,
  calendarId,
}: ImportIcsModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [clearExisting, setClearExisting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const importIcsMutation = useImportIcsFile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) return;

    try {
      await importIcsMutation.mutateAsync({
        organizationId,
        calendarId,
        file: selectedFile,
        clearExisting,
      });
      onClose();
      resetForm();
    } catch (error) {
      console.error('Failed to import ICS file:', error);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setClearExisting(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileSelect = (file: File) => {
    if (file.type === 'text/calendar' || file.name.endsWith('.ics')) {
      setSelectedFile(file);
    } else {
      alert('Please select a valid ICS file (.ics extension)');
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg p-6 w-full max-w-md border border-border shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-card-foreground">Import ICS File</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File Upload Area */}
          <div
            className={`
              border-2 border-dashed rounded-lg p-6 text-center transition-colors
              ${dragActive ? 'border-primary bg-primary/10' : 'border-border'}
              ${selectedFile ? 'border-green-500 bg-green-500/10 dark:border-green-400 dark:bg-green-400/10' : ''}
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".ics,text/calendar"
              onChange={handleFileInputChange}
              className="hidden"
            />

            {selectedFile ? (
              <div className="flex items-center justify-center space-x-2">
                <FileText className="w-8 h-8 text-green-600 dark:text-green-400" />
                <div>
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">{selectedFile.name}</p>
                  <p className="text-xs text-green-600 dark:text-green-400">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground mb-2">
                  Drag and drop your ICS file here, or
                </p>
                <button
                  type="button"
                  onClick={handleBrowseClick}
                  className="text-primary hover:text-primary/80 font-medium"
                >
                  browse to select a file
                </button>
                <p className="text-xs text-muted-foreground mt-2">
                  Supports .ics files only
                </p>
              </div>
            )}
          </div>

          {selectedFile && (
            <button
              type="button"
              onClick={() => {
                setSelectedFile(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
              }}
              className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            >
              Remove file
            </button>
          )}

          {/* Clear Existing Events Option */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="clearExisting"
              checked={clearExisting}
              onChange={(e) => setClearExisting(e.target.checked)}
              className="h-4 w-4 text-primary focus:ring-ring border-input rounded bg-background"
            />
            <label htmlFor="clearExisting" className="ml-2 block text-sm text-foreground">
              Clear existing events before importing
            </label>
          </div>

          {clearExisting && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md dark:bg-yellow-900/20 dark:border-yellow-800">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Warning:</strong> This will permanently delete all existing events in this calendar before importing the new ones.
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-muted-foreground bg-muted hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={importIcsMutation.isPending || !selectedFile}
              className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 disabled:bg-primary/50 disabled:text-primary-foreground/50 rounded-md transition-colors"
            >
              {importIcsMutation.isPending ? 'Importing...' : 'Import Events'}
            </button>
          </div>
        </form>

        {importIcsMutation.error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md dark:bg-red-900/20 dark:border-red-800">
            <p className="text-sm text-red-800 dark:text-red-200">
              Failed to import ICS file. Please check the file format and try again.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
