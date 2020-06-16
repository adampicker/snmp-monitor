import { Mib } from '../../../shared/model/snmp.model';

export interface ConfigurationSave {
  configurationName: string;
  defaultConfiguration: boolean;
  mibs: Mib[];
}
