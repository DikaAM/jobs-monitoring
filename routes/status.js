const express = require("express");
const router = express.Router();
const {
  createStatus,
  getAllStatus,
  updateStatus,
  deleteStatus,
} = require("../controller/status");

/**
 * @swagger
 * tags:
 *   name: Status
 *   description: Status management endpoints
 */

/**
 * @swagger
 * /api/status:
 *   post:
 *     summary: Create a new status
 *     tags: [Status]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Status created successfully
 *   get:
 *     summary: Get all statuses
 *     tags: [Status]
 *     responses:
 *       200:
 *         description: List of all statuses
 */
router.route("/").post(createStatus).get(getAllStatus);

/**
 * @swagger
 * /api/status/{id}:
 *   patch:
 *     summary: Update a status
 *     tags: [Status]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       404:
 *         description: Status not found
 *   delete:
 *     summary: Delete a status
 *     tags: [Status]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Status deleted successfully
 *       404:
 *         description: Status not found
 */
router.route("/:id").patch(updateStatus).delete(deleteStatus);

module.exports = router;
