# -------------------------
# Stage 1: Build
# -------------------------
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /app

# Copy csproj and restore
COPY DotNetApi/*.csproj ./DotNetApi/
RUN dotnet restore DotNetApi/DotNetApi.csproj

# Copy all source files
COPY DotNetApi/. ./DotNetApi/

# Build and publish
WORKDIR /app/DotNetApi
RUN dotnet publish -c Release -o /app/publish

# -------------------------
# Stage 2: Runtime
# -------------------------
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Copy published app
COPY --from=build /app/publish .

# Expose the correct port
EXPOSE 5258

# Run the application
ENTRYPOINT ["dotnet", "DotNetApi.dll"]

