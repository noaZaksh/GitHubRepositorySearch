import { Component, inject, signal } from '@angular/core';

import { BookmarkService } from '../../services/bookmark.service';
import { GitHubRepo } from '../../models/github-repo.model';
import { RepositoryCardComponent } from '../repository-card/repository-card.component';

@Component({
  selector: 'app-bookmarks',
  standalone: true,
  imports: [RepositoryCardComponent],
  templateUrl: './bookmarks.component.html',
  styleUrl: './bookmarks.component.css',
})
export class BookmarksComponent {
  private readonly bookmarkService = inject(BookmarkService);

  readonly bookmarks = signal<GitHubRepo[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  constructor() {
    this.loadBookmarks();
  }

  loadBookmarks(): void {
    this.loading.set(true);
    this.error.set(null);

    this.bookmarkService.getBookmarks().subscribe({
      next: (bookmarks) => {
        this.bookmarks.set(bookmarks);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load bookmarks:', err);
        this.error.set('Failed to load bookmarks.');
        this.loading.set(false);
      },
    });
  }

  removeBookmark(repo: GitHubRepo): void {
    this.bookmarkService.removeBookmark(repo.id).subscribe({
      next: () => {
        this.bookmarks.update((current) =>
          current.filter((item) => item.id !== repo.id),
        );
      },
      error: (err) => {
        console.error('Failed to remove bookmark:', err);
      },
    });
  }
}