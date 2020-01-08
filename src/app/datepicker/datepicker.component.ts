import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatepickerComponent implements OnInit {
  today: Date = new Date(new Date().getTime());

  constructor(
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {}

  onDateChanged(date: Date) {
    this.today = date;
    this.changeDetectorRef.markForCheck();
  }
}
