import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatListModule, } from '@angular/material/list'
import {MatButtonModule} from '@angular/material/button'
import {MatIconModule} from '@angular/material/icon'
import {MatGridListModule} from '@angular/material/grid-list'
import {MatFormFieldModule} from '@angular/material/form-field'
import {MatBadgeModule} from '@angular/material/badge'
import {MatSelectModule} from '@angular/material/select'
import {MatInputModule} from '@angular/material/input'
import {MatRadioModule} from '@angular/material/radio'
import {MatSidenavModule} from '@angular/material/sidenav'
import {MatDatepickerModule} from '@angular/material/datepicker'
import {MatChipsModule} from '@angular/material/chips'
import {MatTooltipModule} from '@angular/material/tooltip'
import {MatTableModule} from '@angular/material/table'
import {MatPaginatorModule} from '@angular/material/paginator'

@NgModule({
   imports: [
      CommonModule,
      MatButtonModule,
      MatToolbarModule,
      MatIconModule,
      MatSidenavModule,
      MatBadgeModule,
      MatListModule,
      MatGridListModule,
      MatFormFieldModule,
      MatInputModule,
      MatSelectModule,
      MatRadioModule,
      MatDatepickerModule,
      MatChipsModule,
      MatTooltipModule,
      MatTableModule,
      MatPaginatorModule
   ],
   exports: [
      MatButtonModule,
      MatToolbarModule,
      MatIconModule,
      MatSidenavModule,
      MatBadgeModule,
      MatListModule,
      MatGridListModule,
      MatInputModule,
      MatFormFieldModule,
      MatSelectModule,
      MatRadioModule,
      MatDatepickerModule,
      MatChipsModule,
      MatTooltipModule,
      MatTableModule,
      MatPaginatorModule
   ],
   providers: [
      MatDatepickerModule,
   ]
})

export class AngularMaterialModule { }