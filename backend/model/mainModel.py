import tensorflow as tf
from .conformer import ConformerBlock

# 패딩된 비디오 프레임을 찾는 함수
def make_frame_mask(video):
    v = tf.cast(video, tf.float32)
    
    # 프레임에서 절댓값이 가장 큰 값을 뽑기
    energy = tf.reduce_max(tf.abs(v), axis=[2, 3, 4])  # [B, T]
    
    # 절댓값이 0보다 크면 True, 아니면 False가 반환되는 배열 출력
    return energy > 0.0


def make_model(voca_size):
    video_input = tf.keras.Input(shape=(None, 224, 224, 3))
    keypoint_input = tf.keras.Input(shape=(None, 381))

    base_model = tf.keras.applications.ResNet50(
        include_top=False,
        weights="imagenet",
        input_shape=(224, 224, 3),
    )

    # resnet50의 미리 학습된 모델을 학습용으로 사용하지 않도록 설정
    for layer in base_model.layers:
        layer.trainable = False

    cnn = tf.keras.Sequential([
        base_model,
        tf.keras.layers.GlobalAveragePooling2D()
    ], name="cnn")

    class FrameCNN(tf.keras.layers.Layer):
        def __init__(self, cnn):
            super().__init__()
            self.cnn = cnn
            self.proj = tf.keras.layers.Dense(512)

        def call(self, video):
            shape = tf.shape(video)
            
            x = tf.reshape(video, (-1, 224, 224, 3))
            x = self.cnn(x)
            x = self.proj(x)
            
            return tf.reshape(x, (shape[0], shape[1], 512))
        
    x = FrameCNN(cnn)(video_input)

    #keypoint feature
    k = tf.keras.layers.LSTM(128, return_sequences=True, dtype="float32")(keypoint_input)
    k = tf.keras.layers.Dense(128, dtype="float32")(k)
    #k = tf.keras.layers.LayerNormalization(epsilon=1e-5, dtype="float32")(k)

    #video, keypoint feature 합치기
    combined = tf.keras.layers.Concatenate()([x, k])
    combined = tf.keras.layers.LayerNormalization(epsilon=1e-5, dtype="float32")(combined)
    h = tf.keras.layers.Dense(256, dtype="float32")(combined)  # d_model 맞춤

    frame_mask = tf.keras.layers.Lambda(make_frame_mask, name="frame_mask")(video_input)

    # Conformer stack
    for i in range(2):
        h = ConformerBlock(
            d_model=256, num_heads=4, ffn_mult=4, conv_kernel=15, dropout=0.1,
            )(h, mask=frame_mask)

    #activate 함수 없이 출력
    output = tf.keras.layers.Dense(voca_size, dtype='float32')(h)

    model = tf.keras.Model(
        inputs=[video_input, keypoint_input],
        outputs=output
    )
    
    return model