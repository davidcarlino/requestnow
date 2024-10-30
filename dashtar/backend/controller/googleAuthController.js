const { OAuth2Client } = require('google-auth-library');
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const axios = require('axios');
const { signInToken } = require("../config/auth");

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

exports.getGoogleAuthURL = (req, res) => {
  console.log('Generating Google Auth URL...');
  const url = client.generateAuthUrl({
    access_type: 'offline',
    scope: ['profile', 'email'],
  });
  console.log('Generated Auth URL:', url);
  res.json({ url });
};

exports.googleCallback = async (req, res) => {
  console.log('Google callback initiated');
  const { code } = req.query;
  
  try {
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { name, email, picture } = payload;
    const googleId = payload.sub;
    
    let admin = await Admin.findOne({ email });
    let randomPassword = crypto.randomBytes(10).toString('hex');
    let plainPassword = randomPassword;

    if (!admin) {
      admin = new Admin({
        name: { firstName: name.split(' ')[0], lastName: name.split(' ')[1] || '' },
        email,
        image: picture || '',
        googleId,
        provider: 'google',
        password: bcrypt.hashSync(randomPassword),
        role: 'Admin',
        joiningDate: new Date(),
        status: 'Active'
      });
      await admin.save();
    } else {
      admin.googleId = googleId;
      admin.provider = 'google';
      if (picture && admin.image !== picture) {
        admin.image = picture;
      }
      admin.password = bcrypt.hashSync(randomPassword);
      await admin.save();
    }

    try {
      const admin = await Admin.findOne({ email: email });
      if (admin && bcrypt.compareSync(plainPassword, admin.password)) {
        const token = signInToken(admin);
        
        res.json({
          success: true,
          token,
          admin: {
            name: admin.name,
            email: admin.email,
            image: admin.image,
            role: admin.role
          }
        });
      } else {
        res.status(401).json({
          success: false,
          message: 'Authentication failed'
        });
      }
    } catch (loginError) {
      res.status(401).json({
        success: false,
        message: 'Login failed',
        error: loginError.message
      });
    }

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Google authentication failed',
      error: error.message
    });
  }
};
