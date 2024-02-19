-- Example Unit Test
--
-- This test should always pass as the auth table is not managed by us, but provides an example of how & where to write tests.
-- See https://supabase.com/docs/guides/database/extensions/pgtap for details on setting up your own tests, and add them in this folder

begin;
select plan(1); -- only one statement to run

SELECT has_column(
    'auth',
    'users',
    'id',
    'id should exist'
);

select * from finish();
rollback;
