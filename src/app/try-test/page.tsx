"use client";

import dynamic from "next/dynamic";

const TryTest = dynamic(() => import("@/components/TryOnTest"), { ssr: false });

import CommanLayout from "@/components/CommanLayout";

export default function Augument() {
  return (
    <CommanLayout>
      <TryTest />
    </CommanLayout>
  );
}
