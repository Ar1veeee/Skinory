"use strict";
const db = require("../config/db");

const Routine = {
  // Adds a product to the user's day routine
  addDayRoutine: async (user_id, product_id, category) => {
    const query = `
      INSERT INTO day_routines (user_id, product_id, category)
      VALUES (?, ?, ?)
    `;
    return new Promise((resolve, reject) => {
      db.query(query, [user_id, product_id, category], (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
    });
  },

  // Adds a product to the user's night routine
  addNightRoutine: async (user_id, product_id, category) => {
    const query = `
      INSERT INTO night_routines (user_id, product_id, category)
      VALUES (?, ?, ?)
    `;
    return new Promise((resolve, reject) => {
      db.query(query, [user_id, product_id, category], (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
    });
  },

  // Retrieves all products in the user's day routine
  getDayRoutinesByUserId: async (user_id) => {
    const query = `
      SELECT p.id_product, p.name_product, p.skin_type, p.category
      FROM day_routines r
      JOIN products p ON r.product_id = p.id_product
      WHERE r.user_id = ?
    `;
    return new Promise((resolve, reject) => {
      db.query(query, [user_id], (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(results);
      });
    });
  },

  // Deletes all day routines for a given user ID
  deleteDayRoutinesByUserId: async (user_id) => {
    const query = `
      DELETE FROM day_routines WHERE user_id = ?
    `;
    return new Promise((resolve, reject) => {
      db.query(query, [user_id], (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(results);
      });
    });
  },

  // Retrieves all products in the user's night routine
  getNightRoutinesByUserId: async (user_id) => {
    const query = `
      SELECT p.id_product, p.name_product, p.skin_type, p.category
      FROM night_routines r
      JOIN products p ON r.product_id = p.id_product
      WHERE r.user_id = ?
    `;
    return new Promise((resolve, reject) => {
      db.query(query, [user_id], (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(results);
      });
    });
  },

  // Deletes all night routines for a given user ID
  deleteNightRoutinesByUserId: async (user_id) => {
    const query = `
      DELETE FROM night_routines WHERE user_id = ?
    `;
    return new Promise((resolve, reject) => {
      db.query(query, [user_id], (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(results);
      });
    });
  },

  // Finds a specific product in the user's day routine by both user ID and product ID
  findDayRoutineByUserAndProduct: async (user_id, product_id) => {
    const query = `
      SELECT * FROM day_routines WHERE user_id = ? AND product_id = ?
    `;
    return new Promise((resolve, reject) => {
      db.query(query, [user_id, product_id], (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(results.length > 0 ? results[0] : null);
      });
    });
  },

  // Finds a specific product in the user's night routine by both user ID and product ID
  findNightRoutineByUserAndProduct: async (user_id, product_id) => {
    const query = `
      SELECT * FROM night_routines WHERE user_id = ? AND product_id = ?
    `;
    return new Promise((resolve, reject) => {
      db.query(query, [user_id, product_id], (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(results.length > 0 ? results[0] : null);
      });
    });
  },

  // Fetching recommended products based on user's skin type and product category,
  getRecommendedProducts: async (user_id, category) => {
    const query = `
      SELECT p.*
      FROM products p
      JOIN users u ON u.skin_type = p.skin_type
      WHERE u.id = ? AND p.category = ?
    `;
    return new Promise((resolve, reject) => {
      db.query(query, [user_id, category], (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(results);
      });
    });
  },
};
module.exports = Routine;
