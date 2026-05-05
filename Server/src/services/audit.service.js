import AuditLog from '../models/AuditLog.js';

export const logAction = async (
  { action, performedBy, entityType, entityId, details = {} },
  session = null
) => {
  const logEntry = new AuditLog({
    action,
    performedBy,
    entityType,
    entityId,
    details,
  });

  if (session) {
    return await logEntry.save({ session });
  }
  return await logEntry.save();
};
