const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { requireAdmin } = require('../middleware/auth');

router.get('/', jobController.listJobs);
router.get('/:id', jobController.getJob);

// protected
router.post('/', requireAdmin, jobController.createJob);
router.put('/:id', requireAdmin, jobController.updateJob);
router.delete('/:id', requireAdmin, jobController.deleteJob);
router.put('/:id/mark-expired', requireAdmin, jobController.markExpired);

module.exports = router;
