import * as tf from '@tensorflow/tfjs';
import { buildMultiOutputModel, ALL_EXTRACT_LAYERS } from './buildDemoModel';

export interface ActivationData {
  layerName: string;
  shape: number[];
  data: Float32Array;
}

export interface InferenceResult {
  activations: Record<string, ActivationData>;
  scores: number[];
  denseWeights: { weights: number[][]; biases: number[] };
  gapValues: number[];
}

export async function runInference(
  model: tf.LayersModel,
  inputTensor: tf.Tensor4D
): Promise<InferenceResult> {
  const multiModel = buildMultiOutputModel(model);

  const outputs = multiModel.predict(inputTensor) as tf.Tensor[];

  const activations: Record<string, ActivationData> = {};

  for (let i = 0; i < ALL_EXTRACT_LAYERS.length; i++) {
    const name = ALL_EXTRACT_LAYERS[i];
    const tensor = outputs[i];
    const data = await tensor.data() as Float32Array;
    activations[name] = {
      layerName: name,
      shape: tensor.shape.slice(),
      data: new Float32Array(data),
    };
  }

  // Extract final scores (dense_out)
  const scoresData = activations['dense_out'].data;
  const scores = Array.from(scoresData).map(v => Math.round(v * 100));

  // Extract GAP values
  const gapValues = Array.from(activations['gap'].data);

  // Extract dense layer weights
  const denseLayer = model.getLayer('dense_out');
  const [weightsT, biasesT] = denseLayer.getWeights();
  const weightsData = await weightsT.data();
  const biasesData = await biasesT.data();

  const numInputs = weightsT.shape[0]!; // 512
  const numOutputs = weightsT.shape[1]!; // 65
  const weights: number[][] = [];
  for (let i = 0; i < numInputs; i++) {
    const row: number[] = [];
    for (let j = 0; j < numOutputs; j++) {
      row.push(weightsData[i * numOutputs + j]);
    }
    weights.push(row);
  }
  const biases = Array.from(biasesData);

  // Dispose tensors
  outputs.forEach(t => t.dispose());
  multiModel.dispose();

  return { activations, scores, denseWeights: { weights, biases }, gapValues };
}
