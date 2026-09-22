namespace Backend.DTOs;

public class GithubRepositoryDto
{
    public long Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string HtmlUrl { get; set; } = string.Empty;
    public string AvatarUrl { get; set; } = string.Empty;
}
