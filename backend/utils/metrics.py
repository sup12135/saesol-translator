# metrics에서 제작된 함수들은 AI가 작성한 코드로 검증 후 사용되었음

from typing import Callable, Iterable, List, Sequence, Tuple
import tensorflow as tf

# 예측값과 정답값의 최소 수정 횟수를(WER 비율을 위한) DP 알고리즘을 통해 찾는 함수
def _edit_distance(ref: Sequence[int], hyp: Sequence[int]) -> int:
    n = len(ref)
    m = len(hyp)
    dp = [[0] * (m + 1) for _ in range(n + 1)]

    for i in range(n + 1):
        dp[i][0] = i
    for j in range(m + 1):
        dp[0][j] = j

    for i in range(1, n + 1):
        for j in range(1, m + 1):
            cost = 0 if ref[i - 1] == hyp[j - 1] else 1
            dp[i][j] = min(
                dp[i - 1][j] + 1,
                dp[i][j - 1] + 1,
                dp[i - 1][j - 1] + cost,
            )
    return dp[n][m]

# 예측값과 정답값의 최소 수정 횟수의 모든 중간 결과 값을 반환하는 함수
def _edit_distance_table(ref: Sequence[int], hyp: Sequence[int]) -> List[List[int]]:
    n = len(ref)
    m = len(hyp)
    dp = [[0] * (m + 1) for _ in range(n + 1)]

    for i in range(n + 1):
        dp[i][0] = i
    for j in range(m + 1):
        dp[0][j] = j

    for i in range(1, n + 1):
        for j in range(1, m + 1):
            cost = 0 if ref[i - 1] == hyp[j - 1] else 1
            dp[i][j] = min(
                dp[i - 1][j] + 1,
                dp[i][j - 1] + 1,
                dp[i - 1][j - 1] + cost,
            )
    return dp

# 예측된 형태소 토큰 결과를 후처리하는 함수
def ctc_collapse(seq: Iterable[int], blank: int = 0) -> List[int]:
    result: List[int] = []
    prev = None
    for token in seq:
        token = int(token)
        
        # 토큰이 blank이거나 이전 토큰과 다르면 result에 저장
        if token != blank and token != prev:
            result.append(token)
        prev = token
    return result

# 패딩 토큰을 제거하는 함수
def strip_pad(seq: Iterable[int], pad: int = 3) -> List[int]:
    return [int(t) for t in seq if int(t) != pad]

# 하나의 예측에 대한 wer 비율을 반환하는 함수
def wer_single(ref: Sequence[int], hyp: Sequence[int]) -> float:
    if len(ref) == 0:
        return 0.0 if len(hyp) == 0 else 1.0
    return _edit_distance(ref, hyp) / float(len(ref))

# 여러 예측(batch 만큼)에 대한 wer 비율을 반환하는 함수
def wer_batch(
    refs: Sequence[Sequence[int]],
    hyps: Sequence[Sequence[int]],
) -> Tuple[float, int, int]:
    total_edits = 0
    total_words = 0

    for ref, hyp in zip(refs, hyps):
        total_edits += _edit_distance(ref, hyp)
        total_words += len(ref)

    if total_words == 0:
        return 0.0, total_edits, total_words
    return total_edits / float(total_words), total_edits, total_words

# 모델의 logits 결과를 디코딩하는 함수
def decode_ctc_greedy_from_logits(
    logits: tf.Tensor,
    input_length: tf.Tensor,
    blank_index: int = 0,
) -> List[List[int]]:
    # logits: [B, T, C]
    log_probs = tf.nn.log_softmax(tf.cast(logits, tf.float32), axis=-1)
    
    # logits을 [T, B, C]로 이동 후 디코딩
    decoded, _ = tf.nn.ctc_greedy_decoder(
        tf.transpose(log_probs, [1, 0, 2]),
        tf.cast(input_length, tf.int32),
        blank_index=blank_index,
    )
    dense = tf.sparse.to_dense(decoded[0], default_value=blank_index).numpy()
    
    # 한번 더 후처리 후 반환
    return [ctc_collapse(row, blank=blank_index) for row in dense]


def wer_from_logits(
    logits: tf.Tensor,
    labels: tf.Tensor,
    input_length: tf.Tensor,
    blank_index: int = 0,
    pad_index: int = 3,
) -> Tuple[float, int, int, List[List[int]], List[List[int]]]:
    hyps = decode_ctc_greedy_from_logits(logits, input_length, blank_index=blank_index)
    refs = [strip_pad(row, pad=pad_index) for row in labels.numpy()]
    wer, edits, words = wer_batch(refs, hyps)
    
    # wer 비율, 수정 횟수, 예측할 단어 수, 정답 형태소 시퀀스, 예측 형태소 시퀀스
    return wer, edits, words, refs, hyps

# 정확한 정답값, 예측값 비교 테이블을 만들어주는 함수
def alignment_ops(ref: Sequence[int], hyp: Sequence[int]) -> List[dict]:
    
    dp = _edit_distance_table(ref, hyp)
    i = len(ref)
    j = len(hyp)
    ops: List[dict] = []

    while i > 0 or j > 0:
        if i > 0 and j > 0:
            cost = 0 if ref[i - 1] == hyp[j - 1] else 1
            if dp[i][j] == dp[i - 1][j - 1] + cost:
                if cost == 0:
                    ops.append({"op": "equal", "ref_token": int(ref[i - 1]), "hyp_token": int(hyp[j - 1])})
                else:
                    ops.append({"op": "substitute", "ref_token": int(ref[i - 1]), "hyp_token": int(hyp[j - 1])})
                i -= 1
                j -= 1
                continue

        if i > 0 and dp[i][j] == dp[i - 1][j] + 1:
            ops.append({"op": "delete", "ref_token": int(ref[i - 1]), "hyp_token": None})
            i -= 1
            continue

        if j > 0 and dp[i][j] == dp[i][j - 1] + 1:
            ops.append({"op": "insert", "ref_token": None, "hyp_token": int(hyp[j - 1])})
            j -= 1
            continue

        if i > 0 and j > 0:
            ops.append({"op": "substitute", "ref_token": int(ref[i - 1]), "hyp_token": int(hyp[j - 1])})
            i -= 1
            j -= 1
        elif i > 0:
            ops.append({"op": "delete", "ref_token": int(ref[i - 1]), "hyp_token": None})
            i -= 1
        else:
            ops.append({"op": "insert", "ref_token": None, "hyp_token": int(hyp[j - 1])})
            j -= 1

    ops.reverse()
    return ops

# alignment_ops 함수로 얻어진 정답값과 예측값 비교 테이블을 report 형식으로 출력하기 위한 함수
def format_alignment_report(
    ref: Sequence[int],
    hyp: Sequence[int],
    id_to_token: Callable[[int], str] | None = None,
    include_equal: bool = False,
) -> str:
    """Create a human-readable edit report for one sample.

    Output format:
    - REF: original reference tokens
    - HYP: predicted hypothesis tokens
    - ERR: per-position edit tags
    """

    def tok(x: int | None) -> str:
        if x is None:
            return "-"
        if id_to_token is None:
            return str(int(x))
        return str(id_to_token(int(x)))

    ops = alignment_ops(ref, hyp)
    ref_line: List[str] = []
    hyp_line: List[str] = []
    err_line: List[str] = []
    sub = ins = dele = 0

    for op in ops:
        op_type = op["op"]
        r = tok(op["ref_token"])
        h = tok(op["hyp_token"])

        if op_type == "equal":
            ref_line.append(r)
            hyp_line.append(h)
            err_line.append("=" if include_equal else "OK")
        elif op_type == "substitute":
            sub += 1
            ref_line.append(r)
            hyp_line.append(h)
            err_line.append(f"SUB({r}->{h})")
        elif op_type == "insert":
            ins += 1
            ref_line.append("-")
            hyp_line.append(h)
            err_line.append(f"INS({h})")
        else:
            dele += 1
            ref_line.append(r)
            hyp_line.append("-")
            err_line.append(f"DEL({r})")

    header = [
        f"ref_len={len(ref)}, hyp_len={len(hyp)}",
        f"substitute={sub}, insert={ins}, delete={dele}, total_edits={sub + ins + dele}",
    ]

    lines = [
        "REF: " + " | ".join(ref_line) if ref_line else "REF: (empty)",
        "HYP: " + " | ".join(hyp_line) if hyp_line else "HYP: (empty)",
        "ERR: " + " | ".join(err_line) if err_line else "ERR: (empty)",
    ]

    return "\n".join(header + ["-"] + lines)


def format_batch_alignment_reports(
    refs: Sequence[Sequence[int]],
    hyps: Sequence[Sequence[int]],
    id_to_token: Callable[[int], str] | None = None,
    include_equal: bool = False,
    max_samples: int | None = None,
) -> str:
    n = min(len(refs), len(hyps))
    if max_samples is not None:
        n = min(n, int(max_samples))

    if n == 0:
        return "No samples to report."

    sections: List[str] = []
    for i in range(n):
        header = f"===== Sample {i} ====="
        body = format_alignment_report(
            refs[i],
            hyps[i],
            id_to_token=id_to_token,
            include_equal=include_equal,
        )
        sections.append(header + "\n" + body)

    return "\n\n".join(sections)


__all__ = [
    "ctc_collapse",
    "strip_pad",
    "wer_single",
    "wer_batch",
    "decode_ctc_greedy_from_logits",
    "wer_from_logits",
    "alignment_ops",
    "format_alignment_report",
    "format_batch_alignment_reports",
]
