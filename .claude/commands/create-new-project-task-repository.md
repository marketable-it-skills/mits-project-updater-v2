## Context

To understand the context of this task, read the following documents carefully:

- Background and purpose of this tool in this repository: @ README.md
- Standardized task guide: @de/mits-project-task-creation-guide.md

## Your Task

You are creating a git repository for a new project task using the MITS template repository. Follow these steps:

### Step 0: Ask User About Prerequisites of This Workflow

Ask the user if they have already completed all prerequisite tasks in the `/test-projects/project-task-to-update/` folder.

The user should complete the following steps in advance:

- Edit the `metadata.json` file, at minimum filling in the description field (e.g., "This is Module C (REST API backend) for the TurkicSkills 2025 competition")
- Copy the project task description from the original test project description file into `description.md`
- Upload the assets into the `assets` folder

Do not continue until the user confirms that the steps above have been completed.

### Step 1: Create Repository Name

Read the content of `/test-projects/project-task-to-update/project-description.md`, which contains the original description of the project task that will be revised. Create a name for the project task based on the content using the naming convention:

`s17-[year]-module_[letter]-[short-description]`

Example: `s17-ws2024-module_d-lyon-mobile-web-service`

Present the name you created and ask the user to approve it before moving to the next step.

If the name is approved update `/test-projects/project-task-to-update/metadata.json` name field with this name.

### Step 2: Create Repository Using PowerShell Script

Use the approved repository name to run the automated repository creation script:

Run the PowerShell script with the repository name:

```powershell
.\.claude\tools\create-new-project-repository\create-new-project-repository.ps1 -RepositoryName "YOUR-NEW-REPO-NAME"
```

Replace `YOUR-NEW-REPO-NAME` with the actual repository name.

The script will:

- Validate the repository name format
- Check GitHub CLI installation and authentication
- Create the repository from the template
- Clone it into the `test-projects/[repository-name]` folder

### Step 3: Update Configuration

Update `test-projects/[repository-name]/metadata.json` based on `/test-projects/project-task-to-update/metadata.json` and the repository name `YOUR-NEW-REPO-NAME`.

### Step 4: Copy Project Content

Run the content copy script with the repository name:

```powershell
.\.claude\tools\copy-new-project-content\copy-new-project-content.ps1 -RepositoryName "YOUR-NEW-REPO-NAME"
```

Replace `YOUR-NEW-REPO-NAME` with the actual repository name (same as used in Step 2).

The script will:

- Copy `/test-projects/project-task-to-update/project-description.md` to the target repository's `project-description.md`
- Copy all files from `/test-projects/project-task-to-update/assets/` to the target repository's `assets/` folder (if they exist)
- Preserve folder structure for nested assets
- Provide warnings if source files/folders are not found

### Step 5: Confirm Success

Inform the user that:

1. The repository has been created successfully on GitHub
2. The repository has been cloned to `test-projects/[repository-name]`
3. Project content (description and assets) has been copied to the repository
4. Next step: Run `/update-test-project` to begin the standardization workflow
