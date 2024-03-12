alter table "public"."reviews" add column "review_posted" timestamp with time zone not null default (now() AT TIME ZONE 'utc'::text);

create or replace function most_recent_review_date_for_property (id uuid) returns date language sql AS $function$
select review_posted
from reviews
where property_id = id
order by review_posted desc
limit 1 $function$;

drop function reviews_with_landlords;
create or replace function public.reviews_with_landlords() returns table(
        property_id uuid,
        reviewer_id uuid,
        review_date date,
        review_id uuid,
        landlord_rating smallint,
        property_rating smallint,
        review_body text,
        review_posted timestamp with time zone,
        landlord_id uuid
    )
    language plpgsql
as $function$ 
#variable_conflict use_column 
    begin 
    return query
        select *, property_owner_on_date(property_id, review_date) as landlord_id
        from reviews;
    end;
$function$;

drop function reviews_for_landlord;
CREATE OR REPLACE FUNCTION public.reviews_for_landlord(id uuid) RETURNS TABLE(
        property_id uuid,
        reviewer_id uuid,
        review_date date,
        review_id uuid,
        landlord_rating smallint,
        property_rating smallint,
        review_body text,
        review_posted timestamp with time zone,
        landlord_id uuid
    ) LANGUAGE plpgsql AS $function$ #variable_conflict use_column 
    BEGIN return query
select *
from reviews_with_landlords()
where landlord_id = id;
END;
$function$;