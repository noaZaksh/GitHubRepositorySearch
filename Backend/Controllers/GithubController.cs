using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GithubController : ControllerBase
{
    private readonly IGithubService _githubService;

    public GithubController(IGithubService githubService)
    {
        _githubService = githubService;
    }

    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] string query)
    {
        if (string.IsNullOrWhiteSpace(query))
            return BadRequest("Search query is required.");

        var repositories = await _githubService.SearchRepositoriesAsync(query);

        return Ok(repositories);
    }
}
