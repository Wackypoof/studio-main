
interface SiteContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function SiteContainer({ children, className = '' }: SiteContainerProps) {
  return (
    <div className={`mx-auto max-w-screen-2xl px-4 md:px-6 ${className}`}>
      {children}
    </div>
  );
}
