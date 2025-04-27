export const getPermissionCN = (permission: number): string => {
  switch (permission) {
    case 1: return '用户';
    case 1 << 1: return '创作者';
    case 1 << 2: return '开发者';
    case 1 << 3: return '管理者';
    case 1 << 4: return '创始者';
    default: return '未知权限';
  }
}
export const getPermissionByName = (): {
  USER: number;
  CREATOR: number;
  DEVELOPER: number;
  MANAGER: number;
  ADMIN: number
} => {
  return {
    USER: 1,
    CREATOR: 1 << 1,
    DEVELOPER: 1 << 2,
    MANAGER: 1 << 3,
    ADMIN: 1 << 4,
  }
}
