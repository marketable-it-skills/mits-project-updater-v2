# Marking Scheme Converter

## Purpose

A Node.js CLI tool that converts MITS marking schemes from JSON format to XLSX (Excel), producing a spreadsheet suitable for assessors and competition tools. The output follows the structure defined in the marking-scheme-xlsx-template.

## Usage (CLI)

```bash
node convert-marking-scheme-to-xlsx.js <input.json> [output.xlsx] [--day=N]
```

| Argument | Required | Description |
| -------- | -------- | ----------- |
| `input.json` | Yes | Path to `marking-scheme.json`. |
| `output.xlsx` | No | Output file path. Default: same name as input with `.xlsx` extension. |
| `--day=N` | No | Day of marking (integer). Default: `2`. |

**Examples:**
```bash
node convert-marking-scheme-to-xlsx.js marking/marking-scheme.json
node convert-marking-scheme-to-xlsx.js marking/marking-scheme.json output/marking.xlsx
node convert-marking-scheme-to-xlsx.js marking-scheme.json --day=1
```

## Technical Requirements

- **Node.js**: v18+ (or v16+ with `--experimental-json-modules` if using ESM)
- **Dependencies**: Use `xlsx` (SheetJS) or `exceljs` for XLSX generation. Prefer a library that supports proper column widths and cell formatting.
- **Input encoding**: UTF-8
- **Output**: `.xlsx` (Excel 2007+), single sheet, no macros

---

## Input: Marking Scheme JSON Structure

The `marking-scheme.json` file follows the MITS/EuroSkills format based on the WSOS (WorldSkills Occupational Standards) framework.

### Root-Level Properties

| Property        | Type    | Description                                                                 |
| --------------- | ------- | --------------------------------------------------------------------------- |
| `totalMark`     | number  | Total possible points for the module (e.g. 17 for REST API modules).        |
| `wsosSections`  | object  | Maps WSOS section IDs (keys "1"–"5") to human-readable section names.      |
| `subCriterions` | array   | List of criterion groups, each containing multiple assessable aspects.     |

### SubCriterion Structure

| Property   | Type   | Description                                  |
| ---------- | ------ | -------------------------------------------- |
| `name`     | string | Category name (e.g. "Authentication").       |
| `aspects`  | array  | Individual assessment criteria.               |

### Aspect Structure

Each aspect is either **measurement** (pass/fail) or **judgement** (0–3 scale).

**Common fields (all aspects):** `type`, `description`, `maxMark`, `wsosSection`

**Measurement only:** `extraDescription`, `calculation: { type: "pass-or-fail" }`

**Judgement only:** `judgementScoreDescription` (array of 4 strings: Level 0–3)

---

## Output: XLSX Structure

The converter produces a single-sheet Excel file. Row types:

1. **Header row (row 1):** Column titles
2. **Subcriterion header row:** One per group; columns A–C filled, D–K empty
3. **Aspect rows:** One per aspect; columns A–C empty, D–K filled

### Column Definitions (A–K)

| Col | Header | Content |
| ----- | ------ | ------- |
| A | Sub Criterion ID | C1, C2, C3, … (header row only) |
| B | Sub Criterion Name or Description | Category name (header row only) |
| C | Day of Marking | Day number (header row only; default 2) |
| D | Aspect Type | `M` or `J` |
| E | Aspect - Description | Main description text |
| F | Judg Score | Empty (reserved for scoring) |
| G | Extra Aspect Description / Judgement Score Description | Measurement: detailed test instructions. Judgement: four level descriptions. |
| H | Requirement (Measurement Only) | Concise assertion (e.g. "Assert: 200", "Assert: 401"). Empty for judgement. |
| I | WSOS Section | 1–5 |
| J | Calculation Row (Export only) | Always `1` |
| K | Max Mark | Point value (e.g. 0.25, 0.5, 1.5) |

### Exact Header Row Text (for import compatibility)

Use these exact strings for the first row:

```
Sub Criterion ID | Sub Criterion Name or Description | Day of Marking | Aspect Type M = Meas J = Judg | Aspect - Description | Judg Score | Extra Aspect Description (Meas or Judg) OR Judgement Score Description (Judg only) | Requirement (Measurement Only) | WSOS Section | Calculation Row (Export only) | Max Mark
```

---

## Mapping: JSON → XLSX

### Subcriterion Header Rows

| Source | Column |
| ------ | ------ |
| Generated `C{i}` | A |
| `subCriterions[i].name` | B |
| CLI `--day` or default `2` | C |

### Aspect Rows (Measurement)

| JSON field | XLSX column | Notes |
| ---------- | ------------ | ----- |
| `"measurement"` | D = `M` | |
| `description` | E | |
| `extraDescription` | G | Full test instructions. If it contains "Assert:" or "Expect:", consider extracting that part for H. |
| — | H | If `extraDescription` has an "Assert:" or "Expect:" clause, extract it. Otherwise use first sentence or leave empty. |
| `wsosSection` | I | |
| `maxMark` | K | |

### Aspect Rows (Judgement)

| JSON field | XLSX column | Notes |
| ---------- | ------------ | ----- |
| `"judgement"` | D = `J` | |
| `description` | E | |
| `judgementScoreDescription` | G | Format as "Level 0: …\nLevel 1: …\nLevel 2: …\nLevel 3: …" (newline-separated) |
| — | H | Leave empty |
| `wsosSection` | I | |
| `maxMark` | K | |

---

## Validation and Error Handling

1. **Input validation:** Before conversion, verify:
   - JSON is valid and parseable
   - `totalMark` equals sum of all `aspects[].maxMark`
   - All `wsosSection` values are 1–5
   - Measurement aspects have `calculation.type === "pass-or-fail"`
   - Judgement aspects have exactly 4 entries in `judgementScoreDescription`

2. **On validation failure:** Exit with non-zero code, print clear error to stderr.

3. **On success:** Write XLSX to output path, exit 0.

4. **Missing optional fields:** If `extraDescription` is missing for measurement, leave G and H empty.

---

## Edge Cases

- **Empty subcriterion:** If a subcriterion has no aspects, still emit the header row (A, B, C filled).
- **Long text:** Ensure cells allow wrapping; set reasonable column widths (e.g. E, G, H wider).
- **Special characters:** Preserve quotes, newlines, and Unicode in descriptions.

---

## Acceptance Criteria

- [ ] Converts a valid marking-scheme.json to XLSX matching the template structure
- [ ] Subcriterion IDs are C1, C2, C3, … in order
- [ ] Header row text matches template exactly
- [ ] All aspects appear as rows with correct type (M/J), description, WSOS section, max mark
- [ ] Measurement: extraDescription in G; assertion in H when extractable
- [ ] Judgement: four levels in G, formatted with "Level N:" prefix
- [ ] Validation fails fast on invalid JSON or point mismatch
- [ ] CLI supports positional args and `--day`

---

## Reference

- **Template:** `marking-scheme-xlsx-template.csv` (structure reference)
- **JSON schema:** `marking-scheme-creation-guideline.md`
- **Sample input:** `test-projects/s17-es2027-hu-r2-module_a-skillshare-academy-rest-api-backend/marking/marking-scheme.json`
