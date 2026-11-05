import { redirect } from 'next/navigation'

interface ProgrammePageProps {
  params: Promise<{ slug: string }>
}

export default async function ProgrammeDetailPage({ params }: ProgrammePageProps) {
  const { slug } = await params
  redirect(`/our-work#${slug}`)
}
