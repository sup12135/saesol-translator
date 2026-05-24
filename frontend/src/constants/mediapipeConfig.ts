// src/constants/mediapipeConfig.ts

// 배열이면 두 랜드마크의 평균 좌표, 숫자면 그대로 사용
export type LandmarkIndex = number | [number, number];

// Face 매핑
export const FACE_LANDMARK_POINTS: Record<string, LandmarkIndex[]> = {
    outline: [127, 234, 93, [132, 58], [58, 172], 136, 150, 176, 152, 400, 379, 365, [397, 288], 361, 323, 454, 356],
    right_eyebrow: [70, 63, 105, 66, 107],
    left_eyebrow: [336, 296, 334, 293, 300],
    nose_bridge: [[168, 6], [197, 195], 5, 4],
    nose_bottom: [75, 97, 2, 326, 305],
    right_eye: [33, 160, 158, 133, 153, 144],
    left_eye: [362, 385, 387, 263, 373, 380],
    upper_lip_outer: [61, 39, 37, 0, 267, 269, 291],
    lower_lip_outer: [321, 314, 17, 84, 91],
    upper_lip_inner: [78, 82, 13, 312, 308],
    lower_lip_inner: [317, 14, 87],
    iris: [468, 473],
};

// Pose 매핑
export const POSE_LANDMARK_POINTS: LandmarkIndex[] = [
    0,        // 0:  Nose
    [11, 12], // 1:  Neck        (LShoulder + RShoulder 평균)
    12,       // 2:  RShoulder
    14,       // 3:  RElbow
    16,       // 4:  RWrist
    11,       // 5:  LShoulder
    13,       // 6:  LElbow
    15,       // 7:  LWrist
    [23, 24], // 8:  MidHip      (LHip + RHip 평균)
    24,       // 9:  RHip
    26,       // 10: RKnee
    28,       // 11: RAnkle
    23,       // 12: LHip
    25,       // 13: LKnee
    27,       // 14: LAnkle
    5,        // 15: REye
    2,        // 16: LEye
    8,        // 17: REar
    7,        // 18: LEar
    31,       // 19: LBigToe
    31,       // 20: LSmallToe   (근사치)
    29,       // 21: LHeel
    32,       // 22: RBigToe
    32,       // 23: RSmallToe   (근사치)
    30,       // 24: RHeel
];

// Pose 연결선
export const POSE_CONNECTIONS: [number, number][] = [
    [0, 1], [1, 2], [2, 3], [3, 4],     // 오른팔
    [1, 5], [5, 6], [6, 7],             // 왼팔
    [1, 8],                             // 몸통
    [8, 9], [9, 10], [10, 11],          // 오른다리
    [8, 12], [12, 13], [13, 14],        // 왼다리
    [0, 15], [0, 16],                   // 눈
    [15, 17], [16, 18],                 // 귀
    [11, 24], [11, 22], [22, 23],       // 오른발
    [14, 21], [14, 19], [19, 20],       // 왼발
];

// Hand 연결선
export const HAND_CONNECTIONS: [number, number][] = [
    [0, 1], [1, 2], [2, 3], [3, 4],          // 엄지
    [0, 5], [5, 6], [6, 7], [7, 8],          // 검지
    [9, 10], [10, 11], [11, 12],             // 중지
    [13, 14], [14, 15], [15, 16],            // 약지
    [0, 17], [17, 18], [18, 19], [19, 20],  // 소지
    [5, 9], [9, 13], [13, 17],              // 손바닥
];