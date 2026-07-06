import { Component, inject, signal, viewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth.service';
import { SearchService } from '../../../core/services/search.service';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { FormFieldComponent } from '../form-field/form-field.component';
import { IconComponent } from '../icon/icon.component';

interface NavItem {
  label: string;
  link: string;
  isRoute?: boolean;
  hasDropdown?: boolean;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, IconComponent, FormFieldComponent, ReactiveFormsModule, ClickOutsideDirective],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private readonly authService = inject(AuthService);
  private readonly searchService = inject(SearchService);

  private readonly searchFieldRef = viewChild(FormFieldComponent);

  readonly isAuthenticated = this.authService.isAuthenticated;
  readonly isSearchOpen = signal(false);
  readonly searchControl = new FormControl('');

  readonly navItems: NavItem[] = [
    { label: 'Dashboard', link: '/dashboard', isRoute: true },
    { label: 'Markets', link: '/markets', isRoute: true },
    { label: 'Trade', link: '#', hasDropdown: true },
    { label: 'Earn', link: '#', hasDropdown: true },
    { label: 'More', link: '#', hasDropdown: true },
  ];

  constructor() {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntilDestroyed(),
    ).subscribe(value => this.searchService.set(value ?? ''));
  }

  toggleSearch(): void {
    const opening = !this.isSearchOpen();
    this.isSearchOpen.set(opening);

    if (opening) {
      this.searchFieldRef()?.focus();
    } else {
      this.searchControl.setValue('', { emitEvent: false });
      this.searchService.clear();
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
