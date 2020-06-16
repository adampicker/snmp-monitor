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
  port: string;
  pid: number;
  userName: string;
  configuration: number;
}
