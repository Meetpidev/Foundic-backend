const prisma = require("../../config/db");

function createInvoice(data) {
  return prisma.invoice.create({ data });
}

function recordPayment(data) {
  return prisma.payment.create({ data });
}

function markInvoicePaid(invoiceId) {
  return prisma.invoice.update({ where: { id: invoiceId }, data: { status: "PAID" } });
}

function getInvoicesForProject(projectId) {
  return prisma.invoice.findMany({ where: { projectId }, include: { payments: true } });
}

module.exports = { createInvoice, recordPayment, markInvoicePaid, getInvoicesForProject };