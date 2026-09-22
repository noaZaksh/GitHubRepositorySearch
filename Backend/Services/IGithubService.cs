using Backend.DTOs;

namespace Backend.Services;

public interface IGithubService
{
    Task<List<GithubRepositoryDto>> SearchRepositoriesAsync(string query);
}
