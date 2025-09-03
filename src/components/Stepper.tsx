type StepperProps = {
  steps: string[];
  currentStep: number; // index of current step
};

export default function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="relative flex justify-between items-center">
      {steps.map((step, index) => {
        const isCompleted = index <= currentStep;

        return (
          <div key={step} className="flex-1 flex flex-col items-center">
            {/* Step circle */}
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${
                isCompleted
                  ? "bg-indigo-600 border-indigo-600 text-white"
                  : "border-gray-300 text-gray-400"
              }`}
            >
              {isCompleted ? "✔" : index + 1}
            </div>

            {/* Label */}
            <span
              className={`mt-2 text-sm font-medium ${
                isCompleted ? "text-indigo-600" : "text-gray-400"
              }`}
            >
              {step}
            </span>
          </div>
        );
      })}

      {/* Line behind steps */}
      <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-300 -z-10">
        <div
          className="h-0.5 bg-indigo-600 transition-all"
          style={{
            width: `${(currentStep / (steps.length - 1)) * 100}%`,
          }}
        ></div>
      </div>
    </div>
  );
}
