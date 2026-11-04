-- Staff account management: super-admin-only RLS + last-super-admin guard
-- The staff management API uses the service role (bypasses RLS), so these
-- policies are defense in depth for direct session-based access.

drop policy if exists profiles_insert_super on public.profiles;
create policy profiles_insert_super on public.profiles
  for insert to authenticated
  with check (public.current_staff_role() = 'super_admin');

drop policy if exists profiles_delete_super on public.profiles;
create policy profiles_delete_super on public.profiles
  for delete to authenticated
  using (public.current_staff_role() = 'super_admin');

-- Hard stop (also binds the service role): the last active super admin
-- cannot be demoted, deactivated, or deleted.
create or replace function public.guard_last_super_admin()
returns trigger
language plpgsql
as $$
declare
  active_supers integer;
  is_protected boolean;
begin
  if tg_op = 'UPDATE' then
    is_protected := old.role = 'super_admin'
      and old.is_active
      and (new.role <> 'super_admin' or new.is_active = false);
  else
    is_protected := old.role = 'super_admin' and old.is_active;
  end if;

  if is_protected then
    select count(*) into active_supers
    from public.profiles
    where role = 'super_admin' and is_active and id <> old.id;

    if active_supers = 0 then
      raise exception 'Cannot remove or demote the last active super admin.';
    end if;
  end if;

  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

drop trigger if exists guard_last_super_admin_trigger on public.profiles;
create trigger guard_last_super_admin_trigger
  before update or delete on public.profiles
  for each row execute function public.guard_last_super_admin();
