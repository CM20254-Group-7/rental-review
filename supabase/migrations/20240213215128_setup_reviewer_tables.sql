alter table "public"."reviewer_public_profiles" drop constraint "reviewer_public_profiles_id_fkey";

alter table "public"."reviews" drop constraint "reviews_reviewer_id_fkey";

alter table "public"."reviewer_public_profiles" drop constraint "reviewer_public_profiles_pkey";

drop index if exists "public"."reviewer_public_profiles_pkey";

drop table "public"."reviewer_public_profiles";

alter table "public"."reviews" add constraint "reviews_reviewer_id_fkey" FOREIGN KEY (reviewer_id) REFERENCES reviewer_private_profiles(reviewer_id) not valid;

alter table "public"."reviews" validate constraint "reviews_reviewer_id_fkey";

create policy "Enable read access for users own profiles"
on "public"."reviewer_private_profiles"
as permissive
for select
to public
using ((auth.uid() = user_id));



