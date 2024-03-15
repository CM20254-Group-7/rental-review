alter table "public"."reviewer_private_profiles" drop constraint "reviewer_private_profiles_property_id_fkey";

alter table "public"."reviews" drop constraint "reviews_property_id_fkey";

alter table "public"."reviewer_private_profiles" add constraint "reviewer_private_profiles_property_id_fkey" FOREIGN KEY (property_id) REFERENCES properties(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."reviewer_private_profiles" validate constraint "reviewer_private_profiles_property_id_fkey";

alter table "public"."reviews" add constraint "reviews_property_id_fkey" FOREIGN KEY (property_id) REFERENCES properties(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."reviews" validate constraint "reviews_property_id_fkey";


