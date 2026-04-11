import asyncHandler from "../middleware/async.js";
import ErrorResponse from "../utils/errorResponse.js";
import PricingPlan from "../models/PricingPlan.js";
import DiscountCampaign from "../models/DiscountCampaign.js";
import Transaction from "../models/Transaction.js";

function buildDefaultPerks(tokens) {
  return [
    `${tokens} AI interview tokens`,
    "Access to interview generator",
    "Save and revisit sessions",
  ];
}

async function ensureDefaultPlansSeeded() {
  const count = await PricingPlan.countDocuments();
  if (count > 0) return;

  await PricingPlan.insertMany([
    {
      name: "Starter Pack",
      tokens: 5,
      priceBirr: 250,
      perks: [
        "5 AI interview tokens",
        "Access to interview generator",
        "Basic session history",
      ],
      sortOrder: 1,
      isPublished: true,
      isFeatured: false,
    },
    {
      name: "Pro Pack",
      tokens: 10,
      priceBirr: 400,
      perks: [
        "10 AI interview tokens",
        "Faster practice loops",
        "Save and revisit sessions",
      ],
      sortOrder: 2,
      isPublished: true,
      isFeatured: true,
    },
    {
      name: "Growth Pack",
      tokens: 15,
      priceBirr: 600,
      perks: [
        "15 AI interview tokens",
        "More attempts for harder topics",
        "Study plan friendly",
      ],
      sortOrder: 3,
      isPublished: true,
      isFeatured: false,
    },
    {
      name: "Power Pack",
      tokens: 20,
      priceBirr: 800,
      perks: [
        "20 AI interview tokens",
        "Deep practice for interview week",
        "Most popular for intensive prep",
      ],
      sortOrder: 4,
      isPublished: true,
      isFeatured: false,
    },
  ]);
}

async function ensureDefaultCampaignsSeeded() {
  const count = await DiscountCampaign.countDocuments();
  if (count > 0) return;

  const now = Date.now();
  await DiscountCampaign.insertMany([
    {
      code: "WELCOME10",
      percentage: 10,
      firstPurchaseOnly: true,
      startsAt: new Date(now - 24 * 60 * 60 * 1000),
      endsAt: new Date(now + 15 * 24 * 60 * 60 * 1000),
      isActive: true,
      redemptions: 0,
    },
    {
      code: "APRIL20",
      percentage: 20,
      firstPurchaseOnly: false,
      startsAt: new Date(now + 2 * 24 * 60 * 60 * 1000),
      endsAt: new Date(now + 20 * 24 * 60 * 60 * 1000),
      isActive: true,
      redemptions: 0,
    },
  ]);
}

function ensureValidCampaignWindow(startsAt, endsAt) {
  const start = new Date(startsAt);
  const end = new Date(endsAt);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()))
    throw new ErrorResponse("Invalid campaign dates", 400);
  if (start >= end)
    throw new ErrorResponse("Campaign start date must be before end date", 400);
  return { start, end };
}

function isCampaignInWindow(campaign, now = new Date()) {
  const start = new Date(campaign.startsAt);
  const end = new Date(campaign.endsAt);
  return campaign.isActive && start <= now && now <= end;
}

async function findEligibleCampaignForUser(userId) {
  const campaigns = await DiscountCampaign.find({ isActive: true }).sort({
    percentage: -1,
    createdAt: -1,
  });
  const campaignsInWindow = campaigns.filter((campaign) =>
    isCampaignInWindow(campaign),
  );
  if (campaignsInWindow.length === 0) return null;
  const completedCount = await Transaction.countDocuments({
    user: userId,
    status: "completed",
  });
  for (const campaign of campaignsInWindow) {
    if (campaign.firstPurchaseOnly && completedCount > 0) continue;
    return campaign;
  }
  return null;
}

export const getPublicPricingPlans = asyncHandler(async (req, res) => {
  await ensureDefaultPlansSeeded();
  const plans = await PricingPlan.find({ isPublished: true }).sort({
    sortOrder: 1,
    createdAt: 1,
  });
  res.status(200).json({ success: true, count: plans.length, data: plans });
});

export const getPublicActiveCampaign = asyncHandler(async (req, res) => {
  await ensureDefaultCampaignsSeeded();
  const campaigns = await DiscountCampaign.find({ isActive: true }).sort({
    percentage: -1,
    createdAt: -1,
  });
  const activeCampaign = campaigns.find((campaign) =>
    isCampaignInWindow(campaign),
  );
  res.status(200).json({ success: true, data: activeCampaign || null });
});

export const getMyEligibleActiveCampaign = asyncHandler(async (req, res) => {
  await ensureDefaultCampaignsSeeded();
  const userId = req.user?._id;
  if (!userId) throw new ErrorResponse("Not authorized", 401);
  const activeCampaign = await findEligibleCampaignForUser(userId);
  res.status(200).json({ success: true, data: activeCampaign || null });
});

export const getAdminPricingPlans = asyncHandler(async (req, res) => {
  await ensureDefaultPlansSeeded();
  const plans = await PricingPlan.find().sort({ sortOrder: 1, createdAt: 1 });
  res.status(200).json({ success: true, count: plans.length, data: plans });
});

export const createPricingPlan = asyncHandler(async (req, res) => {
  const { name, tokens, priceBirr, perks, sortOrder, isPublished, isFeatured } =
    req.body;
  if (!name || String(name).trim().length === 0)
    throw new ErrorResponse("Plan name is required", 400);
  if (tokens === undefined || Number(tokens) <= 0)
    throw new ErrorResponse("Tokens must be greater than 0", 400);
  if (priceBirr === undefined || Number(priceBirr) < 0)
    throw new ErrorResponse("Price must be 0 or greater", 400);
  if (isFeatured) await PricingPlan.updateMany({}, { isFeatured: false });

  const plan = await PricingPlan.create({
    name: String(name).trim(),
    tokens: Number(tokens),
    priceBirr: Number(priceBirr),
    perks:
      Array.isArray(perks) && perks.length > 0
        ? perks.map((p) => String(p).trim()).filter(Boolean)
        : buildDefaultPerks(Number(tokens)),
    sortOrder: Number.isFinite(Number(sortOrder))
      ? Number(sortOrder)
      : Date.now(),
    isPublished: typeof isPublished === "boolean" ? isPublished : true,
    isFeatured: Boolean(isFeatured),
  });
  res.status(201).json({ success: true, data: plan });
});

export const updatePricingPlan = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const existingPlan = await PricingPlan.findById(id);
  if (!existingPlan) throw new ErrorResponse("Pricing plan not found", 404);

  const updates = {};
  if (req.body.name !== undefined) {
    const name = String(req.body.name).trim();
    if (!name) throw new ErrorResponse("Plan name is required", 400);
    updates.name = name;
  }
  if (req.body.tokens !== undefined) {
    if (Number(req.body.tokens) <= 0)
      throw new ErrorResponse("Tokens must be greater than 0", 400);
    updates.tokens = Number(req.body.tokens);
  }
  if (req.body.priceBirr !== undefined) {
    if (Number(req.body.priceBirr) < 0)
      throw new ErrorResponse("Price must be 0 or greater", 400);
    updates.priceBirr = Number(req.body.priceBirr);
  }
  if (req.body.perks !== undefined)
    updates.perks = Array.isArray(req.body.perks)
      ? req.body.perks.map((p) => String(p).trim()).filter(Boolean)
      : existingPlan.perks;
  if (req.body.sortOrder !== undefined)
    updates.sortOrder = Number(req.body.sortOrder);
  if (req.body.isPublished !== undefined)
    updates.isPublished = Boolean(req.body.isPublished);
  if (req.body.isFeatured !== undefined)
    updates.isFeatured = Boolean(req.body.isFeatured);
  if (updates.isFeatured)
    await PricingPlan.updateMany({ _id: { $ne: id } }, { isFeatured: false });

  const updatedPlan = await PricingPlan.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, data: updatedPlan });
});

export const deletePricingPlan = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const plan = await PricingPlan.findById(id);
  if (!plan) throw new ErrorResponse("Pricing plan not found", 404);
  await plan.deleteOne();
  res
    .status(200)
    .json({ success: true, message: "Pricing plan deleted successfully" });
});

export const getAdminDiscountCampaigns = asyncHandler(async (req, res) => {
  await ensureDefaultCampaignsSeeded();
  const campaigns = await DiscountCampaign.find().sort({ createdAt: -1 });
  res
    .status(200)
    .json({ success: true, count: campaigns.length, data: campaigns });
});

export const createDiscountCampaign = asyncHandler(async (req, res) => {
  const { code, percentage, firstPurchaseOnly, startsAt, endsAt, isActive } =
    req.body;
  if (!code || String(code).trim().length === 0)
    throw new ErrorResponse("Campaign code is required", 400);
  if (percentage === undefined || Number(percentage) <= 0)
    throw new ErrorResponse("Discount percentage must be greater than 0", 400);
  if (Number(percentage) > 100)
    throw new ErrorResponse("Discount percentage can not exceed 100", 400);
  const { start, end } = ensureValidCampaignWindow(startsAt, endsAt);
  const campaign = await DiscountCampaign.create({
    code: String(code).trim().toUpperCase(),
    percentage: Number(percentage),
    firstPurchaseOnly: Boolean(firstPurchaseOnly),
    startsAt: start,
    endsAt: end,
    isActive: typeof isActive === "boolean" ? isActive : true,
  });
  res.status(201).json({ success: true, data: campaign });
});

export const updateDiscountCampaign = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const existingCampaign = await DiscountCampaign.findById(id);
  if (!existingCampaign)
    throw new ErrorResponse("Discount campaign not found", 404);
  const updates = {};
  if (req.body.code !== undefined) {
    const code = String(req.body.code).trim().toUpperCase();
    if (!code) throw new ErrorResponse("Campaign code is required", 400);
    updates.code = code;
  }
  if (req.body.percentage !== undefined) {
    const percentage = Number(req.body.percentage);
    if (percentage <= 0 || percentage > 100)
      throw new ErrorResponse(
        "Discount percentage must be between 1 and 100",
        400,
      );
    updates.percentage = percentage;
  }
  if (req.body.firstPurchaseOnly !== undefined)
    updates.firstPurchaseOnly = Boolean(req.body.firstPurchaseOnly);
  const nextStartsAt =
    req.body.startsAt !== undefined
      ? req.body.startsAt
      : existingCampaign.startsAt;
  const nextEndsAt =
    req.body.endsAt !== undefined ? req.body.endsAt : existingCampaign.endsAt;
  if (req.body.startsAt !== undefined || req.body.endsAt !== undefined) {
    const { start, end } = ensureValidCampaignWindow(nextStartsAt, nextEndsAt);
    updates.startsAt = start;
    updates.endsAt = end;
  }
  if (req.body.isActive !== undefined)
    updates.isActive = Boolean(req.body.isActive);
  const updatedCampaign = await DiscountCampaign.findByIdAndUpdate(
    id,
    updates,
    { new: true, runValidators: true },
  );
  res.status(200).json({ success: true, data: updatedCampaign });
});

export const deleteDiscountCampaign = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const campaign = await DiscountCampaign.findById(id);
  if (!campaign) throw new ErrorResponse("Discount campaign not found", 404);
  await campaign.deleteOne();
  res
    .status(200)
    .json({ success: true, message: "Discount campaign deleted successfully" });
});
