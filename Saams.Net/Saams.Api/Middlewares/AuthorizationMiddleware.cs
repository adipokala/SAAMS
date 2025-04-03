using Microsoft.AspNetCore.Mvc.Controllers;
using Saams.Api.Attributes;
using Saams.Api.Models;
using Saams.Api.Utils;
using Saams.EF;
using System.Text;
using System.Text.Json;

namespace Saams.Api.Middlewares
{
    public class AuthorizationMiddleware
    {
        private readonly RequestDelegate _next;

        public AuthorizationMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)   
        {
            var endpoint = context.GetEndpoint();
            var actionDescriptor = endpoint?.Metadata.GetMetadata<ControllerActionDescriptor>();

            if (actionDescriptor != null && actionDescriptor.MethodInfo.GetCustomAttributes(typeof(AllowAnonymousAttribute), true).Any())
            {
                await _next(context);
                return;
            }

            if (!context.Request.Headers.ContainsKey("Authorization"))
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                var response = new ResponseModel()
                {
                    Message = "Authorization required",
                    Status = false
                };
                await context.Response.WriteAsync(JsonSerializer.Serialize(response));
                return;
            }

            var authHeader = context.Request.Headers["Authorization"].ToString();

            if (!authHeader.StartsWith("Basic ", StringComparison.OrdinalIgnoreCase))
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                var response = new ResponseModel()
                {
                    Message = "Invalid authorization format",
                    Status = false
                };
                await context.Response.WriteAsync(JsonSerializer.Serialize(response));
                return;
            }

            // Extract and decode credentials
            var encodedCredentials = authHeader.Substring("Basic ".Length).Trim();
            var decodedBytes = Convert.FromBase64String(encodedCredentials);
            var credentials = Encoding.UTF8.GetString(decodedBytes).Split(':', 2);

            if (credentials.Length != 2)
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                var response = new ResponseModel()
                {
                    Message = "Invalid authorization format",
                    Status = false
                };
                await context.Response.WriteAsync(JsonSerializer.Serialize(response));
                return;
            }

            var username = credentials[0];
            var password = credentials[1];

            if (!IsValidUser(username, password))
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                var response = new ResponseModel()
                {
                    Message = "Invalid credentials",
                    Status = false
                };
                await context.Response.WriteAsync(JsonSerializer.Serialize(response));
                return;
            }

            await _next(context);
        }

        private bool IsValidUser(string username, string password)
        {
            using (var context = new SaamsContext())
            {
                var user = context.Users.Where(x => x.UserName == username).FirstOrDefault();
                if (user == null)
                {
                    return false;
                }

                if (user.Password != AESEncryption.Encrypt(password))
                {
                    return false;
                }
            }

            return true;
        }
    }
}
