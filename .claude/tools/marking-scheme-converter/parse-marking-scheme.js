const fs = require("fs");

// Read the structured data
const data = JSON.parse(
  fs.readFileSync("marking-scheme-structured.json", "utf8")
);
const sheetData = data.data;

// Parse WSOS sections (rows 4-8)
const wsosSections = {};
let totalMark = 0;

// Extract WSOS sections from rows 4-8
for (let i = 4; i <= 8; i++) {
  const row = sheetData[i];
  if (row && row[0] && row[1] && row[9] !== undefined) {
    const sectionNum = row[0];
    const sectionName = row[1];
    const aspectMarks = row[9];

    if (aspectMarks > 0) {
      wsosSections[sectionNum] = sectionName;
      totalMark += aspectMarks;
    }
  }
}

console.log("WSOS Sections:", wsosSections);
console.log("Total Mark:", totalMark);

// Parse sub-criteria starting from row 13 (header at row 12)
const subCriterions = [];
let currentSubCriterion = null;

for (let i = 13; i < sheetData.length; i++) {
  const row = sheetData[i];
  if (!row || row.length === 0) continue;

  // Check if this is a sub-criterion header (has ID in first column)
  if (
    row[0] &&
    (row[0].toString().startsWith("A") ||
      row[0].toString().startsWith("C") ||
      row[0].toString().startsWith("E"))
  ) {
    if (currentSubCriterion) {
      subCriterions.push(currentSubCriterion);
    }

    currentSubCriterion = {
      name: row[1] || "Unknown",
      aspects: [],
    };
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
        // For judgement, we'd need to define the score descriptions
        aspect.judgementScoreDescription = [
          "Poor implementation",
          "Basic implementation with issues",
          "Good implementation with minor issues",
          "Excellent implementation following best practices",
        ];
      }

      currentSubCriterion.aspects.push(aspect);
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
  "marking-scheme-converted.json",
  JSON.stringify(markingScheme, null, 2)
);

console.log(
  "\\nConverted marking scheme saved to marking-scheme-converted.json"
);
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
});

// Verify total marks
const calculatedTotal = subCriterions.reduce((total, criterion) => {
  return (
    total + criterion.aspects.reduce((sum, aspect) => sum + aspect.maxMark, 0)
  );
}, 0);

console.log(`\\nCalculated total marks: ${calculatedTotal}`);
console.log(`Expected total marks: ${totalMark}`);
