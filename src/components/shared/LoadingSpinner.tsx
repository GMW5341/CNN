interface Props {
  message?: string;
}

export default function LoadingSpinner({ message = '처리 중...' }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-12 h-12 border-4 border-[#334155] border-t-[#6366f1] rounded-full animate-spin" />
      <p className="text-[#94a3b8] text-sm">{message}</p>
    </div>
  );
}
