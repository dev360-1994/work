import { RoleWiseMenu } from './role-wise-menu';
import { griddoMaster } from './griddo-master.menu';
import { builderAdmin } from './builder-admin.menu';
import { builderAdminProjectMenu } from './builder-admin-project.menu';
import { agentAdmin } from './agent-admin.menu';
import { buyerAdmin } from './buyer-admin.menu';
import { agencyAdmin } from './buyer-admin.menu';

export const sidebarMenu: {
  griddoMaster?: RoleWiseMenu,
  builderAdmin?: RoleWiseMenu,
  builderAdminProjectMenu?: RoleWiseMenu,
  agentAdmin?: RoleWiseMenu,
  agencyAdmin?: RoleWiseMenu,
  buyerAdmin?:RoleWiseMenu
} = {
  griddoMaster,
  builderAdmin,
  builderAdminProjectMenu,
  agentAdmin,
 agencyAdmin,
  buyerAdmin
}