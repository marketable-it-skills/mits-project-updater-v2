# Marking Scheme Creation Guideline

This guideline provides standards and best practices for creating marking schemes for EuroSkills competition modules, based on analysis of existing marking schemes.

## Overview

Marking schemes are JSON files that define assessment criteria, point distributions, and evaluation methods for competition modules. They follow the WSOS (WorldSkills Occupational Standards) framework with 5 core sections.

## JSON Structure Requirements

### Root Level Properties

```json
{
  "totalMark": 17,
  "wsosSections": {
    "1": "Work organization and self-management",
    "2": "Communication and interpersonal skills", 
    "3": "Design Implementation",
    "4": "Front-End Development",
    "5": "Back-End Development"
  },
  "subCriterions": [...]
}
```

**Required Fields:**
- `totalMark`: Integer representing total possible points
- `wsosSections`: Object mapping section numbers (1-5) to descriptive names
- `subCriterions`: Array of criterion objects

### WSOS Section Definitions

The 5 standard WSOS sections used across modules:

1. **Work organization and self-management** - Project structure, file organization, deliverables
2. **Communication and interpersonal skills** - User feedback, error handling, documentation clarity
3. **Design Implementation** - Visual design, layout, user experience, accessibility
4. **Front-End Development** - Client-side functionality, responsiveness, standards compliance
5. **Back-End Development** - Server-side logic, security, database design, API implementation

### Sub-Criterion Structure

```json
{
  "name": "Project Structure and File Organization",
  "aspects": [...]
}
```

**Required Fields:**
- `name`: Descriptive name for the criterion category
- `aspects`: Array of individual assessment aspects

### Aspect Structure

#### Measurement Aspects (Pass/Fail)

```json
{
  "type": "measurement",
  "description": "All 4 required pages are implemented",
  "maxMark": 0.25,
  "wsosSection": 1,
  "extraDescription": "Detailed explanation of what is being measured",
  "calculation": {
    "type": "pass-or-fail"
  }
}
```

#### Judgement Aspects (Qualitative Assessment)

```json
{
  "type": "judgement", 
  "description": "Code organization and maintainability",
  "maxMark": 0.5,
  "wsosSection": 1,
  "judgementScoreDescription": [
    "Level 0: Poor description",
    "Level 1: Basic description", 
    "Level 2: Good description",
    "Level 3: Excellent description"
  ]
}
```

**Required Fields for All Aspects:**
- `type`: Either "measurement" or "judgement"
- `description`: Clear, concise description of what is being assessed
- `maxMark`: Point value (can be decimal: 0.25, 0.5, 0.75, 1, 1.5, etc.). The maximumum value is 1.5!
- `wsosSection`: Integer (1-5) indicating which WSOS section this belongs to

**Additional Fields:**
- `extraDescription`: (Optional) Detailed explanation for measurement aspects
- `calculation`: (For measurement) Object with `type: "pass-or-fail"`
- `judgementScoreDescription`: (For judgement) Array of 4 level descriptions (0-3)

## Point Distribution Guidelines

### Total Points by Module Type

- **Module A (Static Website)**: 17 points
- **Module B (Dynamic Website)**: 20 points  
- **Module C (REST API)**: 15-17 points
- **Module D (Interactive Frontend)**: 22 points

### Point Value Standards

**Common point values:**
- `0.25`: Small features or basic requirements
- `0.5`: Standard features or moderate requirements
- `0.75`: Important features requiring skill
- `1.0`: Major features or critical functionality
- `1.5`: Complex features requiring advanced skills

### WSOS Section Balance

Aim for balanced distribution across WSOS sections:
- **Section 1 (Work Organization)**: 10-15% of total points
- **Section 2 (Communication)**: 5-10% of total points
- **Section 3 (Design)**: 25-35% of total points
- **Section 4 (Frontend)**: 30-40% of total points
- **Section 5 (Backend)**: 20-30% of total points (backend-heavy modules)

## Writing Assessment Descriptions

### Measurement Aspects

**Good practices:**
- Use clear, actionable language
- Specify exact requirements
- Include technical details in `extraDescription`
- Focus on objective, verifiable criteria

**Examples:**
```json
{
  "description": "W3C HTML validation compliance",
  "extraDescription": "All HTML files pass W3C validation with no errors"
}
```

### Judgement Aspects

**4-Level Scale Requirements:**
- **Level 0**: Complete failure or absence
- **Level 1**: Basic/minimal implementation
- **Level 2**: Good/solid implementation  
- **Level 3**: Excellent/exceptional implementation

**Good practices:**
- Use progressive language showing improvement
- Include specific technical criteria
- Avoid subjective terms without context
- Provide clear differentiation between levels

**Example:**
```json
"judgementScoreDescription": [
  "CSS code is unorganized with poor structure and no meaningful class names",
  "CSS code has basic organization but lacks consistent naming conventions", 
  "CSS code is well-organized with good structure and meaningful class names",
  "CSS code is excellently organized with modular structure, meaningful class names, efficient use of modern CSS features, and easy maintainability"
]
```

## Calculation Types

### Standard Types

- `"pass-or-fail"`: Most common for measurement aspects
- `"judgement"`:  


### Implementation Notes

- Measurement aspects typically use binary scoring (0 or full points)
- Judgement aspects use 4-level scale (0, 1, 2, 3) mapped to percentage of maxMark
- Final scores are calculated as: `(level / 3) * maxMark`

## Quality Assurance Checklist

### Structure Validation
- [ ] Total points add up correctly across all aspects
- [ ] All WSOS sections are represented appropriately
- [ ] JSON syntax is valid
- [ ] Required fields are present for all aspects

### Content Quality
- [ ] Descriptions are clear and unambiguous
- [ ] Assessment criteria are objective and measurable
- [ ] Point values reflect relative importance
- [ ] Judgement levels show clear progression
- [ ] Technical requirements are specific

### Module Alignment
- [ ] Criteria match module learning objectives
- [ ] Point distribution reflects module complexity
- [ ] Assessment covers all key competencies
- [ ] Difficulty level appropriate for competition timeframe

## Common Patterns by Module Type

### Static Website Modules (Module A)
- Focus on HTML/CSS standards compliance
- Responsive design across multiple viewports
- Accessibility and SEO considerations
- File organization and project structure

### Dynamic Website Modules (Module B) 
- Server-side rendering implementation
- Database design and integration
- Authentication and security measures
- Administrative interface functionality

### API Modules (Module C)
- Authentication token handling
- Error response specifications
- Database operations and integrity
- External service integration

### Interactive Frontend Modules (Module D)
- Single Page Application routing
- Real-time features and polling
- Error handling and user feedback
- Advanced UI interactions

## Examples from Reference Schemes

### Well-Structured Measurement Aspect
```json
{
  "type": "measurement",
  "description": "Purple-orange-cyan color scheme implementation", 
  "maxMark": 0.5,
  "wsosSection": 3,
  "extraDescription": "Uses specified vibrant purple (#7c3aed), orange (#f97316), cyan (#06b6d4) color palette consistently",
  "calculation": {
    "type": "pass-or-fail"
  }
}
```

### Well-Structured Judgement Aspect
```json
{
  "type": "judgement",
  "description": "Overall visual design quality and creativity",
  "maxMark": 0.75,
  "wsosSection": 3,
  "judgementScoreDescription": [
    "Design lacks creativity and visual appeal, poor use of color scheme and layout",
    "Design has basic visual appeal but limited creativity in layout and color usage", 
    "Design is visually appealing with good use of color scheme and creative layout elements",
    "Excellent creative design with outstanding visual appeal, masterful use of color scheme, and innovative layout that effectively communicates the SkillShare Academy brand"
  ]
}
```

## Validation Tools

When creating marking schemes, validate using:
1. JSON syntax validators
2. Point total calculators  
3. WSOS distribution analysis
4. Peer review with other module creators
5. Test implementation with sample submissions

---

*This guideline should be updated as marking scheme standards evolve and new patterns emerge from competition implementation.*