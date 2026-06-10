import tensorflow as tf

def make_frame_mask(video: tf.Tensor) -> tf.Tensor:
    """Detect non-padded frames from video tensor [B, T, H, W, C]."""
    v = tf.cast(video, tf.float32)
    energy = tf.reduce_max(tf.abs(v), axis=[2, 3, 4])  # [B, T]
    return energy > 0.0


@tf.keras.utils.register_keras_serializable()
class VideoTemporalSignModel(tf.keras.Model):
    """
    TensorFlow port of the previous PyTorch default_model.
    Input:
      - video: [B, T, 224, 224, 3]
      - optional keypoint: [B, T, K] (ignored for compatibility)
    Output:
      - logits: [B, T//4, vocab_size]
    """

    def __init__(self, vocab_size: int, **kwargs):
        super().__init__(**kwargs)
        self.vocab_size = int(vocab_size)

        kinit = tf.keras.initializers.HeNormal()
        xinit = tf.keras.initializers.GlorotNormal()

        # 2D feature extraction (frame-level)
        self.conv1 = tf.keras.layers.Conv2D(32, 3, padding="same", use_bias=False, kernel_initializer=kinit)
        self.bn1 = tf.keras.layers.BatchNormalization()
        self.pool1 = tf.keras.layers.MaxPool2D(pool_size=2, strides=2)

        self.conv2 = tf.keras.layers.Conv2D(64, 3, padding="same", use_bias=False, kernel_initializer=kinit)
        self.bn2 = tf.keras.layers.BatchNormalization()
        self.pool2 = tf.keras.layers.MaxPool2D(pool_size=2, strides=2)

        self.conv3 = tf.keras.layers.Conv2D(64, 3, padding="same", use_bias=False, kernel_initializer=kinit)
        self.bn3 = tf.keras.layers.BatchNormalization()
        self.conv4 = tf.keras.layers.Conv2D(128, 3, padding="same", use_bias=False, kernel_initializer=kinit)
        self.bn4 = tf.keras.layers.BatchNormalization()
        self.pool4 = tf.keras.layers.MaxPool2D(pool_size=2, strides=2)

        self.conv5 = tf.keras.layers.Conv2D(128, 3, padding="same", use_bias=False, kernel_initializer=kinit)
        self.bn5 = tf.keras.layers.BatchNormalization()
        self.conv6 = tf.keras.layers.Conv2D(256, 3, padding="same", use_bias=False, kernel_initializer=kinit)
        self.bn6 = tf.keras.layers.BatchNormalization()
        self.pool6 = tf.keras.layers.MaxPool2D(pool_size=2, strides=2)

        self.conv7 = tf.keras.layers.Conv2D(256, 3, padding="same", use_bias=False, kernel_initializer=kinit)
        self.bn7 = tf.keras.layers.BatchNormalization()
        self.conv8 = tf.keras.layers.Conv2D(512, 3, padding="same", use_bias=False, kernel_initializer=kinit)
        self.bn8 = tf.keras.layers.BatchNormalization()
        self.pool8 = tf.keras.layers.MaxPool2D(pool_size=2, strides=2)

        self.conv9 = tf.keras.layers.Conv2D(512, 3, padding="same", use_bias=False, kernel_initializer=kinit)
        self.bn9 = tf.keras.layers.BatchNormalization()
        self.avg_pool = tf.keras.layers.GlobalAveragePooling2D()

        # Temporal encoder
        self.tconv1 = tf.keras.layers.Conv1D(512, 5, padding="same", use_bias=False, kernel_initializer=kinit)
        self.tbn1 = tf.keras.layers.BatchNormalization()
        self.tpool1 = tf.keras.layers.MaxPool1D(pool_size=2, strides=2)

        self.tconv2 = tf.keras.layers.Conv1D(512, 5, padding="same", use_bias=False, kernel_initializer=kinit)
        self.tbn2 = tf.keras.layers.BatchNormalization()
        self.tpool2 = tf.keras.layers.MaxPool1D(pool_size=2, strides=2)

        self.tconv3 = tf.keras.layers.Conv1D(1024, 3, padding="same", use_bias=False, kernel_initializer=kinit)
        self.tbn3 = tf.keras.layers.BatchNormalization()

        self.classifier = tf.keras.layers.Dense(self.vocab_size, kernel_initializer=xinit, bias_initializer="zeros")

        self.relu = tf.keras.layers.ReLU()

    def _conv_block(self, x: tf.Tensor, conv: tf.keras.layers.Layer, bn: tf.keras.layers.Layer, training: bool) -> tf.Tensor:
        x = conv(x)
        x = bn(x, training=training)
        return self.relu(x)

    def extract_feature(self, video: tf.Tensor, training: bool = False) -> tf.Tensor:
        shape = tf.shape(video)
        b = shape[0]
        t = shape[1]

        # [B, T, H, W, C] -> [B*T, H, W, C]
        x = tf.reshape(video, (b * t, shape[2], shape[3], shape[4]))

        x = self.pool1(self._conv_block(x, self.conv1, self.bn1, training))
        x = self.pool2(self._conv_block(x, self.conv2, self.bn2, training))
        x = self.pool4(self._conv_block(self._conv_block(x, self.conv3, self.bn3, training), self.conv4, self.bn4, training))
        x = self.pool6(self._conv_block(self._conv_block(x, self.conv5, self.bn5, training), self.conv6, self.bn6, training))
        x = self.pool8(self._conv_block(self._conv_block(x, self.conv7, self.bn7, training), self.conv8, self.bn8, training))
        x = self._conv_block(x, self.conv9, self.bn9, training)
        x = self.avg_pool(x)  # [B*T, 512]

        # [B*T, 512] -> [B, T, 512]
        x = tf.reshape(x, (b, t, 512))
        return x

    def call(self, inputs, training: bool = False):
        # notebook compatibility: model([video, keypoint]) or model((video, keypoint))
        if isinstance(inputs, (tuple, list)):
            if len(inputs) == 0:
                raise ValueError("Expected at least one input tensor (video).")
            video = inputs[0]
        else:
            video = inputs

        frame_mask = make_frame_mask(video)  # [B, T]

        x = self.extract_feature(video, training=training)  # [B, T, 512]
        x = self._conv_block(x, self.tconv1, self.tbn1, training)
        x = self.tpool1(x)
        x = self._conv_block(x, self.tconv2, self.tbn2, training)
        x = self.tpool2(x)
        x = self._conv_block(x, self.tconv3, self.tbn3, training)  # [B, T//4, 1024]

        logits = self.classifier(x)  # [B, T//4, vocab]

        # Downsample mask with the same temporal pooling path to keep shape aligned.
        mask = tf.cast(frame_mask, logits.dtype)             # [B, T]
        mask = tf.expand_dims(mask, axis=-1)                 # [B, T, 1]
        mask = self.tpool1(mask)                             # [B, T//2, 1] (valid pooling)
        mask = self.tpool2(mask)                             # [B, T//4, 1] (valid pooling)
        mask = tf.cast(mask > 0.0, logits.dtype)
        return logits * mask

    def get_config(self):
        cfg = super().get_config()
        cfg.update({"vocab_size": self.vocab_size})
        return cfg


def make_model(voca_size: int) -> tf.keras.Model:
    """
    Factory kept for compatibility with model.ipynb usage.
    """
    video_input = tf.keras.Input(shape=(None, 224, 224, 3), name="video")
    keypoint_input = tf.keras.Input(shape=(None, 411), name="keypoint")

    model = VideoTemporalSignModel(voca_size, name="default_video_temporal_model")
    output = model([video_input, keypoint_input])
    return tf.keras.Model(inputs=[video_input, keypoint_input], outputs=output, name="default_sign_model_tf")
