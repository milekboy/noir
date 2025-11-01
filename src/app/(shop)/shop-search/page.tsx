"use client";
import dynamic from "next/dynamic";
import CommanLayout from "@/components/CommanLayout";
import ShopSearch from "./_components/ShopSearch";

// Dynamically import client-only SearchParamsWrapper
const SearchParamsWrapper = dynamic(
  () => import("@/components/SearchParamsWrapper"),
  { ssr: false }
);

const ShopSearchPage = () => {
  return (
    <CommanLayout>
      <SearchParamsWrapper>
        {(searchParams) => {
          const selectedCategory = searchParams?.get("category") ?? null;
          return <ShopSearch selectedCategory={selectedCategory} />;
        }}
      </SearchParamsWrapper>
    </CommanLayout>
  );
};

export default ShopSearchPage;
