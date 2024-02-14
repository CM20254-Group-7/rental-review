alter table "public"."reviews" drop constraint "reviews_landlord_rating_check";

alter table "public"."reviews" drop constraint "reviews_property_rating_check";

alter table "public"."reviews" alter column "landlord_rating" set not null;

alter table "public"."reviews" alter column "property_rating" set not null;

alter table "public"."reviews" alter column "review_body" set not null;

alter table "public"."reviews" add constraint "reviews_review_body_check" CHECK ((length(review_body) <= 1000)) not valid;

alter table "public"."reviews" validate constraint "reviews_review_body_check";

alter table "public"."reviews" add constraint "reviews_landlord_rating_check" CHECK (((landlord_rating >= 1) AND (landlord_rating <= 5))) not valid;

alter table "public"."reviews" validate constraint "reviews_landlord_rating_check";

alter table "public"."reviews" add constraint "reviews_property_rating_check" CHECK (((property_rating >= 1) AND (property_rating <= 5))) not valid;

alter table "public"."reviews" validate constraint "reviews_property_rating_check";


