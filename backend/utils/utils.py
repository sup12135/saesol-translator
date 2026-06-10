import numpy as np

# 양쪽 어깨의 중심(root)과 어깨폭(scale)을 계산하는 함수
def _get_shoulder_root_scale(pose):
    r_shoulder = pose[2, :2]
    l_shoulder = pose[5, :2]
    
    root = (r_shoulder + l_shoulder) / 2.0
    scale = np.linalg.norm(l_shoulder - r_shoulder)
    
    # scale이 너무 작은 경우 1로 처리
    if scale < 1e-6:
        scale = 1.0
        
    return root, float(scale)

def normalize_pose(pose, root=None, scale=None):
    pose = pose.copy()

    pose[:, :2] = (pose[:, :2] - root) / scale

    return pose

def normalize_hand(hand, scale=None):
    hand = hand.copy()

    # 손목을 기준 좌표로 선택
    wrist = hand[0, :2]

    hand[:, :2] = (hand[:, :2] - wrist) / scale

    return hand

def normalize_face(face, scale=None):
    face = face.copy()

    # 코 주변 포인트를 기준 좌표로 선택
    center = face[30, :2]

    face[:, :2] = (face[:, :2] - center) / scale

    return face

# keypoint를 정규화하는 함수
def normalize_keypoints(keypoints):
    T = keypoints.shape[0]
    normalized_seq = []

    for t in range(T):
        frame = keypoints[t]

        # -------- 1. 분리 --------
        face = frame[:210].reshape(70, 3)
        pose = frame[210:255].reshape(15, 3)
        left_hand = frame[255:318].reshape(21, 3)
        right_hand = frame[318:381].reshape(21, 3)

        # -------- 2. normalize (어깨폭 공통 스케일) --------
        root, shoulder_scale = _get_shoulder_root_scale(pose)
        pose = normalize_pose(pose, root=root, scale=shoulder_scale)
        face = normalize_face(face, scale=shoulder_scale)
        left_hand = normalize_hand(left_hand, scale=shoulder_scale)
        right_hand = normalize_hand(right_hand, scale=shoulder_scale)

        # -------- 3. 다시 합치기 --------
        new_frame = np.concatenate([
            face.reshape(-1),
            pose.reshape(-1),
            left_hand.reshape(-1),
            right_hand.reshape(-1)
        ])

        normalized_seq.append(new_frame)

    return np.array(normalized_seq)