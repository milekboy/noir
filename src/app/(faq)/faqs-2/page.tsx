"use client";

import { Suspense } from "react";
import MainLayout from "@/components/MainLayout";
import Faq2 from "./_components/Faq2";

const Faq2Page = () => {
  return (
    <MainLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <Faq2 />
      </Suspense>
    </MainLayout>
  );
};

export default Faq2Page;
