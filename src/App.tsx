import { useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import { useAppStore } from './store/useAppStore';
import { buildDemoModel } from './model/buildDemoModel';
import Header from './components/layout/Header';
import StepNavigation from './components/layout/StepNavigation';
import Step1ImageInput from './components/steps/Step1_ImageInput/Step1ImageInput';
import Step2Convolution from './components/steps/Step2_Convolution/Step2Convolution';
import Step3PaddingPooling from './components/steps/Step3_PaddingPooling/Step3PaddingPooling';
import Step4FeatureMaps from './components/steps/Step4_FeatureMaps/Step4FeatureMaps';
import Step5GlobalAvgPooling from './components/steps/Step5_GlobalAvgPooling/Step5GlobalAvgPooling';
import Step6DenseLayer from './components/steps/Step6_DenseLayer/Step6DenseLayer';
import LoadingSpinner from './components/shared/LoadingSpinner';

function App() {
  const { currentStep, modelStatus, inferenceStatus, setModel, setModelStatus } = useAppStore();

  // Build model on mount
  useEffect(() => {
    const init = async () => {
      try {
        setModelStatus('building');
        await tf.ready();
        const model = buildDemoModel();
        // Warm up the model with a dummy prediction
        const dummy = tf.zeros([1, 224, 224, 3]) as tf.Tensor4D;
        const warmup = model.predict(dummy) as tf.Tensor;
        warmup.dispose();
        dummy.dispose();
        setModel(model);
      } catch (err) {
        console.error('Model build failed:', err);
        setModelStatus('error');
      }
    };
    init();
  }, [setModel, setModelStatus]);

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <Step1ImageInput />;
      case 2: return <Step2Convolution />;
      case 3: return <Step3PaddingPooling />;
      case 4: return <Step4FeatureMaps />;
      case 5: return <Step5GlobalAvgPooling />;
      case 6: return <Step6DenseLayer />;
      default: return <Step1ImageInput />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <StepNavigation />
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-6">
        {modelStatus === 'building' ? (
          <LoadingSpinner message="CNN 모델을 구축하고 있습니다..." />
        ) : modelStatus === 'error' ? (
          <div className="text-center py-20">
            <p className="text-[#ef4444] text-lg">모델 로드에 실패했습니다.</p>
            <p className="text-[#94a3b8] text-sm mt-2">페이지를 새로고침해주세요.</p>
          </div>
        ) : (
          <>
            {renderStep()}
            {inferenceStatus === 'running' && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-[#1e293b] rounded-xl p-8 border border-[#334155] text-center">
                  <div className="w-12 h-12 border-4 border-[#334155] border-t-[#6366f1] rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-white font-medium">CNN 추론 중...</p>
                  <p className="text-[#94a3b8] text-sm mt-1">각 층의 활성화 데이터를 추출하고 있습니다</p>
                </div>
              </div>
            )}
          </>
        )}
      </main>
      <footer className="bg-[#1e293b] border-t border-[#334155] px-6 py-3 text-center">
        <p className="text-xs text-[#64748b]">
          AestheVision Explorer | 모든 연산은 브라우저 내에서만 수행됩니다 | 이미지는 서버로 전송되지 않습니다
        </p>
      </footer>
    </div>
  );
}

export default App;
