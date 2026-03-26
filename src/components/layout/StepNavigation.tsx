import { useAppStore } from '../../store/useAppStore';
import { STEPS } from '../../constants/steps';

export default function StepNavigation() {
  const { currentStep, setCurrentStep, inferenceStatus, imageData } = useAppStore();
  const hasImage = imageData !== null;
  const hasResults = inferenceStatus === 'done';
  const isRunning = inferenceStatus === 'running';

  return (
    <nav className="bg-[#1e293b]/50 border-b border-[#334155] px-4 py-3 overflow-x-auto">
      <div className="max-w-7xl mx-auto flex items-center gap-2 min-w-max">
        {STEPS.map((step) => {
          const isActive = currentStep === step.id;
          // Step 1: always accessible
          // Steps 2-6: accessible after inference is done
          // During inference: show as loading
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
        {hasImage && isRunning && (
          <span className="text-xs text-[#f59e0b] animate-pulse ml-2">
            추론 중... 완료 후 단계 2~6이 활성화됩니다
          </span>
        )}
        {hasImage && inferenceStatus === 'error' && (
          <span className="text-xs text-[#ef4444] ml-2">
            추론 실패 - 이미지를 다시 업로드해주세요
          </span>
        )}
      </div>
    </nav>
  );
}
