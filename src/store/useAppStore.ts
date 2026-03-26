import { create } from 'zustand';
import * as tf from '@tensorflow/tfjs';
import type { ActivationData, InferenceResult } from '../model/extractActivations';

export interface AppState {
  // Navigation
  currentStep: number;
  setCurrentStep: (step: number) => void;

  // Image
  sourceImage: HTMLImageElement | null;
  imageData: ImageData | null;
  processedTensor: tf.Tensor4D | null;
  setSourceImage: (img: HTMLImageElement) => void;
  setImageData: (data: ImageData) => void;
  setProcessedTensor: (t: tf.Tensor4D) => void;

  // Model
  modelStatus: 'idle' | 'building' | 'ready' | 'error';
  model: tf.LayersModel | null;
  setModel: (m: tf.LayersModel) => void;
  setModelStatus: (s: AppState['modelStatus']) => void;

  // Inference results
  activations: Record<string, ActivationData>;
  scores: number[];
  denseWeights: { weights: number[][]; biases: number[] } | null;
  gapValues: number[];
  inferenceStatus: 'idle' | 'running' | 'done' | 'error';
  setInferenceResult: (result: InferenceResult) => void;
  setInferenceStatus: (s: AppState['inferenceStatus']) => void;

  // UI
  animationSpeed: number;
  setAnimationSpeed: (speed: number) => void;
  selectedFilterIndex: number;
  setSelectedFilterIndex: (i: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentStep: 1,
  setCurrentStep: (step) => set({ currentStep: step }),

  sourceImage: null,
  imageData: null,
  processedTensor: null,
  setSourceImage: (img) => set({ sourceImage: img }),
  setImageData: (data) => set({ imageData: data }),
  setProcessedTensor: (t) => set({ processedTensor: t }),

  modelStatus: 'idle',
  model: null,
  setModel: (m) => set({ model: m, modelStatus: 'ready' }),
  setModelStatus: (s) => set({ modelStatus: s }),

  activations: {},
  scores: [],
  denseWeights: null,
  gapValues: [],
  inferenceStatus: 'idle',
  setInferenceResult: (result) => set({
    activations: result.activations,
    scores: result.scores,
    denseWeights: result.denseWeights,
    gapValues: result.gapValues,
    inferenceStatus: 'done',
  }),
  setInferenceStatus: (s) => set({ inferenceStatus: s }),

  animationSpeed: 1,
  setAnimationSpeed: (speed) => set({ animationSpeed: speed }),
  selectedFilterIndex: 0,
  setSelectedFilterIndex: (i) => set({ selectedFilterIndex: i }),
}));
