import { NextPage } from "next";
import { createClient } from "@/utils/supabase/client";
import { ReviewCreationForm } from "./ReviewCreationForm";

const createReviewPage: NextPage = async ({
  searchParams,
}: {
  searchParams?: {
    propertyId?: string;
    address?: string;
  };
}) => {
  const propertyId = searchParams?.propertyId;
  let address: string | undefined = undefined;

  // get the address from the propertyId if it's defined
  if (propertyId) {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("properties")
      .select("address")
      .eq("id", propertyId)
      .maybeSingle();

    // Consider adding error handling here
    // redirect to / show not-found if no property found with the provided id

    address = data?.address;
  }

  if (!address) address = searchParams?.address;

  return (
    <div style={{ minWidth: "1000px" }}>
      <h1 className="text-4xl font-bold mb-2 mt-8">Add New Review</h1>
      <p className="mb-8 text-xl">
        Add a new review for this property: <span>{address}</span>
      </p>

      <ReviewCreationForm propertyId={propertyId} address={address} />
    </div>
  );
};

export default createReviewPage;
