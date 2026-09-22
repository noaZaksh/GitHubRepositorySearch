using System.Text.Json;
using Backend.DTOs;

namespace Backend.Services;

public class BookmarkSession : IBookmarkSession
{
    private const string SessionKey = "bookmarks";

    private readonly IHttpContextAccessor _httpContextAccessor;

    public BookmarkSession(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public List<GithubRepositoryDto> GetBookmarks()
    {
        var json = _httpContextAccessor.HttpContext?.Session.GetString(SessionKey);

        if (string.IsNullOrEmpty(json))
        {
            return [];
        }

        return JsonSerializer.Deserialize<List<GithubRepositoryDto>>(json) ?? [];
    }

    public void AddBookmark(GithubRepositoryDto repository)
    {
        var bookmarks = GetBookmarks();

        if (bookmarks.Any(x => x.Id == repository.Id))
        {
            return;
        }

        bookmarks.Add(repository);

        Save(bookmarks);
    }

    public void RemoveBookmark(long repositoryId)
    {
        var bookmarks = GetBookmarks();

        bookmarks.RemoveAll(x => x.Id == repositoryId);

        Save(bookmarks);
    }

    private void Save(List<GithubRepositoryDto> bookmarks)
    {
        var json = JsonSerializer.Serialize(bookmarks);

        _httpContextAccessor.HttpContext?
            .Session
            .SetString(SessionKey, json);
    }
}
