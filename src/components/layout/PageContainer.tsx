import { cn } from '@/lib/utils';

export interface PageContainerProps {
  className?: string;
  children: React.ReactNode;
}

export function PageContainer({ className, children }: PageContainerProps) {
  return (
    <main className={cn('mx-auto min-h-screen max-w-4xl px-4 pt-18 pb-8', className)}>
      {children}
    </main>
  );
}
