export interface Mib {
  description: string;
  oid: string;
  telnetShortcut: string;
  unit: string;
}
export interface Client {
  id: number;
  macAddress: string;
  status: string;
  type: string;
  telnetPort: string;
  pid: string;
  userName: string;
  configuration: number;
}
