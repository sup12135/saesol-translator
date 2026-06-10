import numpy as np

def _get_shoulder_root_scale(pose):
    """pose에서 어깨 중심(root)과 어깨폭(scale)을 계산한다."""
    r_shoulder = pose[2, :2]
    l_shoulder = pose[5, :2]
    root = (r_shoulder + l_shoulder) / 2.0
    scale = np.linalg.norm(l_shoulder - r_shoulder)
    if scale < 1e-6:
        scale = 1.0
    return root, float(scale)

def normalize_pose(pose, root=None, scale=None):
    pose = pose.copy()

    if root is None or scale is None:
        root, scale = _get_shoulder_root_scale(pose)

    pose[:, :2] = (pose[:, :2] - root) / scale

    return pose

def normalize_hand(hand, scale=None):
    hand = hand.copy()

    # 손목 기준으로 이동 후, 스케일은 어깨폭(권장) 또는 기존 bbox 스케일 사용
    wrist = hand[0, :2]
    if scale is None:
        min_xy = np.min(hand[:, :2], axis=0)
        max_xy = np.max(hand[:, :2], axis=0)
        scale = np.max(max_xy - min_xy)
        if scale < 1e-6:
            scale = 1.0

    hand[:, :2] = (hand[:, :2] - wrist) / scale

    return hand

def normalize_face(face, scale=None):
    face = face.copy()

    # 코 주변 포인트를 중심으로 이동 후, 스케일은 어깨폭(권장) 또는 기존 bbox 스케일 사용
    center = face[30, :2]
    if scale is None:
        min_xy = np.min(face[:, :2], axis=0)
        max_xy = np.max(face[:, :2], axis=0)
        scale = np.max(max_xy - min_xy)
        if scale < 1e-6:
            scale = 1.0

    face[:, :2] = (face[:, :2] - center) / scale

    return face

def normalize_keypoints(keypoints):
    """
    sequence: (T, 381)
    return: (T, 381)
    """
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