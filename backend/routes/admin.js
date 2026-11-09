import express from 'express';
import { protect } from '../middlewares/auth.js';          
import { authorize } from '../middlewares/authorize.js';    
import User from '../models/User.js';
import Transaction from '../models/Transactions.js';

const router = express.Router();

/**
 * @swagger
 * /admin/overview:
 *   get:
 *     summary: Admin system overview dashboard
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/overview', protect, authorize('admin'), async (req, res, next) => {
  try {
    // 1. Xisaabi tirada guud ee Users-ka
    const totalUsers = await User.countDocuments({ role: 'user' });

    // 2. Xisaabi qaybaha lacagaha ugu badan ee dadku kharash gareeyeen (Expenses)
    const topSpendingCategories = await Transaction.aggregate([
      { $match: { type: 'expense' } },
      {
        $group: {
          _id: '$category',
          totalAmount: { $sum: '$amount' },
          transactionCount: { $sum: 1 }
        }
      },
      { $sort: { totalAmount: 1 } }, // Maadaama expenses ay laga yaabo inay minus yihiin ama plus
      { $limit: 5 }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        topSpendingCategories
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
