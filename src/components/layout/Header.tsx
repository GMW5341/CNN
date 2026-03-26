import { useRef, useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import {
  loadImageFromFile,
  cropAndResizeFromImage,
  cropAndResizeFromCanvas,
  imageDataToTensor,
} from '../../utils/imageProcessing';
import { runInference } from '../../model/extractActivations';
import { generateSampleImage1, generateSampleImage2 } from '../../utils/sampleImages';

export default function Header() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    model, modelStatus, setSourceImage, setImageData,
    setProcessedTensor, setInferenceStatus, setInferenceResult, setCurrentStep,
  } = useAppStore();

  const runPipeline = async (imageData: ImageData) => {
    setImageData(imageData);
    setCurrentStep(1);

    let tensor: import('@tensorflow/tfjs').Tensor4D | null = null;
    try {
      tensor = imageDataToTensor(imageData);
      setProcessedTensor(tensor);

      if (model) {
        setInferenceStatus('running');
        const result = await runInference(model, tensor);
        setInferenceResult(result);
      }
    } catch (err) {
      console.error('Inference failed:', err);
      setInferenceStatus('error');
      setError('CNN 추론에 실패했습니다. 콘솔을 확인해주세요.');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProcessing(true);
    setError(null);
    try {
      const img = await loadImageFromFile(file);
      setSourceImage(img);
      const imageData = cropAndResizeFromImage(img);
      await runPipeline(imageData);
    } catch (err) {
      console.error('File upload failed:', err);
      setError(err instanceof Error ? err.message : '이미지 파일을 읽을 수 없습니다.');
    } finally {
      setProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSampleSelect = async (sampleFn: () => HTMLCanvasElement) => {
    setProcessing(true);
    setError(null);
    try {
      const canvas = sampleFn();
      // Create an HTMLImageElement from the canvas for display in Step 1
      const img = new Image();
      img.src = canvas.toDataURL();
      await new Promise<void>((resolve) => { img.onload = () => resolve(); });
      setSourceImage(img);

      const imageData = cropAndResizeFromCanvas(canvas);
      await runPipeline(imageData);
    } catch (err) {
      console.error('Sample load failed:', err);
      setError(err instanceof Error ? err.message : '샘플 이미지 생성에 실패했습니다.');
    } finally {
      setProcessing(false);
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
            accept="image/jpeg,image/png,image/webp"
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
          <button
            onClick={() => handleSampleSelect(generateSampleImage1)}
            disabled={isDisabled}
            className="px-4 py-2 bg-[#334155] hover:bg-[#475569] disabled:text-[#64748b] text-white rounded-lg text-sm font-medium transition-colors"
          >
            샘플 1 (색소침착)
          </button>
          <button
            onClick={() => handleSampleSelect(generateSampleImage2)}
            disabled={isDisabled}
            className="px-4 py-2 bg-[#334155] hover:bg-[#475569] disabled:text-[#64748b] text-white rounded-lg text-sm font-medium transition-colors"
          >
            샘플 2 (주름)
          </button>
          {modelStatus === 'building' && (
            <span className="text-sm text-[#f59e0b] animate-pulse">모델 로딩중...</span>
          )}
          {modelStatus === 'error' && (
            <span className="text-sm text-[#ef4444]">모델 로드 실패</span>
          )}
          {processing && (
            <span className="text-sm text-[#f59e0b] animate-pulse">CNN 추론 중...</span>
          )}
          {error && (
            <span className="text-sm text-[#ef4444]">{error}</span>
          )}
        </div>
      </div>
    </header>
  );
}
