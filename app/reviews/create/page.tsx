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

        <label htmlFor="tenancy_period">Tenancy Period</label>
        <input
          className="border p-2 rounded-md"
          type="text"
          name="tenancy_period"
          id="tenancy_period"
          required
        />

        <label htmlFor="proof_of_tenancy">Upload proof of tenancy</label>
        <input
          className="border p-2 rounded-md mb-6"
          type="file"
          name="proof_of_tenancy"
          id="proof_of_tenancy"
          accept="image/*"
          required
        />

        <h2 className="text-xl font-semibold">Landlord Ratings</h2>

        <label htmlFor="speed_rating">Speed to Reply</label>
        <input
          className="border p-2 rounded-md"
          type="number"
          name="speed_rating"
          id="speed_rating"
          min="1"
          max="5"
          required
        />
        <label htmlFor="contract_fairness_rating">Fairness of contract</label>
        <input
          className="border p-2 rounded-md"
          type="number"
          name="contract_fairness_rating"
          id="contract_fairness_rating"
          min="1"
          max="5"
          required
        />

        <label htmlFor="friendliness_rating">Friendliness</label>
        <input
          className="border p-2 rounded-md mb-6"
          type="number"
          name="friendliness_rating"
          id="friendliness_rating"
          min="1"
          max="5"
          required
        />

        <h2 className="text-xl font-semibold">Overall Ratings</h2>

        <label htmlFor="friendliness_rating">Overall Rating</label>
        <input
          className="border p-2 rounded-md"
          type="number"
          name="friendliness_rating"
          id="friendliness_rating"
          min="1"
          max="5"
          required
        />

        <label htmlFor="property_images">Upload images of property here</label>
        <input
          className="border p-2 rounded-md"
          type="file"
          name="property_images"
          id="property_images"
          accept="image/*"
          required
        />

        <label htmlFor="review_body">
          Write your review here (max 300 characters)
        </label>
        <textarea
          className="border p-2 rounded-md h-40"
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
