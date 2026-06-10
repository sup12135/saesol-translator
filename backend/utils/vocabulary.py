from collections import Counter
from pathlib import Path
import pandas as pd
import ast

class Vocabulary:
    def __init__(self, morpheme_data: pd.Series):
        tokens = []
        for morpheme in morpheme_data:
            morpheme = ast.literal_eval(morpheme)
            tokens.extend(morpheme)
            
        counter = Counter(tokens)
        
        vocab_tokens = sorted(
        counter,
        key=lambda x: counter[x],
        reverse=True
        )
        
        specials = ["<blank>", "<si>", "<unk>", "<pad>"]
        
        self.vocab = specials + vocab_tokens
        
        self.stoi_dict = {token: i for i, token in enumerate(self.vocab)}
        self.itos_dict = {i: token for i, token in enumerate(self.vocab)}

        # unknown token index
        self.unk_id = self.stoi_dict["<unk>"]
    
    def stoi(self, token):
        return self.stoi_dict.get(token, self.unk_id)

    # 🔹 index → token
    def itos(self, index):
        return self.itos_dict.get(index, "<unk>")

    # 🔹 glosses → index 리스트
    def encode(self, tokens):
        return [self.stoi(t) for t in ast.literal_eval(tokens)]

    # 🔹 index 리스트 → glosses
    def decode(self, indices):
        return [self.itos(i) for i in indices]
    
    def save_csv(self, path: str):
        out_path = Path(path)

        # index 순서 보장
        df = pd.DataFrame({
            "index": list(range(len(self.vocab))),
            "token": self.vocab
        })
        df.to_csv(out_path, index=False, encoding="utf-8-sig")

    @classmethod
    def load_csv(cls, path: str) -> "Vocabulary":
        in_path = Path(path)
        if not in_path.exists():
            raise FileNotFoundError(f"CSV 파일이 없습니다: {in_path}")

        df = pd.read_csv(in_path, encoding="utf-8-sig")

        required_cols = {"index", "token"}
        if not required_cols.issubset(df.columns):
            raise ValueError(f"CSV에는 {required_cols} 컬럼이 필요합니다. 현재 컬럼: {set(df.columns)}")

        # index 정렬 후 token 복원
        df = df.sort_values("index").reset_index(drop=True)
        vocab_tokens = df["token"].astype(str).tolist()

        if "<unk>" not in vocab_tokens:
            raise ValueError("CSV에 '<unk>' 토큰이 없습니다. unk_id를 만들 수 없습니다.")

        # __init__ 우회해서 객체 생성
        obj = cls.__new__(cls)
        obj.vocab = vocab_tokens
        obj.stoi_dict = {token: i for i, token in enumerate(obj.vocab)}
        obj.itos_dict = {i: token for i, token in enumerate(obj.vocab)}
        obj.unk_id = obj.stoi_dict["<unk>"]
        return obj