import tensorflow as tf
import cv2
import numpy as np
import pandas as pd
import utils
import math
import json

def create_infer_data(video_path, keypoints):
    video_data = load_video(video_path)
    keypoints_data = load_keypoints(keypoints)
    
    # keypoints_data = json.loads(keypoints)
    # keypoints_data = keypoints.values.astype(np.float32)
    # keypoints_data = utils.normalize_keypoints(keypoints)
    
    T = min(len(video_data), len(keypoints_data))

    video_data = video_data[:T:2]
    keypoints_data = keypoints_data[:T:2]
    
    #resnet50에 맞게 전처리
    video_data = tf.keras.applications.resnet50.preprocess_input(video_data)

    return video_data, keypoints_data

def load_video(video_path):
    cap = cv2.VideoCapture(video_path)

    frames = []
    
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        
        #BGR -> RGB
        frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        frames.append(frame)

    cap.release()

    return np.array(frames)

def load_keypoints(keypoint_path):
    remove_idx = np.r_[
        240:246,
        249:255,
        267:285
    ]
    
    keypoints = pd.read_csv(keypoint_path)
    keypoints = keypoints.values.astype(np.float32)
    
    keypoints = np.delete(keypoints, remove_idx, axis=1)

    keypoints = utils.normalize_keypoints(keypoints)

    return keypoints

def load_video_and_keypoint(video_path, keypoint_path):
    if isinstance(video_path, bytes):
        video_path = video_path.decode('utf-8')
    if isinstance(keypoint_path, bytes):
        keypoint_path = keypoint_path.decode('utf-8')

    video = load_video(video_path)
    keypoint = load_keypoints(keypoint_path)
    
    T = min(len(video), len(keypoint))

    video = video[:T:2]
    keypoint = keypoint[:T:2]
    
    #resnet50에 맞게 전처리
    video = tf.keras.applications.resnet50.preprocess_input(video)

    return video, keypoint

def load_data(video_path, keypoint_path, glosses):
    video, keypoint = tf.numpy_function(
        load_video_and_keypoint,
        [video_path, keypoint_path],
        [tf.float32, tf.float32]
    )

    video.set_shape((None, 224, 224, 3))
    keypoint.set_shape((None, 381))

    #T = tf.minimum(tf.shape(video)[0], tf.shape(keypoint)[0])
    #video = video[:T:2]
    #keypoint = keypoint[:T:2]

    return (video, keypoint, tf.shape(video)[0]), glosses

def make_dataset_from_df(data, batch_size):
    def generator():
        for _, row in data.iterrows():
            yield (
                row['video_path'],
                row['keypoint_path'],
                row['morpheme']
            )
            
    dataset = tf.data.Dataset.from_generator(
        generator,
        output_signature=(
            tf.TensorSpec(shape=(), dtype=tf.string),
            tf.TensorSpec(shape=(), dtype=tf.string),
            tf.TensorSpec(shape=(None,), dtype=tf.int32)
        )
    )
    
    dataset = dataset.map(load_data, num_parallel_calls=tf.data.AUTOTUNE)
    
    dataset = dataset.padded_batch(
        batch_size,
        padded_shapes=(
            # video (T, H, W, C), keypoint (T, V), video_length
            ([None, 224, 224, 3], [None, 381], []),
            [None]                 # morpheme (sequence)
        ),
        padding_values=(
            # video padding, keypoint padding, video_length
            (0.0, 0.0, 0),
            3     # morpheme padding
        )
    )
    
    return dataset.prefetch(tf.data.AUTOTUNE)

def make_shard_dataset(data, make_shards_num):
    NUM_SAMPLES = len(data)
    SHARD_SAMPLE_SIZE = math.ceil(NUM_SAMPLES / make_shards_num)
    
    shard_datasets = []

    for shardIdx in range(make_shards_num):
        start = shardIdx * SHARD_SAMPLE_SIZE
        end = min((shardIdx + 1) * SHARD_SAMPLE_SIZE, NUM_SAMPLES)
        
        if start < end:
            shard_datasets.append(data.iloc[start:end])
            
    return shard_datasets