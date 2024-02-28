-- Give users the ability to read their own private landlord profile
create policy "landlords can read own private profiles"
on "public"."landlord_private_profiles"
as permissive
for select
to public
using ((auth.uid() = user_id));

-- Configure the property_ownership table to cascade delete on property_id
alter table "public"."property_ownership" drop constraint "property_ownership_property_id_fkey";
alter table "public"."property_ownership" add constraint "property_ownership_property_id_fkey" FOREIGN KEY (property_id) REFERENCES properties(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;
alter table "public"."property_ownership" validate constraint "property_ownership_property_id_fkey";

