export const createOrganization = async (req, res) => {
  try {
    const userId = req.user.userId; // from JWT
    const { name } = req.body;

    const org = await prisma.$transaction(async (tx) => {

      //Create org
      const newOrg = await tx.organization.create({
        data: {
          name,
        },
      });

      //Make user OWNER
      await tx.membership.create({
        data: {
          userId,
          orgId: newOrg.id,
          role: "OWNER",
        },
      });

      return newOrg;
    });

    res.json({
      message: "Organization created",
      org,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating org" });
  }
};
