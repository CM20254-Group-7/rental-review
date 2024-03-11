create table "public"."property_tags" (
    "property_id" uuid not null,
    "tag_id" uuid not null
);


alter table "public"."property_tags" enable row level security;

create table "public"."tags" (
    "tag_id" uuid not null,
    "tag_name" text not null
);


alter table "public"."tags" enable row level security;

CREATE UNIQUE INDEX property_tags_pkey ON public.property_tags USING btree (tag_id, property_id);

CREATE UNIQUE INDEX tags_pkey ON public.tags USING btree (tag_id);

CREATE UNIQUE INDEX tags_tag_id_key ON public.tags USING btree (tag_id);

CREATE UNIQUE INDEX tags_tag_name_key ON public.tags USING btree (tag_name);

alter table "public"."property_tags" add constraint "property_tags_pkey" PRIMARY KEY using index "property_tags_pkey";

alter table "public"."tags" add constraint "tags_pkey" PRIMARY KEY using index "tags_pkey";

alter table "public"."property_tags" add constraint "property_tags_property_id_fkey" FOREIGN KEY (property_id) REFERENCES properties(id) not valid;

alter table "public"."property_tags" validate constraint "property_tags_property_id_fkey";

alter table "public"."property_tags" add constraint "property_tags_tag_id_fkey" FOREIGN KEY (tag_id) REFERENCES tags(tag_id) not valid;

alter table "public"."property_tags" validate constraint "property_tags_tag_id_fkey";

alter table "public"."tags" add constraint "tags_tag_id_key" UNIQUE using index "tags_tag_id_key";

alter table "public"."tags" add constraint "tags_tag_name_key" UNIQUE using index "tags_tag_name_key";

grant delete on table "public"."property_tags" to "anon";

grant insert on table "public"."property_tags" to "anon";

grant references on table "public"."property_tags" to "anon";

grant select on table "public"."property_tags" to "anon";

grant trigger on table "public"."property_tags" to "anon";

grant truncate on table "public"."property_tags" to "anon";

grant update on table "public"."property_tags" to "anon";

grant delete on table "public"."property_tags" to "authenticated";

grant insert on table "public"."property_tags" to "authenticated";

grant references on table "public"."property_tags" to "authenticated";

grant select on table "public"."property_tags" to "authenticated";

grant trigger on table "public"."property_tags" to "authenticated";

grant truncate on table "public"."property_tags" to "authenticated";

grant update on table "public"."property_tags" to "authenticated";

grant delete on table "public"."property_tags" to "service_role";

grant insert on table "public"."property_tags" to "service_role";

grant references on table "public"."property_tags" to "service_role";

grant select on table "public"."property_tags" to "service_role";

grant trigger on table "public"."property_tags" to "service_role";

grant truncate on table "public"."property_tags" to "service_role";

grant update on table "public"."property_tags" to "service_role";

grant delete on table "public"."tags" to "anon";

grant insert on table "public"."tags" to "anon";

grant references on table "public"."tags" to "anon";

grant select on table "public"."tags" to "anon";

grant trigger on table "public"."tags" to "anon";

grant truncate on table "public"."tags" to "anon";

grant update on table "public"."tags" to "anon";

grant delete on table "public"."tags" to "authenticated";

grant insert on table "public"."tags" to "authenticated";

grant references on table "public"."tags" to "authenticated";

grant select on table "public"."tags" to "authenticated";

grant trigger on table "public"."tags" to "authenticated";

grant truncate on table "public"."tags" to "authenticated";

grant update on table "public"."tags" to "authenticated";

grant delete on table "public"."tags" to "service_role";

grant insert on table "public"."tags" to "service_role";

grant references on table "public"."tags" to "service_role";

grant select on table "public"."tags" to "service_role";

grant trigger on table "public"."tags" to "service_role";

grant truncate on table "public"."tags" to "service_role";

grant update on table "public"."tags" to "service_role";

create policy "Enable insert for authenticated users only"
on "public"."property_tags"
as permissive
for all
to authenticated
with check (true);


create policy "public read access"
on "public"."property_tags"
as permissive
for select
to public
using (true);


create policy "public read access"
on "public"."tags"
as permissive
for select
to public
using (true);


create policy "write access for authenticated users"
on "public"."tags"
as permissive
for all
to authenticated
with check (true);



