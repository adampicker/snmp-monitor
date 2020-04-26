export interface TableConfig {
  columns: TableColumn[];
}

export interface TableColumn {
  label: string;
  type: string;
  key: string;
  visible?: boolean;
  icon?: string;
}

export const columns: TableColumn[] = [
  {
    label: 'Client ID',
    type: 'number',
    key: 'id',
    visible: true
  },
  {
    label: 'MAC',
    type: 'number',
    key: 'macAddress',
    visible: true
  },
  { label: 'Status', type: 'status', key: 'status', visible: true },
  { label: 'Client type', type: 'type', key: 'type', visible: true },
  { label: 'PID', type: 'number', key: 'pid', visible: true },
  { label: 'User', type: 'number', key: 'userName', visible: true },
  { label: 'Port', type: 'number', key: 'port', visible: true }
];
