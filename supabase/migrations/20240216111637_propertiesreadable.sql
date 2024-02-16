create policy "Enable read access for all users"
on "public"."properties"
as permissive
for select
to public
using (true);



