# Guide to Standardized Project Task Creation

This guide outlines the essential steps and structural requirements for preparing new project tasks to be integrated into the _Marketable IT Skills_ (MITS) repository and web application. Adhering to these standards ensures **consistency**, **usability**, and **long-term sustainability**.

---

## I. Task Content and Structure

Each task must be documented in **Markdown format** and stored in a dedicated **GitHub repository**. The repository must contain the following key files and follow a consistent format:

### Required Files

```
/README.md
/project-description.md
/metadata.json
/marking/marking-scheme.json
/assets/ (optional media files)
/assets/project-description-images (images for the project-description.md)
```

---

### 1. `project-description.md` – Task Specification

Use the following consistent structure and header hierarchy:

#### Document Structure and Header Levels

The document must follow this **exact order** and **header level hierarchy**:

```markdown
# Test Project Outline – [Module Name] – [Skill Area] (Level 1 - Document Title)

## Competition time (Level 2 - Main Section)

## Introduction (Level 2 - Main Section)

## General Description of Project and Tasks (Level 2 - Main Section)

## Requirements (Level 2 - Main Section)

### [Subsection Name] (Level 3 - Subsection within Requirements)

#### [Sub-subsection Name] (Level 4 - Detailed items/pages)

## Assessment (Level 2 - Main Section)

## Mark distribution (Level 2 - Main Section)
```

**Header Level Guidelines:**

- `#` (Level 1): Document title only
- `##` (Level 2): Main sections (Competition time, Introduction, Requirements, Assessment, etc.)
- `###` (Level 3): Subsections within main sections (e.g., Error Handling, Pages)
- `####` (Level 4): Detailed items, specific pages, or components

#### Document Title:

```markdown
# Test Project Outline – [Module Name] – [Skill Area]
```

**Example:**

```markdown
# Test Project Outline – Module A – Static Website Design
```

#### Competition Time:

```markdown
## Competition time

[Duration in hours]
```

#### Introduction:

A brief description of the project, its context and purpose.

```markdown
## Introduction
```

#### General Description of Project and Tasks:

Include:

- Total number of pages or components
- Provided vs. custom asset expectations
- Technology restrictions (e.g., HTML/CSS only)
- Validation requirements (W3C compliance)
- Required responsive breakpoints (e.g., mobile: 360×640, tablet: 768×1024, desktop: 1920×1080)

The contents in the list can be optional, use them only if they are appropriate and you have the necessary infromation from the original description

```markdown
## General Description of Project and Tasks
```

#### Requirements:

Outline both functional and non-functional requirements. Include:

- The goal of the solution
- Detailed description of the overall requirements and each individual task requirements

```markdown
## Requirements
```

**Example**

```markdown
## Requirements

The following pages must be implemented.

### Home Page

A short but catching home page.
The idea is to show the product with some simple information and engaging media.
It must contain links to the product and pricing pages where interested visitors can find more information.

### Product Page

The product page shows the whole AI API suite, by listing all available APIs and their features.

### Pricing Page

...
```

#### Assessment:

List tools and methods used for evaluation (e.g., browsers, Axe for WCAG).

```markdown
## Assessment
```

#### Mark Distribution:

Provide a table following this structure:

```markdown
#### Mark distribution

| WSOS SECTION | Description                            | Points |
| ------------ | -------------------------------------- | ------ |
| 1            | Work organization and self-management  | X      |
| 2            | Communication and interpersonal skills | X      |
| 3            | Design Implementation                  | X      |
| 4            | Front-End Development                  | X      |
| 5            | Back-End Development                   | X      |
| **Total**    |                                        | XX     |
```

---

### 2. `README.md` – Repository Overview

Include:

- Title of the project task
- Short description (1–2 sentences)
- **Skill domain(s)** (e.g., Web Technologies)
- **Task origin** (competition name, year, module, authors)
- Links to important documents:
  - `project-description.md`
  - `assets/`
  - `marking/marking-scheme.json`
- Short section about the **MITS project**, mentioning:
  - Erasmus+ funding
  - Partner institutions
  - Real-world IT training objective

---

### 3. `metadata.json` – Machine-Readable Task Data

Use the structure below:

```json
{
  "name": "ES2023 S17 - Module A",
  "displayName": "AI Services Promo Website",
  "description": "Short description of the task.",
  "url": "https://github.com/marketable-it-skills/example-repo",
  "skillDomainIds": [1],
  "competition": "EuroSkills Gdansk 2023",
  "estTime": 4,
  "authors": [
    { "name": "Author Name", "url": "https://linkedin.com/in/example" }
  ],
  "technologies": ["HTML", "CSS", "JavaScript"],
  "tags": ["frontend", "design", "static website"]
}
```

- Ensure accurate **competition**, **authors**, and **technology tags**
- Follow **tag conventions** for filtering

---

## III. Additional Technical Considerations

- ✅ **Markdown Conversion**: All task descriptions must be in `.md` format

- ✅ **Standard Structure**: Ensure headings and sections follow the naming conventions above

- ✅ **AI Review**: Use AI tools to improve clarity, grammar, and consistency

- ✅ **Professional Review**: Validate technical content, update any outdated instructions

- ✅ **Asset Management**: Keep `assets/` clean and organized

- ✅ **Meta Tagging**: Assign searchable tags in `metadata.json`

- ✅ **Public Upload**: Push the full repository (including markdown, JSON, and media) to GitHub

---

By following this guide, new project tasks will be uniformly structured, easy to integrate into the MITS web application, and provide effective real-world learning experiences for vocational IT training.
