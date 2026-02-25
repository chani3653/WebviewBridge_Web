import { ACTIONS } from "../protocol/constants";
import { bridge } from "../index";

export const logger = {
  log(level, message, extra) {
    return bridge.request(ACTIONS.LOGGER_LOG, { level, message, extra });
  },
};
