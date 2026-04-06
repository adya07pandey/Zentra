import * as service from "./transaction.service.js"

export const createTransaction = async (req, res, next) => {

  try {
    const userId = req.user.userId;
    const orgId = req.orgId;

    const transaction = await service.createTransaction(
      req.body,
      userId,
      orgId
    );

    res.status(201).json({
      success: true,
      data: transaction,
    });
  } catch (err) {
    console.log(err)
    next(err);
  }
};


export const getTransaction = async (req, res, next) => {
  try {
    const { transactionId } = req.params;
    const orgId = req.orgId;
    
    const data = await service.getTransactionById(
      transactionId,
      orgId
    );

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};


export const reverseTransaction = async (req, res, next) => {
  try {
    
    const { id } = req.params;
    const userId = req.user.id;
    const orgId = req.org.id;

    const reversal = await service.reverseTransaction(
      id,
      userId,
      orgId
    );

    res.status(201).json({
      success: true,
      data: reversal,
    });
  } catch (err) {
    next(err);
  }
};

export const getAllTransactions = async (req, res) => {
  try {
    const orgId = req.headers["x-org-id"];

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await service.getAllTransactions(orgId, page, limit);

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};