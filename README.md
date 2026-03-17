# WebView Native Bridge Demo (Web)

React + Vite 기반으로 만든 **iOS WebView ↔ Web 페이지 브릿지 데모 웹 프로젝트**입니다.  
웹에서 네이티브 기능을 호출하고, 네이티브가 웹으로 응답을 돌려주는 흐름을 UI로 확인할 수 있도록 구성되어 있습니다.

이 프로젝트는 특히 다음 목적에 맞게 설계되었습니다.

- 웹에서 iOS 네이티브 브릿지 호출 테스트
- 요청/응답 로그 시각화
- Web ↔ Native 메시지 규약 실험
- 포트폴리오 및 브릿지 데모용 샘플 프로젝트

---

## 1. 프로젝트 개요

이 프로젝트는 `window.webkit.messageHandlers.bridge.postMessage(...)` 방식의 iOS WebKit 브릿지를 기준으로 구성되어 있습니다.

웹은 아래와 같은 역할을 담당합니다.

- 네이티브로 요청 메시지 전송
- 요청별 `id`를 기반으로 응답 대기
- 성공/실패/타임아웃 로그 기록
- 기능 테스트용 버튼 제공
- 수신된 데이터 및 로컬 스토리지 상태 확인

현재 UI는 3개 탭으로 구성됩니다.

- **기능**: 네이티브 호출 테스트 버튼
- **콘솔**: Web → Native / Native → Web 로그 확인
- **데이터**: 브라우저 `localStorage` 내용 확인

---

## 2. 기술 스택

- **React 19**
- **Vite 7**
- **JavaScript (ES Modules)**
- **CSS**
- **WebKit Message Handler 기반 iOS WebView 브릿지**

---

## 3. 주요 기능

### 3-1. Web → Native 요청 전송
웹에서 아래 액션들을 네이티브에 요청할 수 있습니다.

- `native.haptic.vibrate`
- `native.push.requestPermission`
- `native.token.get`
- `native.ui.toast`
- `native.app.openExternal`

### 3-2. Native → Web 응답 수신
네이티브는 `window.onNativeMessage(...)`를 호출하여 웹으로 응답을 전달할 수 있습니다.

웹은 응답의 `id`를 기준으로 대기 중인 Promise를 찾아:

- 성공이면 `resolve`
- 실패이면 `reject`
- 로그 카드 생성

### 3-3. 요청/응답 로그 시각화
브릿지 통신 로그는 별도 저장소(`ConsoleAction`)에서 관리됩니다.

로그에는 다음 정보가 포함됩니다.

- 요청/응답 방향
- 성공/실패 상태
- payload 원문
- 응답 시간(ms)

### 3-4. Local Storage 확인
`데이터` 탭에서 현재 브라우저 `localStorage` 값을 확인할 수 있습니다.

---

## 4. 화면 구성

### 기능 탭
테스트용 버튼 목록:

- 진동
- 푸시 알림 권한 요청
- 토큰값 가져오기
- 토스트 메시지
- 외부앱 열기

### 콘솔 탭
브릿지 메시지 로그를 카드 UI로 표시합니다.

- Success / Fail / Neutral 상태 표시
- Web to Native / Native to Web 방향 구분
- 응답 시간(ms) 출력
- `clear` 버튼으로 전체 로그 삭제

### 데이터 탭
`localStorage`의 key/value를 확인할 수 있습니다.

- 값이 JSON이면 pretty print
- 일반 문자열이면 그대로 출력

---

## 5. 프로젝트 구조

```bash
.
├── index.html
├── package.json
├── vite.config.js
├── public/
│   └── vite.svg
└── src/
    ├── App.jsx
    ├── main.jsx
    ├── index.css
    ├── App.css
    ├── Bridge/
    │   ├── BridgeAction.js
    │   └── ConsoleAction.js
    ├── Components/
    │   └── Tabs.jsx
    ├── Pages/
    │   ├── Functions.jsx
    │   ├── Console.jsx
    │   └── Storage.jsx
    ├── Storage/
    │   └── StorageAction.js
    └── Console /
        └── ConsoleAction.js
```

---

## 6. 핵심 파일 설명

### `src/Bridge/BridgeAction.js`
브릿지 통신의 핵심 레이어입니다.

주요 역할:

- `SendToNative(data)`
  - iOS 브릿지(`window.webkit.messageHandlers.bridge`)에 메시지 전송
  - 전송 로그 기록
  - 브릿지가 없으면 실패 로그 생성

- `requestNative({ action, payload, timeoutMs })`
  - 요청 메시지 생성
  - Promise 기반 응답 대기
  - 타임아웃 시 실패 처리

- `window.onNativeMessage = (msg) => { ... }`
  - 네이티브가 호출하는 웹 수신 진입점
  - 응답 메시지를 pending 요청과 매칭

### `src/Bridge/ConsoleAction.js`
브릿지 로그 저장소입니다.

주요 역할:

- 로그 목록 저장
- 구독/해제 API 제공
- 요청 시간 기록
- 응답 시 elapsed time 계산
- clear 기능 제공

### `src/Pages/Functions.jsx`
브릿지 테스트용 버튼 UI입니다.

- 각 버튼은 고유 action을 가진 메시지를 생성
- 일부 기능은 `requestNative` 사용
- 단순 호출은 `SendToNative` 사용

### `src/Pages/Console.jsx`
로그를 카드 UI로 렌더링합니다.

### `src/Pages/Storage.jsx`
브라우저 `localStorage` 내용을 시각화합니다.

### `src/Components/Tabs.jsx`
상단 탭 전환 컴포넌트입니다.

---

## 7. 메시지 규약

### Web → Native Request

```json
{
  "kind": "request",
  "id": "req-123",
  "from": "Web",
  "to": "Native",
  "action": "native.ui.toast",
  "payload": {
    "message": "HELLO FROM WEB"
  }
}
```

### Native → Web Response

```json
{
  "kind": "response",
  "id": "req-123",
  "from": "Native",
  "to": "Web",
  "ok": true,
  "result": {
    "message": "toast displayed"
  }
}
```

### 실패 응답 예시

```json
{
  "kind": "response",
  "id": "req-123",
  "from": "Native",
  "to": "Web",
  "ok": false,
  "error": "Unsupported action"
}
```

---

## 8. 실행 방법

### 1) 의존성 설치

```bash
npm install
```

### 2) 개발 서버 실행

```bash
npm run dev
```

### 3) 빌드

```bash
npm run build
```

### 4) 빌드 결과 미리보기

```bash
npm run preview
```

---

## 9. iOS 연동 방식

웹은 아래 객체가 존재할 때 iOS 브릿지가 연결된 것으로 간주합니다.

```js
window.webkit?.messageHandlers?.bridge
```

즉, iOS 앱에서는 `WKUserContentController`에 `bridge` 이름의 메시지 핸들러를 등록해야 합니다.

예시 개념:

```swift
userContentController.add(self, name: "bridge")
```

웹 → 네이티브:

```js
window.webkit.messageHandlers.bridge.postMessage(message)
```

네이티브 → 웹:

```swift
webView.evaluateJavaScript("window.onNativeMessage(\(jsonString))")
```

---

## 10. 점검 결과

압축 파일 기준으로 프로젝트를 점검했을 때, 현재 상태는 **브릿지 데모의 기본 골격은 잘 잡혀 있지만, README 내용과 실제 구현 사이에 일부 차이**가 있습니다.

### 확인된 장점

- Web → Native 요청 구조가 명확함
- Promise 기반 응답 대기 구조가 잘 분리됨
- 요청/응답 로그 구조가 단순하고 이해하기 쉬움
- UI가 브릿지 데모 용도에 맞게 깔끔하게 구성됨
- `vite.config.js`에서 외부 디바이스 접근(`host: true`)이 가능하도록 설정됨

### 확인된 개선 포인트

#### 1) 기존 README와 실제 구현 내용이 일부 다름
기존 README에는 아래 기능이 구현된 것처럼 설명되어 있지만, 실제 코드에서는 확인되지 않았습니다.

- `native.storage.set` / `native.storage.sync` 수신 후 `localStorage` 반영
- `web.token.get` 요청 처리
- `webviewbridge.storage.updated` 이벤트 디스패치

즉, **README가 실제 코드보다 더 앞선 상태로 작성되어 있습니다.**

#### 2) 중복/불필요 파일 존재
다음 항목들은 정리가 필요합니다.

- `src/Console /ConsoleAction.js`
  - 폴더명에 공백이 포함되어 있음
  - 실제 사용되지 않는 중복 파일로 보임
- `src/Storage/StorageAction.js`
  - 현재 비어 있음
- `src/App.css`
  - 현재 실질 내용 없음
- `src/.DS_Store`, `__MACOSX/`
  - macOS 압축 부산물

#### 3) `node_modules`가 압축에 포함됨
저장소에는 일반적으로 포함하지 않는 것이 좋습니다.

권장 사항:

- `.gitignore`에 `node_modules/` 추가
- 압축/커밋 시 제외

#### 4) 사용되지 않는 state/import 존재
`Functions.jsx`에는 현재 사용되지 않는 값이 남아 있습니다.

- `keyValue`, `setKeyValue`
- `valueValue`, `setValueValue`

스토리지 저장 UI가 주석 처리되어 있어 함께 제거 또는 복구가 필요합니다.

#### 5) 브라우저 단독 테스트 fallback이 약함
현재는 iOS 브릿지가 없으면 alert만 띄우는 형태입니다.
데모/포트폴리오 용도라면 브라우저에서도 테스트 가능한 mock native layer를 두면 더 좋습니다.

예:

- mock response 자동 반환
- test harness 제공
- action별 샘플 응답 분기

---

## 11. 추천 개선 방향

### 우선순위 1
- README와 실제 구현 동기화
- 불필요 파일 정리
- `node_modules`, `.DS_Store`, `__MACOSX` 제거

### 우선순위 2
- `native.storage.set` / `native.storage.sync` 실제 구현
- `web.token.get` 요청 처리 추가
- Storage 탭 자동 갱신 이벤트 추가

### 우선순위 3
- TypeScript 전환 또는 메시지 타입 정의 추가
- Android 브릿지 대응 레이어 추가
- mock native 환경 추가
- 로그 export 기능 추가

---

## 12. 추천 .gitignore

```gitignore
node_modules/
dist/
.DS_Store
__MACOSX/
.vscode/
.env
```

---

## 13. 커밋 메시지 예시

```bash
feat: add webview native bridge demo UI
feat: implement promise-based native request handler
refactor: separate bridge and console store layers
docs: rewrite README for webview bridge project
chore: remove macOS artifacts and node_modules from repo
```

---

## 14. 한 줄 요약

이 프로젝트는 **iOS WebView 브릿지 통신을 시각적으로 검증하기 위한 React 기반 데모 웹 앱**이며, 현재도 데모로 사용 가능하지만, **README-구현 동기화와 불필요 파일 정리, storage/token 처리 보강**을 하면 훨씬 완성도 높은 포트폴리오 프로젝트가 됩니다.
