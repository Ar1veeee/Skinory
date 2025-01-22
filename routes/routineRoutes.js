const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddleware");
const {
  getRecommendedProducts,
  DayRoutine,
  NightRoutine,
  getUserDayRoutines,
  getUserNightRoutines,
  DeleteDayRoutine,
  DeleteNightRoutine,
} = require("../controllers/routineController");

router.use(verifyToken);  

router.get("/:user_id/day", getUserDayRoutines);
router.delete("/:user_id/day", DeleteDayRoutine);

router.get("/:user_id/night", getUserNightRoutines);
router.delete("/:user_id/night", DeleteNightRoutine);

router.get("/:user_id/:category", getRecommendedProducts);

router.post("/:user_id/:category/day/:product_id", DayRoutine);
router.post("/:user_id/:category/night/:product_id", NightRoutine);

module.exports = router;
