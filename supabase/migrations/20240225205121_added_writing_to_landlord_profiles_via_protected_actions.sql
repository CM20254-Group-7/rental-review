drop policy "Enable public access to landlord details" on "public"."landlord_public_profiles";

create policy "Allow all access to own row"
on "public"."landlord_private_profiles"
as permissive
for all
to public
using ((auth.uid() = user_id));


create policy "Enable delete for users based on user_id"
on "public"."landlord_public_profiles"
as permissive
for delete
to public
using ((auth.uid() = user_id));


create policy "Enable insert for users based on user_id"
on "public"."landlord_public_profiles"
as permissive
for insert
to public
with check ((auth.uid() = user_id));


create policy "Enable update for users based on user_id"
on "public"."landlord_public_profiles"
as permissive
for update
to public
using ((auth.uid() = user_id));


create policy "Enable public access to landlord details"
on "public"."landlord_public_profiles"
as permissive
for select
to public
using (true);



