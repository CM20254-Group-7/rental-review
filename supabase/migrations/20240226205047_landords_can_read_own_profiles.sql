create policy "landlords can read own private profiles"
on "public"."landlord_private_profiles"
as permissive
for select
to public
using ((auth.uid() = user_id));



