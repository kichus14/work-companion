import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {Router} from '@angular/router';
import {LocalStorageService} from 'ngx-store';
import {MenuItem, PrimeNGConfig} from 'primeng/api';
import {USER_AUTH_STORAGE_KEY, USER_DETAIL_STORAGE_KEY, USER_THEME} from './constants/localstorage.constant';
import {Path} from './constants/routes.constant';
import {AppTheme, THEMES} from './constants/themes.constant';
import {UserDetail} from './interfaces/user.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  public items: MenuItem[];
  public userDetail: UserDetail;
  public showFallbackImage = false;
  public currentTheme: AppTheme;
  public themes = THEMES;

  constructor(
    readonly primeConfig: PrimeNGConfig,
    readonly localStorageService: LocalStorageService,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
    ) {
    primeConfig.ripple = true;
    this.userDetail = this.localStorageService.get(USER_DETAIL_STORAGE_KEY);
    const authKey = this.localStorageService.get(USER_DETAIL_STORAGE_KEY);
    this.checkAuthAndRedirect(authKey);
    this.localStorageService.observe(USER_DETAIL_STORAGE_KEY).subscribe((res) => {
      this.userDetail = res.newValue;
      this.cdr.markForCheck();
    });
    this.localStorageService.observe(USER_AUTH_STORAGE_KEY).subscribe((res) => {
      this.checkAuthAndRedirect(res.newValue);
    });
    this.items = [
      {
        label: 'Export Literals',
        icon: 'pi pi-fw pi-cloud-download',
        routerLink: [Path.literals, Path.extractLiterals],
      },
      {
        label: 'Validate Literals',
        icon: 'pi pi-fw pi-check-square',
        routerLink: [Path.literals, Path.validateLiterals],
      }
    ];
    let storedTheme = this.localStorageService.get(USER_THEME);
    if (storedTheme === null) {
      storedTheme = THEMES[0];
    }
    this.currentTheme = storedTheme;
    this.changeTheme(this.currentTheme);
  }

  imgLoadError(event: Event): void {
    this.showFallbackImage = true;
  }

  get iconLabel(): string {
    const userNameArray = this.userDetail.displayName.trim().split(' ');
    return userNameArray.length > 1 ? userNameArray[0].charAt(0) + userNameArray[1].charAt(0) : userNameArray[0].charAt(0);
  }

  changeTheme(newTheme: AppTheme): void {
    const themeLink = document.getElementById('theme-style-link');
    if (themeLink != null) {
      let existingThemeLink = themeLink.getAttribute('href');
      if (existingThemeLink == null) {
        existingThemeLink = '';
      }
      themeLink.setAttribute('href', existingThemeLink.replace(this.currentTheme.slug, newTheme.slug));
      this.currentTheme = newTheme;
    } else {
      const headElement = document.getElementsByTagName('head').item(0);
      if (headElement == null) {
        return;
      }
      const linkElement = document.createElement('link');
      linkElement.href = `assets/themes/${newTheme.slug}/theme.css`;
      linkElement.rel = 'stylesheet';
      linkElement.type = 'text/css';
      headElement.appendChild(linkElement);
    }
    this.localStorageService.set(USER_THEME, newTheme);
  }

  private checkAuthAndRedirect(auth: string): void {
    if (auth == null || auth === '') {
      this.router.navigate([Path.login]);
    }
  }
}
