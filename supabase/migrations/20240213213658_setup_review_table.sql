alter table "public"."reviews" add column "landlord_rating" smallint;

alter table "public"."reviews" add column "property_rating" smallint;

alter table "public"."reviews" add column "review_body" text;

alter table "public"."reviews" add constraint "reviews_landlord_rating_check" CHECK (((landlord_rating >= 0) AND (landlord_rating <= 5))) not valid;

alter table "public"."reviews" validate constraint "reviews_landlord_rating_check";

alter table "public"."reviews" add constraint "reviews_property_rating_check" CHECK (((property_rating >= 0) AND (property_rating <= 5))) not valid;

alter table "public"."reviews" validate constraint "reviews_property_rating_check";

create policy "Enable read access for all users"
on "public"."reviews"
as permissive
for select
to public
using (true);



