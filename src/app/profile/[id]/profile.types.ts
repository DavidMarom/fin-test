export interface ProfilePageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ source?: string }>;
}
