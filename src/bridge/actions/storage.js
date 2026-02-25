import { ACTIONS } from "../protocol/constants";
import { bridge } from "../index";

export const storage = {
  set(key, value) {
    return bridge.request(ACTIONS.STORAGE_SET, { key, value });
  },
  get(key) {
    return bridge.request(ACTIONS.STORAGE_GET, { key });
  },
  remove(key) {
    return bridge.request(ACTIONS.STORAGE_REMOVE, { key });
  },
};
