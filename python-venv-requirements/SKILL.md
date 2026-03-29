---
name: python-venv-requirements
description: Python の依存関係をプロジェクトローカルの venv と requirements.txt で管理する。venv の作り方・有効化・pip install -r requirements.txt の流れを統一し、グローバル Python を汚染しない。トリガーは「venv」「仮想環境」「requirements.txt」「pip install」「グローバルに入れたくない」「Python 環境をプロジェクトで」など。
---

# Python: venv + requirements.txt

## 原則

- **依存関係は必ずプロジェクトの仮想環境に入れる**。グローバル（システム）の Python への `pip install` は避ける。
- **1 ファイルに集約する場合は `requirements.txt` にテスト用パッケージ（例: pytest）も含めてよい**。本番コンテナだけ別インストールにしたいプロジェクトは Dockerfile 側で `pip install` を分割する。

## 標準手順（エージェント向け）

1. プロジェクトルート（`requirements.txt` があるディレクトリ）に移動する。
2. 未作成なら venv を作る（名前は **`.venv`** を推奨）:  
   `python -m venv .venv`
3. **有効化してから** pip を実行する。
4. `python -m pip install -U pip`
5. `pip install -r requirements.txt`
6. 実行・テストは **有効化したシェル**で `python ...` / `pytest ...` とする。

## 有効化コマンド（OS 別）

| OS | シェル | コマンド |
|----|--------|----------|
| Windows | PowerShell | `.\.venv\Scripts\Activate.ps1` |
| Windows | cmd | `.venv\Scripts\activate.bat` |
| macOS / Linux | bash/zsh | `source .venv/bin/activate` |

実行ポリシーで PowerShell がブロックする場合は、ユーザーに `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` の検討を促すか、cmd の `activate.bat` を使う。

## .gitignore

以下をコミット対象外にする: `.venv/` または `venv/`、`__pycache__/`、`.pytest_cache/`、`.env`（シークレット）。

## エージェントがやってはいけないこと

- ユーザーのグローバル環境にだけ `pip install` してプロジェクトを完了扱いにすること（venv 未使用のまま進めない）。
- `requirements.txt` を更新せずに新パッケージだけ入れること（再現性が壊れる）。

## Troubleshooting

### `python` が別バージョンを指す

**原因**: PATH 上の `python` と venv の意図がずれている。  
**対処**: `python -m venv .venv` を使い、有効化後に `where python` / `which python` で venv 内を指すか確認する。

### 依存追加後に他環境で再現できない

**原因**: `pip install` だけして `requirements.txt` を更新していない。  
**対処**: `pip freeze` で丸ごと固定は避け、**意図した範囲**で `package>=x.y` を追記するか、プロジェクト方針に従う。
