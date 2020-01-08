import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter } from '@angular/core';
import { DatepickerView } from '../../enums/datepickerView.enum';
import { NgDate } from '../../models/ngDate';

@Component({
  selector: 'app-ngdatepicker',
  templateUrl: './ngdatepicker.component.html',
  styleUrls: ['./ngdatepicker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgDatepickerComponent {
  private readonly yearCellsCount: number = 16;
  private readonly dayTimespan: number = 24 * 3600 * 1000;
  private readonly datesRows: number = 6;
  private readonly minYear: number = 1895;

  visible: boolean;
  months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  days: string[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  datepickerView = DatepickerView;
  currentDatepickerView: DatepickerView = DatepickerView.Days;
  date: Date;
  dateChanged: EventEmitter<Date>;

  month: number;
  year: number;

  constructor(private readonly changeDetectorRef: ChangeDetectorRef) {}

  get monthString(): string {
    return this.months[this.month];
  }

  get startYear(): number {
    return this.year - this.yearCellsCount / 2 + 1;
  }

  get endYear(): number {
    return this.year + this.yearCellsCount / 2;
  }

  get surroundingYears(): number[] {
    const surroundingYears: number[] = [];

    for (let y = this.startYear; y <= this.endYear; y++) {
      surroundingYears.push(y);
    }

    return surroundingYears;
  }

  get dates(): NgDate[] {
    const dates: NgDate[] = [];

    let date = new Date(this.year, this.month);

    let prev = new Date(date);

    for (let i = prev.getDay() - 1; i > 0; i--) {
      prev = new Date(prev.getTime() - this.dayTimespan);

      dates.unshift({
        date: prev,
        disabled: true
      });
    }

    while (date.getMonth() === this.month) {
      dates.push({
        date
      });

      date = new Date(date.getTime() + this.dayTimespan);
    }

    while (dates.length < this.datesRows * this.days.length) {
      dates.push({
        date,
        disabled: true
      });

      date = new Date(date.getTime() + this.dayTimespan);
    }

    return dates;
  }

  isActive(date: Date) {
    if (!this.date) {
      return;
    }

    return date.getFullYear() === this.date.getFullYear() && date.getMonth() === this.date.getMonth() && date.getDate() === this.date.getDate();
  }

  isToday(date: Date) {
    const today = new Date();

    return date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth() && date.getDate() === today.getDate();
  }

  show() {
    this.visible = true;
    this.changeDetectorRef.markForCheck();
  }

  hide() {
    this.visible = false;
    this.changeDetectorRef.markForCheck();
  }

  initMonth(date: Date = this.date) {
    this.month = date.getMonth();
  }

  initYear(date: Date = this.date) {
    this.year = date.getFullYear();
  }

  backwards() {
    switch (this.currentDatepickerView) {
      case DatepickerView.Days:
        this.month--;

        if (this.month < 0) {
          if (this.year - 1 >= this.minYear) {
            this.year--;
            this.month = this.months.length - 1;
          } else {
            this.month = 0;
          }
        }

        break;
      case DatepickerView.Months:
        this.year--;

        if (this.year < this.minYear) {
          this.year = this.minYear + this.yearCellsCount / 2 - 1;
        }

        break;
      case DatepickerView.Years:
        this.year -= this.yearCellsCount;

        if (this.year < this.minYear) {
          this.year = this.minYear;
        }

        break;
    }

    this.changeDetectorRef.markForCheck();
  }

  forwards() {
    switch (this.currentDatepickerView) {
      case DatepickerView.Days:
        this.month++;

        if (this.month >= this.months.length) {
          this.year++;
          this.month = 0;
        }

        break;
      case DatepickerView.Months:
        this.year++;

        break;
      case DatepickerView.Years:
        this.year += this.yearCellsCount;

        break;
    }

    this.changeDetectorRef.markForCheck();
  }

  toggleView(e: Event, datepickerView: DatepickerView) {
    e.stopPropagation();
    e.stopImmediatePropagation();

    this.currentDatepickerView = datepickerView;
    this.changeDetectorRef.markForCheck();
  }

  onMonthChosen(e: Event, month: number) {
    e.stopPropagation();
    e.stopImmediatePropagation();

    this.month = month;
    this.currentDatepickerView = DatepickerView.Days;
    this.changeDetectorRef.markForCheck();
  }

  onYearChosen(e: Event, year: number) {
    e.stopPropagation();
    e.stopImmediatePropagation();

    this.year = year;
    this.currentDatepickerView = DatepickerView.Months;
    this.changeDetectorRef.markForCheck();
  }

  onDateChosen(e: Event, ngDate: NgDate) {
    e.stopPropagation();
    e.stopImmediatePropagation();

    if (ngDate.disabled) {
      if (
        (ngDate.date.getMonth() < this.month && ngDate.date.getFullYear() === this.year) ||
        (ngDate.date.getMonth() > this.month && ngDate.date.getFullYear() < this.year)
      ) {
        this.backwards();
      } else if (
        (ngDate.date.getMonth() > this.month && ngDate.date.getFullYear() === this.year) ||
        (ngDate.date.getMonth() < this.month && ngDate.date.getFullYear() > this.year)
      ) {
        this.forwards();
      }
    } else {
      this.dateChanged.emit(ngDate.date);
      this.hide();
    }
  }
}
