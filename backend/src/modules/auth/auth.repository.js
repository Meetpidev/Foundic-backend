const prisma = require("../../config/db");

function findUserByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}

function findUserById(id) {
  return prisma.user.findUnique({ where: { id } });
}

function createUserWithProfile({ email, phone, passwordHash, role, fullName }) {
  return prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: { email, phone, passwordHash, role },
    });

    if (role === "FOUNDER") {
      await tx.founderProfile.create({ data: { userId: user.id, fullName } });
    } else if (role === "COMPANY") {
      await tx.companyProfile.create({ data: { userId: user.id } });
    } else if (role === "EXPERT") {
      await tx.expertProfile.create({ data: { userId: user.id } });
    }

    return user;
  });
}

function markUserVerified(userId) {
  return prisma.user.update({ where: { id: userId }, data: { isVerified: true } });
}

function updatePassword(userId, passwordHash) {
  return prisma.user.update({ where: { id: userId }, data: { passwordHash } });
}

function enableTwoFactor(userId, secret) {
  return prisma.user.update({
    where: { id: userId },
    data: { twoFactorEnabled: true, twoFactorSecret: secret },
  });
}

module.exports = {
  findUserByEmail,
  findUserById,
  createUserWithProfile,
  markUserVerified,
  updatePassword,
  enableTwoFactor,
};