import { RequestContext } from "../server/types";
import { getApiHandler } from "./index";

export const apiRoutes = ({ forward }) => {
  return async (ctx: RequestContext) => {
    let apiHandler = getApiHandler(new URL(ctx.request.url), ctx.request.method);
    if (apiHandler) {
      return await apiHandler(ctx);
    }
    return await forward(ctx);
  };
};
