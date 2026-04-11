const express = require("express");
const {
  getPublicPricingPlans,
  getPublicActiveCampaign,
  getMyEligibleActiveCampaign,
  getAdminPricingPlans,
  createPricingPlan,
  updatePricingPlan,
  deletePricingPlan,
  getAdminDiscountCampaigns,
  createDiscountCampaign,
  updateDiscountCampaign,
  deleteDiscountCampaign,
} = require("../controllers/pricingController");

const router = express.Router();

// Public routes
router.get("/", getPublicPricingPlans);
router.get("/campaigns/active", getPublicActiveCampaign);

// User protected routes
router.get("/campaigns/active/me", getMyEligibleActiveCampaign);

// Admin routes - Pricing Plans
router.route("/admin").get(getAdminPricingPlans).post(createPricingPlan);

router.route("/admin/:id").patch(updatePricingPlan).delete(deletePricingPlan);

// Admin routes - Discount Campaigns
router
  .route("/admin/campaigns")
  .get(getAdminDiscountCampaigns)
  .post(createDiscountCampaign);

router
  .route("/admin/campaigns/:id")
  .patch(updateDiscountCampaign)
  .delete(deleteDiscountCampaign);

module.exports = router;
