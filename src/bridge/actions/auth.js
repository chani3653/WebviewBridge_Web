import { ACTIONS } from "../protocol/constants";
import { bridge } from "../index";

export const auth = {
  getToken() {
    return bridge.request(ACTIONS.AUTH_GET_TOKEN);
  },
  setToken(accessToken) {
    return bridge.request(ACTIONS.AUTH_SET_TOKEN, { accessToken });
  },
};
