alter table "public"."landlord_private_profiles" drop constraint "landlord_private_profiles_id_fkey";

alter table "public"."properties" drop constraint "properties_address_key";

alter table "public"."reviewer_private_profiles" drop constraint "reviewer_private_profiles_user_id_fkey";

alter table "public"."user_profiles" drop constraint "user_profiles_id_fkey";

alter table "public"."user_profiles" drop constraint "user_public_profiles_id_fkey";

alter table "public"."property_ownership" drop constraint "property_ownership_property_id_fkey";

alter table "public"."reviewer_private_profiles" drop constraint "reviewer_private_profiles_property_id_fkey";

alter table "public"."reviews" drop constraint "reviews_property_id_fkey";

drop function if exists "public"."get_properties_with_ratings"();

drop index if exists "public"."properties_address_key";

create table "public"."review_tags" (
    "review_id" uuid not null,
    "tag" text not null
);


alter table "public"."review_tags" enable row level security;

create table "public"."tags" (
    "tag" text not null
);


alter table "public"."tags" enable row level security;

alter table "public"."properties" drop column "address";

alter table "public"."reviews" add column "review_posted" timestamp with time zone not null default (now() AT TIME ZONE 'utc'::text);

CREATE UNIQUE INDEX properties_house_street_county_postcode_country_key ON public.properties USING btree (house, street, county, postcode, country);

CREATE UNIQUE INDEX review_tags_pkey ON public.review_tags USING btree (review_id, tag);

CREATE UNIQUE INDEX tags_pkey ON public.tags USING btree (tag);

CREATE UNIQUE INDEX tags_tag_name_key ON public.tags USING btree (tag);

alter table "public"."review_tags" add constraint "review_tags_pkey" PRIMARY KEY using index "review_tags_pkey";

alter table "public"."tags" add constraint "tags_pkey" PRIMARY KEY using index "tags_pkey";

alter table "public"."properties" add constraint "properties_house_street_county_postcode_country_key" UNIQUE using index "properties_house_street_county_postcode_country_key";

alter table "public"."review_tags" add constraint "review_tags_review_id_fkey" FOREIGN KEY (review_id) REFERENCES reviews(review_id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."review_tags" validate constraint "review_tags_review_id_fkey";

alter table "public"."review_tags" add constraint "review_tags_tag_fkey" FOREIGN KEY (tag) REFERENCES tags(tag) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."review_tags" validate constraint "review_tags_tag_fkey";

alter table "public"."tags" add constraint "tags_tag_name_key" UNIQUE using index "tags_tag_name_key";

alter table "public"."user_profiles" add constraint "user_profiles_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."user_profiles" validate constraint "user_profiles_user_id_fkey";

alter table "public"."property_ownership" add constraint "property_ownership_property_id_fkey" FOREIGN KEY (property_id) REFERENCES properties(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."property_ownership" validate constraint "property_ownership_property_id_fkey";

alter table "public"."reviewer_private_profiles" add constraint "reviewer_private_profiles_property_id_fkey" FOREIGN KEY (property_id) REFERENCES properties(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."reviewer_private_profiles" validate constraint "reviewer_private_profiles_property_id_fkey";

alter table "public"."reviews" add constraint "reviews_property_id_fkey" FOREIGN KEY (property_id) REFERENCES properties(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."reviews" validate constraint "reviews_property_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.average_landlord_rating(id uuid)
 RETURNS numeric
 LANGUAGE sql
AS $function$
select AVG(landlord_rating)
from reviews_for_landlord(id);
$function$
;

CREATE OR REPLACE FUNCTION public.get_properties_with_addresses()
 RETURNS TABLE(id uuid, baths smallint, beds smallint, country text, county text, description text, house text, postcode text, property_type text, street text, address text)
 LANGUAGE plpgsql
AS $function$
#variable_conflict use_column 
begin
  return QUERY select *, plain_text_address(id) as address
  from properties;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.landlord_public_profiles_with_ratings()
 RETURNS TABLE(user_id uuid, website character varying, bio character varying, profile_image_id uuid, verified boolean, type character, display_email text, display_name text, average_rating numeric)
 LANGUAGE plpgsql
AS $function$ #variable_conflict use_column 
  BEGIN return query
select *,
  average_landlord_rating(user_id) as average_rating
from landlord_public_profiles;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.most_recent_review_date_for_property(id uuid)
 RETURNS date
 LANGUAGE sql
AS $function$
select review_posted
from reviews
where property_id = id
order by review_posted desc
limit 1 $function$
;

CREATE OR REPLACE FUNCTION public.plain_text_address(property_id uuid)
 RETURNS text
 LANGUAGE sql
AS $function$
  select P.house 
    || COALESCE(', ' || P.street, '')
    || COALESCE(', ' || P.county, '')
    || COALESCE(', ' || P.postcode, '')
    || COALESCE(', ' || P.country, '')
    || COALESCE(', ' || P.county, '') as address
  from properties P
  where P.id = property_id
$function$
;

CREATE OR REPLACE FUNCTION public.properties_full()
 RETURNS TABLE(id uuid, baths smallint, beds smallint, country text, county text, description text, house text, postcode text, property_type text, street text, address text, average_rating numeric, last_reviewed date)
 LANGUAGE plpgsql
AS $function$
#variable_conflict use_column 
begin
  return QUERY select 
    *, 
    plain_text_address(id) as address, 
    get_average_property_rating(id) as average_rating,
    most_recent_review_date_for_property(id) as last_reviewed
  from properties;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.property_owner_on_date(property_id uuid, query_date date)
 RETURNS uuid
 LANGUAGE sql
 STABLE
AS $function$
select landlord_id
from property_ownership
where started_at <= query_date
  and (
    ended_at >= query_date
    or ended_at is null
  )
  and property_id = property_id
$function$
;

CREATE OR REPLACE FUNCTION public.reviews_for_landlord(id uuid)
 RETURNS TABLE(property_id uuid, reviewer_id uuid, review_date date, review_id uuid, landlord_rating smallint, property_rating smallint, review_body text, review_posted timestamp with time zone, landlord_id uuid)
 LANGUAGE plpgsql
AS $function$ #variable_conflict use_column 
    BEGIN return query
select *
from reviews_with_landlords()
where landlord_id = id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.reviews_with_landlords()
 RETURNS TABLE(property_id uuid, reviewer_id uuid, review_date date, review_id uuid, landlord_rating smallint, property_rating smallint, review_body text, review_posted timestamp with time zone, landlord_id uuid)
 LANGUAGE plpgsql
AS $function$ 
#variable_conflict use_column 
    begin 
    return query
        select *, property_owner_on_date(property_id, review_date) as landlord_id
        from reviews;
    end;
$function$
;

CREATE OR REPLACE FUNCTION public.update_user_email()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$begin
  INSERT INTO public.user_profiles(email)
  VALUES(new.email)
  ON CONFLICT(email) DO UPDATE SET email = EXCLUDED.email;

  return new;
end$function$
;

CREATE OR REPLACE FUNCTION public.get_properties_with_ratings()
 RETURNS TABLE(id uuid, baths smallint, beds smallint, country text, county text, description text, house text, postcode text, property_type text, street text, average_rating numeric)
 LANGUAGE plpgsql
AS $function$
#variable_conflict use_column 
BEGIN
  RETURN QUERY select *, get_average_property_rating(id) as average_rating
  from properties;
END; $function$
;

create or replace view "public"."full_properties" as  SELECT properties.id,
    properties.baths,
    properties.beds,
    properties.country,
    properties.county,
    properties.description,
    properties.house,
    properties.postcode,
    properties.property_type,
    properties.street,
    plain_text_address(properties.id) AS address,
    avg(reviews.property_rating) AS average_rating,
    most_recent_review_date_for_property(properties.id) AS last_reviewed,
    jsonb_agg(DISTINCT (to_jsonb(property_ownership.*) - 'property_id'::text)) AS ownership_history,
    jsonb_agg(DISTINCT (to_jsonb(reviews.*) - 'property_id'::text)) AS reviews,
    array_agg(DISTINCT (to_jsonb(tag_counts.*) ->> 'tag'::text)) AS tags,
    jsonb_agg(DISTINCT (to_jsonb(tag_counts.*) - 'property_id'::text)) AS tag_counts
   FROM (((properties
     LEFT JOIN property_ownership ON ((properties.id = property_ownership.property_id)))
     LEFT JOIN ( SELECT reviews_1.property_id,
            reviews_1.reviewer_id,
            reviews_1.review_date,
            reviews_1.review_id,
            reviews_1.landlord_rating,
            reviews_1.property_rating,
            reviews_1.review_body,
            reviews_1.review_posted,
            array_agg(review_tags.tag) AS tags
           FROM (reviews reviews_1
             LEFT JOIN review_tags ON ((reviews_1.review_id = review_tags.review_id)))
          GROUP BY reviews_1.review_id) reviews ON ((properties.id = reviews.property_id)))
     LEFT JOIN ( SELECT reviews_1.property_id,
            review_tags.tag,
            count(*) AS count
           FROM (review_tags
             LEFT JOIN reviews reviews_1 ON ((review_tags.review_id = reviews_1.review_id)))
          GROUP BY reviews_1.property_id, review_tags.tag) tag_counts ON ((properties.id = tag_counts.property_id)))
  GROUP BY properties.id;


grant delete on table "public"."review_tags" to "anon";

grant insert on table "public"."review_tags" to "anon";

grant references on table "public"."review_tags" to "anon";

grant select on table "public"."review_tags" to "anon";

grant trigger on table "public"."review_tags" to "anon";

grant truncate on table "public"."review_tags" to "anon";

grant update on table "public"."review_tags" to "anon";

grant delete on table "public"."review_tags" to "authenticated";

grant insert on table "public"."review_tags" to "authenticated";

grant references on table "public"."review_tags" to "authenticated";

grant select on table "public"."review_tags" to "authenticated";

grant trigger on table "public"."review_tags" to "authenticated";

grant truncate on table "public"."review_tags" to "authenticated";

grant update on table "public"."review_tags" to "authenticated";

grant delete on table "public"."review_tags" to "service_role";

grant insert on table "public"."review_tags" to "service_role";

grant references on table "public"."review_tags" to "service_role";

grant select on table "public"."review_tags" to "service_role";

grant trigger on table "public"."review_tags" to "service_role";

grant truncate on table "public"."review_tags" to "service_role";

grant update on table "public"."review_tags" to "service_role";

grant delete on table "public"."tags" to "anon";

grant insert on table "public"."tags" to "anon";

grant references on table "public"."tags" to "anon";

grant select on table "public"."tags" to "anon";

grant trigger on table "public"."tags" to "anon";

grant truncate on table "public"."tags" to "anon";

grant update on table "public"."tags" to "anon";

grant delete on table "public"."tags" to "authenticated";

grant insert on table "public"."tags" to "authenticated";

grant references on table "public"."tags" to "authenticated";

grant select on table "public"."tags" to "authenticated";

grant trigger on table "public"."tags" to "authenticated";

grant truncate on table "public"."tags" to "authenticated";

grant update on table "public"."tags" to "authenticated";

grant delete on table "public"."tags" to "service_role";

grant insert on table "public"."tags" to "service_role";

grant references on table "public"."tags" to "service_role";

grant select on table "public"."tags" to "service_role";

grant trigger on table "public"."tags" to "service_role";

grant truncate on table "public"."tags" to "service_role";

grant update on table "public"."tags" to "service_role";

create policy "landlords can read own private profiles"
on "public"."landlord_private_profiles"
as permissive
for select
to public
using ((auth.uid() = user_id));


create policy "allow users to edit tags on reviews they created"
on "public"."review_tags"
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM reviewer_private_profiles
  WHERE ((reviewer_private_profiles.user_id = auth.uid()) AND (reviewer_private_profiles.reviewer_id = ( SELECT reviews.reviewer_id
           FROM reviews
          WHERE (reviews.review_id = review_tags.review_id)))))))
with check ((EXISTS ( SELECT 1
   FROM reviewer_private_profiles
  WHERE ((reviewer_private_profiles.user_id = auth.uid()) AND (reviewer_private_profiles.reviewer_id = ( SELECT reviews.reviewer_id
           FROM reviews
          WHERE (reviews.review_id = review_tags.review_id)))))));


create policy "public read access"
on "public"."review_tags"
as permissive
for select
to public
using (true);


create policy "public read access"
on "public"."tags"
as permissive
for select
to public
using (true);


CREATE TRIGGER update_user_profile AFTER UPDATE ON public.user_profiles FOR EACH STATEMENT EXECUTE FUNCTION update_user_email();


