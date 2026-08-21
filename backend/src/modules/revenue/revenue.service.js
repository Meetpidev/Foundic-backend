const repo = require("./revenue.repository");

async function createInvoice(projectId, { amount, dueDate }) {
  return repo.createInvoice({ projectId, amount, dueDate, status: "PENDING" });
}

async function handlePaymentWebhook({ invoiceId, amount, method, transactionId, status }) {
  const payment = await repo.recordPayment({ invoiceId, amount, method, transactionId, status });
  if (status === "success") {
    await repo.markInvoicePaid(invoiceId);
  }
  return payment;
}

async function getInvoices(projectId) {
  return repo.getInvoicesForProject(projectId);
}

module.exports = { createInvoice, handlePaymentWebhook, getInvoices };