import { sleep } from "../../shared/utils/sleep";
import { ACTIONS } from "../protocol/constants";

export async function sendToWebMock(req) {
  await sleep(250);

  switch (req.action) {
    case ACTIONS.AUTH_GET_TOKEN:
      return {
        id: req.id,
        ok: true,
        data: { accessToken: "mock_access_token" },
      };

    case ACTIONS.AUTH_SET_TOKEN:
      return { id: req.id, ok: true, data: { saved: true } };

    case ACTIONS.DEVICE_HAPTIC:
      return { id: req.id, ok: true, data: { done: true } };

    case ACTIONS.NAV_OPEN_EXTERNAL:
      if (req.payload?.url)
        window.open(req.payload.url, "_blank", "noopener,noreferrer");
      return { id: req.id, ok: true };

    case ACTIONS.NAV_ROUTE:
      return {
        id: req.id,
        ok: true,
        data: { routed: req.payload?.path || "/" },
      };

    case ACTIONS.UI_TOAST:
      return { id: req.id, ok: true };

    case ACTIONS.STORAGE_SET:
      localStorage.setItem(req.payload.key, JSON.stringify(req.payload.value));
      return { id: req.id, ok: true };

    case ACTIONS.STORAGE_GET: {
      const raw = localStorage.getItem(req.payload.key);
      return {
        id: req.id,
        ok: true,
        data: { value: raw ? JSON.parse(raw) : null },
      };
    }

    case ACTIONS.STORAGE_REMOVE:
      localStorage.removeItem(req.payload.key);
      return { id: req.id, ok: true };

    case ACTIONS.LOGGER_LOG:
      return { id: req.id, ok: true };

    default:
      return {
        id: req.id,
        ok: false,
        error: { code: "NOT_IMPL", message: `Not implemented: ${req.action}` },
      };
  }
}
