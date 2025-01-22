"use strict";

const db = require("../config/db");

//
const Product = {
  // Fetching recommended products based on user's skin type, product category, and product rating,
  getBestProducts: async (user_id) => {
    const setRankQuery = `SET @rank = 0;`;
    const setSkinTypeCategoryQuery = `SET @skin_type_category = '';`;
    const selectQuery = `
      SELECT
        id_product,
        name_product,
        skin_type,
        category,
        image_url,
        store_url,
        price,
        rating
      FROM (
        SELECT
          p.id_product,
          p.name_product,
          p.skin_type,
          p.category,
          p.image_url,
          p.store_url,
          p.price,
          p.rating,
          @rank := IF(@skin_type_category = CONCAT(p.skin_type, '-', p.category), @rank + 1, 1) AS rank,
          @skin_type_category := CONCAT(p.skin_type, '-', p.category) AS group_key
        FROM
          products p
        JOIN users u ON u.skin_type = p.skin_type
        WHERE
          u.id = ?
        ORDER BY
          p.skin_type,
          p.category,
          p.rating DESC
      ) AS RankedProducts
      WHERE
        rank <= 3
      ORDER BY
        skin_type,
        category,
        rating DESC;
    `;

    try {
      await new Promise((resolve, reject) => {
        db.query(setRankQuery, (error) => {
          if (error) return reject(error);
          resolve();
        });
      });

      await new Promise((resolve, reject) => {
        db.query(setSkinTypeCategoryQuery, (error) => {
          if (error) return reject(error);
          resolve();
        });
      });

      const results = await new Promise((resolve, reject) => {
        db.query(selectQuery, [user_id], (error, results) => {
          if (error) return reject(error);
          resolve(results);
        });
      });

      console.log("Query results:", results);

      return results;
    } catch (error) {
      console.error("Error in getBestProducts:", error);
      throw error;
    }
  },

  findProductById: async (product_id) => {
    const query = `
      SELECT * FROM products WHERE id_product = ?
    `;
    return new Promise((resolve, reject) => {
      db.query(query, [product_id], (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(results.length > 0 ? results[0] : null);
      });
    });
  },
};

module.exports = Product;
