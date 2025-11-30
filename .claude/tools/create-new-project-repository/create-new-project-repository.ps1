<#
.SYNOPSIS
Creates a standardized MITS project task repository from the template.

.DESCRIPTION
This helper validates the requested repository name, confirms that the GitHub CLI is
installed and authenticated, creates the repository from the official template, and
clones it into the local `test-projects/` folder so that the standardization workflow
can continue.
#>

[CmdletBinding()]
param(
    [Parameter(Mandatory, Position = 0)]
    [ValidateNotNullOrEmpty()]
    [string]$RepositoryName,

    [Parameter(Position = 1)]
    [ValidateNotNullOrEmpty()]
    [string]$TemplateOwner = "marketable-it-skills",

    [Parameter(Position = 2)]
    [ValidateNotNullOrEmpty()]
    [string]$TemplateRepo = "mits-project-task-template",

    [Parameter(Position = 3)]
    [string]$TargetDirectoryName = "test-projects",

    [Parameter(Position = 4)]
    [string]$RepositoryOwner = ""
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Fail([string]$Message) {
    throw $Message
}

try {
    $repositoryRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..\..")).ProviderPath
}
catch {
    Fail "Unable to determine the repository root relative to the script location."
}

$namePattern = '^s17-[a-z]{2}[0-9]{4}-module_[a-z0-9]+-[a-z0-9-]+$'
if (-not ($RepositoryName -match $namePattern)) {
    Fail "Repository name '$RepositoryName' does not match the required pattern 's17-[a-z]{2}[0-9]{4}-module_[a-z0-9]+-[a-z0-9-]+'. Please use lowercase letters, digits, and hyphens."
}

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    Fail "GitHub CLI ('gh') is not installed or not available on the PATH. Install it from https://cli.github.com/ and retry."
}

$authOutput = & gh auth status 2>&1
if ($LASTEXITCODE -ne 0) {
    Fail "GitHub CLI authentication failed. Run 'gh auth login' to authenticate before running this script.`n$authOutput"
}

$targetOwner = if ($RepositoryOwner) { $RepositoryOwner } else { $TemplateOwner }
$fullRepoName = "$targetOwner/$RepositoryName"
$templateSpecifier = "$TemplateOwner/$TemplateRepo"
Write-Host "Creating '$fullRepoName' from template '$templateSpecifier'."
$createArgs = @(
    "api", "repos/$TemplateOwner/$TemplateRepo/generate",
    "-F", "name=$RepositoryName",
    "-F", "owner=$targetOwner",
    "-F", "private=true"
)
$createOutput = & gh @createArgs 2>&1
if ($LASTEXITCODE -ne 0) {
    Fail "Failed to create repository '$fullRepoName' from template '$templateSpecifier'.`n$createOutput"
}

$createdFullRepoName = $fullRepoName
try {
    $createJson = $createOutput | ConvertFrom-Json
    if ($createJson -and $createJson.full_name) {
        $createdFullRepoName = $createJson.full_name
    }
}
catch {
    Write-Host "Warning: could not parse GitHub API response to determine the repository slug. Falling back to '$fullRepoName'."
}

$testProjectsPath = Join-Path $repositoryRoot $TargetDirectoryName
if (-not (Test-Path $testProjectsPath)) {
    Write-Host "Creating '$TargetDirectoryName' directory at '$testProjectsPath'."
    New-Item -ItemType Directory -Path $testProjectsPath -Force | Out-Null
}

$clonePath = Join-Path $testProjectsPath $RepositoryName
if (Test-Path $clonePath) {
    Fail "Destination '$clonePath' already exists. Remove it or choose a different repository name."
}

Write-Host "Cloning '$createdFullRepoName' into '$clonePath'."

$tempErrorFile = [System.IO.Path]::GetTempFileName()
try {
    $cloneProcess = Start-Process -FilePath "gh" -ArgumentList @("repo", "clone", $createdFullRepoName, $clonePath) -NoNewWindow -Wait -PassThru -RedirectStandardError $tempErrorFile

    if ($cloneProcess.ExitCode -ne 0) {
        $errorContent = Get-Content $tempErrorFile -Raw
        Fail "Failed to clone repository '$createdFullRepoName'.`n$errorContent"
    }
}
finally {
    if (Test-Path $tempErrorFile) {
        Remove-Item $tempErrorFile -Force -ErrorAction SilentlyContinue
    }
}

Write-Host "Repository '$createdFullRepoName' created and cloned to '$clonePath'."