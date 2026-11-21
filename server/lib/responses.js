export const conflict = (res, field) =>
  res.status(409).json({
    errors: [{ msg: `${field} already in use.`, path: field }],
  });
