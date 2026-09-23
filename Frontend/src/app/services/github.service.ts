import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../environments/environment';
import { GitHubRepo } from '../models/github-repo.model';

@Injectable({
  providedIn: 'root',
})
export class GithubService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  searchRepositories(query: string): Observable<GitHubRepo[]> {
    const params = new HttpParams().set('query', query);

    return this.http
      .get<GitHubRepo[]>(
        `${this.baseUrl}/api/github/search`,
        {
          params,
        },
      )
      .pipe(
        catchError((error) =>
          throwError(
            () =>
              new Error(
                error?.error?.message ??
                  error?.message ??
                  'Failed to search repositories. Please try again.',
              ),
          ),
        ),
      );
  }

  getBookmarks(): Observable<GitHubRepo[]> {
    return this.http.get<GitHubRepo[]>(
      `${this.baseUrl}/api/bookmarks`,
      {
        withCredentials: true,
      },
    );
  }

  addBookmark(repository: GitHubRepo): Observable<void> {
    console.log('ADDING BOOKMARK TO SERVER:', repository);

    return this.http.post<void>(
      `${this.baseUrl}/api/bookmarks`,
      repository,
      {
        withCredentials: true,
      },
    );
  }

  removeBookmark(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/api/bookmarks/${id}`,
      {
        withCredentials: true,
      },
    );
  }
}