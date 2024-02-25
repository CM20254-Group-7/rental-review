create policy "Enable read access for all users"
on "public"."property_ownership"
as permissive
for select
to public
using (true);



