import * as tf from '@tensorflow/tfjs';
import { NUM_SCORES } from './diagnosticLabels';

export interface LayerConfig {
  name: string;
  type: 'conv2d' | 'maxpool' | 'gap' | 'dense';
  filters?: number;
  kernelSize?: number;
  units?: number;
}

export const LAYER_CONFIGS: LayerConfig[] = [
  { name: 'conv1', type: 'conv2d', filters: 32, kernelSize: 3 },
  { name: 'pool1', type: 'maxpool' },
  { name: 'conv2', type: 'conv2d', filters: 64, kernelSize: 3 },
  { name: 'pool2', type: 'maxpool' },
  { name: 'conv3', type: 'conv2d', filters: 128, kernelSize: 3 },
  { name: 'pool3', type: 'maxpool' },
  { name: 'conv4', type: 'conv2d', filters: 256, kernelSize: 3 },
  { name: 'pool4', type: 'maxpool' },
  { name: 'conv5', type: 'conv2d', filters: 512, kernelSize: 3 },
  { name: 'pool5', type: 'maxpool' },
  { name: 'gap', type: 'gap' },
  { name: 'dense_out', type: 'dense', units: NUM_SCORES },
];

export const CONV_LAYER_NAMES = ['conv1', 'conv3', 'conv5'];
export const ALL_EXTRACT_LAYERS = ['conv1', 'pool1', 'conv3', 'pool3', 'conv5', 'pool5', 'gap', 'dense_out'];

export function buildDemoModel(): tf.LayersModel {
  const input = tf.input({ shape: [224, 224, 3], name: 'input_image' });

  let x: tf.SymbolicTensor = input;

  for (const config of LAYER_CONFIGS) {
    switch (config.type) {
      case 'conv2d':
        x = tf.layers.conv2d({
          filters: config.filters,
          kernelSize: config.kernelSize!,
          padding: 'same',
          activation: 'relu',
          name: config.name,
          kernelInitializer: 'glorotUniform',
        }).apply(x) as tf.SymbolicTensor;
        break;
      case 'maxpool':
        x = tf.layers.maxPooling2d({
          poolSize: [2, 2],
          strides: [2, 2],
          name: config.name,
        }).apply(x) as tf.SymbolicTensor;
        break;
      case 'gap':
        x = tf.layers.globalAveragePooling2d({
          name: config.name,
        }).apply(x) as tf.SymbolicTensor;
        break;
      case 'dense':
        x = tf.layers.dense({
          units: config.units!,
          activation: 'sigmoid',
          name: config.name,
        }).apply(x) as tf.SymbolicTensor;
        break;
    }
  }

  const model = tf.model({ inputs: input, outputs: x });
  return model;
}

export function buildMultiOutputModel(model: tf.LayersModel): tf.LayersModel {
  const outputs = ALL_EXTRACT_LAYERS.map(name => {
    const layer = model.getLayer(name);
    return layer.output as tf.SymbolicTensor;
  });

  return tf.model({
    inputs: model.input,
    outputs,
  });
}
