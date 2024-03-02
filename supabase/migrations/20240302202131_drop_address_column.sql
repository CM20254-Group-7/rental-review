alter table "public"."properties" drop constraint "properties_address_key";

drop index if exists "public"."properties_address_key";

alter table "public"."properties" drop column "address";


DROP function get_properties_with_ratings;

CREATE OR REPLACE FUNCTION public.get_properties_with_ratings()
 RETURNS TABLE(
    property_id uuid,
    baths smallint,
    beds smallint,
    country text,
    county text,
    description text,
    house text,
    postcode text,
    property_type text,
    street text,
    average_rating numeric
  )
 LANGUAGE plpgsql
AS $function$
#variable_conflict use_column 
BEGIN
  RETURN QUERY select *, get_average_property_rating(id) as average_rating
  from properties;
END; $function$
;