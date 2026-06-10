import tensorflow as tf

class ConformerBlock(tf.keras.Model):
    def __init__(self, d_model=256, num_heads=4, ffn_mult=4, conv_kernel=15, dropout=0.1, name=None):
        super().__init__(name=name)
        ffn_dim = d_model * ffn_mult

        self.ln_ffn1 = tf.keras.layers.LayerNormalization(dtype="float32")
        self.ffn1 = tf.keras.Sequential([
            tf.keras.layers.Dense(ffn_dim, activation="swish", dtype="float32"),
            tf.keras.layers.Dropout(dropout),
            tf.keras.layers.Dense(d_model, dtype="float32"),
        ])
        self.do_ffn1 = tf.keras.layers.Dropout(dropout)

        self.ln_attn = tf.keras.layers.LayerNormalization(dtype="float32")
        self.mha = tf.keras.layers.MultiHeadAttention(
            num_heads=num_heads, key_dim=d_model // num_heads, dropout=dropout, dtype="float32"
        )
        self.do_attn = tf.keras.layers.Dropout(dropout)

        self.ln_conv = tf.keras.layers.LayerNormalization(dtype="float32")
        self.pw1 = tf.keras.layers.Conv1D(2 * d_model, 1, padding="same", dtype="float32")
        self.dw = tf.keras.layers.SeparableConv1D(d_model, conv_kernel, padding="same", dtype="float32")
        self.ln_after_conv = tf.keras.layers.LayerNormalization(epsilon=1e-5, dtype="float32")
        self.pw2 = tf.keras.layers.Conv1D(d_model, 1, padding="same", dtype="float32")
        self.do_conv = tf.keras.layers.Dropout(dropout)

        self.ln_ffn2 = tf.keras.layers.LayerNormalization(epsilon=1e-5, dtype="float32")
        self.ffn2 = tf.keras.Sequential([
            tf.keras.layers.Dense(ffn_dim, activation="swish", dtype="float32"),
            tf.keras.layers.Dropout(dropout),
            tf.keras.layers.Dense(d_model, dtype="float32"),
        ])
        self.do_ffn2 = tf.keras.layers.Dropout(dropout)

        self.ln_out = tf.keras.layers.LayerNormalization(dtype="float32")

    def call(self, x, mask=None, training=False):
        # FFN half step
        y = self.ln_ffn1(x)
        y = self.ffn1(y, training=training)
        x = x + 0.5 * self.do_ffn1(y, training=training)

        # Self-attention
        y = self.ln_attn(x)
        attn_mask = None
        if mask is not None:
            # [B,T] -> [B,T,T]
            attn_mask = tf.logical_and(mask[:, :, None], mask[:, None, :])
        y = self.mha(y, y, attention_mask=attn_mask, training=training)
        x = x + self.do_attn(y, training=training)

        # Conv module + GLU
        y = self.ln_conv(x)
        y = self.pw1(y)
        a, b = tf.split(y, 2, axis=-1)
        y = a * tf.nn.sigmoid(b)          # GLU
        y = self.dw(y)
        y = self.ln_after_conv(y, training=training)
        y = tf.nn.swish(y)
        y = self.pw2(y)
        x = x + self.do_conv(y, training=training)

        # FFN half step
        y = self.ln_ffn2(x)
        y = self.ffn2(y, training=training)
        x = x + 0.5 * self.do_ffn2(y, training=training)

        return self.ln_out(x)