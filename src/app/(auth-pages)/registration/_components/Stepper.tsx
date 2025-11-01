"use client";
import * as React from "react";
import { Check, ChevronRight } from "lucide-react";
import { toast } from "react-toastify";
interface StepProps {
  title: string;
  isCompleted?: boolean;
  isActive?: boolean;
  id: number;
}

const Step: React.FC<StepProps> = ({ id, isCompleted, isActive }) => {
  return (
    <div className="d-flex justify-content-center align-items-center">
      <div className="relative d-flex justify-content-center align-items-center">
        <div
          style={{ width: "30px", height: "30px" }}
          className={`rounded-5 border ${
            isCompleted ? "border-black" : "border-primary"
          } d-flex justify-content-center align-items-center 
           ${
             isCompleted
               ? "   bg-black "
               : isActive
               ? " border-none"
               : " border-muted"
           }`}
        >
          {isCompleted ? (
            <Check className="w-4 h-4 text-white" />
          ) : (
            <span className="text-sm font-medium">{id}</span>
          )}
        </div>
      </div>
    </div>
  );
};

interface StepperProps {
  children: React.ReactNode;
  onStepChange: (steps: number) => void;
  steps: Array<{ title: string; description?: string }>;
  currentStep: number;
  passwordConfirmation?: boolean;
  verifyPassword: () => void;
  verifyName?: () => void;
  firstName: string;
  lastName: string;
  gender: string;
  number: string;
  date: string;
}
export const steps = [
  { id: 1, title: "1" },
  { id: 2, title: "2" },
];

export function Stepper({
  children,
  onStepChange,
  currentStep,
  passwordConfirmation,
  verifyPassword,
  verifyName,
  firstName,
  lastName,
  gender,
  number,
  date
}: StepperProps){
  const [loading, setLoading] = React.useState(false);
  const [older, setOlder] = React.useState(false);
  function handleStepChange() {
    if (passwordConfirmation) {
      verifyPassword && verifyPassword();
      onStepChange(currentStep + 1);
      // alert("Password confirmation step reached");

      // console.log("Password confirmation step reached");
    } else {
      verifyPassword && verifyPassword();
    }
  }
  const handleload = () => {
    setLoading(true);
    console.log(number)
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }
  console.log(verifyName)

  React.useEffect(() => {
    if (date) {
      const birthYear = Number(date.slice(0, 4));
      const currentYear = new Date().getFullYear();
      if (currentYear - birthYear >= 18) {
        setOlder(true);
      } else {
        setOlder(false);
         toast.error("You must be at least 18 years old to register", {
                theme: "dark",
                hideProgressBar: true,
                position: "bottom-right",
                autoClose: 1000,
              });
      }
    }
  }, [date]);
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="d-flex justify-content-center m-b10 align-items-center md:items-center gap-4 mb-8">
        {steps.map((step, index) => (
          <React.Fragment key={step.title}>
            <Step
              id={step.id}
              title={step.title}
              isCompleted={index < currentStep}
              isActive={index === currentStep}
            />
            {index < steps.length - 1 && (
              <ChevronRight className="hidden md:block text-muted-foreground" />
            )}
          </React.Fragment>
        ))}
      </div>

      {children}

      <div className="d-flex justify-content-between">
        <button
          className="btn btn-secondary btnhover text-uppercase me-2"
          onClick={() => onStepChange(currentStep - 1)}
          disabled={currentStep === 0}
        >
          Previous
        </button>
        <button
          className={`btn btn-outline-secondary btnhover text-uppercase ${
            currentStep === steps.length - 1 ? "d-none" : "block"
          }`}
          type="button"
          onClick={() => handleStepChange()}
        >
          {currentStep === steps.length - 1 ? "Finish" : "Next"}
        </button>
        {currentStep === steps.length - 1 && (
          <button
            type={verifyName  ? "submit" : "button"}
            className="btn btn-secondary btnhover text-uppercase me-2"
            disabled={
              !firstName.trim() ||
              !lastName.trim() ||
              !gender.trim() ||
              !number.trim() || !older
            }
            onClick={() => {
              verifyName && verifyName(); handleload();}}
          >
            {/* bootstrap loading */}
            {loading ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            ) : (
              "Register"
            )}
            {/* Register */}
          </button>
        )}
      </div>
    </div>
  );
}