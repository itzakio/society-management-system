import { Router } from "express";
import { authenticate, AuthRequest } from "../middlewares/auth.middleware.js";
import { login } from "../controllers/auth.controller.js";

const router = Router();
router.post("/login", login);
router.get("/me", authenticate, (req: AuthRequest, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

export default router;
