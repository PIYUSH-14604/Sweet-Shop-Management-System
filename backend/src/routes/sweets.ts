import { Router } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth';
import {
  createSweet,
  listSweets,
  searchSweets,
  updateSweet,
  deleteSweet,
  purchaseSweet,
  restockSweet
} from '../controllers/sweetController';

const router = Router();

router.use(authenticate);
router.post('/', createSweet);
router.get('/', listSweets);
router.get('/search', searchSweets);
router.put('/:id', updateSweet);
router.delete('/:id', requireAdmin, deleteSweet);

router.post('/:id/purchase', purchaseSweet);
router.post('/:id/restock', requireAdmin, restockSweet);

export default router;
