using HelpDeskAPI.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// 💾 Configurar SQLite y el DbContext
builder.Services.AddDbContext<HelpDeskContext>(options =>
    options.UseSqlite("Data Source=helpdesk.db"));

// 🛡️ Leer configuración del JWT desde appsettings.json
var jwtSettings = builder.Configuration.GetSection("Jwt");
var key = Encoding.ASCII.GetBytes(jwtSettings["Key"]);

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
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"]
    };
});

// 👮‍♂️ Habilitar controladores
builder.Services.AddControllers();

// 🧪 Habilitar Swagger (documentación de API REST)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// 🌐 Middleware de desarrollo y documentación
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// 🔐 Middleware de HTTPS
app.UseHttpsRedirection();

// 🔐 Usar autenticación y autorización
app.UseAuthentication();
app.UseAuthorization();

// 🔄 Routing a los controladores
app.MapControllers();

app.Run();
