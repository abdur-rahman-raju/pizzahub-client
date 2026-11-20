export const ROLE_HOME = {
  admin: "/dashboard/admin",
  vendor: "/dashboard/vendor",
  customer: "/dashboard/customer",
};

export const getRoleHome = (role) => ROLE_HOME[role] || "/dashboard/customer";