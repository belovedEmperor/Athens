export const conflict = (res, field) =>
  res.status(409).json({
    errors: [{ msg: `${field} already in use.`, path: field }],
  });

export const sendError = (res, { status = 400, type, location, path, msg }) =>
  res.status(status).json({ errors: [{ type, location, path, status, msg }] });

export const sendBodyError = (res, { status = 400, msg }) =>
  sendError(res, {
    type: "field",
    path: "body",
    location: "body",
    status,
    msg,
  });
