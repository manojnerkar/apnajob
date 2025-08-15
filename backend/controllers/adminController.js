// const Admin = require('../models/Admin');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

// exports.login = async (req, res, next) => {
//   try {
//     const { email, password } = req.body; // match your model: email

//     // Validate input
//     if (!email || !password) {
//       return res.status(400).json({ message: 'Email and password are required' });
//     }

//     // Find admin
//     const admin = await Admin.findOne({ email });
//     if (!admin) return res.status(401).json({ message: 'Invalid credentials' });

//     // Compare passwords using the correct field
//     const valid = await bcrypt.compare(password, admin.password);
//     if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

//     // Generate JWT
//     const token = jwt.sign(
//       { id: admin._id, email: admin.email },
//       process.env.JWT_SECRET,
//       { expiresIn: '8h' }
//     );

//     res.json({ token });
//   } catch (err) {
//     next(err);
//   }
// };


const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // 2. Find admin
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ message: 'Invalid credentials' });

    // 3. Compare password
    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

    // 4. Generate JWT
    const token = jwt.sign(
      { id: admin._id, email: admin.email, name: admin.name },
      process.env.JWT_SECRET || 'secret123', // fallback secret
      { expiresIn: '8h' }
    );

    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

