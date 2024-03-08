set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_user_email()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$begin
  INSERT INTO public.user_profiles(email)
  VALUES(new.email)
  ON CONFLICT(email) DO UPDATE SET email = EXCLUDED.email;

  return new;
end$function$
;

CREATE TRIGGER update_user_profile AFTER UPDATE ON public.user_profiles FOR EACH STATEMENT EXECUTE FUNCTION update_user_email();
xxx
