import { Component, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

type AuthPageKey = 'login' | 'forgot-password' | 'reset-password' | 'registration';

interface AuthPageContent {
  key: AuthPageKey;
  title: string;
  subtitle: string;
  icon: 'login' | 'mail' | 'lock';
  link: string;
  linkPrefix: string;
  linkLabel: string;
  showBackArrow: boolean;
}

const AUTH_PAGE_CONTENT: Record<AuthPageKey, AuthPageContent> = {
  login: {
    key: 'login',
    title: 'Welcome Back',
    subtitle: 'Sign in to your patient portal',
    icon: 'login',
    link: '/auth/registration',
    linkPrefix: "Don't have an account?",
    linkLabel: 'Create one',
    showBackArrow: false
  },
  'forgot-password': {
    key: 'forgot-password',
    title: 'Forgot Password',
    subtitle: 'Enter your email to receive a reset link',
    icon: 'mail',
    link: '/auth/login',
    linkPrefix: '',
    linkLabel: 'Back to sign in',
    showBackArrow: true
  },
  'reset-password': {
    key: 'reset-password',
    title: 'Set New Password',
    subtitle: 'Create a strong password for your account',
    icon: 'lock',
    link: '/auth/login',
    linkPrefix: '',
    linkLabel: 'Back to sign in',
    showBackArrow: true
  },
  registration: {
    key: 'registration',
    title: 'Create your account',
    subtitle: 'Medication refills are only a few clicks away',
    icon: 'login',
    link: '/auth/login',
    linkPrefix: 'Already have an account?',
    linkLabel: 'Log In',
    showBackArrow: false
  }
};

@Component({
  selector: 'app-auth-layout',
  imports: [RouterLink, RouterOutlet],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.scss'
})
export class AuthLayout {
  private readonly router = inject(Router);
  private readonly currentUrl = signal(this.router.url);

  protected readonly page = computed(() => {
    const key = this.currentUrl().split('?')[0].split('/').filter(Boolean).at(-1) as AuthPageKey;
    return AUTH_PAGE_CONTENT[key] ?? AUTH_PAGE_CONTENT.login;
  });

  constructor() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => this.currentUrl.set(event.urlAfterRedirects));
  }
}
