import {
  ApplicationRef,
  ChangeDetectorRef,
  ComponentRef,
  Directive,
  ElementRef,
  EmbeddedViewRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { NgDatepickerComponent } from '../components/ngdatepicker/ngdatepicker.component';
import { DynamicComponentsService } from '../services/dynamicComponents.service';
import { isChildOf } from '../utilities/html.utilities';

@Directive({
  selector: '[ngdatepicker]',
  host: {
    '(click)': 'onClick($event)'
  }
})
export class NgDatepickerDirective implements OnInit, OnChanges, OnDestroy {
  private readonly marginTop: number = 4;

  @Input() date: Date;

  @Output() dateChanged: EventEmitter<Date> = new EventEmitter();

  static ngDatepickerDirectives: NgDatepickerDirective[] = [];

  ngDatepickerComponentRef: ComponentRef<NgDatepickerComponent>;

  constructor(
    private readonly dynamicComponentsService: DynamicComponentsService,
    private readonly appRef: ApplicationRef,
    private readonly elementRef: ElementRef<HTMLElement>
  ) {}

  ngOnInit() {
    NgDatepickerDirective.ngDatepickerDirectives.push(this);

    this.appendToBody();
    this.initGlobalScrollHandler();

    this.updateInstance();
  }

  ngOnChanges() {
    this.updateInstance();
  }

  ngOnDestroy() {
    NgDatepickerDirective.ngDatepickerDirectives = NgDatepickerDirective.ngDatepickerDirectives.filter(directive => directive !== this);

    this.removeFromBody();
    this.destroyGlobalScrollHandler();
  }

  get directiveInstance(): NgDatepickerDirective {
    return NgDatepickerDirective.ngDatepickerDirectives.find(d => d === this);
  }

  get datepickerElement(): HTMLElement {
    if (!this.directiveInstance) {
      return;
    }

    return this.getDomElement(this.directiveInstance.ngDatepickerComponentRef);
  }

  get datepickerInstance(): NgDatepickerComponent {
    if (!this.directiveInstance) {
      return;
    }

    return this.directiveInstance.ngDatepickerComponentRef.instance;
  }

  get datepickerChangeDetectorRef(): ChangeDetectorRef {
    if (!this.directiveInstance) {
      return;
    }

    return this.directiveInstance.ngDatepickerComponentRef.changeDetectorRef;
  }

  onClick() {
    this.updatePosition();
    this.datepickerInstance.show();
  }

  @HostListener('document:click', ['$event']) onDocumentClick({ target }: Event) {
    const targetIsNotPartOfTheDatepicker = target !== this.datepickerElement && !isChildOf(this.datepickerElement, target as HTMLElement);

    let targetIsNotPartOfAnyDirectiveElementRef: boolean = true;

    for (let index = 0; index < NgDatepickerDirective.ngDatepickerDirectives.length; index++) {
      const directive = NgDatepickerDirective.ngDatepickerDirectives[index];

      if (target === directive.elementRef.nativeElement || isChildOf(directive.elementRef.nativeElement, target as HTMLElement)) {
        targetIsNotPartOfAnyDirectiveElementRef = false;
        break;
      }
    }

    if (targetIsNotPartOfTheDatepicker && targetIsNotPartOfAnyDirectiveElementRef) {
      this.datepickerInstance.hide();
    }
  }

  private getDomElement<T>(componentRef: ComponentRef<T>): HTMLElement {
    return (componentRef.hostView as EmbeddedViewRef<T>).rootNodes[0] as HTMLElement;
  }

  private appendToBody() {
    this.ngDatepickerComponentRef = this.dynamicComponentsService.createComponentElement(NgDatepickerComponent, {});

    this.appRef.attachView(this.ngDatepickerComponentRef.hostView);

    document.body.appendChild(this.getDomElement(this.ngDatepickerComponentRef));
  }

  private removeFromBody() {
    this.getDomElement(this.ngDatepickerComponentRef).remove();

    this.appRef.detachView(this.ngDatepickerComponentRef.hostView);
  }

  private updateInstance() {
    if (!this.datepickerInstance) {
      return;
    }

    this.datepickerInstance.date = this.date;
    this.datepickerInstance.dateChanged = this.dateChanged;
    this.datepickerInstance.initMonth();
    this.datepickerInstance.initYear();
    this.datepickerChangeDetectorRef.detectChanges();
  }

  private updatePosition() {
    if (!this.datepickerElement) {
      return;
    }

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

  private initGlobalScrollHandler() {
    document.addEventListener('scroll', this.globalScrollHandler.bind(this), true);
  }

  private destroyGlobalScrollHandler() {
    document.removeEventListener('scroll', this.globalScrollHandler);
  }
}
