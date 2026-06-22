import { Injectable } from '@angular/core';
import { StoredUser } from '../models/auth.model';

export interface StorageSchema {
  auth_token: string;
  registered_users: StoredUser[];
}

export type StorageKey = keyof StorageSchema;

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  get<K extends StorageKey>(key: K): StorageSchema[K] | null {
    const raw = localStorage.getItem(key);
    if (raw === null) return null;
    try {
      return JSON.parse(raw) as StorageSchema[K];
    } catch {
      return null;
    }
  }

  set<K extends StorageKey>(key: K, value: StorageSchema[K]): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  remove(key: StorageKey): void {
    localStorage.removeItem(key);
  }
}
