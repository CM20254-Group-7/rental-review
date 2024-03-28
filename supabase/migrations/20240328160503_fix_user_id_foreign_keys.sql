alter table "public"."landlord_private_profiles" add constraint "public_landlord_private_profiles_user_id_fkey" FOREIGN KEY (user_id) REFERENCES user_profiles(user_id) not valid;

alter table "public"."landlord_private_profiles" validate constraint "public_landlord_private_profiles_user_id_fkey";


