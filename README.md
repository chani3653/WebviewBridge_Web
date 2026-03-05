# WebViewBridge_Web

간단한 설명
- 이 저장소는 iOS 앱의 WebView와 웹 페이지 간의 메시지(브리지) 통신을 테스트/데모하기 위한 작은 React 앱입니다.
- Vite + React로 작성되어 있으며, 웹 ↔ 네이티브 간 요청/응답 및 로그를 시각화하는 UI를 포함합니다.

주요 기능
- Web -> Native 요청 전송 (`SendToNative`, `requestNative`)
- Native -> Web 요청/응답 수신 (`window.onNativeMessage` 처리)
- 콘솔 탭: Web/Native 메시지 로그(성공/실패 포함) 표시
- 데이터 탭: 네이티브가 보낸 스토리지 데이터 수신 시 로컬에 저장하고 목록으로 표시
- 기능 탭: 테스트용 버튼(진동, 토스트, 토큰 요청 등) 및 네이티브 저장 요청 UI

프로젝트 구조(중요 파일)
- `src/Bridge/BridgeAction.js` — 브리지 레이어: `SendToNative`, `requestNative`, `window.onNativeMessage` 처리
- `src/Bridge/ConsoleAction.js` — 콘솔 로그 저장소(구독 API)
- `src/Pages/Console.jsx` — 콘솔 UI (로그 표시, 실패/성공 스타일 적용)
- `src/Pages/Storage.jsx` — localStorage 내용을 목록으로 보여주는 UI
- `src/Pages/Functions.jsx` — 테스트용 기능 버튼과 네이티브 저장 요청 UI
- `src/index.css` — 디자인/스타일 (콘솔의 success/fail 스타일 포함)

브리지 메시지 규약 (간단)
- 요청(웹→네이티브) 예시:
  ```json
  { "kind":"request", "id":"<id>", "from":"Web", "to":"Native", "action":"native.some.action", "payload":{...} }
  ```
- 응답(네이티브→웹 또는 웹→네이티브 응답) 예시:
  ```json
  { "kind":"response", "id":"<id>", "from":"Native", "to":"Web", "ok":true, "result":... }
  ```

지원되는 주요 액션(현재 예시)
- `native.haptic.vibrate` — 진동
- `native.push.requestPermission` — 푸시 권한 요청
- `native.token.get` — 네이티브에서 토큰 요청(웹→네이티브)
- `native.ui.toast` — 토스트 표시
- `native.app.openExternal` — 외부 URL 열기
- `native.storage.set` / `native.storage.sync` — 네이티브 → 웹 스토리지 동기화
- `web.token.get` — 네이티브 → 웹: 동기적으로 웹에 저장된 토큰 요청

동작/특이사항
- 콘솔 로그: `ConsoleAction`의 `logWebToNative`, `logNativeToWeb`, `logGeneric`을 통해 로그가 기록됩니다. 실패/타임아웃 상황도 `fail` 카드로 표시됩니다.
- 스토리지 동기화: 네이티브가 `native.storage.set` 또는 `native.storage.sync`로 메시지를 보내면, 웹은 수신된 `payload`를 `localStorage`에 저장하고 `webviewbridge.storage.updated` 이벤트를 디스패치하여 `Storage` 탭을 갱신합니다.
- 토큰 처리: 네이티브가 `web.token.get`을 요청하면 웹은 `localStorage.auth_token` 또는 `localStorage.token`에서 토큰을 조회합니다. 없으면 `uid()`로 새 토큰을 생성해 `localStorage.auth_token`에 저장하고 응답합니다.
- 웹에서 스토리지 저장을 요청할 때는 웹이 직접 로컬에 쓰지 않고 `requestNative({ action: 'native.storage.set', payload })`로 네이티브에 요청합니다. 네이티브가 실제로 저장한 뒤 웹으로 동기화 메시지를 다시 보내면 웹이 로컬에 저장합니다.

개발/실행
1. 의존 설치
```
npm install
```
2. 개발 서버 실행
```
npm run dev
```
3. 브리지 시뮬레이션 (브라우저에서 테스트할 때)
  - 네이티브가 보내는 저장 메시지 시뮬레이트:
    ```js
    window.onNativeMessage && window.onNativeMessage({ action: 'native.storage.set', payload: { key: 'foo', value: { a: 1 } } })
    ```
  - 토큰 요청 시뮬레이트 (iOS 코드에서처럼):
    ```js
    window.onNativeMessage && window.onNativeMessage({ kind: 'request', id: 'req-1', action: 'web.token.get' })
    ```

테스트 및 디버그
- 콘솔 탭에서 로그가 즉시 쌓이는지 확인하세요. 상단의 `clear` 버튼으로 로그를 지울 수 있습니다.
- 스토리지 탭에서 `webviewbridge.storage.updated` 이벤트 수신 후 목록 갱신 여부를 확인하세요.

추가 개선 아이디어
- Android 브리지 연동 (예: `window.AndroidBridge.postMessage`) 추가
- 메시지 스키마/타입 정의(TypeScript 또는 JSON Schema)
- 로그 영구화(IndexedDB) 또는 원격 수집

저작권
- 개인/예제 목적용 저장소입니다.
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
