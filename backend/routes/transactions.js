import express from 'express';
import { createTransaction, getMyTransaction, updateTransaction, deleteTransaction, getMonthlySummary } from '../controllers/transactionController.js';
import { protect } from '../middlewares/auth.js';
import { validate } from '../middlewares/validateZod.js';
import { transactionValidationSchema } from '../validations/transactionValidation.js';

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * /transactions/monthly-summary:
 *   get:
 *     summary: Get total spent and earned per category
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Monthly summary successfully retrieved
 */
router.get('/monthly-summary', getMonthlySummary);

/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: List all transactions for the logged-in user
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of transactions
 *   post:
 *     summary: Add a new income or expense transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - amount
 *               - type
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *                 example: Groceries
 *               amount:
 *                 type: number
 *                 example: -50
 *               type:
 *                 type: string
 *                 enum: [expense, income]
 *                 example: expense
 *               category:
 *                 type: string
 *                 example: Food
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-05-27"
 *     responses:
 *       201:
 *         description: Transaction created successfully
 */
router.route('/')
  .get(getMyTransaction)
  .post(validate(transactionValidationSchema), createTransaction);

/**
 * @swagger
 * /transactions/{id}:
 *   put:
 *     summary: Edit an existing transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The transaction ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Groceries Edited
 *               amount:
 *                 type: number
 *                 example: -60
 *               type:
 *                 type: string
 *                 enum: [expense, income]
 *                 example: expense
 *               category:
 *                 type: string
 *                 example: Food
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-05-27"
 *     responses:
 *       200:
 *         description: Transaction updated successfully
 *       404:
 *         description: Transaction not found
 *   delete:
 *     summary: Remove a transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The transaction ID
 *     responses:
 *       200:
 *         description: Transaction deleted successfully
 *       404:
 *         description: Transaction not found
 */
router.route('/:id')
  .put(validate(transactionValidationSchema), updateTransaction)
  .delete(deleteTransaction);

export default router;
