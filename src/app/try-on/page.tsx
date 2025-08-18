import TryOn from "@/components/TryOn";
import CommanLayout from "@/components/CommanLayout";
import TryOn3D from "@/components/TryOn3D";
export default function Augument() {
  return (
    <CommanLayout>
      <TryOn
        garmentUrl={
          "https://res.cloudinary.com/dbpjskran/image/upload/v1752226877/2_omkjax.png"
        }
      />
      {/* <TryOn3D /> */}
    </CommanLayout>
  );
}
