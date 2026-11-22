/**
 * Validates member is chat admin.
 * Must be used after `validateUserIsChatMember`.
 */
export default [
  async (req, res, next) => {
    try {
      if (req.memberRole !== "ADMIN") return res.sendStatus(403);
      return next();
    } catch (err) {
      console.error(err);
      next(err);
    }
  },
];
