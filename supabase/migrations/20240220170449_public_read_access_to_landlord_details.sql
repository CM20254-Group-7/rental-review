create policy "Enable public access to landlord details"
on "public"."landlord_public_profiles"
as permissive
for select
to public
using (true);



