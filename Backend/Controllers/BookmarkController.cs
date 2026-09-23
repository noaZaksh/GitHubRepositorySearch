using Backend.DTOs;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/bookmarks")]
[Authorize]
public class BookmarkController : ControllerBase
{
    private readonly IBookmarkSession _bookmarkSession;

    public BookmarkController(IBookmarkSession bookmarkSession)
    {
        _bookmarkSession = bookmarkSession;
    }

    [HttpGet]
    public ActionResult<List<GithubRepositoryDto>> GetBookmarks()
    {
        return Ok(_bookmarkSession.GetBookmarks());
    }

    [HttpPost]
    public IActionResult AddBookmark([FromBody] GithubRepositoryDto repository)
    {
        _bookmarkSession.AddBookmark(repository);

        return Ok();
    }

    [HttpDelete("{id:long}")]
    public IActionResult RemoveBookmark(long id)
    {
        _bookmarkSession.RemoveBookmark(id);

        return NoContent();
    }
}