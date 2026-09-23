import { Component, input, output, signal } from '@angular/core';
import { GitHubRepo } from '../../models/github-repo.model';

@Component({
  selector: 'app-repository-card',
  templateUrl: './repository-card.component.html',
  styleUrl: './repository-card.component.css',
})
export class RepositoryCardComponent {
  readonly repo = input.required<GitHubRepo>();
  readonly bookmarked = input.required<boolean>();

  readonly bookmarkToggle = output<number>();

  onBookmarkClick(): void {
    this.bookmarkToggle.emit(this.repo().id);
  }
}
