export interface DataValues {
  timestamp: Date;
  clientId: number;
  oid: string;
  value: string;
  unwrappingSerializer?: boolean;
  delegatee: any;
}

export interface DataStream {
  values: DataValues[];
}
