import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedRoutingModule } from './shared-routing.module';
import { MenuTopComponent } from './components/menu-top/menu-top.component';
import { SpinnerComponent } from './ui/spinner/spinner.component';
import { MenuLeftComponent } from './components/menu-left/menu-left.component';
import { CreateConfigurationModalComponent } from '../modules/mib/components/create-configuration-modal/create-configuration-modal.component';
import { LengthPipe } from './pipes/length.pipe';
import { ButtonComponent } from './components/button/button.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    SpinnerComponent,
    MenuLeftComponent,
    MenuTopComponent,
    LengthPipe,
    ButtonComponent
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatAutocompleteModule
  ],
  exports: [SpinnerComponent, MenuTopComponent, MenuLeftComponent, LengthPipe],
  entryComponents: [CreateConfigurationModalComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule {}
