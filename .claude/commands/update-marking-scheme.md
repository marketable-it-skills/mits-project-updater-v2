---
description: Start a new project updating workflow
allowed-tools: Bash, Read, Write, Edit
---

## Context

Current project status:

- Project guidelines: @CLAUDE.md

## Your task

You are updating the marking-scheme.json of the current project task. Follow these steps:

1. Read the name field of `/test-projects/project-task-to-update/metadata.json` to identify the folder name of the project task that will be updated. This will be the target project folder: `/test-projects/[project-task-name]`

2. Find the Excel marking scheme file (file name includes "marking" and has `.xlsx` extension) in `/test-projects/project-task-to-update/` folder.

3. Navigate to `.claude/tools/marking-scheme-converter/` directory and run the conversion scripts in order:

   - First, run `node convert.js` to parse the Excel file into raw JSON format
     - The script reads from `../../../test-projects/project-task-to-update/marking_scheme.xlsx`
     - This generates `marking-scheme-raw.json` and `marking-scheme-structured.json`
   - Then, run `node create-final-marking-scheme.js` to generate the final marking scheme JSON
     - This reads from `marking-scheme-structured.json` and generates `new-marking-scheme.json`
   - The final output will be saved as `new-marking-scheme.json` in the `.claude/tools/marking-scheme-converter/` directory

4. **IMPORTANT**: Copy the generated `new-marking-scheme.json` file to `/test-projects/[project-task-name]/marking/marking-scheme.json`

   - Use the exact content generated from the Excel file - the Excel file is the source of truth
   - **DO NOT** create custom content or write your own marking scheme based on assumptions
   - **DO NOT** change aspect descriptions, sub-criterion names, or their meaning
   - **DO NOT** add, remove, or modify aspects unless they are in the Excel file
   - **YOU MAY** fix spelling errors, grammar errors, or formatting issues in descriptions
   - **YOU MAY** fix the `totalMark` value if it shows floating-point precision issues (e.g., 80.00000000000001 → 80)
   - Always preserve the original meaning and content from the Excel file

5. Verify that the marking scheme has been correctly copied by checking that:
   - The sub-criterion names match what's in the Excel file
   - The aspect descriptions match the Excel file content (spelling/grammar may be corrected, but meaning must be preserved)
   - The structure is correct (wsosSections, subCriterions array, etc.)
   - All aspects and their marks correspond to the Excel file
