using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

public class AuthService
{
    private readonly IConfiguration _configuration;

    public AuthService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public string GenerateToken(int id, string username, string role)
    {
        var claims = new[]
        {
            new Claim("id", id.ToString()),
            new Claim(ClaimTypes.Name, username),
            new Claim(ClaimTypes.Role, role)
        };

        var keyValue = _configuration["Jwt:Key"]
            ?? throw new InvalidOperationException("JWT Key not configured");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyValue ?? string.Empty));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddHours(3),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    // Aquí validas el usuario, ejemplo simple (debes validar en DB)
    public bool ValidateUser(string username, string password, out string? role)
    {
        // TODO: validar en base de datos
        // Ejemplo duro:
        if (username == "admin" && password == "1234")
        {
            role = "Administrator";
            return true;
        }
        else if (username == "tech" && password == "1234")
        {
            role = "Technician";
            return true;
        }
        else if (username == "user" && password == "1234")
        {
            role = "User";
            return true;
        }
        role = null;
        return false;
    }
}
