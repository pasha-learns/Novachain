import { InjectionToken } from '@angular/core';
import { environment } from '../../../environment/environment';

export type Environment = typeof environment;

export const ENVIRONMENT = new InjectionToken<Environment>('ENVIRONMENT');
