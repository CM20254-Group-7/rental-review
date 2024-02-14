'use client'

// TEST PAGE FOR CREATE ACTION - PLEASE REPLACE
import { useFormState } from 'react-dom'
import { createReview } from "./actions";

const createReviewPage = () => {
  // define example propertyId and address, these should be determined by params in implementation

  // set examplePropertyId to undefined to test creating a new property
  const examplePropertyId = '7cda6a4c-868d-436d-a05b-25d6eeaed351'
  const exampleAddress = undefined //"1234 Example St, Example, EX 12345";

  // bind the id & address to the createReview function
  const initialState = { message: null, errors: {} };
  const createReviewWithProperty = createReview.bind(null, {id: examplePropertyId, address: exampleAddress});
  const [state, dispatch] = useFormState(createReviewWithProperty, initialState)

  return (
    <div>
      <h1>Create Review</h1>
      <p>Test page for create action</p>

      <form
        className="flex flex-col gap-2 pleace-items-center max-w-prose w-full border p-4 rounded-md"
        action={dispatch}
      >
        <label htmlFor="review_date">Review Date</label>
        <input 
          className="border p-2 rounded-md bg-gray-800"
          type="date"
          name="review_date"
          id="review_date"
          required
        />

        <label htmlFor="review_body">Review Body</label>
        <textarea 
          className="border p-2 rounded-md bg-gray-800"
          name="review_body"
          id="review_body"
          required
        ></textarea>

        <label htmlFor="property_rating">Property Rating</label>
        <input 
          className="border p-2 rounded-md bg-gray-800"
          type="number"
          name="property_rating"
          id="property_rating"
          min="1"
          max="5"
          required
        />

        <label htmlFor="landlord_rating">Landlord Rating</label>
        <input 
          className="border p-2 rounded-md bg-gray-800x§"
          type="number"
          name="landlord_rating"
          id="landlord_rating"
          min="1"
          max="5"
          required
        />

        <button 
          className="text-white rounded-md p-2 bg-gray-800 hover:bg-gray-700 border"
          type="submit"
        >Create Review</button>

        {state.message && <p>{state.message}</p>}
        {state.errors && <p>{JSON.stringify(state.errors, null, '\t')}</p>}
      </form>
    </div>
  );
};

export default createReviewPage;