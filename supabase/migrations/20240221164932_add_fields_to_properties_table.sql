alter table "public"."properties" add column "baths" smallint;

alter table "public"."properties" add column "beds" smallint;

alter table "public"."properties" add column "country" text not null;

alter table "public"."properties" add column "county" text not null;

alter table "public"."properties" add column "description" text;

alter table "public"."properties" add column "house" text not null;

alter table "public"."properties" add column "postcode" text not null;

alter table "public"."properties" add column "property_type" text not null;

alter table "public"."properties" add column "street" text;


