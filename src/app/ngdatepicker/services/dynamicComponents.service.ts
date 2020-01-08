import { Injectable, ComponentFactoryResolver, Injector, Type, ComponentRef } from '@angular/core';

@Injectable()
export class DynamicComponentsService {

  constructor(
    private readonly componentFactoryResolver: ComponentFactoryResolver,
    private readonly injector: Injector
  ) { }

  createComponentElement<T>(componentType: Type<T>, obj: object): ComponentRef<T> {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentType);
    const component: ComponentRef<T> = componentFactory.create(this.injector);

    Object.keys(obj).forEach(k => component.instance[k] = obj[k]);

    component.changeDetectorRef.detectChanges();

    return component;
  }
}
