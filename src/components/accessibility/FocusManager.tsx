import React, { useEffect, useRef } from 'react';
import { useLanguage } from "@/hooks/useLanguageCompat";

interface FocusManagerProps {
  children: React.ReactNode;
  autoFocus?: boolean;
  restoreFocus?: boolean;
  trapFocus?: boolean;
}

export const FocusManager: React.FC<FocusManagerProps> = ({
  children,
  autoFocus = false,
  restoreFocus = true,
  trapFocus = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<Element | null>(null);
  const { isRTL } = useLanguage();

  useEffect(() => {
    if (autoFocus && containerRef.current) {
      // Save the currently focused element
      previousActiveElement.current = document.activeElement;
      
      // Focus the first focusable element in the container
      const focusableElements = containerRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      }
    }

    return () => {
      if (restoreFocus && previousActiveElement.current) {
        (previousActiveElement.current as HTMLElement).focus();
      }
    };
  }, [autoFocus, restoreFocus]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!trapFocus || !containerRef.current) return;

    if (event.key === 'Tab') {
      const focusableElements = containerRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }

    // Enhanced keyboard navigation for RTL
    if (isRTL) {
      if (event.key === 'ArrowLeft') {
        // In RTL, left arrow should move forward
        event.stopPropagation();
        const nextElement = getNextFocusableElement();
        if (nextElement) nextElement.focus();
      } else if (event.key === 'ArrowRight') {
        // In RTL, right arrow should move backward
        event.stopPropagation();
        const previousElement = getPreviousFocusableElement();
        if (previousElement) previousElement.focus();
      }
    }
  };

  const getNextFocusableElement = (): HTMLElement | null => {
    if (!containerRef.current) return null;
    
    const focusableElements = Array.from(
      containerRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ) as HTMLElement[];
    
    const currentIndex = focusableElements.indexOf(document.activeElement as HTMLElement);
    return focusableElements[currentIndex + 1] || focusableElements[0];
  };

  const getPreviousFocusableElement = (): HTMLElement | null => {
    if (!containerRef.current) return null;
    
    const focusableElements = Array.from(
      containerRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ) as HTMLElement[];
    
    const currentIndex = focusableElements.indexOf(document.activeElement as HTMLElement);
    return focusableElements[currentIndex - 1] || focusableElements[focusableElements.length - 1];
  };

  return (
    <div
      ref={containerRef}
      onKeyDown={handleKeyDown}
      className={`focus-manager ${isRTL ? 'rtl-container' : 'ltr-container'}`}
      role="region"
      aria-label="Managed focus area"
    >
      {children}
    </div>
  );
};