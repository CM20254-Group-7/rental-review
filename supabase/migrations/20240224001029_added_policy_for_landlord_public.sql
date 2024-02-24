create policy "Enable read access for all users"
on "public"."landlord_private_profiles"
as permissive
for select
to public
using (true);


create policy "Enable read access for all users"
on "public"."landlord_public_profiles"
as permissive
for select
to public
using (true);


create policy "Enable read access for all users"
on "public"."property_ownership"
as permissive
for select
to public
using (true);



