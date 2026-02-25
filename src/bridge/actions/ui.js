import { ACTIONS } from "../protocol/constants";
import { bridge } from "../index";

export const ui = {
  toast(message) {
    return bridge.request(ACTIONS.UI_TOAST, { message });
  },
};
