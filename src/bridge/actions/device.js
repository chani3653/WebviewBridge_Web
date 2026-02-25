import { ACTIONS } from "../protocol/constants";
import { bridge } from "../index";

export const device = {
  haptic(type = "light") {
    return bridge.request(ACTIONS.DEVICE_HAPTIC, { type });
  },
};
