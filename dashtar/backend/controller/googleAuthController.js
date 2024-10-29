const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

exports.getGoogleAuthURL = (req, res) => {
  const url = client.generateAuthUrl({
    access_type: 'offline',
    scope: ['profile', 'email'],
  });
  res.json({ url });
};

exports.googleCallback = async (req, res) => {
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
    let user = await User.findOne({ email });

    if (!user) {
      const randomPassword = crypto.randomBytes(10).toString('hex');
      
      user = new User({
        name,
        email,
        picture: picture || '',
        googleId,
        provider: 'google',
        password: randomPassword,
        isVerified: true
      });
      await user.save();
    } else if (!user.googleId) {
      user.googleId = googleId;
      user.provider = 'google';
      if (picture && user.picture !== picture) {
        user.picture = picture;
      }
      await user.save();
    }

    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.redirect(`${process.env.FRONTEND_URL}/auth/google/callback?token=${jwtToken}`);
  } catch (error) {
    console.error('Error in Google callback:', error);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=google_auth_failed`);
  }
};
