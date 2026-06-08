const STEPS = [
  { number: 1, label: 'בחירת סניף' },
  { number: 2, label: 'בחירת תאריך' },
  { number: 3, label: 'בחירת שעה' },
  { number: 4, label: 'פרטים אישיים' },
];

function BookingProgress({ currentStep }) {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between gap-2">
        {STEPS.map((step, index) => {
          const isActive = currentStep === step.number;
          const isComplete = currentStep > step.number;

          return (
            <div key={step.number} className="flex flex-1 items-center">
              <div className="flex flex-col items-center flex-1 min-w-0">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                    isActive || isComplete
                      ? 'bg-[var(--primary)] text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step.number}
                </div>
                <span
                  className={`mt-2 text-xs sm:text-sm text-center leading-tight ${
                    isActive ? 'text-[var(--primary)] font-medium' : 'text-gray-500'
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {index < STEPS.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-1 mb-6 transition-colors ${
                    isComplete ? 'bg-[var(--primary)]' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BookingProgress;
