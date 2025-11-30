---
description: Start a new project updating workflow
allowed-tools: Bash, Read, Write, Edit
---

## Context

Read `\.claude\context\system-prompt.md` for getting the context of this command.
Read `\.claude\guide\mits-project-task-creation-guide.md` for getting the detailed requirements of the standardized project task.

## Your task

You are starting a new project development updating workflow. Follow these steps:

1. Read the name field of `/test-projects/project-task-to-update/metadata.json` to identify the folder name of the project task will be updated.
2. Read the content of `/test-projects/[project-task-to-update]` (`metadata.json`, `project-description.md`, content of `assets` folder) carefully, think through the problem and create a plan with detailed todo list in `/test-projects/project-task-to-update/projectplan.md` strictly following the `\.claude\guide\mits-project-task-creation-guide.md`
3. Get user approval for the plan
4. Implement the project step by step
   - Mark todos as complete as you go
   - Provide high-level explanations of changes made
   - Keep changes simple and minimal
   - Add a review section when complete
   - Do not change the `marking-scheme.json` in this workflow.
   - When updating `metadata.json`, ensure the `description` field follows the style of other projects in the repository:
     - Start with an action verb (e.g., "Build", "Create")
     - Describe what is being built and its purpose
     - List key features and functionality
     - Mention important technical requirements or standards
     - Reference existing project descriptions in the `test-projects` folder for examples
