set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.plain_text_address(property_id uuid)
 RETURNS text
 LANGUAGE sql
AS $function$select P.house 
    || COALESCE(', ' || P.street, '')
    || COALESCE(', ' || P.county, '')
    || COALESCE(', ' || P.postcode, '')
    || COALESCE(', ' || P.country, '') as address
  from properties P
  where P.id = property_id$function$
;

CREATE OR REPLACE FUNCTION public.property_owner_on_date(property_id uuid, query_date date)
 RETURNS uuid
 LANGUAGE sql
 STABLE
AS $function$select landlord_id
from (
  select
    started_at,
    ended_at,
    landlord_id,
    property_id as p_id
  from property_ownership
) sub
where
  started_at <= query_date
  and
  (
    ended_at >= query_date
    or ended_at is null
  )
  and p_id = property_id$function$
;


