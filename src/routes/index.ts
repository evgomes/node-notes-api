import { Router } from 'express';
import authRoutes from './auth.routes';
import notesRoutes from './notes.routes';

const router = Router();

router.use('/api/login', authRoutes);
router.use('/api/notes', notesRoutes);

export default router;
