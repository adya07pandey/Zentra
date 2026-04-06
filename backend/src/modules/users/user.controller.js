import * as service from "./user.services.js"

export const getUsers = async (req, res, next) => {
  try {
    const orgId = req.orgId;

    const users = await service.getUsers(orgId);
    res.json({
      success: true,
      data: users,
    });
  } catch (err) {
    next(err);
  }
};

export const inviteUser = async (req, res) => {
  try {
    const { email, role } = req.body;
    const orgId = req.orgId;
    const userId = req.user.userId;
    console.log("createdby",userId)
    const result = await service.inviteUser(
      email,
      role,
      orgId,
      userId
    );
    console.log(result)
    res.json(result);
  } catch (err) {
    console.log(err)
    res.status(500).json({"message":"Failed to send Invite"});
  }
};

export const acceptInvite = async (req, res) => {
  try {
    const { token, password, name } = req.body;

    const result = await service.acceptInvite(token, password, name);

    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};