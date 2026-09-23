import { bootstrapApplication } from '@angular/platform-browser';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';

import { RepositorySearchComponent } from './app/components/repository-search/repository-search.component';
import { authInterceptor } from './app/interceptors/auth.interceptor';

bootstrapApplication(RepositorySearchComponent, {
  providers: [
    provideHttpClient(
      withFetch(),
      withInterceptors([
        authInterceptor,
      ]),
    ),
  ],
});