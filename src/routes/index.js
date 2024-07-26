import { Router } from "express";
import postRoutes from "./postRoutes.js";
import { authenticateApiKey } from '../middleware/authMiddleware.js';

const router = Router();

router.use("/api/v1/posts", authenticateApiKey, postRoutes);

export default router;
