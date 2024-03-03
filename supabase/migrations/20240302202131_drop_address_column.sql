alter table "public"."properties" drop constraint "properties_address_key";

drop index if exists "public"."properties_address_key";

alter table "public"."properties" drop column "address";


DROP function get_properties_with_ratings;

CREATE OR REPLACE FUNCTION public.get_properties_with_ratings()
 RETURNS TABLE(
    id uuid,
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

create or replace function plain_text_address (property_id uuid)
  returns text
  language SQL
as $function$
  select P.house 
    || COALESCE(', ' || P.street, '')
    || COALESCE(', ' || P.county, '')
    || COALESCE(', ' || P.postcode, '')
    || COALESCE(', ' || P.country, '')
    || COALESCE(', ' || P.county, '') as address
  from properties P
  where P.id = property_id
$function$;

CREATE or replace function public.get_properties_with_addresses()
 returns table(
    id uuid,
    baths smallint,
    beds smallint,
    country text,
    county text,
    description text,
    house text,
    postcode text,
    property_type text,
    street text,
    address text
  )
 language plpgsql
as $function$
#variable_conflict use_column 
begin
  return QUERY select *, plain_text_address(id) as address
  from properties;
end;
$function$;

CREATE or replace function public.properties_full()
 returns table(
    id uuid,
    baths smallint,
    beds smallint,
    country text,
    county text,
    description text,
    house text,
    postcode text,
    property_type text,
    street text,
    address text,
    average_rating numeric
  )
 language plpgsql
as $function$
#variable_conflict use_column 
begin
  return QUERY select 
    *, 
    plain_text_address(id) as address, 
    get_average_property_rating(id) as average_rating
  from properties;
end;
$function$;