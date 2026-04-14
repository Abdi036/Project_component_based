// Payment utility helpers

export function createTxRef() {
  return `AIPREP-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

export function splitName(fullName = "") {
  const cleaned = String(fullName).trim();
  if (!cleaned) {
    return { firstName: "Customer", lastName: "" };
  }

  const nameParts = cleaned.split(/\s+/);
  const firstName = nameParts.shift() || "Customer";
  const lastName = nameParts.join(" ");
  return { firstName, lastName };
}

export function normalizeStatus(statusValue) {
  const normalized = String(statusValue || "").toLowerCase();
  if (["success", "successful", "completed"].includes(normalized)) {
    return "completed";
  }
  if (
    ["failed", "cancelled", "canceled", "expired", "error"].includes(normalized)
  ) {
    return "failed";
  }
  return "pending";
}

export function isCampaignInWindow(campaign, now = new Date()) {
  const start = new Date(campaign.startsAt);
  const end = new Date(campaign.endsAt);
  return campaign.isActive && start <= now && now <= end;
}
