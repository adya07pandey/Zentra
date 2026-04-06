import * as service from "./dashboard.service.js";

export const dashboardController = async (req, res) => {
  try {
    const orgId = req.orgId;

    const data = await service.getDashboardData(orgId);

    res.json(data);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};