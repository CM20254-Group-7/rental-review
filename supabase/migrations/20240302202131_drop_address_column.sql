alter table "public"."properties" drop constraint "properties_address_key";

drop index if exists "public"."properties_address_key";

alter table "public"."properties" drop column "address";


