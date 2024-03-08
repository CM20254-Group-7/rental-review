alter table "public"."reviews" add column "review_posted" timestamp with time zone not null default (now() AT TIME ZONE 'utc'::text);


