-- Sample Users
-- 
-- |       Email         |     Password     |         Used for        |                           Detail                           |
-- |---------------------|------------------|-------------------------|------------------------------------------------------------|
-- | user.1@example.com  | User.1.Password  |   supabase-user-tests   |                                                            |
-- |                     |                  |   landlord-page-tests   | Must have owned (at least) 2 properties (1 & 2 Test Road)  |
-- | user.2@example.com  | User.2.Password  |   supabase-user-tests   |                                                            |
-- |                     |                  |   landlord-page-tests   | Must be a landlord, but not have owned any properties      |
-- |                     |                  | property-claiming-tests | Must be registered as a landlord                           |
-- | user.3@example.com  | User.3.Password  |   landlord-page-tests   | Must not be registered as a landlord                       |
-- |                     |                  | property-claiming-tests | Must not be registered as a landlord                       |
-- | user.4@example.com  | User.4.Password  | property-claiming-tests | Must be registered as a landlord, and will claim properties|
-- | user.5@example.com  | User.5.Password  | property-claiming-tests | Must be registered as a landlord, and will claim properties|
-- | user.6@example.com  | User.6.Password  |   property-page-tests   | Have a review on 1 Test Road                               |
-- | user.7@example.com  | User.7.Password  |   property-page-tests   | Have reviews on 1 & 2 Test Road                            |
-- | user.8@example.com  | User.8.Password  |   property-page-tests   | Have a review on 1 Test Road (landlord changed)            |
-- | user.9@example.com  | User.9.Password  |   landlord-page-tests   | Must have owned 1 property                                 |
-- |                     |                  |                         | Average rating must be the highest                         |
-- | user.10@example.com | User.10.Password |                         |                                                            |

INSERT INTO "auth"."users" (            "instance_id"             ,                  "id"                 ,      "aud"     ,     "role"     ,        "email"       ,                      "encrypted_password"                     ,      "email_confirmed_at"      , "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at",        "last_sign_in_at"       ,               "raw_app_meta_data"              , "raw_user_meta_data", "is_super_admin",          "created_at"          ,          "updated_at"          , "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at") VALUES
                           ('00000000-0000-0000-0000-000000000000', 'b1b284f9-2c24-4f2e-bd4e-9c7ab7fe88e3', 'authenticated', 'authenticated', 'user.1@example.com'  , '$2a$10$dAXb7tcknPdbIxQjhH5Kp.HsnSH/axCF84WFR3x/5igoOD5Yf/rtq', '2024-02-21 19:01:43.584403+00', NULL        , ''                  , NULL                  , ''              , NULL              , ''                      , ''            , NULL                  , '2024-02-21 19:01:43.587224+00', '{"provider": "email", "providers": ["email"]}', '{}'                , NULL            , '2024-02-21 19:01:43.574501+00', '2024-02-21 19:01:43.590832+00', NULL   , NULL                , ''            , ''                  , NULL                  , ''                          , 0                            , NULL          , ''                      , NULL                      , false        , NULL        ),
                           ('00000000-0000-0000-0000-000000000000', '44db487d-ace4-43c8-bd7c-38b32b0bc711', 'authenticated', 'authenticated', 'user.2@example.com'  , '$2a$10$d3lqf9/eXZNLgph4MvB.wOsiQ99hTs54LKyNabZJmSSldVMo.NdWO', '2024-02-21 19:02:04.216791+00', NULL        , ''                  , NULL                  , ''              , NULL              , ''                      , ''            , NULL                  , '2024-02-21 19:02:04.219512+00', '{"provider": "email", "providers": ["email"]}', '{}'                , NULL            , '2024-02-21 19:02:04.210609+00', '2024-02-21 19:02:04.221503+00', NULL   , NULL                , ''            , ''                  , NULL                  , ''                          , 0                            , NULL          , ''                      , NULL                      , false        , NULL        ),
                           ('00000000-0000-0000-0000-000000000000', 'e155848a-f32b-4d7d-a8d2-4228a7989078', 'authenticated', 'authenticated', 'user.3@example.com'  , '$2a$10$qa6g5dxgKY7ixgiJaNGs4uwTb0Lq/BLg2NO1AA3FjbEEX6xHqEvCi', '2024-02-21 19:02:15.554559+00', NULL        , ''                  , NULL                  , ''              , NULL              , ''                      , ''            , NULL                  , '2024-02-21 19:02:15.556338+00', '{"provider": "email", "providers": ["email"]}', '{}'                , NULL            , '2024-02-21 19:02:15.551133+00', '2024-02-21 19:02:15.557628+00', NULL   , NULL                , ''            , ''                  , NULL                  , ''                          , 0                            , NULL          , ''                      , NULL                      , false        , NULL        ),
                           ('00000000-0000-0000-0000-000000000000', '482afef6-1b2f-4ac2-a449-9bc318f55936', 'authenticated', 'authenticated', 'user.4@example.com'  , '$2a$10$GjUd2SlxxiqVOX73QKD0B.909K2ZCf1dq04R.lzDkwTjFQD8/lEaS', '2024-02-21 19:02:25.513947+00', NULL        , ''                  , NULL                  , ''              , NULL              , ''                      , ''            , NULL                  , '2024-02-21 19:02:25.515414+00', '{"provider": "email", "providers": ["email"]}', '{}'                , NULL            , '2024-02-21 19:02:25.50949+00' , '2024-02-21 19:02:25.516963+00', NULL   , NULL                , ''            , ''                  , NULL                  , ''                          , 0                            , NULL          , ''                      , NULL                      , false        , NULL        ),
                           ('00000000-0000-0000-0000-000000000000', '4dfc3778-a1f2-410d-ae3d-9c92a469db8d', 'authenticated', 'authenticated', 'user.5@example.com'  , '$2a$10$XzxQ1ti.s5tWfWEfYhFeL.F9o5WY6rvJuoQrDPdOZ6uB5WASOCkdG', '2024-02-21 19:02:30.303065+00', NULL        , ''                  , NULL                  , ''              , NULL              , ''                      , ''            , NULL                  , '2024-02-21 19:02:30.30867+00' , '{"provider": "email", "providers": ["email"]}', '{}'                , NULL            , '2024-02-21 19:02:30.29966+00' , '2024-02-21 19:02:30.310043+00', NULL   , NULL                , ''            , ''                  , NULL                  , ''                          , 0                            , NULL          , ''                      , NULL                      , false        , NULL        ),
                           ('00000000-0000-0000-0000-000000000000', '470b631a-addd-4380-acf3-b476e136d5f6', 'authenticated', 'authenticated', 'user.6@example.com'  , '$2a$10$.mu0f6YWdyq2clNH/8tR5.2EWZCeNzdXgPVU6LBAmsdmBIuUHB28G', '2024-02-21 19:02:34.445684+00', NULL        , ''                  , NULL                  , ''              , NULL              , ''                      , ''            , NULL                  , '2024-02-21 19:02:34.44741+00' , '{"provider": "email", "providers": ["email"]}', '{}'                , NULL            , '2024-02-21 19:02:34.442515+00', '2024-02-21 19:02:34.448634+00', NULL   , NULL                , ''            , ''                  , NULL                  , ''                          , 0                            , NULL          , ''                      , NULL                      , false        , NULL        ),
                           ('00000000-0000-0000-0000-000000000000', 'a5ceb0f0-707e-47b8-9021-cf451fca19be', 'authenticated', 'authenticated', 'user.7@example.com'  , '$2a$10$aCjrE.Qgbt14t6sxRp9AUe7WQ86XZxojSvi1AoGyH3Hw68kTh8api', '2024-02-21 19:02:38.743055+00', NULL        , ''                  , NULL                  , ''              , NULL              , ''                      , ''            , NULL                  , '2024-02-21 19:02:38.744413+00', '{"provider": "email", "providers": ["email"]}', '{}'                , NULL            , '2024-02-21 19:02:38.740235+00', '2024-02-21 19:02:38.745538+00', NULL   , NULL                , ''            , ''                  , NULL                  , ''                          , 0                            , NULL          , ''                      , NULL                      , false        , NULL        ),
                           ('00000000-0000-0000-0000-000000000000', 'f48d6af6-5b3e-4834-ab9d-3e2d9af434b6', 'authenticated', 'authenticated', 'user.8@example.com'  , '$2a$10$Ppa8f8yryPXVXI1tTcEsUe5AtHBP/P.ELEDlK0DnHS1JKjj0tnTNC', '2024-02-21 19:02:44.547349+00', NULL        , ''                  , NULL                  , ''              , NULL              , ''                      , ''            , NULL                  , '2024-02-21 19:02:44.551001+00', '{"provider": "email", "providers": ["email"]}', '{}'                , NULL            , '2024-02-21 19:02:44.544392+00', '2024-02-21 19:02:44.552957+00', NULL   , NULL                , ''            , ''                  , NULL                  , ''                          , 0                            , NULL          , ''                      , NULL                      , false        , NULL        ),
                           ('00000000-0000-0000-0000-000000000000', '1c6ff33c-5efe-4b45-bd35-13783eebbee2', 'authenticated', 'authenticated', 'user.9@example.com'  , '$2a$10$rJBYMRDxq2lyStjPEcY7d.0aQnb6xeNhrE.q9Y0VQPWDjmvcKcncK', '2024-02-21 19:02:49.598548+00', NULL        , ''                  , NULL                  , ''              , NULL              , ''                      , ''            , NULL                  , '2024-02-21 19:02:49.600667+00', '{"provider": "email", "providers": ["email"]}', '{}'                , NULL            , '2024-02-21 19:02:49.594916+00', '2024-02-21 19:02:49.602113+00', NULL   , NULL                , ''            , ''                  , NULL                  , ''                          , 0                            , NULL          , ''                      , NULL                      , false        , NULL        ),
                           ('00000000-0000-0000-0000-000000000000', '5b3bb17f-33fe-40dd-a387-285e70812f0b', 'authenticated', 'authenticated', 'user.10@example.com' , '$2a$10$fDAaDVDdFr4hR4IEIBuQCu34leGCv6ACDMXHVW1pC9d1qWWrC4Hq2', '2024-02-21 19:02:56.022635+00', NULL        , ''                  , NULL                  , ''              , NULL              , ''                      , ''            , NULL                  , '2024-02-21 19:02:56.025823+00', '{"provider": "email", "providers": ["email"]}', '{}'                , NULL            , '2024-02-21 19:02:56.019983+00', '2024-02-21 19:02:56.027023+00', NULL   , NULL                , ''            , ''                  , NULL                  , ''                          , 0                            , NULL          , ''                      , NULL                      , false        , NULL        );

-- Sample Properties
--
-- |   Address   |       Used for      |             Details            |
-- |-------------|---------------------|--------------------------------|
-- | 1 Test Road | landlord-page-tests | Must have been owned by User.1 |
-- | 2 Test Road | landlord-page-tests | Must have been owned by User.1 |

INSERT INTO "public"."properties" (                    "id"              , "house" ,   "street"  , "county", "postcode",     "country"     ) VALUES
                                  ('1ececec8-4bbf-445f-8de0-f563caf0bf01', '1'     , 'Test Road' , 'London', 'AB1 234' , 'United Kingdom'  ),
                                  ('6a83d02b-9da1-4a4a-9719-05e8a8c9228d', '2'     , 'Test Road' , 'London', 'AB1 234' , 'United Kingdom'  );
                                  


-- Sample Landlord Private Profiles
--
-- No tests directly use this table yet, however the public profiles require it to exist.
--
-- |    User    |       Used for      |             Details            |
-- |   User.1   |                     |                                |
-- |   User.2   |                     |                                |
-- |   User.4   |                     |                                |
-- |   User.5   |                     |                                |
-- |   User.9   |                     |                                |

INSERT INTO "public"."landlord_private_profiles" (               "user_id"               , "phone_number" , "postcode" ,     "country"   , "county" , "city" , "street" ,    "house"    , "first_name" , "last_name" ) VALUES
                                                  ('b1b284f9-2c24-4f2e-bd4e-9c7ab7fe88e3', '12345678'     , 'TES T12'  , 'United Kingdom',  NULL    , NULL   ,  NULL    , '1 Test House', 'Joe'        , 'Doe'       ),
                                                  ('44db487d-ace4-43c8-bd7c-38b32b0bc711', '87654321'     , 'TES T34'  , 'United Kingdom',  NULL    , NULL   ,  NULL    , '2 Test House', 'Matthew'    , 'Nash'      ),
                                                  ('482afef6-1b2f-4ac2-a449-9bc318f55936', '0111111111'   , 'TES T56'  , 'United Kingdom',  NULL    , NULL   ,  NULL    , '3 Test House', 'John'       , 'Smith'     ),
                                                  ('4dfc3778-a1f2-410d-ae3d-9c92a469db8d', '0222222222'   , 'TES T56'  , 'United Kingdom',  NULL    , NULL   ,  NULL    , '4 Test House', 'Jane'       , 'Smith'     ),
                                                  ('1c6ff33c-5efe-4b45-bd35-13783eebbee2', '0333333333'   , 'TES T69'  , 'United Kingdom',  NULL    , NULL   ,  NULL    , '5 Test House', 'John'       , 'Doe'       );


-- Sample Landlord Public Profiles
--
-- |    User    |  Display name  |         Used for        |                                                  Details                                                 |
-- |------------|----------------|-------------------------|----------------------------------------------------------------------------------------------------------|
-- |   User.1   |   Test Name 1  |   landlord-page-tests   | Name, email, and bio must match 'Test Name 1', 'display1@example.com, and 'Cool landlord' respectively   |
-- |   User.2   |   Test Name 2  |   landlord-page-tests   | Name, email, and bio must match 'Test Name 2', 'display2@example.com, and 'Cooler landlord' respectively |
-- |   User.4   |   Test Name 4  | property-claiming-tests | Name, email, and bio must match 'Test Name 4', 'display3@example.com, and 'Evil landlord' respectively   |
-- |   User.5   |   Test Name 5  | property-claiming-tests | Name, email, and bio must match 'Test Name 5', 'display4@example.com, and 'Lazy landlord' respectively   |
-- |   User.9   |   Test Name 9  |   landlord-page-tests   | Name, email, and bio must match 'Test Name 9', 'display5@example.com, and 'Best landlord' respectively   |

INSERT INTO "public"."landlord_public_profiles" (               "user_id"               , "website" ,       "bio"      , "verified" , "profile_image_id" , "type" ,    "display_email"     , "display_name" ) VALUES
                                                 ('b1b284f9-2c24-4f2e-bd4e-9c7ab7fe88e3',  NULL     , 'Cool landlord'  ,    TRUE    ,  NULL              ,    1   , 'display1@example.com' , 'Test Name 1'  ),
                                                 ('44db487d-ace4-43c8-bd7c-38b32b0bc711',  NULL     , 'Cooler landlord',    TRUE    ,  NULL              ,    1   , 'display2@example.com' , 'Test Name 2'  ),
                                                 ('482afef6-1b2f-4ac2-a449-9bc318f55936',  NULL     , 'Evil landlord'  ,    TRUE    ,  NULL              ,    1   , 'display3@example.com' , 'Test Name 3'  ),
                                                 ('4dfc3778-a1f2-410d-ae3d-9c92a469db8d',  NULL     , 'Lazy landlord'  ,    TRUE    ,  NULL              ,    1   , 'display4@example.com' , 'Test Name 4'  ),
                                                 ('1c6ff33c-5efe-4b45-bd35-13783eebbee2',  NULL     , 'Best landlord'  ,    TRUE    ,  NULL              ,    1   , 'display5@example.com' , 'Test Name 5'  );


-- Sample Property Ownership
--
-- | Property Address |   Landlord   |       Used for      |                    Details                   |
-- |------------------|--------------|---------------------|----------------------------------------------|
-- |   1 Test Road    |    User.1    | landlord-page-tests | Must have been owned by User.1 at some point |
-- |   2 Test Road    |    User.1    | landlord-page-tests | Must have been owned by User.1 at some point |
-- |   2 Test Road    |    User.9    | landlord-page-tests | Must have been owned by User.2 at some point |

INSERT INTO "public"."property_ownership" (               "property_id"           , "started_at" ,              "landlord_id"            , "ended_at" ) VALUES
                                           ('1ececec8-4bbf-445f-8de0-f563caf0bf01', '2024-02-20' , 'b1b284f9-2c24-4f2e-bd4e-9c7ab7fe88e3', '2024-02-21' ),
                                           ('6a83d02b-9da1-4a4a-9719-05e8a8c9228d', '2024-01-20' , 'b1b284f9-2c24-4f2e-bd4e-9c7ab7fe88e3', NULL ),
                                           ('6a83d02b-9da1-4a4a-9719-05e8a8c9228d', '2021-01-01' , '1c6ff33c-5efe-4b45-bd35-13783eebbee2', '2021-12-31' );

-- Sample Reviewer Private Profiles
--
-- No tests directly use this table yet, however the property review require it to exist.
-- 
-- |    User    |       Used for       |                          Details                          |
-- |   User.2   |                      | Must have (at least) 1 property review (1 Test Road)      |
-- |   User.3   |                      | Must have (at least) 2 property reviews (1 & 2 Test Road) |
-- |   User.6   |                      | Must have (at least) 1 property review (2 Test Road)      |
-- |   User.9   |                      | Must have (at least) 1 property reviews (2 Test Road) |

INSERT INTO "public"."reviewer_private_profiles" (               "user_id"              ,             "property_id"             ,               "reviewer_id"           ) VALUES
                                                 ('482afef6-1b2f-4ac2-a449-9bc318f55936', '1ececec8-4bbf-445f-8de0-f563caf0bf01', '9e6bf369-8347-4878-8f9d-67671d175734'),
                                                 ('4dfc3778-a1f2-410d-ae3d-9c92a469db8d', '1ececec8-4bbf-445f-8de0-f563caf0bf01', '07ad8a9b-6b9b-47c8-943c-e45a041370e0'),
                                                 ('4dfc3778-a1f2-410d-ae3d-9c92a469db8d', '6a83d02b-9da1-4a4a-9719-05e8a8c9228d', 'a9d236d8-2d41-467b-8970-bb614673f919'),
                                                 ('470b631a-addd-4380-acf3-b476e136d5f6', '6a83d02b-9da1-4a4a-9719-05e8a8c9228d', '4f4ada56-4133-408a-ae63-3e02f9676ddb'),
                                                 ('1c6ff33c-5efe-4b45-bd35-13783eebbee2', '6a83d02b-9da1-4a4a-9719-05e8a8c9228d', '038ae11c-4b9e-4824-8f50-7ff8b3e67544');


insert into "public"."tags" (      "tag"       ) values
                            ( 'considerate'    ),
                            ( 'fast responses' ),
                            ( 'pet friendly'   );

-- Sample Property Reviews
--
-- | Property Address |  Reviewer   |       Used for       |                           Details                         |
-- |   1 Test Road    |   User.4    |                      | Review date, landlord rating, property_rating and review body must match '2024-01-01', '4', '1', 'The landlord is fantastic, but the property is in a horrible state.'                                                                                               |
-- |   1 Test Road    |   User.5    |                      | Review date, landlord rating, property_rating and review body must match '2024-02-01', '3', '3', 'Everything is fine.'                                                                                                                                               |
-- |   2 Test Road    |   User.5    |                      | Review date, landlord rating, property_rating and review body must match '2024-02-21', '2', '5', 'The landlord never responded to my queries and did not offer to fix the leakage in the bathroom. However, the property is impressive, with a beautiful city view.' |
-- |   2 Test Road    |   User.6    |                      | Review date, landlord rating, property_rating and review body must match '2023-02-21', '5', '1', 'Friendly landlord, but the property is a mess.'                                                                                                                    |
-- |   2 Test Road    |   User.9    |                      | Review date, landlord rating, property_rating and review body must match '2021-05-17', '5', '5', 'Everything is perfect!'                                                                                                                                            |


INSERT INTO "public"."reviews" (           "review_id"                ,             "property_id"             ,               "reviewer_id"           , "review_date", "landlord_rating", "property_rating",   "review_body"  ) VALUES
                               ('92f38488-210e-4637-9e82-48d2d7c5dd9b', '1ececec8-4bbf-445f-8de0-f563caf0bf01', '9e6bf369-8347-4878-8f9d-67671d175734', '2024-01-01' , '4'              , '1'              , 'The landlord is fantastic, but the property is in a horrible state.'                                                                                               ),
                               ('1cf1903b-5657-4301-9509-58d3e1c6a6a9', '6a83d02b-9da1-4a4a-9719-05e8a8c9228d', '07ad8a9b-6b9b-47c8-943c-e45a041370e0', '2024-02-01' , '3'              , '3'              , 'Everything is fine.'                                                                                                                                               ),
                               ('0e067144-b72b-4872-b0d0-a604c2350936', '6a83d02b-9da1-4a4a-9719-05e8a8c9228d', 'a9d236d8-2d41-467b-8970-bb614673f919', '2024-02-21' , '2'              , '5'              , 'The landlord never responded to my queries and did not offer to fix the leakage in the bathroom. However, the property is impressive, with a beautiful city view.' ),
                               ('f3e3e3e3-3e3e-3e3e-3e3e-3e3e3e3e3e3e', '6a83d02b-9da1-4a4a-9719-05e8a8c9228d', '4f4ada56-4133-408a-ae63-3e02f9676ddb', '2023-02-21' , '5'              , '1'              , 'Friendly landlord, but the property is a mess.'                                                                                                                    ),
                               ('a0d56fb3-8c86-48c4-96c1-d6b494c3a0ef', '6a83d02b-9da1-4a4a-9719-05e8a8c9228d', '038ae11c-4b9e-4824-8f50-7ff8b3e67544', '2021-05-17' , '5'              , '5'              , 'Everything is perfect!'                                                                                                                                            );


insert into "public"."review_tags" (               "review_id"              ,       "tag"      ) values
                                   ( '92f38488-210e-4637-9e82-48d2d7c5dd9b' , 'fast responses' ),
                                   ( '92f38488-210e-4637-9e82-48d2d7c5dd9b' , 'considerate'    ),
                                   ( '1cf1903b-5657-4301-9509-58d3e1c6a6a9' , 'fast responses' ),
                                   ( '0e067144-b72b-4872-b0d0-a604c2350936' , 'pet friendly'   ),
                                   ( 'f3e3e3e3-3e3e-3e3e-3e3e-3e3e3e3e3e3e' , 'pet friendly'   );