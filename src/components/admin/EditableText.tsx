import React, { useRef, useEffect, useState } from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import { Edit2, Check } from 'lucide-react';

interface EditableTextProps {
  value: string;
  onSave: (value: string) => void;
  className?: string;
  as?: React.ElementType;
}

export function EditableText({ value, onSave, className = "", as: Component = "span" }: EditableTextProps) {
  const { isAdminMode } = useAdmin();
  const elementRef = useRef<HTMLElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);

  useEffect(() => {
    setCurrentValue(value);
    if (elementRef.current && !isEditing) {
      elementRef.current.innerText = value;
    }
  }, [value, isEditing]);

  if (!isAdminMode) {
    return <Component className={className}>{value}</Component>;
  }

  const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
    const newValue = e.target.innerText.trim();
    if (newValue !== value && newValue !== '') {
      onSave(newValue);
    } else if (newValue === '') {
      e.target.innerText = value;
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.currentTarget.blur();
    }
  };

  const startEditing = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
    setTimeout(() => {
      if (elementRef.current) {
        elementRef.current.focus();
        // Select all text
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(elementRef.current);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }, 50);
  };

  return (
    <div className={`group inline-flex items-center relative ${isEditing ? 'z-50' : ''}`}>
      <Component
        ref={elementRef}
        contentEditable={isEditing}
        suppressContentEditableWarning
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`${className} ${
          isEditing 
            ? 'outline-none ring-2 ring-blue-500 bg-blue-500/10 dark:bg-blue-500/20 rounded px-2 -mx-2' 
            : 'outline outline-1 outline-dashed outline-blue-400/60 hover:outline-blue-500 hover:bg-blue-500/10 cursor-pointer rounded px-2 -mx-2 transition-all relative'
        }`}
        title="Clique para editar"
        onClick={(e: React.MouseEvent) => {
          if (!isEditing) {
             e.preventDefault();
             e.stopPropagation();
             startEditing(e);
          }
        }}
      >
        {currentValue}
      </Component>
      
      {!isEditing && (
        <span className="ml-2 opacity-50 group-hover:opacity-100 transition-opacity">
          <Edit2 className="w-3 h-3 text-blue-500" />
        </span>
      )}
      {isEditing && (
        <span className="ml-2 text-green-500">
          <Check className="w-4 h-4" />
        </span>
      )}
    </div>
  );
}
