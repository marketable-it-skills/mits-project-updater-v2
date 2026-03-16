#!/usr/bin/env node
/**
 * Converts MITS marking schemes from JSON to XLSX format.
 * Usage: node convert-marking-scheme-to-xlsx.js <input.json> [output.xlsx] [--day=N]
 */

const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

// Parse CLI args
const args = process.argv.slice(2);
const dayArg = args.find((a) => a.startsWith("--day="));
const day = dayArg ? parseInt(dayArg.split("=")[1], 10) : 2;
const posArgs = args.filter((a) => !a.startsWith("--"));
const inputPath = posArgs[0];
const outputPath = posArgs[1];

if (!inputPath) {
  console.error("Usage: node convert-marking-scheme-to-xlsx.js <input.json> [output.xlsx] [--day=N]");
  process.exit(1);
}

const outFile = outputPath || inputPath.replace(/\.json$/i, ".xlsx");

// Exact header row per PRD
const HEADER_ROW = [
  "Sub Criterion ID",
  "Sub Criterion Name or Description",
  "Day of Marking",
  "Aspect Type M = Meas J = Judg",
  "Aspect - Description",
  "Judg Score",
  "Extra Aspect Description (Meas or Judg) OR Judgement Score Description (Judg only)",
  "Requirement (Measurement Only)",
  "WSOS Section",
  "Calculation Row (Export only)",
  "Max Mark",
];

/**
 * Extract assertion from extraDescription (Assert: or Expect: clause)
 */
function extractRequirement(extraDescription) {
  if (!extraDescription || typeof extraDescription !== "string") return "";
  const assertMatch = extraDescription.match(/(?:Assert|Expect):\s*([^.;\n]+)/i);
  return assertMatch ? assertMatch[1].trim() : "";
}

/**
 * Validate marking scheme JSON
 */
function validate(scheme) {
  const errors = [];

  if (!scheme.totalMark || typeof scheme.totalMark !== "number") {
    errors.push("totalMark must be a number");
  }

  const sumMarks = (scheme.subCriterions || []).reduce((sum, sc) => {
    return sum + (sc.aspects || []).reduce((s, a) => s + (a.maxMark || 0), 0);
  }, 0);

  if (scheme.totalMark !== undefined && Math.abs(sumMarks - scheme.totalMark) > 0.01) {
    console.warn(`Warning: totalMark (${scheme.totalMark}) does not match sum of aspect maxMarks (${sumMarks})`);
    // Non-fatal: allow conversion to proceed
  }

  (scheme.subCriterions || []).forEach((sc, i) => {
    (sc.aspects || []).forEach((a, j) => {
      if (a.wsosSection < 1 || a.wsosSection > 5) {
        errors.push(`subCriterions[${i}].aspects[${j}]: wsosSection must be 1-5`);
      }
      if (a.type === "measurement") {
        if (!a.calculation || a.calculation.type !== "pass-or-fail") {
          errors.push(`subCriterions[${i}].aspects[${j}]: measurement must have calculation.type "pass-or-fail"`);
        }
      }
      if (a.type === "judgement") {
        const descs = a.judgementScoreDescription || [];
        if (descs.length !== 4) {
          errors.push(`subCriterions[${i}].aspects[${j}]: judgement must have exactly 4 judgementScoreDescription entries`);
        }
      }
    });
  });

  if (errors.length > 0) {
    errors.forEach((e) => console.error(e));
    return false;
  }
  return true;
}

/**
 * Convert marking scheme JSON to XLSX rows
 */
function jsonToRows(scheme, dayOfMarking) {
  const rows = [HEADER_ROW];

  (scheme.subCriterions || []).forEach((sc, idx) => {
    const cId = `C${idx + 1}`;
    const cName = sc.name || "";

    // Subcriterion header row: A, B, C filled; D-K empty
    rows.push([cId, cName, dayOfMarking, "", "", "", "", "", "", "", ""]);

    (sc.aspects || []).forEach((a) => {
      if (a.type === "measurement") {
        const extraOrJudgement = a.extraDescription || "";
        const requirement = extractRequirement(a.extraDescription);
        rows.push([
          "", "", "",
          "M",
          a.description || "",
          "",
          extraOrJudgement,
          requirement,
          a.wsosSection ?? 5,
          1,
          a.maxMark ?? 0,
        ]);
      } else {
        // Judgement (J): main row + 4 level rows per template
        const descs = a.judgementScoreDescription || [];
        rows.push([
          "", "", "",
          "J",
          a.description || "",
          "", // Judg Score - empty on main row
          "", // G empty on main row; level descs go in follow-up rows
          "", // H empty for judgement
          a.wsosSection ?? 5,
          1,
          a.maxMark ?? 0,
        ]);
        for (let i = 0; i < 4; i++) {
          rows.push([
            "", "", "", "", "", // A-E empty
            i, // F: Judg Score (0-3)
            descs[i] || "", // G: level description
            "", "", "", ""  // H-K empty
          ]);
        }
      }
    });
  });

  return rows;
}

/**
 * Main
 */
function main() {
  let raw;
  try {
    raw = fs.readFileSync(inputPath, "utf8");
  } catch (e) {
    console.error(`Cannot read input file: ${inputPath}`);
    process.exit(1);
  }

  let scheme;
  try {
    scheme = JSON.parse(raw);
  } catch (e) {
    console.error("Invalid JSON:", e.message);
    process.exit(1);
  }

  if (!validate(scheme)) {
    process.exit(1);
  }

  const rows = jsonToRows(scheme, day);

  const ws = XLSX.utils.aoa_to_sheet(rows);

  // Set column widths
  ws["!cols"] = [
    { wch: 18 },
    { wch: 35 },
    { wch: 14 },
    { wch: 8 },
    { wch: 45 },
    { wch: 12 },
    { wch: 55 },
    { wch: 35 },
    { wch: 12 },
    { wch: 22 },
    { wch: 10 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Marking Scheme");

  try {
    XLSX.writeFile(wb, outFile);
    console.log(`Written: ${outFile}`);
  } catch (e) {
    console.error("Failed to write output:", e.message);
    process.exit(1);
  }
}

main();
