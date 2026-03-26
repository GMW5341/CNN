import { useAppStore } from '../../store/useAppStore';
import { STEPS } from '../../constants/steps';

export default function StepNavigation() {
  const { currentStep, setCurrentStep, inferenceStatus } = useAppStore();
  const hasResults = inferenceStatus === 'done';

  return (
    <nav className="bg-[#1e293b]/50 border-b border-[#334155] px-4 py-3 overflow-x-auto">
      <div className="max-w-7xl mx-auto flex items-center gap-2 min-w-max">
        {STEPS.map((step) => {
          const isActive = currentStep === step.id;
          const isAccessible = step.id === 1 || hasResults;

          return (
            <button
              key={step.id}
              onClick={() => isAccessible && setCurrentStep(step.id)}
              disabled={!isAccessible}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-[#6366f1] text-white shadow-lg shadow-[#6366f1]/25'
                  : isAccessible
                  ? 'bg-[#334155] text-[#94a3b8] hover:bg-[#475569] hover:text-white'
                  : 'bg-[#1e293b] text-[#475569] cursor-not-allowed'
              }`}
            >
              <span className="text-base">{step.icon}</span>
              <span>{step.id}. {step.titleKo}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
