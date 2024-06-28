export class User {
  id: any;
  userName: string;
  agencyId: string;
  builderId: string;
  agentId: number;
  fullName: string;
  email: string;
  token: string;
  role: string;
  roles: Array<"MasterAdmin" | "Builder" | "Agent" | "Agency" | "Buyer"> = []; //'MasterAdmin'  'Builder Agent
  superadmin?: boolean;
  builder?: boolean;
  agent?: boolean;
  agency?: boolean;
  buyer?: boolean;
  constructor(obj?: User) {
    this.id = obj?.id || '';
    this.userName = obj?.userName || '';
    this.email = obj?.email || '';
    this.token = obj?.token || '';
    this.role = obj?.role || '';
    this.agencyId = obj?.agencyId || '';
    this.builderId = obj?.builderId || '';
    this.fullName = obj?.fullName || '';
    this.roles = obj?.roles || [];
    this.agentId = obj?.agentId || 0;
  }
}