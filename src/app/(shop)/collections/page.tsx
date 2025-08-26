"use client";
import dynamic from "next/dynamic";
import CommanLayout from "@/components/CommanLayout";
import ShopList from "./_components/ShopList";

// Dynamically import client-only SearchParamsWrapper
const SearchParamsWrapper = dynamic(
  () => import("@/components/SearchParamsWrapper"),
  { ssr: false }
);

const ShopListPage = () => {
  return (
    <CommanLayout>
      <SearchParamsWrapper>
        {(searchParams) => {
          const selectedCategory = searchParams?.get("category") ?? null;
          return <ShopList selectedCategory={selectedCategory} />;
        }}
      </SearchParamsWrapper>
    </CommanLayout>
  );
};

export default ShopListPage;
