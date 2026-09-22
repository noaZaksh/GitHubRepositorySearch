using Backend.Services;

var builder = WebApplication.CreateBuilder(args);

// GitHub API
builder.Services.AddHttpClient<IGithubService, GithubService>(client =>
{
    client.DefaultRequestHeaders.UserAgent.ParseAdd("GitHubRepositorySearch");
});

// Session
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<IBookmarkSession, BookmarkSession>();

builder.Services.AddDistributedMemoryCache();

builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30);

    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;

    // Angular and .NET run on different origins.
    options.Cookie.SameSite = SameSiteMode.None;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
});

// Controllers
builder.Services.AddControllers();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("Angular", policy =>
    {
        policy
            .WithOrigins(
                "https://zp1v56uxy8rdx5ypatb0ockcb9tr6a-oci3--4200--d5306e6f.local-credentialless.webcontainer-api.io"
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// OpenAPI
builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// CORS must run before the endpoints.
app.UseCors("Angular");

app.UseSession();

app.MapControllers();

app.MapGet("/api/health", () => new
{
    status = "ok"
});

app.Run();