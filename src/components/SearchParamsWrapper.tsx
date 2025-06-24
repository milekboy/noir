"use client";
import { useSearchParams } from "next/navigation";

const SearchParamsWrapper = ({
  children,
}: {
  children: (params: URLSearchParams) => React.ReactNode;
}) => {
  const searchParams = useSearchParams();
  return <>{children(searchParams)}</>;
};

export default SearchParamsWrapper;
