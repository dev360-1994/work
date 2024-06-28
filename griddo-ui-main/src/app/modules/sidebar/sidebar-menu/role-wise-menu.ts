import { SideBarLink } from "../components/sidebar/sidebar.component";

export interface RoleWiseMenu {
  links?: Array<SideBarLink>,
  bottomlinks?: Array<SideBarLink>,
  heading?: 'none' | 'project' | 'buyer-admin'|'agency-admin';
  find_replace_from_params?: string
}