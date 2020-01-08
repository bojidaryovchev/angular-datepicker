import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgDatepickerComponent } from './components/ngdatepicker/ngdatepicker.component';
import { NgDatepickerDirective } from './directives/ngdatepicker.directive';
import { DynamicComponentsService } from './services/dynamicComponents.service';
import { NgDatePipe } from './pipes/ngDate.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [NgDatepickerComponent, NgDatepickerDirective, NgDatePipe],
  providers: [DynamicComponentsService],
  entryComponents: [NgDatepickerComponent],
  exports: [NgDatepickerDirective]
})
export class NgDatepickerModule {}
