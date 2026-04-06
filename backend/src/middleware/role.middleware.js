import prisma from "../config/db.js";

export const allowRoles = (...roles) => {
  return async (req, res, next) => {
    try {
      //userId comes from authenticated user (req.user)
      const userId = req.user.userId;

      //orgId comes from attachOrg middleware (req.orgId)
      const orgId = req.orgId;

      // Check membership in this org
      const membership = await prisma.membership.findUnique({
        where: {
          userId_orgId: { userId, orgId },
        },
      });

      if (!membership || !roles.includes(membership.role)) {
        return res.status(403).json({ message: "Forbidden" });
      }

      next();
    } catch (err) {
      console.error("allowRoles error:", err);
      res.status(500).json({ message: "Server error" });
    }
  };
};