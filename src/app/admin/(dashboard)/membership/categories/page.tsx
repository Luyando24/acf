import { createClient } from '@/lib/supabase/server'
import MembershipCategoryManager, {
  MembershipCategoryItem,
  DEFAULT_MEMBERSHIP_CATEGORIES,
} from '@/components/admin/MembershipCategoryManager'

export const metadata = {
  title: 'Membership Categories & Requirements | Admin Portal',
}

export default async function AdminMembershipCategoriesPage() {
  const supabase = await createClient()

  const { data: catData, error } = await supabase
    .from('membership_categories')
    .select('*')
    .order('order_index', { ascending: true })

  const categories =
    catData && catData.length > 0
      ? (catData as unknown as MembershipCategoryItem[])
      : DEFAULT_MEMBERSHIP_CATEGORIES

  return <MembershipCategoryManager initialCategories={categories} />
}

