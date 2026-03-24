# gws docs documents get と JSON→Markdown 変換

## コマンド

```bash
gws docs documents get --params '{"documentId": "<documentId>"}' --format json
```

- **documentId**: Google Docs の Document ID（下記「Document ID の取り方」参照）。
- **--format json**: 出力を JSON にする。gws は標準出力に UTF-8 で出す。

## Document ID の取り方

- **URL から**: `/d/` の直後から、次の `/` または `?` または `#` の**手前**までを Document ID とする。
- **含めないもの**: `/edit`、`?tab=t.xxx`、`#heading=xxx` などは ID に含めない。
- 例:
  - `https://docs.google.com/document/d/1M_KTGel8F1uWW-g3tlpA_eptUI_ZlNI4N08cLUVG7Kk/edit?tab=t.hzktz29ph13u`
  - → Document ID: `1M_KTGel8F1uWW-g3tlpA_eptUI_ZlNI4N08cLUVG7Kk`

## レスポンス JSON の構造（抜粋）

- `title`: ドキュメントタイトル
- `body.content[]`: ブロックの配列
  - `paragraph`: 段落
    - `paragraphStyle.namedStyleType`: `NORMAL_TEXT`, `HEADING_1`, `HEADING_2`, `HEADING_3` など
    - `elements[]`: インライン要素の配列
      - `textRun.content`: 通常テキスト
      - `dateElement.dateElementProperties.displayText`: 日付表示
      - `person.personProperties.name`: メンション名
      - `richLink.richLinkProperties.title`: リンクタイトル

## JSON→Markdown 変換のポイント

1. **段落ごと**に `body.content` を走査し、`paragraph` があるブロックだけ処理する。
2. **namedStyleType** に応じて見出しにする。
   - `HEADING_1` → `# テキスト\n`
   - `HEADING_2` → `## テキスト\n`
   - `HEADING_3` → `### テキスト\n`
   - その他 → テキスト + `\n`
3. **elements** から表示用テキストを取得する。
   - `textRun.content` をそのまま結合。
   - `\u000b`（垂直タブ）は `\n` に置換する。
   - `dateElement` → `displayText`、`person` → `name`、`richLink` → `title` を表示用に使う。
4. **タイトル**は `data.title` を先頭に `# タイトル\n\n` として付ける。
5. 空段落（`line.strip()` が空）はスキップする。

## 文字化けの原因と対策

- **原因**: gws の出力は UTF-8。これを PowerShell の `Out-File` や `> file` で受け取ると、コンソールのコードページ（例: CP932）で解釈されたり、パイプ経由でバイトが変わったりして文字化けする。
- **対策**:
  - **ターミナルで試すだけ**: Windows で `chcp 65001` を先に実行し、UTF-8 のまま表示・リダイレクトする。
  - **ファイルに保存する**: 必ず **スクリプト（Python/Node）から gws を呼び**、子プロセスの stdout を `encoding="utf-8"`（または `utf8`）で読み、その文字列を **UTF-8 でファイルに書き込む**。シェル経由で gws の出力をファイルに流し込まない。
- **Python**: `subprocess.run(..., capture_output=True, encoding="utf-8")` で stdout を取得し、`Path(...).write_text(data, encoding="utf-8")` または `open(..., "w", encoding="utf-8").write(data)` で保存。
- **Node**: 子プロセスで `encoding: "utf8"` を指定し、`fs.writeFileSync(path, stdout, "utf8")` で保存。

## 実行環境の注意

- **Windows**: gws は `gws.cmd` としてインストールされていることが多い。スクリプトから呼ぶときは `where gws` でパスを取得し、`.cmd` の場合は `cmd /c <gws.cmdのパス>` で実行する。PATH にない場合は `npx --yes gws` を利用する。**引数配列**で `--params` を渡す（シェルを介さない）。
- **Node で gws を呼ぶ場合**: **gws-params-encoding** スキルに従い、`shell: false` で引数配列を渡す。stdout は `encoding: 'buffer'` で受け、`.toString('utf8')` してから UTF-8 でファイルに書く。

## エラーと対処

| 現象 | 対処 |
|------|------|
| 401 / credentials missing | `gws auth login -s docs` を実行する。 |
| 403 / Permission denied | 対象ドキュメントへのアクセス権があるアカウントで認証しているか確認する。 |
| 404 / Not found | Document ID が正しいか確認する。URL の `/d/` と次の `/` の間だけを渡す。 |
| validationError / unexpected argument | `--params` の JSON がシェルで壊れている。スクリプトから引数配列で渡す。 |
| 取得はできるが保存後に文字化け | 保存経路を UTF-8 に統一する。PowerShell のパイプ・Out-File を使わず、スクリプトで書き込む。 |
