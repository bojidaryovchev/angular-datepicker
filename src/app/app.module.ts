import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { DatepickerComponent } from "./datepicker/datepicker.component";
import { NgDatepickerModule } from "./ngdatepicker/ngdatepicker.module";

@NgModule({
  declarations: [AppComponent, DatepickerComponent],
  imports: [BrowserModule, AppRoutingModule, NgDatepickerModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
