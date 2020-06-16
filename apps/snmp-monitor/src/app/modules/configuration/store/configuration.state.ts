import { Configuration } from '../model/configuration.model';
import { State, Selector, Action, StateContext } from '@ngxs/store';
import { LoadAllConfigurations } from './configuration.action';
import { ConfigurationService } from '../service/configuration.service';
import { Injectable } from '@angular/core';

interface ConfigurationState {
  configurations: Configuration[];
}

@State<ConfigurationState>({
  name: 'configuration',
  defaults: {
    configurations: []
  }
})
@Injectable()
export class ConfigurationStore {
  constructor(private configurationApiService: ConfigurationService) {}

  @Selector()
  static getConfigurations(state: ConfigurationState) {
    return state.configurations;
  }

  @Action(LoadAllConfigurations)
  updateUserData({ setState }: StateContext<ConfigurationState>) {
    this.configurationApiService.getAllConfigurations().subscribe(res => {
      setState({ configurations: res });
    });
  }
}
