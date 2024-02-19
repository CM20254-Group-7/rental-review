"use client";

// TEST PAGE FOR CREATE ACTION - PLEASE REPLACE
import { useFormState } from "react-dom";
import { createReview } from "./actions";

const createReviewPage = () => {
  // define example propertyId and address, these should be determined by params in implementation
  const examplePropertyId = undefined; // '7cda6a4c-868d-436d-a05b-25d6eeaed351'
  const exampleAddress = "1 Lorem Ipsum Road, Oldfield Park"; // ofc replace this later

  // bind the id & address to the createReview function
  const initialState = { message: null, errors: {} };
  const createReviewWithProperty = createReview.bind(null, {
    id: examplePropertyId,
    address: exampleAddress,
  });
  const [state, dispatch] = useFormState(
    createReviewWithProperty,
    initialState
  );

  return (
    <div style={{ minWidth: "1000px" }}>
      <h1 className="text-4xl font-bold mb-2 mt-8">Add New Review</h1>
      <p className="mb-8 text-xl">
        Add a new review for this property:{" "}
        <span>1 Lorem Ipsum Road, Oldfield Park</span>
      </p>

      <form
        className="flex flex-col gap-2 pleace-items-center w-full border p-4 rounded-md mb-8"
        action={dispatch}
        style={{ backgroundColor: "#778378", color: "#222" }}
      >
        <h2 className="text-xl font-semibold">Your Details</h2>

        <label htmlFor="name">Your Name</label>
        <textarea
          className="border p-1 rounded-md h-10"
          name="name"
          id="name"
          required
        ></textarea>

        <label htmlFor="review_date">Review Date</label>
        <input
          className="border p-2 rounded-md"
          type="date"
          name="review_date"
          id="review_date"
          required
        />

        <label htmlFor="tenancy_period">Tenancy Period</label>
        <input
          className="border p-2 rounded-md mb-6"
          type="text"
          name="tenancy_period"
          id="tenancy_period"
          required
        />

        <h2 className="text-xl font-semibold">Ratings</h2>

        <label htmlFor="landlord_rating">
          Rate the landlord on a scale from 1-5
        </label>
        <input
          className="border p-2 rounded-md"
          type="number"
          name="landlord_rating"
          id="landlord_rating"
          min="1"
          max="5"
          required
        />

        <label htmlFor="property_rating">
          Rate the property on a scale of 1-5
        </label>
        <input
          className="border p-2 rounded-md mb-6"
          type="number"
          name="property_rating"
          id="property_rating"
          min="1"
          max="5"
          required
        />

        <h2 className="text-xl font-semibold">Review Description</h2>

        {/* Comment this out later if we decide to include image upload*/}
        {/* <label htmlFor="property_images">Upload images of property here</label>
        <input
          className="border p-2 rounded-md"
          type="file"
          name="property_images"
          id="property_images"
          accept="image/*"
          required
        /> */}

        <label htmlFor="review_title">Review Title</label>
        <textarea
          className="border p-1 rounded-md h-10"
          name="review_title"
          id="review_title"
          required
        ></textarea>

        <label htmlFor="review_body">
          Write your review here (max 1000 characters)
        </label>
        <textarea
          className="border p-2 rounded-md h-40 mb-6"
          name="review_body"
          id="review_body"
          required
        ></textarea>

        <button
          className="rounded-md p-2 border"
          type="submit"
          style={{ backgroundColor: "#E2B758" }}
        >
          Create Review
        </button>

        {state.message && <p>{state.message}</p>}
        {state.errors && <p>{JSON.stringify(state.errors, null, "\t")}</p>}
      </form>
    </div>
  );
};

export default createReviewPage;
