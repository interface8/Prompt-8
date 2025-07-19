export default function DesktopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="p-10 max-w-5xl mx-auto">{children}</div>;
}
