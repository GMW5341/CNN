export interface StepInfo {
  id: number;
  titleKo: string;
  titleEn: string;
  descriptionKo: string;
  icon: string;
}

export const STEPS: StepInfo[] = [
  {
    id: 1,
    titleKo: '컴퓨터의 눈으로 보기',
    titleEn: 'Pixel View',
    descriptionKo: '이미지는 224x224개의 픽셀로 이루어져 있으며, 각 픽셀은 R, G, B 세 가지 숫자(0~255)를 가집니다. 마우스를 사진 위에 올려 각 픽셀의 실제 숫자값을 확인해보세요.',
    icon: '🔍',
  },
  {
    id: 2,
    titleKo: '특징 찾아내기',
    titleEn: 'Convolution',
    descriptionKo: '3x3 필터가 사진 위를 훑으며 색소나 주름 같은 특정 패턴을 수치화합니다. 필터가 지나간 자리에는 새로운 특징 지도(Feature Map)가 만들어집니다.',
    icon: '🔬',
  },
  {
    id: 3,
    titleKo: '패딩과 풀링',
    titleEn: 'Padding & Pooling',
    descriptionKo: '패딩은 가장자리에 0을 채워 이미지 크기를 유지합니다. 풀링은 2x2 영역에서 가장 큰 값만 남겨 데이터를 의도적으로 압축합니다.',
    icon: '📐',
  },
  {
    id: 4,
    titleKo: '추상화의 깊이',
    titleEn: 'Feature Maps',
    descriptionKo: '깊은 층으로 갈수록 이미지가 추상화됩니다. 초기 층은 가장자리와 윤곽선을 감지하고, 깊은 층은 질감이나 패턴 같은 고수준 특징을 인식합니다.',
    icon: '🎨',
  },
  {
    id: 5,
    titleKo: '핵심 압축',
    titleEn: 'Global Average Pooling',
    descriptionKo: '수백 장의 특징 지도가 각각 하나의 숫자로 평균화되어, 단 512개의 핵심 숫자로 압축됩니다. 이것이 이미지의 최종 특징 벡터입니다.',
    icon: '🎯',
  },
  {
    id: 6,
    titleKo: '65종 점수 도출',
    titleEn: 'Dense Layer',
    descriptionKo: '512개의 숫자가 각각의 가중치와 곱해져 65종의 구체적인 피부 진단 점수(0~100)로 변환됩니다. 각 지표를 클릭하면 어떤 특징이 가장 큰 영향을 주었는지 확인할 수 있습니다.',
    icon: '📊',
  },
];
