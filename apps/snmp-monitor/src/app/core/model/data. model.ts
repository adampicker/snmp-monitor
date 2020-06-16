export interface Value {
  timestamp: Date;
  clientId: number;
  oid: string;
  value: string;
  unwrappingSerializer?: boolean;
  delegatee?: any;
}
