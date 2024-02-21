CREATE TRIGGER create_profile_for_new_user AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION create_profile_for_user();
