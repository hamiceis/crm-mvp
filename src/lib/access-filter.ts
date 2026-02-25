type AccessInput = {
  companyId: string;
  userId: string;
  isAdmin: boolean;
};

type AccessFilter = {
  companyId: string;
  ownerUserId?: string;
};

type TaskAccessFilter = {
  companyId: string;
  assignedToId?: string;
};

export const buildAccessFilter = ({
  companyId,
  userId,
  isAdmin,
}: AccessInput): AccessFilter => {
  const base: AccessFilter = { companyId };
  if (!isAdmin) {
    base.ownerUserId = userId;
  }
  return base;
};

export const buildTaskAccessFilter = ({
  companyId,
  userId,
  isAdmin,
}: AccessInput): TaskAccessFilter => {
  const base: TaskAccessFilter = { companyId };
  if (!isAdmin) {
    base.assignedToId = userId;
  }
  return base;
};
