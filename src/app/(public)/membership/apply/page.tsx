import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { constructMetadata } from '@/lib/utils/seo'
import MembershipApplyForm, {
  MembershipCategoryOption,
} from '@/components/membership/MembershipApplyForm'
import { DEFAULT_MEMBERSHIP_CATEGORIES } from '@/components/admin/MembershipCategoryManager'

export const metadata = constructMetadata({
  title: 'Apply for Membership | Agricultural Consultative Forum',
  description:
    'Submit your institutional or individual application to join an ACF stakeholder caucus.',
  pathname: '/membership/apply',
})

export default async function MembershipApplyPage() {
  const supabase = await createClient()

  const { data: catData } = await supabase
    .from('membership_categories')
    .select('id, name')
    .order('order_index', { ascending: true })

  const categories: MembershipCategoryOption[] =
    catData && catData.length > 0
      ? catData
      : DEFAULT_MEMBERSHIP_CATEGORIES.map((c) => ({ id: c.id, name: c.name }))

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#fdfdfd] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#1e7e48] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <MembershipApplyForm categories={categories} />
    </Suspense>
  )
}
