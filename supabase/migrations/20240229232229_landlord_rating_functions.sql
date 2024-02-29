set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.average_landlord_rating(id uuid)
 RETURNS numeric
 LANGUAGE sql
AS $function$
  select AVG(landlord_rating) from reviews_for_landlord(id);
$function$
;

CREATE OR REPLACE FUNCTION public.landlord_public_profiles_with_ratings()
 RETURNS TABLE(user_id uuid, website character varying, bio character varying, profile_image_id uuid, verified boolean, type character, display_email text, display_name text, average_rating numeric)
 LANGUAGE plpgsql
AS $function$
#variable_conflict use_column 
BEGIN
  return query select *, average_landlord_rating(user_id) as average_rating from landlord_public_profiles;
END; $function$
;

CREATE OR REPLACE FUNCTION public.property_owner_on_date(property_id uuid, query_date date)
 RETURNS uuid
 LANGUAGE sql
 STABLE
AS $function$
  select landlord_id from property_ownership
    where started_at <= query_date
      and ended_at >= query_date
      and property_id = property_id
$function$
;

CREATE OR REPLACE FUNCTION public.reviews_for_landlord(id uuid)
 RETURNS TABLE(property_id uuid, reviewer_id uuid, review_date date, review_id uuid, landlord_rating smallint, property_rating smallint, review_body text, landlord_id uuid)
 LANGUAGE plpgsql
AS $function$
#variable_conflict use_column 
BEGIN
  return query select * from reviews_with_landlords() where landlord_id = id;
END; $function$
;

CREATE OR REPLACE FUNCTION public.reviews_with_landlords()
 RETURNS TABLE(property_id uuid, reviewer_id uuid, review_date date, review_id uuid, landlord_rating smallint, property_rating smallint, review_body text, landlord_id uuid)
 LANGUAGE plpgsql
AS $function$
#variable_conflict use_column 
BEGIN
  return query select *, property_owner_on_date(property_id,review_date) as landlord_id from reviews;
END; $function$
;


