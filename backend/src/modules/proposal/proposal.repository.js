// src/modules/proposal/proposal.repository.js
const prisma = require("../../config/db");

function createProposal(data) {
  return prisma.proposal.create({ data });
}

function getProposalById(id) {
  return prisma.proposal.findUnique({ where: { id }, include: { problem: true } });
}

// Approving a proposal atomically creates the Project + ExecutionPlan
function approveProposal(proposalId, { businessGoal, executionGoal, roadmap }) {
  return prisma.$transaction(async (tx) => {
    const proposal = await tx.proposal.update({
      where: { id: proposalId },
      data: { status: "APPROVED" },
    });

    const project = await tx.project.create({
      data: { proposalId: proposal.id, status: "ACTIVE" },
    });

    await tx.executionPlan.create({
      data: { projectId: project.id, businessGoal, executionGoal, roadmap },
    });

    return project;
  });
}

module.exports = { createProposal, getProposalById, approveProposal };