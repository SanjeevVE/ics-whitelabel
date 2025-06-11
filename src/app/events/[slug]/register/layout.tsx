import { Metadata } from 'next';
import { generateEventMetadata } from '@/utils/eventMetadata';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>; 
}): Promise<Metadata> {
  const resolvedParams = await params; 
  return await generateEventMetadata({ params: resolvedParams }, true);
}

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}