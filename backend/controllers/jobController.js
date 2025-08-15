const Job = require('../models/Job');

exports.listJobs = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, category, search, showExpired } = req.query;
    const filter = {};
    if (category && category !== 'All') filter.category = category;
    if (!showExpired) filter.isExpired = false;
    if (search) {
      const q = new RegExp(search, 'i');
      filter.$or = [
        { title: q },
        { company: q },
        { description: q },
        { skills: q }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Job.countDocuments(filter);
    const jobs = await Job.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
    res.json({ data: jobs, meta: { total, page: Number(page), limit: Number(limit) } });
  } catch (err) {
    next(err);
  }
};

exports.getJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    // auto mark expired if date passed
    if (!job.isExpired && new Date(job.lastDateToApply) < new Date()) {
      job.isExpired = true;
      await job.save();
    }

    res.json(job);
  } catch (err) {
    next(err);
  }
};

exports.createJob = async (req, res, next) => {
  try {
    const payload = req.body;
    const job = await Job.create(payload);
    res.status(201).json(job);
  } catch (err) {
    next(err);
  }
};

exports.updateJob = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) {
    next(err);
  }
};

exports.deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json({ message: 'Job deleted' });
  } catch (err) {
    next(err);
  }
};

exports.markExpired = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, { isExpired: true }, { new: true });
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) {
    next(err);
  }
};
