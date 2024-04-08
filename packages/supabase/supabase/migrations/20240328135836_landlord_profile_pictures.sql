-- Create landlord_profile_pictures bucket and policies
--    bucket is public so all users will have read access
--    adds permissions for to landlords to add/edit their own profile pictures
--    should only be one profile picture per landlord so insert only allowed when folder is empty

insert into storage.buckets
	(id, name, allowed_mime_types, public)
values
	('landlord_profile_pictures', 'landlord_profile_pictures' , ARRAY ['image/*'], TRUE);

create policy "Give landlords insert access to own profile picture folder"
  on "storage"."objects"
  as permissive
  for insert
  to public
  with check ((
    -- restrict to bucket
    (bucket_id = 'landlord_profile_pictures'::text)
    and
    -- check that its the landlord's folder
    ((auth.uid())::text = (storage.foldername(name))[1])
    and
    -- check that the user is a landlord
    (exists (select 1 from landlord_public_profiles where user_id = (auth.uid())::uuid))
    and
    -- check that the folder is empty
    (
      not exists (
        select 1
        from storage.objects
        where
          bucket_id = 'landlord_profile_pictures'
          and
          (storage.foldername(name))[1] = (auth.uid())::text
      )
    )
  ));


create policy "Give landlords update access to own profile picture folder"
  on "storage"."objects"
  as permissive
  for update
  to public
  using ((
    -- restrict to bucket
    (bucket_id = 'landlord_profile_pictures'::text)
    and
    -- check that its the landlord's folder
    ((auth.uid())::text = (storage.foldername(name))[1])
    -- check that the user is a landlord
    and
    (exists (select 1 from landlord_public_profiles where user_id = (auth.uid())::uuid))
  ));


create policy "Give landlords delete access to own profile picture folder"
  on "storage"."objects"
  as permissive
  for delete
  to public
  using ((
    -- restrict to bucket
    (bucket_id = 'landlord_profile_pictures'::text)
    and
    -- check that its the landlord's folder
    ((auth.uid())::text = (storage.foldername(name))[1])
    -- check that the user is a landlord
    and
    (exists (select 1 from landlord_public_profiles where user_id = (auth.uid())::uuid))
  ));


create policy "Give landords select access to own profile picture folder"
  on "storage"."objects"
  as permissive
  for select
  to public
  using ((
    -- restrict to bucket
    (bucket_id = 'landlord_profile_pictures'::text)
    and
    -- check that its the landlord's folder
    ((auth.uid())::text = (storage.foldername(name))[1])
    -- check that the user is a landlord
    and
    (exists (select 1 from landlord_public_profiles where user_id = (auth.uid())::uuid))
  ));

-- Create view to get landlord profile pictures & add it to the full landlord profile view

create or replace view "public"."landlord_profile_pictures" as  SELECT objects.name AS profile_picture,
    (objects.path_tokens[1])::uuid AS user_id
   FROM storage.objects
  WHERE (objects.bucket_id = 'landlord_profile_pictures'::text);


create or replace view "public"."landlord_public_profiles_full" as  SELECT landlord_public_profiles.user_id,
    landlord_public_profiles.website,
    landlord_public_profiles.bio,
    landlord_public_profiles.profile_image_id,
    landlord_public_profiles.verified,
    landlord_public_profiles.type,
    landlord_public_profiles.display_email,
    landlord_public_profiles.display_name,
    landlord_profile_pictures.profile_picture,
    average_landlord_rating(landlord_public_profiles.user_id) AS average_rating
   FROM (landlord_public_profiles
     LEFT JOIN landlord_profile_pictures USING (user_id));