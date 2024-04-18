alter table "public"."review_photos" drop constraint "review_photos_photo_id_fkey";

alter table "public"."review_photos" drop constraint "review_photos_pkey";

drop index if exists "public"."review_photos_pkey";

alter table "public"."review_photos" drop column "photo_id";

alter table "public"."review_photos" add column "photo" text;

create policy "Provide access"
on "public"."review_photos"
as permissive
for all
to public
using (true);



