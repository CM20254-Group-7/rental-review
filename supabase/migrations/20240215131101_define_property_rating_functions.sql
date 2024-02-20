set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_average_property_rating(property_id uuid)
 RETURNS numeric
 LANGUAGE sql
 STABLE
AS $function$
  SELECT AVG(property_rating)
    FROM reviews
    WHERE reviews.property_id = get_average_property_rating.property_id;
$function$
;

CREATE OR REPLACE FUNCTION public.get_properties_with_ratings()
 RETURNS TABLE(property_id uuid, address text, average_rating numeric)
 LANGUAGE plpgsql
AS $function$
#variable_conflict use_column 
BEGIN
  RETURN QUERY select id as property_id, address, get_average_property_rating(id) as average_rating
  from properties;
END; $function$
;


