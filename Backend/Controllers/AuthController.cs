using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace Backend.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private const string JwtKey =
        "super-secret-key-for-github-repository-search-12345";

    private const string RefreshTokenSessionKey = "refresh_token";

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest request)
    {
        if (request.Username != "demo" || request.Password != "1234")
        {
            return Unauthorized(new
            {
                message = "Invalid username or password."
            });
        }

        var accessToken = CreateAccessToken(request.Username);
        var refreshToken = CreateRefreshToken();

        HttpContext.Session.SetString(
            RefreshTokenSessionKey,
            refreshToken
        );

        return Ok(new
        {
            accessToken,
            refreshToken
        });
    }

    [HttpPost("refresh")]
    public IActionResult Refresh([FromBody] RefreshRequest request)
    {
        var savedRefreshToken =
            HttpContext.Session.GetString(RefreshTokenSessionKey);

        if (string.IsNullOrEmpty(savedRefreshToken) ||
            savedRefreshToken != request.RefreshToken)
        {
            return Unauthorized(new
            {
                message = "Invalid refresh token."
            });
        }

        var accessToken = CreateAccessToken("demo");

        return Ok(new
        {
            accessToken
        });
    }

    private static string CreateAccessToken(string username)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.Name, username)
        };

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(JwtKey)
        );

        var credentials = new SigningCredentials(
            key,
            SecurityAlgorithms.HmacSha256
        );

        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler()
            .WriteToken(token);
    }

    private static string CreateRefreshToken()
    {
        return Convert.ToBase64String(
            RandomNumberGenerator.GetBytes(64)
        );
    }
}

public record LoginRequest(
    string Username,
    string Password
);

public record RefreshRequest(
    string RefreshToken
);
