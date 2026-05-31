FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ["src/Logistik.API/Logistik.API.csproj", "src/Logistik.API/"]
COPY ["src/Logistik.Application/Logistik.Application.csproj", "src/Logistik.Application/"]
COPY ["src/Logistik.Infrastructure/Logistik.Infrastructure.csproj", "src/Logistik.Infrastructure/"]
COPY ["src/Logistik.Domain/Logistik.Domain.csproj", "src/Logistik.Domain/"]
RUN dotnet restore "src/Logistik.API/Logistik.API.csproj"
COPY . .
RUN dotnet publish "src/Logistik.API/Logistik.API.csproj" -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENTRYPOINT ["dotnet", "Logistik.API.dll"]
