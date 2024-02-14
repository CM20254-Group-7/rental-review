alter table "public"."properties" add column "address" text not null;

CREATE UNIQUE INDEX properties_address_key ON public.properties USING btree (address);

alter table "public"."properties" add constraint "properties_address_key" UNIQUE using index "properties_address_key";


