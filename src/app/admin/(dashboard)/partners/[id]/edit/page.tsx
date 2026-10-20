import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PartnerForm from '@/components/admin/forms/PartnerForm'
import { PartnerItem } from '@/components/admin/PartnerManager'

export const metadata = {
  title: 'Edit Partner | ACF Admin CMS',
}

interface EditPartnerProps {
  params: Promise<{ id: string }>
}

const defaultPartners: PartnerItem[] = [
  {
    id: '77777777-7777-7777-7777-777777777701',
    name: 'Ministry of Agriculture - Zambia',
    type: 'Collaborating Institution',
    logo_url: '/partners/ministry-of-agriculture.svg',
    website_url: 'https://www.agriculture.gov.zm',
    description: 'The primary governmental counterpart in national agricultural policy consultations, crop forecasts, and input support reviews.',
    order_index: 1,
    show_on_home: true,
    is_visible: true,
  },
  {
    id: '77777777-7777-7777-7777-777777777702',
    name: 'Zambia National Farmers Union (ZNFU)',
    type: 'Partner',
    logo_url: '/partners/znfu.svg',
    website_url: 'https://www.znfu.org.zm',
    description: 'Apex representative federation for smallholder, emergent, and large-scale commercial farming households in Zambia.',
    order_index: 2,
    show_on_home: true,
    is_visible: true,
  },
  {
    id: '77777777-7777-7777-7777-777777777703',
    name: 'Indaba Agricultural Policy Research Institute (IAPRI)',
    type: 'Partner',
    logo_url: '/partners/iapri.svg',
    website_url: 'https://www.iapri.org.zm',
    description: 'Premier collaborating research body undertaking rigorous empirical analyses of food security and rural economics.',
    order_index: 3,
    show_on_home: true,
    is_visible: true,
  },
]

export default async function EditPartnerPage({ params }: EditPartnerProps) {
  const { id } = await params
  const supabase = await createClient()

  let partner: PartnerItem | null = null

  try {
    const { data } = await supabase
      .from('partners')
      .select('*')
      .eq('id', id)
      .single()

    if (data) {
      partner = data as unknown as PartnerItem
    }
  } catch {
    // Fallback
  }

  if (!partner) {
    const found = defaultPartners.find((p) => p.id === id)
    if (found) {
      partner = found
    }
  }

  if (!partner) {
    notFound()
  }

  return <PartnerForm initialData={partner} />
}
