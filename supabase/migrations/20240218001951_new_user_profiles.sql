drop policy "Enable read access for all users" on "public"."properties";

drop function if exists "public"."get_average_property_rating"(property_id uuid);

drop function if exists "public"."get_properties_with_ratings"();

alter table "public"."user_profiles" drop column "first_name";

alter table "public"."user_profiles" drop column "last_name";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.create_profile_for_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$begin
  insert into public.user_profiles(id, email)
  values(new.id, new.email);
  
  return new;
end;$function$
;

create policy "Allow users to get their own profile"
on "public"."user_profiles"
as permissive
for select
to public
using ((auth.uid() = id));



