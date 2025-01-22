"use strict";
const Product = require("../models/productModel");

// Get Top 3 Best Products For Each Category
exports.BestProducts = async (req, res) => {
  const { user_id } = req.params;
  console.log("User ID from request:", user_id);
  if (!user_id) {
    return res.status(400).json({
      message: "User ID is required"
    });
  }

  try {
    const Best_Products = await Product.getBestProducts(user_id);
    res.status(200).json({ Best_Products })
  } catch (error) {
    console.error("Error fetching Best Products:", error)
    res.status(500).json({
      message: "Error fetching Best Products"
    })
  };
};