create type "public"."report_status" as enum ('reported', 'accepted', 'rejected');

alter table "public"."review_reports" add column "moderator_comment" report_status;

alter table "public"."review_reports" add column "status" report_status not null default 'reported'::report_status;

alter table "public"."reviews" add column "restricted" boolean not null default false;

alter policy "Enable read access for all users"
on "public"."reviews"
rename to "Enable read access to non-restricted reviews for all users";

alter policy "Enable read access to non-restricted reviews for all users"
on "public"."reviews"
to public
using (
  (not restricted)
);

alter view public.full_properties set (security_invoker=true);
alter view public.landlord_profile_pictures set (security_invoker=true);
alter view public.landlord_public_profiles_full set (security_invoker=true);

create function under_review(r_id uuid)
  returns bool
  language sql
  stable
as $function$
  select exists (
    select 1
    from review_reports
    where
      review_reports.review_id = r_id
      and
      review_reports.status = 'reported'
  )
$function$;

create view public.full_reviews
with (security_invoker=true)
as
  select
    reviews.*,
    property_owner_on_date(property_id, review_date) as landlord_id,
    under_review(review_id),
    tags
  from reviews
    left join (
      select
        review_id,
        array_agg ( tag ) tags
      from review_tags
      group by review_id
    ) as review_tags using(review_id) ;
