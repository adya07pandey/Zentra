import * as service from "./accounts.service.js";
import {createAccountSchema, updateAccountSchema} from "./accounts.validation.js";


export const createAccount = async (req, res, next) => {
  try {
    const orgId = req.orgId;

    const parsed = createAccountSchema.parse(req.body);

    const account = await service.createAccount(parsed, orgId);
    
    res.status(201).json({
      success: true,
      data: account,
    });
  } catch (err) {
    next(err);
  }
};

export const getAccounts = async (req, res, next) => {
  try {
    const orgId = req.orgId;

    const accounts = await service.getAccounts(orgId);

    res.json({
      success: true,
      data: accounts,
    });
  } catch (err) {
    next(err);
  }
};


export const getAccount = async (req, res, next) => {
  try {
    const { id } = req.params;
    const orgId = req.orgId;

    const account = await service.getAccountById(id, orgId);

    res.json({
      success: true,
      data: account,
    });
  } catch (err) {
    next(err);
  }
};


export const updateAccount = async (req, res, next) => {
  try {
    const orgId = req.orgId;
    const { id } = req.params;

    const parsed = updateAccountSchema.parse(req.body);

    const account = await service.updateAccount(id, parsed, orgId);

    res.json({
      success: true,
      data: account,
    });
  } catch (err) {
    next(err);
  }
};