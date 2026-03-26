import { STEPS } from '../../constants/steps';

interface Props {
  stepId: number;
}

export default function StepExplanation({ stepId }: Props) {
  const step = STEPS.find(s => s.id === stepId);
  if (!step) return null;

  return (
    <div className="bg-[#1e293b] rounded-xl p-6 border border-[#334155]">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">{step.icon}</span>
        <h2 className="text-lg font-bold text-white">
          {step.id}단계 - {step.titleKo}
        </h2>
        <span className="text-sm text-[#64748b]">({step.titleEn})</span>
      </div>
      <p className="text-[#94a3b8] text-sm leading-relaxed">
        {step.descriptionKo}
      </p>
    </div>
  );
}
