alter table "public"."landlord_private_profiles" alter column "city" set data type text using "city"::text;

alter table "public"."landlord_private_profiles" alter column "country" set data type text using "country"::text;

alter table "public"."landlord_private_profiles" alter column "county" set data type text using "county"::text;

alter table "public"."landlord_private_profiles" alter column "house" set data type text using "house"::text;

alter table "public"."landlord_private_profiles" alter column "phone_number" set data type text using "phone_number"::text;

alter table "public"."landlord_private_profiles" alter column "postcode" set data type text using "postcode"::text;

alter table "public"."landlord_private_profiles" alter column "street" set data type text using "street"::text;


