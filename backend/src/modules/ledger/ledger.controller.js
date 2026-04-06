import * as ledgerService from "./ledger.service.js";

export const getLedger = async (req, res, next) => {

  try {
    const { accountId } = req.params;
    const orgId = req.orgId;
    const ledger = await ledgerService.getLedger(accountId, orgId);

    res.json({
      success: true,
      data: ledger,
    });
  } catch (err) {
    next(err);
  }
};

