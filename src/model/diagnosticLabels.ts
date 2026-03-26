export interface DiagnosticLabel {
  key: string;
  nameKo: string;
  nameEn: string;
  category: string;
  categoryKo: string;
  zone: string;
}

export const diagnosticLabels: DiagnosticLabel[] = [
  // Pigmentation (색소침착) - 14
  { key: 'pigmentation_forehead', nameKo: '색소침착 (이마)', nameEn: 'Pigmentation (Forehead)', category: 'pigmentation', categoryKo: '색소침착', zone: 'forehead' },
  { key: 'pigmentation_glabella', nameKo: '색소침착 (미간)', nameEn: 'Pigmentation (Glabella)', category: 'pigmentation', categoryKo: '색소침착', zone: 'glabella' },
  { key: 'pigmentation_left_cheek', nameKo: '색소침착 (왼쪽 볼)', nameEn: 'Pigmentation (Left Cheek)', category: 'pigmentation', categoryKo: '색소침착', zone: 'left_cheek' },
  { key: 'pigmentation_right_cheek', nameKo: '색소침착 (오른쪽 볼)', nameEn: 'Pigmentation (Right Cheek)', category: 'pigmentation', categoryKo: '색소침착', zone: 'right_cheek' },
  { key: 'pigmentation_left_periorbital', nameKo: '색소침착 (왼쪽 눈가)', nameEn: 'Pigmentation (Left Periorbital)', category: 'pigmentation', categoryKo: '색소침착', zone: 'left_periorbital' },
  { key: 'pigmentation_right_periorbital', nameKo: '색소침착 (오른쪽 눈가)', nameEn: 'Pigmentation (Right Periorbital)', category: 'pigmentation', categoryKo: '색소침착', zone: 'right_periorbital' },
  { key: 'pigmentation_nose', nameKo: '색소침착 (코)', nameEn: 'Pigmentation (Nose)', category: 'pigmentation', categoryKo: '색소침착', zone: 'nose' },
  { key: 'pigmentation_left_nasolabial', nameKo: '색소침착 (왼쪽 팔자)', nameEn: 'Pigmentation (Left Nasolabial)', category: 'pigmentation', categoryKo: '색소침착', zone: 'left_nasolabial' },
  { key: 'pigmentation_right_nasolabial', nameKo: '색소침착 (오른쪽 팔자)', nameEn: 'Pigmentation (Right Nasolabial)', category: 'pigmentation', categoryKo: '색소침착', zone: 'right_nasolabial' },
  { key: 'pigmentation_upper_lip', nameKo: '색소침착 (윗입술)', nameEn: 'Pigmentation (Upper Lip)', category: 'pigmentation', categoryKo: '색소침착', zone: 'upper_lip' },
  { key: 'pigmentation_lower_lip', nameKo: '색소침착 (아랫입술)', nameEn: 'Pigmentation (Lower Lip)', category: 'pigmentation', categoryKo: '색소침착', zone: 'lower_lip' },
  { key: 'pigmentation_chin', nameKo: '색소침착 (턱)', nameEn: 'Pigmentation (Chin)', category: 'pigmentation', categoryKo: '색소침착', zone: 'chin' },
  { key: 'pigmentation_left_jaw', nameKo: '색소침착 (왼쪽 턱선)', nameEn: 'Pigmentation (Left Jaw)', category: 'pigmentation', categoryKo: '색소침착', zone: 'left_jaw' },
  { key: 'pigmentation_right_jaw', nameKo: '색소침착 (오른쪽 턱선)', nameEn: 'Pigmentation (Right Jaw)', category: 'pigmentation', categoryKo: '색소침착', zone: 'right_jaw' },

  // Wrinkles (주름) - 12
  { key: 'wrinkle_forehead', nameKo: '주름 (이마)', nameEn: 'Wrinkle (Forehead)', category: 'wrinkle', categoryKo: '주름', zone: 'forehead' },
  { key: 'wrinkle_glabella', nameKo: '주름 (미간)', nameEn: 'Wrinkle (Glabella)', category: 'wrinkle', categoryKo: '주름', zone: 'glabella' },
  { key: 'wrinkle_left_crow_feet', nameKo: '주름 (왼쪽 눈꼬리)', nameEn: 'Wrinkle (Left Crow\'s Feet)', category: 'wrinkle', categoryKo: '주름', zone: 'left_crow_feet' },
  { key: 'wrinkle_right_crow_feet', nameKo: '주름 (오른쪽 눈꼬리)', nameEn: 'Wrinkle (Right Crow\'s Feet)', category: 'wrinkle', categoryKo: '주름', zone: 'right_crow_feet' },
  { key: 'wrinkle_left_under_eye', nameKo: '주름 (왼쪽 눈밑)', nameEn: 'Wrinkle (Left Under Eye)', category: 'wrinkle', categoryKo: '주름', zone: 'left_under_eye' },
  { key: 'wrinkle_right_under_eye', nameKo: '주름 (오른쪽 눈밑)', nameEn: 'Wrinkle (Right Under Eye)', category: 'wrinkle', categoryKo: '주름', zone: 'right_under_eye' },
  { key: 'wrinkle_left_nasolabial', nameKo: '주름 (왼쪽 팔자)', nameEn: 'Wrinkle (Left Nasolabial)', category: 'wrinkle', categoryKo: '주름', zone: 'left_nasolabial' },
  { key: 'wrinkle_right_nasolabial', nameKo: '주름 (오른쪽 팔자)', nameEn: 'Wrinkle (Right Nasolabial)', category: 'wrinkle', categoryKo: '주름', zone: 'right_nasolabial' },
  { key: 'wrinkle_upper_lip', nameKo: '주름 (윗입술)', nameEn: 'Wrinkle (Upper Lip)', category: 'wrinkle', categoryKo: '주름', zone: 'upper_lip' },
  { key: 'wrinkle_left_marionette', nameKo: '주름 (왼쪽 마리오네트)', nameEn: 'Wrinkle (Left Marionette)', category: 'wrinkle', categoryKo: '주름', zone: 'left_marionette' },
  { key: 'wrinkle_right_marionette', nameKo: '주름 (오른쪽 마리오네트)', nameEn: 'Wrinkle (Right Marionette)', category: 'wrinkle', categoryKo: '주름', zone: 'right_marionette' },
  { key: 'wrinkle_neck', nameKo: '주름 (목)', nameEn: 'Wrinkle (Neck)', category: 'wrinkle', categoryKo: '주름', zone: 'neck' },

  // Pores (모공) - 6
  { key: 'pore_nose', nameKo: '모공 (코)', nameEn: 'Pore (Nose)', category: 'pore', categoryKo: '모공', zone: 'nose' },
  { key: 'pore_left_cheek', nameKo: '모공 (왼쪽 볼)', nameEn: 'Pore (Left Cheek)', category: 'pore', categoryKo: '모공', zone: 'left_cheek' },
  { key: 'pore_right_cheek', nameKo: '모공 (오른쪽 볼)', nameEn: 'Pore (Right Cheek)', category: 'pore', categoryKo: '모공', zone: 'right_cheek' },
  { key: 'pore_left_temple', nameKo: '모공 (왼쪽 관자놀이)', nameEn: 'Pore (Left Temple)', category: 'pore', categoryKo: '모공', zone: 'left_temple' },
  { key: 'pore_right_temple', nameKo: '모공 (오른쪽 관자놀이)', nameEn: 'Pore (Right Temple)', category: 'pore', categoryKo: '모공', zone: 'right_temple' },
  { key: 'pore_chin', nameKo: '모공 (턱)', nameEn: 'Pore (Chin)', category: 'pore', categoryKo: '모공', zone: 'chin' },

  // Elasticity (탄력) - 6
  { key: 'elasticity_forehead', nameKo: '탄력 (이마)', nameEn: 'Elasticity (Forehead)', category: 'elasticity', categoryKo: '탄력', zone: 'forehead' },
  { key: 'elasticity_left_cheek', nameKo: '탄력 (왼쪽 볼)', nameEn: 'Elasticity (Left Cheek)', category: 'elasticity', categoryKo: '탄력', zone: 'left_cheek' },
  { key: 'elasticity_right_cheek', nameKo: '탄력 (오른쪽 볼)', nameEn: 'Elasticity (Right Cheek)', category: 'elasticity', categoryKo: '탄력', zone: 'right_cheek' },
  { key: 'elasticity_left_jaw', nameKo: '탄력 (왼쪽 턱선)', nameEn: 'Elasticity (Left Jaw)', category: 'elasticity', categoryKo: '탄력', zone: 'left_jaw' },
  { key: 'elasticity_right_jaw', nameKo: '탄력 (오른쪽 턱선)', nameEn: 'Elasticity (Right Jaw)', category: 'elasticity', categoryKo: '탄력', zone: 'right_jaw' },
  { key: 'elasticity_neck', nameKo: '탄력 (목)', nameEn: 'Elasticity (Neck)', category: 'elasticity', categoryKo: '탄력', zone: 'neck' },

  // Sebum (피지) - 5
  { key: 'sebum_forehead', nameKo: '피지 (이마)', nameEn: 'Sebum (Forehead)', category: 'sebum', categoryKo: '피지', zone: 'forehead' },
  { key: 'sebum_nose', nameKo: '피지 (코)', nameEn: 'Sebum (Nose)', category: 'sebum', categoryKo: '피지', zone: 'nose' },
  { key: 'sebum_left_cheek', nameKo: '피지 (왼쪽 볼)', nameEn: 'Sebum (Left Cheek)', category: 'sebum', categoryKo: '피지', zone: 'left_cheek' },
  { key: 'sebum_right_cheek', nameKo: '피지 (오른쪽 볼)', nameEn: 'Sebum (Right Cheek)', category: 'sebum', categoryKo: '피지', zone: 'right_cheek' },
  { key: 'sebum_chin', nameKo: '피지 (턱)', nameEn: 'Sebum (Chin)', category: 'sebum', categoryKo: '피지', zone: 'chin' },

  // Moisture (수분) - 5
  { key: 'moisture_forehead', nameKo: '수분 (이마)', nameEn: 'Moisture (Forehead)', category: 'moisture', categoryKo: '수분', zone: 'forehead' },
  { key: 'moisture_left_cheek', nameKo: '수분 (왼쪽 볼)', nameEn: 'Moisture (Left Cheek)', category: 'moisture', categoryKo: '수분', zone: 'left_cheek' },
  { key: 'moisture_right_cheek', nameKo: '수분 (오른쪽 볼)', nameEn: 'Moisture (Right Cheek)', category: 'moisture', categoryKo: '수분', zone: 'right_cheek' },
  { key: 'moisture_nose', nameKo: '수분 (코)', nameEn: 'Moisture (Nose)', category: 'moisture', categoryKo: '수분', zone: 'nose' },
  { key: 'moisture_chin', nameKo: '수분 (턱)', nameEn: 'Moisture (Chin)', category: 'moisture', categoryKo: '수분', zone: 'chin' },

  // Redness (홍조) - 5
  { key: 'redness_forehead', nameKo: '홍조 (이마)', nameEn: 'Redness (Forehead)', category: 'redness', categoryKo: '홍조', zone: 'forehead' },
  { key: 'redness_nose', nameKo: '홍조 (코)', nameEn: 'Redness (Nose)', category: 'redness', categoryKo: '홍조', zone: 'nose' },
  { key: 'redness_left_cheek', nameKo: '홍조 (왼쪽 볼)', nameEn: 'Redness (Left Cheek)', category: 'redness', categoryKo: '홍조', zone: 'left_cheek' },
  { key: 'redness_right_cheek', nameKo: '홍조 (오른쪽 볼)', nameEn: 'Redness (Right Cheek)', category: 'redness', categoryKo: '홍조', zone: 'right_cheek' },
  { key: 'redness_chin', nameKo: '홍조 (턱)', nameEn: 'Redness (Chin)', category: 'redness', categoryKo: '홍조', zone: 'chin' },

  // Texture (피부결) - 3
  { key: 'texture_forehead', nameKo: '피부결 (이마)', nameEn: 'Texture (Forehead)', category: 'texture', categoryKo: '피부결', zone: 'forehead' },
  { key: 'texture_left_cheek', nameKo: '피부결 (왼쪽 볼)', nameEn: 'Texture (Left Cheek)', category: 'texture', categoryKo: '피부결', zone: 'left_cheek' },
  { key: 'texture_right_cheek', nameKo: '피부결 (오른쪽 볼)', nameEn: 'Texture (Right Cheek)', category: 'texture', categoryKo: '피부결', zone: 'right_cheek' },

  // Dark Circles (다크서클) - 2
  { key: 'dark_circle_left', nameKo: '다크서클 (왼쪽)', nameEn: 'Dark Circle (Left)', category: 'dark_circle', categoryKo: '다크서클', zone: 'left' },
  { key: 'dark_circle_right', nameKo: '다크서클 (오른쪽)', nameEn: 'Dark Circle (Right)', category: 'dark_circle', categoryKo: '다크서클', zone: 'right' },

  // Acne (여드름) - 4
  { key: 'acne_forehead', nameKo: '여드름 (이마)', nameEn: 'Acne (Forehead)', category: 'acne', categoryKo: '여드름', zone: 'forehead' },
  { key: 'acne_left_cheek', nameKo: '여드름 (왼쪽 볼)', nameEn: 'Acne (Left Cheek)', category: 'acne', categoryKo: '여드름', zone: 'left_cheek' },
  { key: 'acne_right_cheek', nameKo: '여드름 (오른쪽 볼)', nameEn: 'Acne (Right Cheek)', category: 'acne', categoryKo: '여드름', zone: 'right_cheek' },
  { key: 'acne_chin', nameKo: '여드름 (턱)', nameEn: 'Acne (Chin)', category: 'acne', categoryKo: '여드름', zone: 'chin' },

  // Skin Age & Overall - 3
  { key: 'skin_age', nameKo: '피부 나이', nameEn: 'Skin Age', category: 'overall', categoryKo: '종합', zone: 'overall' },
  { key: 'overall_score', nameKo: '종합 점수', nameEn: 'Overall Score', category: 'overall', categoryKo: '종합', zone: 'overall' },
  { key: 'brightness_overall', nameKo: '광채', nameEn: 'Brightness', category: 'overall', categoryKo: '종합', zone: 'overall' },
];

export const NUM_SCORES = diagnosticLabels.length; // 65
