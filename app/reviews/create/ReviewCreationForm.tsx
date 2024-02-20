"use client";

import { useFormState } from "react-dom";
import { createReview } from "./actions";

interface FormProps {
  propertyId?: string;
  address?: string;
}
export const ReviewCreationForm: React.FC<FormProps> = ({
  propertyId,
  address = "1 Lorem Ipsum Road, Oldfield Park", // For Testing, add dummy value if none provided, consider replacing with error handling
}) => {
  // bind the id & address to the createReview function
  const initialState = { message: null, errors: {} };
  const createReviewWithProperty = createReview.bind(null, {
    id: propertyId,
    address: address,
  });
  const [state, dispatch] = useFormState(
    createReviewWithProperty,
    initialState
  );

  return (
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

      <label htmlFor="review_date">Date of review</label>
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

      <label htmlFor="landlord_rating">Landlord Ratings</label>
      <input
        className="border p-2 rounded-md"
        type="number"
        name="landlord_rating"
        id="landlord_rating"
        min="1"
        max="5"
        required
      />

      <label htmlFor="property_rating">Property Rating</label>
      <input
        className="border p-2 rounded-md mb-6"
        type="number"
        name="property_rating"
        id="property_rating"
        min="1"
        max="5"
        required
      />

      <h2 className="text-xl font-semibold">Write your review</h2>

      {/* Commented out for now as file uploards are being disputed */}
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
      <input
        className="border p-2 rounded-md"
        type="text"
        name="review_title"
        id="review_title"
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
  );
};
