create table "public"."documents" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "file_name" character varying,
    "file_path" character varying,
    "project_id" uuid
);


alter table "public"."documents" enable row level security;

create table "public"."projects" (
    "created_at" timestamp with time zone not null default now(),
    "title" character varying not null,
    "subject" character varying,
    "description" text,
    "start_date" date,
    "end_date" date,
    "number_of_groups" bigint,
    "min_students" bigint,
    "max_students" bigint,
    "students_list" bigint[],
    "id" uuid not null default gen_random_uuid(),
    "id_owner" uuid
);


alter table "public"."projects" enable row level security;

alter table "public"."profiles" add column "show_onboarding" boolean not null default false;

CREATE UNIQUE INDEX documents_pkey ON public.documents USING btree (id);

CREATE UNIQUE INDEX projects_id_key ON public.projects USING btree (id);

CREATE UNIQUE INDEX projects_pkey ON public.projects USING btree (title, id);

alter table "public"."documents" add constraint "documents_pkey" PRIMARY KEY using index "documents_pkey";

alter table "public"."projects" add constraint "projects_pkey" PRIMARY KEY using index "projects_pkey";

alter table "public"."documents" add constraint "documents_project_id_fkey" FOREIGN KEY (project_id) REFERENCES projects(id) not valid;

alter table "public"."documents" validate constraint "documents_project_id_fkey";

alter table "public"."projects" add constraint "projects_id_key" UNIQUE using index "projects_id_key";

alter table "public"."projects" add constraint "projects_id_owner_fkey" FOREIGN KEY (id_owner) REFERENCES profiles(id) not valid;

alter table "public"."projects" validate constraint "projects_id_owner_fkey";

grant delete on table "public"."documents" to "anon";

grant insert on table "public"."documents" to "anon";

grant references on table "public"."documents" to "anon";

grant select on table "public"."documents" to "anon";

grant trigger on table "public"."documents" to "anon";

grant truncate on table "public"."documents" to "anon";

grant update on table "public"."documents" to "anon";

grant delete on table "public"."documents" to "authenticated";

grant insert on table "public"."documents" to "authenticated";

grant references on table "public"."documents" to "authenticated";

grant select on table "public"."documents" to "authenticated";

grant trigger on table "public"."documents" to "authenticated";

grant truncate on table "public"."documents" to "authenticated";

grant update on table "public"."documents" to "authenticated";

grant delete on table "public"."documents" to "service_role";

grant insert on table "public"."documents" to "service_role";

grant references on table "public"."documents" to "service_role";

grant select on table "public"."documents" to "service_role";

grant trigger on table "public"."documents" to "service_role";

grant truncate on table "public"."documents" to "service_role";

grant update on table "public"."documents" to "service_role";

grant delete on table "public"."projects" to "anon";

grant insert on table "public"."projects" to "anon";

grant references on table "public"."projects" to "anon";

grant select on table "public"."projects" to "anon";

grant trigger on table "public"."projects" to "anon";

grant truncate on table "public"."projects" to "anon";

grant update on table "public"."projects" to "anon";

grant delete on table "public"."projects" to "authenticated";

grant insert on table "public"."projects" to "authenticated";

grant references on table "public"."projects" to "authenticated";

grant select on table "public"."projects" to "authenticated";

grant trigger on table "public"."projects" to "authenticated";

grant truncate on table "public"."projects" to "authenticated";

grant update on table "public"."projects" to "authenticated";

grant delete on table "public"."projects" to "service_role";

grant insert on table "public"."projects" to "service_role";

grant references on table "public"."projects" to "service_role";

grant select on table "public"."projects" to "service_role";

grant trigger on table "public"."projects" to "service_role";

grant truncate on table "public"."projects" to "service_role";

grant update on table "public"."projects" to "service_role";

create policy "Enable insert for authenticated users only"
on "public"."documents"
as permissive
for insert
to authenticated
with check (true);


create policy "create_project"
on "public"."projects"
as permissive
for insert
to public
with check (true);


