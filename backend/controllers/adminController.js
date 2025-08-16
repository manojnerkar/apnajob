// const Admin = require('../models/Admin');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

// exports.login = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;

//     // 1. Validate input
//     if (!email || !password) {
//       return res.status(400).json({ message: 'Email and password are required' });
//     }

//     // 2. Find admin
//     const admin = await Admin.findOne({ email });
//     if (!admin) return res.status(401).json({ message: 'Invalid credentials' });

//     // 3. Compare password
//     const valid = await bcrypt.compare(password, admin.password);
//     if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

//     // 4. Generate JWT
//     const token = jwt.sign(
//       { id: admin._id, email: admin.email, name: admin.name },
//       process.env.JWT_SECRET || 'secret123', // fallback secret
//       { expiresIn: '8h' }
//     );

//     res.json({ message: 'Login successful', token });
//   } catch (err) {
//     console.error(err);
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
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    // 2. Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // 3. Compare password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // 4. Generate JWT
    const token = jwt.sign(
      { id: admin._id, email: admin.email, name: admin.name },
      process.env.JWT_SECRET || 'supersecretkey', // fallback secret
      { expiresIn: '8h' }
    );

    // 5. Success response
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        admin: {
          id: admin._id,
          email: admin.email,
          name: admin.name,
        },
      },
    });

  } catch (err) {
    console.error('Error in admin login:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Server error, please try again later',
    });
  }
};
