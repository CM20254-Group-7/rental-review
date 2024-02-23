alter table "public"."user_profiles" drop column "first_name";

alter table "public"."user_profiles" drop column "last_name";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.create_profile_for_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$begin
  insert into public.user_profiles(user_id, email)
  values(new.id, new.email);
  
  return new;
end;$function$
;

CREATE TRIGGER create_profile_for_new_user AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION create_profile_for_user();


create policy "Allow users to get their own profile"
on "public"."user_profiles"
as permissive
for select
to public
using ((auth.uid() = user_id));



