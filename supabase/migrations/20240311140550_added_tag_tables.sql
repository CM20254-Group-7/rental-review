create table "public"."review_tags" ( -- Renamed to review_tags
    "review_id" uuid not null,
    "tag" text not null
);


alter table "public"."review_tags" enable row level security;

create table "public"."tags" (
    --  removed seperate id column
    "tag" text not null
);


alter table "public"."tags" enable row level security;

CREATE UNIQUE INDEX review_tags_pkey ON public.review_tags USING btree (review_id, tag);

CREATE UNIQUE INDEX tags_pkey ON public.tags USING btree (tag);

CREATE UNIQUE INDEX tags_tag_name_key ON public.tags USING btree (tag);

alter table "public"."review_tags" add constraint "review_tags_pkey" PRIMARY KEY using index "review_tags_pkey";

alter table "public"."tags" add constraint "tags_pkey" PRIMARY KEY using index "tags_pkey";

alter table "public"."review_tags" add constraint "review_tags_review_id_fkey" FOREIGN KEY (review_id) REFERENCES reviews(review_id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."review_tags" validate constraint "review_tags_review_id_fkey";

alter table "public"."review_tags" add constraint "review_tags_tag_fkey" FOREIGN KEY (tag) REFERENCES tags(tag) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."review_tags" validate constraint "review_tags_tag_fkey";

alter table "public"."tags" add constraint "tags_tag_name_key" UNIQUE using index "tags_tag_name_key";

grant delete on table "public"."review_tags" to "anon";

grant insert on table "public"."review_tags" to "anon";

grant references on table "public"."review_tags" to "anon";

grant select on table "public"."review_tags" to "anon";

grant trigger on table "public"."review_tags" to "anon";

grant truncate on table "public"."review_tags" to "anon";

grant update on table "public"."review_tags" to "anon";

grant delete on table "public"."review_tags" to "authenticated";

grant insert on table "public"."review_tags" to "authenticated";

grant references on table "public"."review_tags" to "authenticated";

grant select on table "public"."review_tags" to "authenticated";

grant trigger on table "public"."review_tags" to "authenticated";

grant truncate on table "public"."review_tags" to "authenticated";

grant update on table "public"."review_tags" to "authenticated";

grant delete on table "public"."review_tags" to "service_role";

grant insert on table "public"."review_tags" to "service_role";

grant references on table "public"."review_tags" to "service_role";

grant select on table "public"."review_tags" to "service_role";

grant trigger on table "public"."review_tags" to "service_role";

grant truncate on table "public"."review_tags" to "service_role";

grant update on table "public"."review_tags" to "service_role";

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

create policy "public read access"
on "public"."review_tags"
as permissive
for select
to public
using (true);


create policy "allow users to edit tags on reviews they created"
on "public"."review_tags"
as permissive
for all
to public
using ((
    EXISTS (
        SELECT 1
        FROM reviewer_private_profiles
        WHERE (
            (reviewer_private_profiles.user_id = auth.uid())
            AND
            (reviewer_private_profiles.reviewer_id = (
                SELECT reviews.reviewer_id
                FROM reviews
                WHERE (reviews.review_id = review_tags.review_id))
            )
        )
    )
))
with check ((
    EXISTS (
        SELECT 1
        FROM reviewer_private_profiles
        WHERE (
            (reviewer_private_profiles.user_id = auth.uid())
            AND
            (reviewer_private_profiles.reviewer_id = (
                SELECT reviews.reviewer_id
                FROM reviews
                WHERE (reviews.review_id = review_tags.review_id))
            )
        )
    )
));


create policy "public read access"
on "public"."tags"
as permissive
for select
to public
using (true);


-- Possible tags should be pre-defined by us not added by users