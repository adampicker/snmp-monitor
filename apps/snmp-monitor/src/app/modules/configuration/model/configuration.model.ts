import { Mib } from '../../../shared/model/snmp.model';

export interface Configuration {
  id: number;
  client: number;
  configurationName: string;
  defaultConfiguration: boolean;
  mib: Mib[];
}
