set check_function_bodies = off;

create or replace function most_recent_review_date_for_property (id uuid)
  returns date
  language sql
AS $function$
  select review_date from reviews 
  where property_id = id
  order by review_date desc
  limit 1
$function$;

drop function properties_full;
create or replace function public.properties_full()
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
    average_rating numeric,
    last_reviewed date
  )
 language plpgsql
as $function$
#variable_conflict use_column 
begin
  return QUERY select 
    *, 
    plain_text_address(id) as address, 
    get_average_property_rating(id) as average_rating,
    most_recent_review_date_for_property(id) as last_reviewed
  from properties;
end;
$function$;