'use client';

import { createContext, useCallback, useContext, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccordionContextType {
  openItems: Set<string>;
  toggle: (id: string) => void;
}

const AccordionContext = createContext<AccordionContextType>({
  openItems: new Set(),
  toggle: () => {},
});

export interface AccordionProps {
  type?: 'single' | 'multiple';
  defaultOpen?: string[];
  className?: string;
  children: React.ReactNode;
}

export function Accordion({ type = 'single', defaultOpen = [], className, children }: AccordionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set(defaultOpen));

  const toggle = useCallback(
    (id: string) => {
      setOpenItems((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          if (type === 'single') next.clear();
          next.add(id);
        }
        return next;
      });
    },
    [type],
  );

  return (
    <AccordionContext.Provider value={{ openItems, toggle }}>
      <div className={cn('divide-y divide-gray-200 border-y border-gray-200', className)}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

export interface AccordionItemProps {
  id: string;
  className?: string;
  children: React.ReactNode;
}

export function AccordionItem({ id, className, children }: AccordionItemProps) {
  return (
    <div className={className} data-accordion-item={id}>
      {children}
    </div>
  );
}

export interface AccordionTriggerProps {
  id: string;
  className?: string;
  children: React.ReactNode;
}

export function AccordionTrigger({ id, className, children }: AccordionTriggerProps) {
  const { openItems, toggle } = useContext(AccordionContext);
  const isOpen = openItems.has(id);

  return (
    <button
      type="button"
      onClick={() => toggle(id)}
      className={cn(
        'flex w-full items-center justify-between py-3 text-left text-sm font-medium text-gray-900 transition-colors hover:text-blue-600',
        className,
      )}
      aria-expanded={isOpen}
      aria-controls={`accordion-content-${id}`}
    >
      {children}
      <ChevronDown
        className={cn(
          'h-4 w-4 shrink-0 text-gray-500 transition-transform duration-200',
          isOpen && 'rotate-180',
        )}
        aria-hidden="true"
      />
    </button>
  );
}

export interface AccordionContentProps {
  id: string;
  className?: string;
  children: React.ReactNode;
}

export function AccordionContent({ id, className, children }: AccordionContentProps) {
  const { openItems } = useContext(AccordionContext);
  const isOpen = openItems.has(id);

  if (!isOpen) return null;

  return (
    <div
      id={`accordion-content-${id}`}
      role="region"
      className={cn('pb-3 text-sm text-gray-600', className)}
    >
      {children}
    </div>
  );
}
