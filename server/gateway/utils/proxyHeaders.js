import Proxy from "express-http-proxy";

export const proxyHeader = (serviceUrl) => {
  return Proxy(serviceUrl, {
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      if (srcReq?.user?.userId) {
        proxyReqOpts.headers["x-user-id"] = srcReq.user.userId;
      }
      return proxyReqOpts;
    },
  });
};
