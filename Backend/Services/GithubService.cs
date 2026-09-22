using System.Net.Http.Json;
using System.Text.Json.Serialization;
using Backend.DTOs;

namespace Backend.Services;

public class GithubService : IGithubService
{
    private readonly HttpClient _httpClient;

    public GithubService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<List<GithubRepositoryDto>> SearchRepositoriesAsync(string query)
    {
        var response = await _httpClient.GetFromJsonAsync<GithubSearchResponse>(
            $"https://api.github.com/search/repositories?q={Uri.EscapeDataString(query)}");

        return response?.Items.Select(repository => new GithubRepositoryDto
        {
            Id = repository.Id,
            Name = repository.Name,
            FullName = repository.FullName,
            HtmlUrl = repository.HtmlUrl,
            AvatarUrl = repository.Owner?.AvatarUrl ?? string.Empty
        }).ToList() ?? [];
    }

    private class GithubSearchResponse
    {
        [JsonPropertyName("items")]
        public List<GithubRepositoryResponse> Items { get; set; } = [];
    }

    private class GithubRepositoryResponse
    {
        [JsonPropertyName("id")]
        public long Id { get; set; }

        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;

        [JsonPropertyName("full_name")]
        public string FullName { get; set; } = string.Empty;

        [JsonPropertyName("html_url")]
        public string HtmlUrl { get; set; } = string.Empty;

        [JsonPropertyName("owner")]
        public GithubOwnerResponse? Owner { get; set; }
    }

    private class GithubOwnerResponse
    {
        [JsonPropertyName("avatar_url")]
        public string AvatarUrl { get; set; } = string.Empty;
    }
}
