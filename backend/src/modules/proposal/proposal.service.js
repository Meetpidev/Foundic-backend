// src/modules/proposal/proposal.service.js
const ApiError = require("../../utils/ApiError");
const repo = require("./proposal.repository");

async function createProposal(payload) {
  return repo.createProposal({ ...payload, status: "SENT" });
}

async function approveProposal(proposalId, executionDetails) {
  const proposal = await repo.getProposalById(proposalId);
  if (!proposal) throw new ApiError(404, "Proposal not found");
  if (proposal.status !== "SENT") throw new ApiError(400, "Only sent proposals can be approved");

  return repo.approveProposal(proposalId, executionDetails);
}

module.exports = { createProposal, approveProposal };