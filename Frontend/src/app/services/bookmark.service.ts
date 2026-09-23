import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { GitHubRepo } from '../models/github-repo.model';

@Injectable({
  providedIn: 'root',
})
export class BookmarkService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  getBookmarks(): Observable<GitHubRepo[]> {
    return this.http.get<GitHubRepo[]>(
      `${this.baseUrl}/api/bookmarks`,
      {
        withCredentials: true,
      },
    );
  }

  addBookmark(
    repository: GitHubRepo,
  ): Observable<void> {
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