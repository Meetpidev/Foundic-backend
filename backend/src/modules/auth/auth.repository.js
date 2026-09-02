const prisma = require("../../config/db");

function findUserByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}

function findUserById(id) {
  return prisma.user.findUnique({ where: { id } });
}

function createUserWithProfile({ email, phone, passwordHash, role, fullName }) {
  return prisma.$transaction(
    async (tx) => {
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
    },
    { maxWait: 15000, timeout: 20000 }
  );
}

function updateUnverifiedUserWithProfile(id, { phone, passwordHash, role, fullName }) {
  return prisma.$transaction(
    async (tx) => {
      const user = await tx.user.update({
        where: { id },
        data: { phone, passwordHash, role },
      });

      if (role === "FOUNDER") {
        await tx.founderProfile.upsert({
          where: { userId: user.id },
          create: { userId: user.id, fullName },
          update: { fullName },
        });
      } else if (role === "COMPANY") {
        await tx.companyProfile.upsert({
          where: { userId: user.id },
          create: { userId: user.id },
          update: {},
        });
      } else if (role === "EXPERT") {
        await tx.expertProfile.upsert({
          where: { userId: user.id },
          create: { userId: user.id },
          update: {},
        });
      }

      return user;
    },
    { maxWait: 15000, timeout: 20000 }
  );
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
  updateUnverifiedUserWithProfile,
  markUserVerified,
  updatePassword,
  enableTwoFactor,
};