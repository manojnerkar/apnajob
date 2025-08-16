// const express = require('express');
// const router = express.Router();
// const jobController = require('../controllers/jobController');
// const { requireAdmin } = require('../middleware/auth');

// router.get('/', jobController.listJobs);
// router.get('/:id', jobController.getJob);

// // protected
// router.post('/', requireAdmin, jobController.createJob);
// router.put('/:id', requireAdmin, jobController.updateJob);
// router.delete('/:id', requireAdmin, jobController.deleteJob);
// router.put('/:id/mark-expired', requireAdmin, jobController.markExpired);

// module.exports = router;


const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { requireAdmin } = require('../middleware/auth');

// list all jobs
router.get('/', jobController.listJobs);

// ✅ categories route must come before /:id
router.get('/categories', jobController.getCategories);

// get single job by id
router.get('/:id', jobController.getJob);

// protected
router.post('/', requireAdmin, jobController.createJob);
router.put('/:id', requireAdmin, jobController.updateJob);
router.delete('/:id', requireAdmin, jobController.deleteJob);
router.put('/:id/mark-expired', requireAdmin, jobController.markExpired);

module.exports = router;

