revoke delete on table "public"."reviewer_public_profiles" from "anon";

revoke insert on table "public"."reviewer_public_profiles" from "anon";

revoke references on table "public"."reviewer_public_profiles" from "anon";

revoke select on table "public"."reviewer_public_profiles" from "anon";

revoke trigger on table "public"."reviewer_public_profiles" from "anon";

revoke truncate on table "public"."reviewer_public_profiles" from "anon";

revoke update on table "public"."reviewer_public_profiles" from "anon";

revoke delete on table "public"."reviewer_public_profiles" from "authenticated";

revoke insert on table "public"."reviewer_public_profiles" from "authenticated";

revoke references on table "public"."reviewer_public_profiles" from "authenticated";

revoke select on table "public"."reviewer_public_profiles" from "authenticated";

revoke trigger on table "public"."reviewer_public_profiles" from "authenticated";

revoke truncate on table "public"."reviewer_public_profiles" from "authenticated";

revoke update on table "public"."reviewer_public_profiles" from "authenticated";

revoke delete on table "public"."reviewer_public_profiles" from "service_role";

revoke insert on table "public"."reviewer_public_profiles" from "service_role";

revoke references on table "public"."reviewer_public_profiles" from "service_role";

revoke select on table "public"."reviewer_public_profiles" from "service_role";

revoke trigger on table "public"."reviewer_public_profiles" from "service_role";

revoke truncate on table "public"."reviewer_public_profiles" from "service_role";

revoke update on table "public"."reviewer_public_profiles" from "service_role";

alter table "public"."reviewer_public_profiles" drop constraint "reviewer_public_profiles_id_fkey";

alter table "public"."reviews" drop constraint "reviews_reviewer_id_fkey";

alter table "public"."reviewer_public_profiles" drop constraint "reviewer_public_profiles_pkey";

drop index if exists "public"."reviewer_public_profiles_pkey";

drop table "public"."reviewer_public_profiles";

alter table "public"."properties" add column "address" text not null;

alter table "public"."reviews" add column "landlord_rating" smallint not null;

alter table "public"."reviews" add column "property_rating" smallint not null;

alter table "public"."reviews" add column "review_body" text not null;

CREATE UNIQUE INDEX properties_address_key ON public.properties USING btree (address);

alter table "public"."properties" add constraint "properties_address_key" UNIQUE using index "properties_address_key";

alter table "public"."reviews" add constraint "reviews_landlord_rating_check" CHECK (((landlord_rating >= 1) AND (landlord_rating <= 5))) not valid;

alter table "public"."reviews" validate constraint "reviews_landlord_rating_check";

alter table "public"."reviews" add constraint "reviews_property_rating_check" CHECK (((property_rating >= 1) AND (property_rating <= 5))) not valid;

alter table "public"."reviews" validate constraint "reviews_property_rating_check";

alter table "public"."reviews" add constraint "reviews_review_body_check" CHECK ((length(review_body) <= 1000)) not valid;

alter table "public"."reviews" validate constraint "reviews_review_body_check";

alter table "public"."reviews" add constraint "reviews_reviewer_id_fkey" FOREIGN KEY (reviewer_id) REFERENCES reviewer_private_profiles(reviewer_id) not valid;

alter table "public"."reviews" validate constraint "reviews_reviewer_id_fkey";

create policy "Enable read access for users own profiles"
on "public"."reviewer_private_profiles"
as permissive
for select
to public
using ((auth.uid() = user_id));


create policy "Enable read access for all users"
on "public"."reviews"
as permissive
for select
to public
using (true);



