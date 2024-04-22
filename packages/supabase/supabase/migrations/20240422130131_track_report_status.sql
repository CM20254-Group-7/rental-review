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
