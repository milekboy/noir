import TryOn from "@/components/TryOn";
import CommanLayout from "@/components/CommanLayout";
export default function Augument() {
  return (
    <CommanLayout>
      <TryOn
        garmentUrl={
          "https://res.cloudinary.com/dk6wshewb/image/upload/v1751627007/uploads/t7zgidwvvwhcllcmyq6y.jpg"
        }
      />
      {/* <div className="page-content bg-light">
        <div className="flex  h-screen w-screen">
          <div className="   flex">
            <p>here</p>
            <p>here</p>
          </div>
        </div>
      </div> */}
    </CommanLayout>
  );
}
