drop policy "Enable insert for authenticated users only" on "public"."documents";

drop policy "public can read countries" on "public"."countries";

alter table "public"."users_projects" drop constraint "users_projects_group_id_fkey";

alter table "public"."projects" drop constraint "projects_pkey";

alter table "public"."users_projects" drop constraint "users_projects_pkey";

drop index if exists "public"."projects_pkey";

drop index if exists "public"."users_projects_pkey";

alter table "public"."documents" alter column "id" set default gen_random_uuid();

alter table "public"."documents" alter column "id" drop identity;

alter table "public"."documents" alter column "id" set data type uuid using "id"::uuid;

alter table "public"."documents" disable row level security;

alter table "public"."groups" add column "skills_list" text[];

alter table "public"."groups" disable row level security;

alter table "public"."projects" drop column "students_list";

alter table "public"."projects" add column "short_code" text not null default generate_project_code();

alter table "public"."users_groups" add column "skills_list" text[];

alter table "public"."users_projects" drop column "group_id";

alter table "public"."users_projects" add column "project_id" uuid not null;

alter table "public"."users_projects" add column "skills_list" text[];

alter table "public"."users_projects" alter column "is_active" set default true;

alter table "public"."users_projects" disable row level security;

CREATE UNIQUE INDEX projects_short_code_key ON public.projects USING btree (short_code);

CREATE UNIQUE INDEX users_projects_id_key ON public.users_projects USING btree (id);

CREATE UNIQUE INDEX projects_pkey ON public.projects USING btree (title, id, short_code);

CREATE UNIQUE INDEX users_projects_pkey ON public.users_projects USING btree (user_id, project_id);

alter table "public"."projects" add constraint "projects_pkey" PRIMARY KEY using index "projects_pkey";

alter table "public"."users_projects" add constraint "users_projects_pkey" PRIMARY KEY using index "users_projects_pkey";

alter table "public"."projects" add constraint "projects_short_code_key" UNIQUE using index "projects_short_code_key";

alter table "public"."users_projects" add constraint "users_projects_id_key" UNIQUE using index "users_projects_id_key";

alter table "public"."users_projects" add constraint "users_projects_project_id_fkey" FOREIGN KEY (project_id) REFERENCES projects(id) not valid;

alter table "public"."users_projects" validate constraint "users_projects_project_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.generate_project_code()
 RETURNS text
 LANGUAGE plpgsql
AS $function$BEGIN
    RETURN chr(65 + floor(random() * 26)::int) || chr(65 + floor(random() * 26)::int) || LPAD(floor(random() * 90)::int::text, 2, '0') || chr(65 + floor(random() * 26)::int);
END;$function$
;

create policy "public can read countries"
on "public"."countries"
as permissive
for select
to anon, authenticated
using (true);



