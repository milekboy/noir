"use client";

import dynamic from "next/dynamic";

const TryOn = dynamic(() => import("@/elements/Home/TryOn"), { ssr: false });

import CommanLayout from "@/components/CommanLayout";

export default function Augument() {
  return (
    <CommanLayout>
      <TryOn />
    </CommanLayout>
  );
}
