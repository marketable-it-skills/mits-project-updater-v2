# Copy Project Content Script
# This script copies the project description and assets from test-projects/project-task-to-update/ to test-projects/[RepositoryName]/
#
# Usage:
# .\.claude\tools\copy-new-project-content\copy-new-project-content.ps1 -RepositoryName "s17-ws2024-module_d-lyon-mobile-web-service"
#
# This script is part of the repository creation workflow (Step 4).
# It copies project content from test-projects/project-task-to-update/ to test-projects/[RepositoryName]/
#
# Prerequisites:
# - The target repository must already exist (created by create-new-project-repository.ps1)
# - The source folder test-projects/project-task-to-update/ must exist with:
#   - project-description.md file
#   - assets/ folder (optional, but recommended)
#
# What it does:
# 1. Validates the repository name format (s17-[year]-module_[letter]-[short-description])
# 2. Copies project-description.md from source to target
# 3. Recursively copies all files from assets/ folder to target/assets/
# 4. Provides detailed feedback on what was copied
#
# Output:
# - Returns the repository name for use in subsequent commands
# - Displays success message and next steps

param(
    [Parameter(Mandatory = $true)]
    [string]$RepositoryName
)

# Validate repository name format
if ($RepositoryName -notmatch '^s17-[a-z]{2}\d{4}-module_[a-z]-[a-z0-9-]+$') {
    Write-Error "Invalid repository name format. Expected format: s17-[year]-module_[letter]-[short-description]"
    Write-Error "Example: s17-ws2024-module_d-lyon-mobile-web-service"
    exit 1
}

Write-Host "Copying project content to: $RepositoryName" -ForegroundColor Cyan

# Set paths
$scriptRoot = $PSScriptRoot
$projectRoot = Join-Path $scriptRoot "..\..\.."
$sourcePath = Join-Path $projectRoot "test-projects\project-task-to-update"
$targetPath = Join-Path $projectRoot "test-projects\$RepositoryName"

# Verify source folder exists
if (-not (Test-Path $sourcePath)) {
    Write-Error "Source folder not found at: $sourcePath"
    exit 1
}

# Verify target folder exists
if (-not (Test-Path $targetPath)) {
    Write-Error "Target repository folder not found at: $targetPath"
    Write-Error "Please create the repository first using create-new-project-repository.ps1"
    exit 1
}

try {
    # Step 1: Copy project description
    Write-Host ""
    Write-Host "Step 1: Copying project description..." -ForegroundColor Yellow

    $sourceDescription = Join-Path $sourcePath "project-description.md"
    $targetDescription = Join-Path $targetPath "project-description.md"

    if (Test-Path $sourceDescription) {
        Copy-Item -Path $sourceDescription -Destination $targetDescription -Force
        Write-Host "  OK Copied new-project-description.md -> project-description.md" -ForegroundColor Green
    }
    else {
        Write-Warning "  ! new-project-description.md not found in source folder"
    }

    # Step 2: Copy assets
    Write-Host ""
    Write-Host "Step 2: Copying assets..." -ForegroundColor Yellow

    $sourceAssetsPath = Join-Path $sourcePath "assets"
    $targetAssets = Join-Path $targetPath "assets"

    if (Test-Path $sourceAssetsPath) {
        # Ensure target assets folder exists
        if (-not (Test-Path $targetAssets)) {
            New-Item -ItemType Directory -Path $targetAssets -Force | Out-Null
        }

        # Copy entire assets folder contents recursively using a simpler approach
        # Get all child items (files and folders) from source and copy them
        $sourceItems = Get-ChildItem -Path $sourceAssetsPath
        
        foreach ($sourceItem in $sourceItems) {
            $destinationItemPath = Join-Path $targetAssets $sourceItem.Name
            
            if ($sourceItem.PSIsContainer) {
                # Copy directory recursively
                Copy-Item -Path $sourceItem.FullName -Destination $destinationItemPath -Recurse -Force
            }
            else {
                # Copy file
                Copy-Item -Path $sourceItem.FullName -Destination $destinationItemPath -Force
            }
        }

        # Get count of files copied
        $copiedFiles = Get-ChildItem -Path $targetAssets -File -Recurse

        if ($copiedFiles.Count -gt 0) {
            Write-Host "  OK Copied $($copiedFiles.Count) file(s) to assets folder" -ForegroundColor Green

            # List copied files
            $normalizedTargetPath = (Resolve-Path $targetAssets).Path
            foreach ($file in $copiedFiles) {
                $normalizedFilePath = (Resolve-Path $file.FullName).Path
                if ($normalizedFilePath.Length -gt $normalizedTargetPath.Length) {
                    $relativePath = $normalizedFilePath.Substring($normalizedTargetPath.Length + 1)
                    Write-Host "     - $relativePath" -ForegroundColor Gray
                }
            }
        }
        else {
            Write-Warning "  ! No files were copied"
        }
    }
    else {
        Write-Warning "  ! new-project-assets folder not found in source folder"
    }

    Write-Host ""
    Write-Host "OK Project content copied successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Target location: test-projects/$RepositoryName" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Next step: Run /update-test-project to begin standardization" -ForegroundColor Cyan

    # Output the repository name for use in the slash command
    Write-Output $RepositoryName
}
catch {
    Write-Error "Error copying project content: $($_.Exception.Message)"
    exit 1
}
