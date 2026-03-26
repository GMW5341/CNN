import { useRef, useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { loadImageFromFile, loadImageFromUrl, cropAndResize, imageDataToTensor } from '../../utils/imageProcessing';
import { runInference } from '../../model/extractActivations';

const SAMPLE_IMAGES = [
  { name: '샘플 1', url: '/samples/sample1.svg' },
  { name: '샘플 2', url: '/samples/sample2.svg' },
];

export default function Header() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    model, modelStatus, setSourceImage, setImageData,
    setProcessedTensor, setInferenceStatus, setInferenceResult, setCurrentStep,
  } = useAppStore();

  const processImage = async (img: HTMLImageElement) => {
    setProcessing(true);
    setError(null);
    try {
      setSourceImage(img);
      const { imageData } = cropAndResize(img);
      setImageData(imageData);
      const tensor = imageDataToTensor(imageData);
      setProcessedTensor(tensor);
      setCurrentStep(1);

      if (model) {
        setInferenceStatus('running');
        const result = await runInference(model, tensor);
        setInferenceResult(result);
      }
    } catch (err) {
      console.error('Image processing failed:', err);
      setError('이미지 처리에 실패했습니다.');
      setInferenceStatus('error');
    } finally {
      setProcessing(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const img = await loadImageFromFile(file);
      await processImage(img);
    } catch (err) {
      console.error('File load failed:', err);
      setError('이미지 파일을 읽을 수 없습니다.');
    }
    // Reset input so the same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSampleSelect = async (url: string) => {
    try {
      const img = await loadImageFromUrl(url);
      await processImage(img);
    } catch (err) {
      console.error('Sample load failed:', err);
      setError('샘플 이미지를 로드할 수 없습니다.');
    }
  };

  const isDisabled = modelStatus !== 'ready' || processing;

  return (
    <header className="bg-[#1e293b] border-b border-[#334155] px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">
            AestheVision Explorer
          </h1>
          <p className="text-sm text-[#94a3b8]">피부 분석 CNN의 블랙박스를 열다</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/svg+xml"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isDisabled}
            className="px-4 py-2 bg-[#6366f1] hover:bg-[#4f46e5] disabled:bg-[#334155] disabled:text-[#64748b] text-white rounded-lg text-sm font-medium transition-colors"
          >
            {processing ? '처리 중...' : '새 이미지 업로드'}
          </button>
          {SAMPLE_IMAGES.map((sample, i) => (
            <button
              key={i}
              onClick={() => handleSampleSelect(sample.url)}
              disabled={isDisabled}
              className="px-4 py-2 bg-[#334155] hover:bg-[#475569] disabled:text-[#64748b] text-white rounded-lg text-sm font-medium transition-colors"
            >
              {sample.name}
            </button>
          ))}
          {modelStatus === 'building' && (
            <span className="text-sm text-[#f59e0b]">모델 로딩중...</span>
          )}
          {modelStatus === 'error' && (
            <span className="text-sm text-[#ef4444]">모델 로드 실패</span>
          )}
          {error && (
            <span className="text-sm text-[#ef4444]">{error}</span>
          )}
        </div>
      </div>
    </header>
  );
}
