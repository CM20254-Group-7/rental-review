create or replace view full_properties as
  select
    properties.*,
    plain_text_address(id) as address, 
    AVG(reviews.property_rating) as average_rating,
    most_recent_review_date_for_property(properties.id) as last_reviewed,
    jsonb_agg(distinct to_jsonb(property_ownership) - 'property_id') as ownership_history,
    jsonb_agg(distinct to_jsonb(reviews) - 'property_id') as reviews,
    array_agg(distinct (to_jsonb(tag_counts) ->> 'tag')) as tags,
    jsonb_agg(distinct to_jsonb(tag_counts)- 'property_id') as tag_counts
  from properties
  left join property_ownership on properties.id = property_ownership.property_id
  left join (
    select
      reviews.*,
      array_agg(review_tags.tag) as tags
    from reviews
    left join review_tags on reviews.review_id = review_tags.review_id
    group by reviews.review_id
    ) as reviews on properties.id = reviews.property_id
  left join (
    select
      reviews.property_id,
      review_tags.tag,
      count(*)
    from review_tags
    left join reviews on review_tags.review_id = reviews.review_id
    group by reviews.property_id, review_tags.tag
  ) as tag_counts on properties.id = tag_counts.property_id
  group by properties.id;