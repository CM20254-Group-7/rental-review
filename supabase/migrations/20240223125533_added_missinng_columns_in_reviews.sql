alter table "public"."reviews" drop column "title";

alter table "public"."reviews" add column "review_title" text not null;

alter table "public"."reviews" add column "tenancy_period" bigint not null;

create policy "Enable insert for authenticated users only"
on "public"."reviews"
as permissive
for insert
to authenticated
with check (true);



