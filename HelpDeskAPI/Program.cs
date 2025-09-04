using HelpDeskAPI.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// 💾 Configurar SQLite y el DbContext
builder.Services.AddDbContext<HelpDeskContext>(options =>
    options.UseSqlite("Data Source=helpdesk.db"));

// 🌍 Configurar CORS para permitir solicitudes desde el frontend
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// 🛡️ Leer configuración del JWT desde appsettings.json
var jwtSettings = builder.Configuration.GetSection("Jwt");
var keyString = jwtSettings["Key"]
    ?? throw new InvalidOperationException("JWT Key missing in configuration");
var issuer = jwtSettings["Issuer"]
    ?? throw new InvalidOperationException("JWT Issuer missing in configuration");
var audience = jwtSettings["Audience"]
    ?? throw new InvalidOperationException("JWT Audience missing in configuration");
var key = Encoding.ASCII.GetBytes(keyString ?? string.Empty);

// 🔐 Configurar autenticación JWT
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidIssuer = issuer,
        ValidAudience = audience
    };
});

// 👮‍♂️ Habilitar controladores y evitar ciclos de referencia en JSON
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
});

// 🧪 Habilitar Swagger (documentación de API REST)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// 🗃️ Aplicar migraciones y crear la base de datos si no existe
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<HelpDeskContext>();
    db.Database.Migrate();
}

// 🌐 Middleware de desarrollo y documentación
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// 🔐 Middleware de HTTPS
app.UseHttpsRedirection();

// 🌍 Habilitar CORS
app.UseCors();

// 🔐 Usar autenticación y autorización
app.UseAuthentication();
app.UseAuthorization();

// 🔄 Routing a los controladores
app.MapControllers();

app.Run();
