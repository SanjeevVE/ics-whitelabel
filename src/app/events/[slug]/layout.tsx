import { generateEventMetadata } from '@/utils/eventMetadata';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  return await generateEventMetadata({ params: resolvedParams }, false);
}

export default async function EventLayout({ children, params }: LayoutProps) {
  const resolvedParams = await params;

  return <div>{children}</div>;
}