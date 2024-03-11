alter table "public"."landlord_private_profiles" drop constraint "landlord_private_profiles_id_fkey";

alter table "public"."reviewer_private_profiles" drop constraint "reviewer_private_profiles_user_id_fkey";

alter table "public"."user_profiles" drop constraint "user_profiles_id_fkey";

alter table "public"."user_profiles" drop constraint "user_public_profiles_id_fkey";

alter table "public"."user_profiles" add constraint "user_profiles_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."user_profiles" validate constraint "user_profiles_user_id_fkey";


