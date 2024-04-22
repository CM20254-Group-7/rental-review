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

-- Create landlord_profile_pictures bucket and policies
--    bucket is public so all users will have read access
--    adds permissions for to landlords to add/edit their own profile pictures
--    should only be one profile picture per landlord so insert only allowed when folder is empty

insert into storage.buckets
	(id, name, allowed_mime_types, public)
values
	('review_pictures', 'review_pictures' , ARRAY ['image/*'], TRUE);

create policy "Give access to upload file to the folder"
  on "storage"."objects"
  as permissive
  for ALL
  to public
  with check ((
    TRUE
  ));

alter table "public"."review_photos" alter column "photo" set not null;

CREATE UNIQUE INDEX review_photos_pkey ON public.review_photos USING btree (photo);

alter table "public"."review_photos" add constraint "review_photos_pkey" PRIMARY KEY using index "review_photos_pkey";



