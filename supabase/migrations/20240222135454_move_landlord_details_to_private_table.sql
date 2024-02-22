alter table "public"."landlord_private_profiles" add column "first_name" text;

alter table "public"."landlord_private_profiles" add column "last_name" text;

alter table "public"."landlord_public_profiles" add column "display_email" text not null;

alter table "public"."landlord_public_profiles" add column "display_name" text not null;

alter table "public"."user_profiles" drop column "first_name";

alter table "public"."user_profiles" drop column "last_name";


