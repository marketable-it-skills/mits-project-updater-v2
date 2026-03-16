- Read the `/test-projects/project-task-to-update/metadata.json` to identify the project task (test project) folder we are working on. All folders and files below are relative to this directory except when the path starts with "/" which indicates a full path.
- Create or update the marking scheme in the `marking/marking-scheme.json` following the comprehensive process below:

## Phase 1: Project Analysis and Understanding

1. **Project Context Analysis**:

   - Read the `project-description.md` file thoroughly to understand requirements, scope, and technical specifications
   - Review files in the `assets/` folder for additional requirements, content specifications, or visual guidelines
   - Check `metadata.json` for module type, duration, and point totals

2. **Reference Framework Study**:
   - Use `/guide/marking-scheme-creation-guideline.md` as the primary guideline for structure and standards
   - Analyze similar marking schemes from `/assets/marking-scheme-references/` that match the module type:
     - Static websites: Reference Module A schemes
     - Dynamic websites: Reference Module B schemes
     - REST APIs: Reference Module C schemes
     - Interactive frontends: Reference Module D schemes

## Phase 2: Requirements Extraction and Organization

3. **Comprehensive Requirements List**:

   - Extract ALL testable requirements from project description (these become individual aspects)
   - **Prioritize Manual Testing**: Focus on functionality that can be verified through direct manual testing
   - **Break Down Complex Tasks**: Split complex functionality into smaller, granular aspects to prevent competitors from losing all points on difficult tasks
   - Categorize requirements by type:
     - **Measurement aspects**: Binary pass/fail items that can be manually tested (specific API endpoints, expected responses, error codes)
     - **Judgement aspects**: Qualitative assessments (code quality, design creativity, user experience)
   - **Avoid Generic Criteria**: Replace vague aspects like "input validation" with specific testable scenarios
   - Review for overlapping items and consolidate duplicates while preserving distinct evaluation criteria

4. **Logical Grouping and Hierarchy**:
   - Group related requirements into logical categories (these become `subCriterions`)
   - Typical groupings by module type:
     - **Module A**: Project Structure, Content Communication, Visual Design, Technical Implementation
     - **Module B**: Database Design, Authentication/Security, Administrative Interface, Server-Side Rendering
     - **Module C**: Authentication, API Endpoints, Error Handling, External Integration
     - **Module D**: Frontend Design, User Interface, API Integration, Advanced Features
   - Order subCriterions from foundational to advanced (structure → functionality → quality)

## Phase 3: Scoring and Weight Assignment

5. **WSOS Section Mapping**:

   - Assign each aspect to appropriate WSOS section (1-5):
     - **Section 1**: Work organization and self-management (project structure, deliverables)
     - **Section 2**: Communication and interpersonal skills (user feedback, error handling)
     - **Section 3**: Design Implementation (visual design, layout, UX)
     - **Section 4**: Front-End Development (client-side functionality, responsiveness)
     - **Section 5**: Back-End Development (server logic, security, database)

6. **Strategic Point Distribution**:
   - **Total Points**: Check project-description.md for "Mark distribution" section first. If not found, follow module standards (Module A: 17, Module B: 20, Module C: 15-17, Module D: 22)
   - **Weight Assignment**: Rate each aspect 1-10 based on:
     - Complexity and skill level required
     - Time investment needed
     - Impact on overall project success
     - Learning objective importance
   - **Point Allocation**: Distribute total points proportionally to weights
   - **Standard Values**: Use common point values (0.25, 0.5, 0.75, 1.0, 1.5, 2.0)
   - **WSOS Balance**: Ensure balanced distribution across sections per guidelines

## Phase 4: Quality Assurance and Validation

7. **Content Quality Review**:

   - **Measurement Aspects**: Ensure clear, objective, testable criteria that can be verified through manual testing
   - **Include Specific Test Instructions**: Each aspect should specify exactly what to test (e.g., "Test: POST with valid data returns 201", "Test: Invalid ID returns 404 with error message")
   - **Focus on Functional Verification**: Prioritize aspects that test actual functionality over generic code quality checks
   - **Judgement Aspects**: Create 4-level progression (0-3) with distinct, actionable descriptions
   - **Language**: Use precise, unambiguous terminology that assessors can apply consistently through direct testing
   - **Completeness**: Verify all project requirements are covered without gaps
   - **Straightforward Marking**: Ensure each aspect can be evaluated quickly and objectively by following the test instructions

8. **Structural Validation**:
   - Verify JSON structure matches required schema
   - Confirm total points sum correctly across all aspects
   - Check WSOS distribution follows recommended percentages
   - Validate point values align with complexity and module standards

## Phase 5: Implementation and Documentation

9. **JSON Structure Creation**:

   - Build complete marking scheme following standard format:
     ```json
     {
       "totalMark": [total],
       "wsosSections": { "1": "Work organization...", ... },
       "subCriterions": [...]
     }
     ```
   - Include all required fields for each aspect type
   - **Add specific test instructions** in `extraDescription` for measurement aspects (e.g., "Test: GET /api/users without header returns 401")
   - **Use functional descriptions** that specify exact endpoints, HTTP methods, expected status codes, and response formats
   - Provide detailed `judgementScoreDescription` arrays for judgement aspects
   - **Ensure testability**: Every measurement aspect must be verifiable through direct manual testing

10. **Final Validation and Testing**:
    - Cross-check against similar reference schemes for consistency
    - Verify marking scheme covers all project deliverables
    - **Validate manual testability**: Ensure every measurement aspect can be tested by following the provided instructions
    - **Check for granular breakdown**: Confirm complex tasks are split into smaller aspects to prevent total point loss
    - **Assess marking efficiency**: Verify each aspect can be evaluated quickly and objectively
    - Ensure point distribution reflects project priorities
    - Validate assessor can use scheme to evaluate real submissions through direct functional testing

## Output Requirements

- Generate `marking/marking-scheme.json` with complete, validated structure
- **Prioritize functional testing**: Focus on aspects that can be verified through manual API testing, file checks, or direct interaction
- **Enable straightforward marking**: Each aspect should include specific test instructions that eliminates guesswork
- **Break down complex functionality**: Split large features into smaller, testable components to allow partial credit
- **Avoid generic criteria**: Replace vague assessments with concrete, testable requirements
- Ensure scheme is immediately usable for assessment without requiring additional interpretation
- Include clear aspect descriptions that eliminate assessor ambiguity
- Follow all formatting and content standards from the guideline document

## Key Principles for Manual Testing Focus

1. **Specific over Generic**: "POST /api/v1/users/login returns 401 for invalid credentials" instead of "Authentication system validates users"
2. **Testable Instructions**: Include exact test steps in extraDescription field
3. **Granular Breakdown**: Complex features split into 3-5 smaller aspects
4. **Functional Verification**: Priority on what works, not how it's coded
5. **Quick Assessment**: Each aspect verifiable in under 2 minutes
