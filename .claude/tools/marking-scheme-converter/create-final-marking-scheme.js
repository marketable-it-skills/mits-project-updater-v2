const fs = require("fs");

// Read the structured data
const data = JSON.parse(
  fs.readFileSync("marking-scheme-structured.json", "utf8")
);
const sheetData = data.data;

// Parse WSOS sections (rows 4-10)
const wsosSections = {};
let totalMark = 0;

// First, find the total mark from "Total Variation" row
for (let i = 4; i <= 10; i++) {
  const row = sheetData[i];
  if (row && row[8] === "Total Variation" && row[10] !== undefined) {
    totalMark = parseFloat(row[10]) || 0;
    break;
  }
}

// Extract WSOS sections from rows 4-10
for (let i = 4; i <= 10; i++) {
  const row = sheetData[i];
  if (row && row[0] && row[1] && row[10] !== undefined) {
    const sectionNum = row[0];
    const sectionName = row[1];
    const variation = row[10];

    // Skip the "Total Variation" row
    if (row[8] === "Total Variation") {
      continue;
    }

    if (variation > 0 && sectionNum) {
      wsosSections[sectionNum] = sectionName;
    }
  }
}

console.log("WSOS Sections:", wsosSections);
console.log("Total Mark:", totalMark);

// Parse sub-criteria starting from row 12 (header is at 11)
const subCriterions = [];
let currentSubCriterion = null;
let currentJudgementAspect = null;

for (let i = 12; i < sheetData.length; i++) {
  const row = sheetData[i];
  if (!row || row.length === 0) continue;

  // Check if this is a sub-criterion header (has A1, B1, etc in first column)
  if (row[0] && row[0].toString().match(/^[A-Z][0-9]+$/)) {
    if (currentSubCriterion) {
      subCriterions.push(currentSubCriterion);
    }

    currentSubCriterion = {
      name: row[1] || "Unknown",
      aspects: [],
    };
    currentJudgementAspect = null;
  }
  // Check if this is an aspect row (has 'M' or 'J' in column 3)
  else if (row[3] === "M" || row[3] === "J") {
    if (currentSubCriterion) {
      const aspect = {
        type: row[3] === "M" ? "measurement" : "judgement",
        description: row[4] || "Unknown",
        maxMark: parseFloat(row[10]) || 0,
        wsosSection: parseInt(row[8]) || 5,
      };

      // Add extra description if available
      if (row[6]) {
        aspect.extraDescription = row[6];
      }

      // Add calculation based on type
      if (aspect.type === "measurement") {
        aspect.calculation = {
          type: "pass-or-fail",
        };
      } else {
        // For judgement, we'll collect the score descriptions from following rows
        aspect.judgementScoreDescription = [];
        currentJudgementAspect = aspect;
      }

      currentSubCriterion.aspects.push(aspect);
    }
  }
  // Check if this is a judgement score description (has score in column 5)
  else if (
    currentJudgementAspect &&
    row[5] !== undefined &&
    row[5] !== null &&
    row[5] !== "" &&
    row[6]
  ) {
    const score = parseInt(row[5]);
    const description = row[6];

    // Ensure we have enough entries in the array
    while (currentJudgementAspect.judgementScoreDescription.length <= score) {
      currentJudgementAspect.judgementScoreDescription.push("");
    }

    currentJudgementAspect.judgementScoreDescription[score] = description;
  }
  // If we encounter an empty or non-judgement row, clear current judgement tracking
  else if (
    currentJudgementAspect &&
    (!row[3] || (row[3] !== "M" && row[3] !== "J"))
  ) {
    if (row.every((cell) => !cell || cell === "")) {
      currentJudgementAspect = null;
    }
  }
}

// Add the last sub-criterion
if (currentSubCriterion) {
  subCriterions.push(currentSubCriterion);
}

// Create the final marking scheme
const markingScheme = {
  totalMark: totalMark,
  wsosSections: wsosSections,
  subCriterions: subCriterions,
};

// Save the marking scheme
fs.writeFileSync(
  "new-marking-scheme.json",
  JSON.stringify(markingScheme, null, 2)
);

console.log("\nFinal marking scheme saved to new-marking-scheme.json");
console.log("Sub-criteria found:", subCriterions.length);

// Display summary
subCriterions.forEach((criterion, index) => {
  const totalAspectMarks = criterion.aspects.reduce(
    (sum, aspect) => sum + aspect.maxMark,
    0
  );
  console.log(
    `${index + 1}. ${criterion.name}: ${
      criterion.aspects.length
    } aspects, ${totalAspectMarks} marks`
  );

  // Show judgement criteria details
  criterion.aspects.forEach((aspect) => {
    if (
      aspect.type === "judgement" &&
      aspect.judgementScoreDescription.length > 0
    ) {
      console.log(`   - ${aspect.description} (${aspect.maxMark} marks)`);
      aspect.judgementScoreDescription.forEach((desc, score) => {
        if (desc) {
          console.log(`     ${score}: ${desc}`);
        }
      });
    }
  });
});

// Verify total marks
const calculatedTotal = subCriterions.reduce((total, criterion) => {
  return (
    total + criterion.aspects.reduce((sum, aspect) => sum + aspect.maxMark, 0)
  );
}, 0);

console.log(`\nCalculated total marks: ${calculatedTotal}`);
console.log(`Expected total marks: ${totalMark}`);
