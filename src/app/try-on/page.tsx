"use client";

import dynamic from "next/dynamic";

const TryOn = dynamic(() => import("@/components/TryOn"), { ssr: false });

import CommanLayout from "@/components/CommanLayout";
import TryOn3D from "@/components/TryOn3D";
export default function Augument() {
  return (
    <CommanLayout>
      <TryOn />
    </CommanLayout>
  );
}
