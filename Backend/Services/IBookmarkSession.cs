using Backend.DTOs;

namespace Backend.Services;

public interface IBookmarkSession
{
    List<GithubRepositoryDto> GetBookmarks();
    void AddBookmark(GithubRepositoryDto repository);
    void RemoveBookmark(long repositoryId);
}
