const GoogleStrategy = require('passport-google-oauth20').Strategy; // Note the spelling
const passport = require('passport');
const User = require('../models/User');
const generateTokens = require("../utils/generateTokens");
const bcrypt = require('bcrypt');
require('dotenv').config();
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BACKEND_HOST}/auth/google/callback`
  },
  async (accessToken, refreshToken, profile, callback) => {
    try {
      // Check if user already exists or not
      let user = await User.findOne({
        email: profile._json.email
      });

      if (!user) {
        // To create a random password
        const lastSixDigitsID = profile.id.substring(profile.id.length - 6);
        const lastTwoDigitsName = profile._json.name.substring(profile._json.name.length - 2);
        const newPass = lastSixDigitsID + lastTwoDigitsName;

        // Generate salt and hash password
        const salt = await bcrypt.genSalt(parseInt(process.env.SALT));
        const hashedPassword = await bcrypt.hash(newPass, salt);

        user = await User.create({
          email: profile._json.email,
          fullName: profile._json.name,
          image: profile._json.picture,
          password: hashedPassword,
          verified: true
        });
        await user.save();
      }

      // Generate JWT Tokens
      const { accessToken, refreshToken, accessTokenExp, refreshTokenExp } = await generateTokens(user);

      return callback(null, { user, accessToken, refreshToken, accessTokenExp, refreshTokenExp });
    } catch (error) {
      console.log(error);
      return callback(error);
    }
  }
));