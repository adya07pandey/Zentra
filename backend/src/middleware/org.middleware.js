const attachOrg = (req, res, next) => {
  const orgId = req.headers["x-org-id"];

  if (!orgId) {
    return res.status(400).json({
      success: false,
      message: "Organization ID required"
    });
  }

  req.orgId = orgId;
  next();
};

export default attachOrg;