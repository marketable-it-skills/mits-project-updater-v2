# Review Project Description Command

## Purpose

This command reviews an updated MITS project task to ensure it complies with all standardization requirements defined in the `mits-project-task-creation-guide.md`.

## Parameter

- **First parameter**: The folder name (relative to `test-projects/`) where the updated project is located (e.g., `s17-es2025-module_a-static-website-design`)

## Process

### 1. Read the Guide

First, read `.claude/guide/mits-project-task-creation-guide.md` to understand all requirements and standards.

### 2. Review Required Files

Thoroughly review the following files in the specified project folder:

- `README.md`
- `project-description.md`
- `metadata.json`
- `marking/marking-scheme.json`

### 3. Check Against Standards

Verify compliance with the guide, focusing on:

#### README.md

- Contains project title and short description
- Lists skill domain(s)
- Includes task origin (competition name, year, module, authors)
- Has links to important documents
- Includes MITS project description with Erasmus+ funding and partner information

#### project-description.md

- Follows exact header hierarchy (# title, ## main sections, ### subsections, #### details)
- Contains all required sections in order:
  - Competition time
  - Introduction
  - General Description of Project and Tasks
  - Requirements
  - Assessment
  - Mark distribution
- Mark distribution table is properly formatted
- All images referenced exist in `assets/project-description-images/`

#### metadata.json

- Contains all required fields: name, displayName, description, url, skillDomainIds, competition, estTime, authors, technologies, tags
- Data types are correct (arrays, numbers, strings)
- URLs are valid
- Authors have proper structure with name and url

#### marking/marking-scheme.json

- Valid JSON structure
- Consistent with project requirements
- Points align with mark distribution in project-description.md

#### Content Quality Checks

**Duplicate Content Detection:**

- Review all files (especially `project-description.md` and `README.md`) for unnecessary duplicate descriptions
- Identify sections where the same information appears multiple times
- Suggest removal of duplicates while preserving unique information
- Ensure no information loss when consolidating duplicates

**Language and Clarity:**

- Check for linguistic errors (grammar, spelling, punctuation)
- Identify unclear or confusing sentences
- Flag inconsistent terminology or styling
- Suggest improvements for readability and professionalism
- Verify technical accuracy of descriptions

### 4. Generate Review Report

Create a `review.md` file in the project folder with:

#### Structure

```markdown
# Project Review: [Project Name]

## Summary

[Brief overview of review findings]

## Issues Found

### 🔴 Critical Issues

[Issues that must be fixed before integration]

### 🟡 Important Issues

[Issues that should be addressed but don't block integration]

### 🟢 Minor Issues

[Nice-to-have improvements and suggestions]

## Content Quality Issues

### Duplicate Content

[List any duplicate descriptions found and suggest consolidation]

### Language and Clarity

[Grammar errors, unclear sentences, styling inconsistencies]

## Compliance Checklist

- [ ] README.md structure
- [ ] project-description.md header hierarchy
- [ ] All required sections present
- [ ] metadata.json valid and complete
- [ ] marking-scheme.json valid
- [ ] Assets properly organized
- [ ] No broken links or references
- [ ] No unnecessary duplicate content
- [ ] Clear and grammatically correct language

## Recommendations

[Overall suggestions for improvement]
```

#### Issue Categorization

- **🔴 Critical**: Missing required files/sections, invalid JSON, broken structure, incorrect file names, duplicate Level 1 headers, incorrect totalMark values
- **🟡 Important**: Incomplete metadata, formatting inconsistencies, missing information, significant duplicate content that causes confusion, unclear technical requirements
- **🟢 Minor**: Grammar improvements, style suggestions, optimization opportunities, minor duplicate content, small clarity improvements

**Content Quality Issues** (separate category):

- **Duplicate Content**: Consolidate repeated information while preserving unique details
- **Language and Clarity**: Fix grammar, spelling, unclear sentences, and improve readability

## Output

The command creates `review.md` in the project folder with a detailed, actionable review report that includes:

- Structural compliance issues (critical, important, minor)
- Duplicate content analysis with consolidation suggestions
- Language and clarity improvements
- Comprehensive compliance checklist
- Overall recommendations
