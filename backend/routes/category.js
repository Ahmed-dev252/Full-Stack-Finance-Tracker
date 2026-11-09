import express from 'express';
const router = express.Router();

const PREDEFINED_CATEGORIES = [
  'Food',
  'Rent',
  'Utilities',
  'Entertainment',
  'Salary',
  'Freelance',
  'Investments',
  'Others'
];

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: List predefined categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of categories
 */

router.get('/', (_req, res) => {
  res.status(200).json({ success: true, categories: PREDEFINED_CATEGORIES });
});

export default router;
