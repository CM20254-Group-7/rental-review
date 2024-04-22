create type "public"."report_status" as enum ('reported', 'accepted', 'rejected');

alter table "public"."review_reports" add column "moderator_comment" report_status;

alter table "public"."review_reports" add column "status" report_status not null default 'reported'::report_status;

alter table "public"."reviews" add column "restricted" boolean not null default false;
