import { authMiddleware } from "./authMiddleware.js";
import { roleMiddleware } from "./roleMiddleware.js";

export const applyCommonMiddleware = (router) => {
  router.use(authMiddleware);
  return router;
};

export const applyRoleMiddleware = (router, path, roles, methods = ["get", "post", "put", "delete"]) => {
  methods.forEach(method => {
    if (router[method]) {
      const originalMethod = router[method].bind(router);
      router[method] = (route, ...handlers) => {
        if (route === path) {
          return originalMethod(route, roleMiddleware(roles), ...handlers);
        }
        return originalMethod(route, ...handlers);
      };
    }
  });
  return router;
};