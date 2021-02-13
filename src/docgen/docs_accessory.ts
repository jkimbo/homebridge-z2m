import { Controller, ControllerServiceMap, Service } from 'homebridge';
import { BasicAccessory, BasicLogger, BasicPlatform, ServiceHandler } from '../converters/interfaces';

class DocsPlatform implements BasicPlatform {
  isHomebridgeServerVersionGreaterOrEqualTo(version: string): boolean {
    // Always return true
    return true;
  }
}

export class DocsAccessory implements BasicAccessory {
   readonly log: BasicLogger = <BasicLogger><unknown>{
     info: function () {
       // stub
     },
     warn: function () {
       // stub
     },
     error: function () {
       // stub
     },
     debug: function () {
       // stub
     },
   };

   private readonly services : Service[] = [];
   private readonly handlerIds = new Set<string>();
   private readonly controllers = new Set<string>();
   platform = new DocsPlatform();

   constructor(
      readonly displayName: string){}
      
   configureController(controller: Controller<ControllerServiceMap>): void {
     this.controllers.add(controller.constructor.name);
   }

   getControllerNames() : string[] {
     return [...this.controllers].sort();
   }

   getServicesAndCharacteristics() : Map<string, string[]> {
     const result = new Map<string, string[]>();
     for (const srv of this.services) {
       const characteristics = new Set<string>(srv.characteristics.map(c => c.UUID));
       const existing = result.get(srv.UUID);
       if (existing !== undefined) {
         existing.forEach(c => characteristics.add(c));
       }
       result.set(srv.UUID, [...characteristics]);
     }
     return result;
   }
 
   getOrAddService(service: Service): Service {
     const existingService = this.services.find(e =>
       e.UUID === service.UUID && e.subtype === service.subtype,
     );
   
     if (existingService !== undefined) {
       return existingService;
     }

     this.services.push(service);
     return service;
   }

   // eslint-disable-next-line @typescript-eslint/no-unused-vars
   queueDataForSetAction(_data: Record<string, unknown>): void {
     // Do nothing
   }

   // eslint-disable-next-line @typescript-eslint/no-unused-vars
   queueKeyForGetAction(key: string | string[]): void {
     // Do nothing
   }

   // eslint-disable-next-line @typescript-eslint/no-unused-vars
   isPropertyExcluded(property: string | undefined): boolean {
     return false;
   }

   // eslint-disable-next-line @typescript-eslint/no-unused-vars
   isValueAllowedForProperty(property: string, value: string): boolean {
     return true;
   }

   registerServiceHandler(handler: ServiceHandler): void {
     this.handlerIds.add(handler.identifier);
   }

   isServiceHandlerIdKnown(identifier: string): boolean {
     return this.handlerIds.has(identifier);
   }
}