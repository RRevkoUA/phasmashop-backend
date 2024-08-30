export enum RoleEnum {
  USER = 'user',
  MODERATOR = 'moderator',
  ADMIN = 'admin',
}

export const RoleHierarchy = {
  [RoleEnum.USER]: 1,
  [RoleEnum.MODERATOR]: 2,
  [RoleEnum.ADMIN]: 3,
};

export const hasHigherOrEqualRole = (
  role1: RoleEnum,
  role2: RoleEnum,
): boolean => {
  return RoleHierarchy[role1] >= RoleHierarchy[role2];
};
