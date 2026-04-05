// src/components/InlineEditField.tsx (New File)
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button"; // Assuming standard Button component
import { Input } from "@/components/ui/input"; // Assuming standard Input component
import { Textarea } from "@/components/ui/textarea"; // Assuming standard Textarea component
import { Check, X, Edit, Loader2 } from 'lucide-react';

interface InlineEditFieldProps {
  initialValue: string;
  fieldKey: string;
  onSave: (fieldKey: string, newValue: string) => Promise<void>;
  isSaving: boolean;
  type?: 'text' | 'textarea' | 'number';
  label?: string; // Optional label for context
}

export const InlineEditField: React.FC<InlineEditFieldProps> = ({
  initialValue,
  fieldKey,
  onSave,
  isSaving,
  type = 'text',
  label = fieldKey,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  // Update internal state if the external initialValue changes (e.g., after a successful save)
  useEffect(() => {
    setCurrentValue(initialValue);
  }, [initialValue]);

  const handleEdit = () => {
    setIsEditing(true);
    // Focus the input field after the state transition
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleSave = async () => {
    if (currentValue === initialValue || !currentValue.trim()) {
      setIsEditing(false); // No change or empty, just close
      return;
    }
    await onSave(fieldKey, currentValue.trim());
    setIsEditing(false);
  };

  const handleCancel = () => {
    setCurrentValue(initialValue); // Revert to original value
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && type !== 'textarea') {
      e.preventDefault(); // Prevent newline in input fields
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const renderInput = () => {
    if (type === 'textarea') {
      return (
        <Textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={currentValue}
          onChange={(e) => setCurrentValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isSaving}
          rows={3}
          placeholder={`Enter your ${label}`}
        />
      );
    }
    return (
      <Input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type={type === 'number' ? 'number' : 'text'}
        value={currentValue}
        onChange={(e) => setCurrentValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isSaving}
        placeholder={`Enter your ${label}`}
      />
    );
  };

  if (isEditing) {
    return (
      <div className="space-y-2">
        {renderInput()}
        <div className="flex space-x-2 justify-end">
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={handleCancel} 
            disabled={isSaving}
          >
            <X className="h-4 w-4 mr-1" /> Cancel
          </Button>
          <Button 
            size="sm" 
            className="bg-orange-600 hover:bg-orange-700" 
            onClick={handleSave} 
            disabled={isSaving || currentValue.trim() === initialValue || !currentValue.trim()}
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin mr-1" />
            ) : (
              <Check className="h-4 w-4 mr-1" />
            )}
            Save
          </Button>
        </div>
      </div>
    );
  }

  // Display Mode
  return (
    <div className="group flex items-center justify-between p-1 rounded-md transition duration-150">
      <span className="flex-1 text-sm text-muted-foreground leading-relaxed italic pr-2">
        {initialValue || `Click to add ${label}...`}
      </span>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={handleEdit} 
        className="opacity-0 group-hover:opacity-100 h-6 w-6"
      >
        <Edit className="h-3 w-3" />
      </Button>
    </div>
  );
};