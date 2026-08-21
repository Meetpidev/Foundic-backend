const service = require("./revenue.service");

async function createInvoice(req, res, next) {
  try {
    const data = await service.createInvoice(req.params.projectId, req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function webhook(req, res, next) {
  try {
    const data = await service.handlePaymentWebhook(req.body);
    res.status(200).json({ received: true, data });
  } catch (err) {
    next(err);
  }
}

async function listInvoices(req, res, next) {
  try {
    const data = await service.getInvoices(req.params.projectId);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

module.exports = { createInvoice, webhook, listInvoices };