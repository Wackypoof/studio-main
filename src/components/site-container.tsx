
export function SiteContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-screen-2xl px-4 md:px-6">
      {children}
    </div>
  );
}
