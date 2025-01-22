"use strict";

const db = require("../config/db");
const bcrypt = require("bcrypt");


const User = {
  // Creates a new user with hashed password and specified skin type
  createUser: async (username, email, password, skin_type) => {
    const query = `
    INSERT INTO users (username, email, password, skin_type) VALUES (?, ?, ?, ?)
    `;
    const hashedPassword = await bcrypt.hash(password, 10);
    return new Promise((resolve, reject) => {
      db.query(query, [username, email, hashedPassword, skin_type], (error, results) => {
        if (error) reject(error);
        resolve(results);
      })
    })
  },

  // Updates an existing user's password
  updateOldPassword: async (user_id, password) => {
    const query = `
      UPDATE users SET password = ? WHERE id = ?
    `;
    const newPasswordHash = await bcrypt.hash(password, 10);
    return new Promise((resolve, reject) => {
      db.query(query, [newPasswordHash, user_id], (error, results) => {
        if (error) reject(error);
        resolve(results);
      });
    });
  },

  // Finds a user by their email address
  findUserByEmail: async (email) => {
    const query = `
        SELECT * FROM users WHERE email = ?
      `;
    return new Promise((resolve, reject) => {
      db.query(query, [email], (error, results) => {
        if (error) reject(error);
        resolve(results[0]);
      });
    });
  },

  // Finds a user by their unique ID
  findUserById: async (user_id) => {
    const query = `
        SELECT * FROM users WHERE id = ?
      `;
    return new Promise((resolve, reject) => {
      db.query(query, [user_id], (error, results) => {
        if (error) reject(error);
        resolve(results.length > 0 ? results[0] : null);
      });
    });
  },

  // Creates or updates authentication tokens for a user
  createOrUpdateAuthToken: (user_id, activeToken, refreshToken) => {
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM auth WHERE user_id = ?",
        [user_id],
        (error, results) => {
          if (error) reject(error);

          if (results.length > 0) {
            db.query(
              "UPDATE auth SET active_token = ?, refresh_token = ? WHERE user_id = ?",
              [activeToken, refreshToken, user_id],
              (updateError, updateResults) => {
                if (updateError) reject(updateError);
                resolve(updateResults);
              }
            );
          } else {
            db.query(
              "INSERT INTO auth (user_id, active_token, refresh_token) VALUES (?, ?, ?)",
              [user_id, activeToken, refreshToken],
              (insertError, insertResults) => {
                if (insertError) reject(insertError);
                resolve(insertResults);
              }
            );
          }
        }
      );
    });
  },

  // Finds authentication tokens for a given user ID
  findAuthByUserId: (userId) => {
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM auth WHERE user_id = ?",
        [userId],
        (error, results) => {
          if (error) reject(error);
          resolve(results[0] || null);
        }
      );
    });
  },
};

module.exports = User;
