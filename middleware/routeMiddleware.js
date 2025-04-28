import { authMiddleware } from "./authMiddleware.js";
import { requirePasswordChange } from "./passwordChangeMiddleware.js";
import { roleMiddleware } from "./roleMiddleware.js";

export const applyCommonMiddleware = (router) => {
  // Authentication middleware
  router.use(authMiddleware);
  
  // Password change requirement check
  router.use(requirePasswordChange);
  
  return router;
};

// Helper function to apply role-based access control to specific routes
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