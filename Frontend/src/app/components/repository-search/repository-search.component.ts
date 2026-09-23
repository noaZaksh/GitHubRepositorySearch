import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { GithubService } from '../../services/github.service';
import { BookmarkService } from '../../services/bookmark.service';
import { AuthService } from '../../services/auth.service';

import { GitHubRepo } from '../../models/github-repo.model';

import { RepositoryCardComponent } from '../repository-card/repository-card.component';
import { LoginComponent } from '../login/login.component';
import { BookmarksComponent } from '../bookmarks/bookmarks.component';

@Component({
  selector: 'app-repository-search',
  standalone: true,
  imports: [
    FormsModule,
    RepositoryCardComponent,
    LoginComponent,
    BookmarksComponent,
  ],
  templateUrl: './repository-search.component.html',
  styleUrl: './repository-search.component.css',
})
export class RepositorySearchComponent {
  private readonly githubService = inject(GithubService);
  private readonly bookmarkService = inject(BookmarkService);

  readonly authService = inject(AuthService);

  query = '';

  loading = signal(false);
  searched = signal(false);
  error = signal<string | null>(null);
  repos = signal<GitHubRepo[]>([]);
  lastQuery = signal('');

  readonly showBookmarks = signal(false);

  private bookmarked = signal<Set<number>>(new Set());

  constructor() {
    if (this.authService.isLoggedIn()) {
      this.loadBookmarks();
    }
  }

  loadBookmarks(): void {
    this.bookmarkService.getBookmarks().subscribe({
      next: (bookmarks) => {
        const ids = new Set(
          bookmarks.map((repo) => repo.id),
        );

        this.bookmarked.set(ids);
      },

      error: (err) => {
        console.error(
          'Failed to load bookmarks:',
          err,
        );
      },
    });
  }

  search(): void {
    const term = this.query.trim();

    if (!term) {
      this.error.set('Please enter a search term.');
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    this.searched.set(true);
    this.lastQuery.set(term);

    this.githubService.searchRepositories(term).subscribe({
      next: (results) => {
        this.repos.set(results);
        this.loading.set(false);
      },

      error: (err: Error) => {
        console.error('API ERROR:', err);

        this.error.set(err.message);
        this.repos.set([]);
        this.loading.set(false);
      },
    });
  }

  isBookmarked(id: number): boolean {
    return this.bookmarked().has(id);
  }

  toggleBookmark(repo: GitHubRepo): void {
    const isCurrentlyBookmarked =
      this.isBookmarked(repo.id);

    if (isCurrentlyBookmarked) {
      this.bookmarkService
        .removeBookmark(repo.id)
        .subscribe({
          next: () => {
            const current = new Set(
              this.bookmarked(),
            );

            current.delete(repo.id);
            this.bookmarked.set(current);
          },

          error: (err) => {
            console.error(
              'Failed to remove bookmark:',
              err,
            );
          },
        });
    } else {
      this.bookmarkService
        .addBookmark(repo)
        .subscribe({
          next: () => {
            const current = new Set(
              this.bookmarked(),
            );

            current.add(repo.id);
            this.bookmarked.set(current);
          },

          error: (err) => {
            console.error(
              'Failed to add bookmark:',
              err,
            );
          },
        });
    }
  }

  openBookmarks(): void {
    this.showBookmarks.set(true);
  }

  openSearch(): void {
    this.showBookmarks.set(false);
  }

  logout(): void {
    this.authService.logout();

    this.query = '';
    this.repos.set([]);
    this.bookmarked.set(new Set());
    this.searched.set(false);
    this.showBookmarks.set(false);
  }
}