import { ApplicationRef, ChangeDetectorRef, ComponentRef, Directive, ElementRef, EmbeddedViewRef, HostListener, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { NgDatepickerComponent } from '../components/ngdatepicker/ngdatepicker.component';
import { DynamicComponentsService } from '../services/dynamicComponents.service';
import { isChildOf } from '../utilities/html.utilities';

@Directive({
  selector: '[ngdatepicker]',
  host: {
    '(click)': 'onClick($event)'
  }
})
export class NgDatepickerDirective implements OnChanges {
  private readonly marginTop: number = 4;

  @Input() date: Date;

  @Output() dateChanged: EventEmitter<Date> = new EventEmitter();

  static ngDatepickerComponentRef: ComponentRef<NgDatepickerComponent>;

  constructor(
    private readonly dynamicComponentsService: DynamicComponentsService,
    private readonly appRef: ApplicationRef,
    private readonly elementRef: ElementRef<HTMLElement>
  ) {
    if (!NgDatepickerDirective.ngDatepickerComponentRef) {
      this.appendToBody();
      this.registerGlobalScrollHandler();
    }
  }

  ngOnChanges() {
    this.updateInstance();
  }

  get datepickerElement(): HTMLElement {
    return this.getDomElement(NgDatepickerDirective.ngDatepickerComponentRef);
  }

  get datepickerInstance(): NgDatepickerComponent {
    const {
      ngDatepickerComponentRef: { instance }
    } = NgDatepickerDirective;

    return instance;
  }

  get datepickerChangeDetectorRef(): ChangeDetectorRef {
    const {
      ngDatepickerComponentRef: { changeDetectorRef }
    } = NgDatepickerDirective;

    return changeDetectorRef;
  }

  onClick() {
    this.updatePosition();
    this.datepickerInstance.show();
  }

  @HostListener('document:click', ['$event']) onDocumentClick({ target }: Event) {
    const targetIsNotPartOfTheDatepicker = target !== this.datepickerElement && !isChildOf(this.datepickerElement, target as HTMLElement);
    const targetIsNotPartOfTheElementRef = target !== this.elementRef.nativeElement && !isChildOf(this.elementRef.nativeElement, target as HTMLElement);

    if (targetIsNotPartOfTheDatepicker && targetIsNotPartOfTheElementRef) {
      this.datepickerInstance.hide();
    }
  }

  private getDomElement<T>(componentRef: ComponentRef<T>): HTMLElement {
    return (componentRef.hostView as EmbeddedViewRef<unknown>).rootNodes[0] as HTMLElement;
  }

  private appendToBody() {
    NgDatepickerDirective.ngDatepickerComponentRef = this.dynamicComponentsService.createComponentElement(NgDatepickerComponent, {});

    this.appRef.attachView(NgDatepickerDirective.ngDatepickerComponentRef.hostView);

    document.body.appendChild(this.getDomElement(NgDatepickerDirective.ngDatepickerComponentRef));
  }

  private updateInstance() {
    this.datepickerInstance.date = this.date;
    this.datepickerInstance.dateChanged = this.dateChanged;
    this.datepickerInstance.initMonth();
    this.datepickerInstance.initYear();
    this.datepickerChangeDetectorRef.detectChanges();
  }

  private updatePosition() {
    const { left, top, width, height } = this.elementRef.nativeElement.getBoundingClientRect();

    const datepicker = this.datepickerElement.firstElementChild as HTMLElement;
    const datepickerBoundingRect = datepicker.getBoundingClientRect();

    const elementFitsOnTheRight: boolean = left + datepickerBoundingRect.width <= window.innerWidth;

    if (elementFitsOnTheRight) {
      datepicker.style.left = `${left}px`;
    } else {
      datepicker.style.left = `${left + width - datepickerBoundingRect.width}px`;
    }
    
    const elementFitsBeneath: boolean = top + height + this.marginTop + datepickerBoundingRect.height <= window.innerHeight;

    if (elementFitsBeneath) {
      datepicker.style.top = `${top + height + this.marginTop}px`;
    } else {
      datepicker.style.top = `${top - this.marginTop - datepickerBoundingRect.height}px`;
    }
  }

  private globalScrollHandler() {
    this.updatePosition();
  }

  private registerGlobalScrollHandler() {
    document.addEventListener(
      'scroll',
      () => {
        this.globalScrollHandler();
      },
      true
    );
  }
}
