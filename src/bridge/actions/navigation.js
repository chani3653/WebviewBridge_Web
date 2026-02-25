import { ACTIONS } from "../protocol/constants";
import { bridge } from "../index";

export const navigation = {
  openExternal(url) {
    return bridge.request(ACTIONS.NAV_OPEN_EXTERNAL, { url });
  },
  route(path) {
    return bridge.request(ACTIONS.NAV_ROUTE, { path });
  },
};
