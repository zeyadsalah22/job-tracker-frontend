const ROLE_TYPE_LABELS = {
  0: "Software Engineer",
  1: "Product Manager",
  2: "Data Scientist",
  3: "Data Analyst",
  4: "UX/UI Designer",
  5: "DevOps Engineer",
  6: "QA Engineer",
  7: "Project Manager",
  8: "Business Analyst",
  9: "Backend Developer",
  10: "Frontend Developer",
  11: "Full Stack Developer",
  12: "Mobile Developer",
  13: "Security Engineer",
  14: "Cloud Architect",
  99: "Other",
};

const QUESTION_TYPE_LABELS = {
  0: "Technical",
  1: "Behavioral",
  2: "Case Study",
  3: "System Design",
  4: "Coding",
  5: "Problem Solving",
  6: "Leadership",
  7: "Situational",
  99: "Other",
};

const DIFFICULTY_LABELS = {
  0: "Easy",
  1: "Medium",
  2: "Hard",
};

const normalizeKey = (value) => {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return trimmed.toLowerCase().replace(/[^a-z0-9]/g, "");
};

const buildLookup = (labels) => {
  return Object.values(labels).reduce((acc, label) => {
    const key = normalizeKey(label);
    if (key) acc[key] = label;
    return acc;
  }, {});
};

const ROLE_TYPE_LOOKUP = buildLookup(ROLE_TYPE_LABELS);
const QUESTION_TYPE_LOOKUP = buildLookup(QUESTION_TYPE_LABELS);
const DIFFICULTY_LOOKUP = buildLookup(DIFFICULTY_LABELS);

const DIFFICULTY_VALUE_BY_LABEL = Object.entries(DIFFICULTY_LABELS).reduce((acc, [value, label]) => {
  const key = normalizeKey(label);
  if (key) acc[key] = Number(value);
  return acc;
}, {});

const asStringValue = (value) => {
  if (value === null || value === undefined) return undefined;

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return undefined;
    // Treat pure numeric strings as numeric values instead
    if (!Number.isNaN(Number(trimmed))) {
      return undefined;
    }
    return trimmed;
  }

  if (typeof value === "object") {
    return (
      asStringValue(value.label) ??
      asStringValue(value.name) ??
      asStringValue(value.title) ??
      asStringValue(value.displayName) ??
      asStringValue(value.text) ??
      asStringValue(value.description)
    );
  }

  return undefined;
};

const asNumericValue = (value) => {
  if (value === null || value === undefined) return undefined;

  if (typeof value === "number" && !Number.isNaN(value)) {
    return value;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return undefined;
    const parsed = Number(trimmed);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
    return undefined;
  }

  if (typeof value === "object") {
    const candidateKeys = ["value", "id", "key", "enumValue", "enum", "code"];
    for (const key of candidateKeys) {
      const nested = asNumericValue(value[key]);
      if (nested !== undefined) {
        return nested;
      }
    }
  }

  return undefined;
};

const prioritizeSources = (sources) => sources.filter(Boolean);

const findFirstString = (sources, fieldNames) => {
  for (const source of prioritizeSources(sources)) {
    for (const field of fieldNames) {
      const candidate = asStringValue(source[field]);
      if (candidate) {
        return candidate;
      }
    }
  }
  return undefined;
};

const findFirstNumber = (sources, fieldNames) => {
  for (const source of prioritizeSources(sources)) {
    for (const field of fieldNames) {
      const candidate = asNumericValue(source[field]);
      if (candidate !== undefined) {
        return candidate;
      }
    }
  }
  return undefined;
};

const labelFromString = (value, lookup) => {
  if (!value) return undefined;
  const normalized = normalizeKey(value);
  if (!normalized) return undefined;
  return lookup[normalized];
};

const resolveRoleTypeLabel = (...sources) => {
  const textMatch = findFirstString(sources, [
    "addedRoleType",
    "roleTypeLabel",
    "roleTypeName",
    "roleName",
    "roleDisplayName",
    "jobRole",
    "positionTitle",
    "roleTitle",
    "roleType",
    "role",
  ]);

  if (textMatch) {
    return labelFromString(textMatch, ROLE_TYPE_LOOKUP) ?? textMatch;
  }

  const numericMatch = findFirstNumber(sources, [
    "roleType",
    "roleTypeValue",
    "role",
    "roleTypeId",
  ]);

  if (numericMatch !== undefined && ROLE_TYPE_LABELS[numericMatch] !== undefined) {
    return ROLE_TYPE_LABELS[numericMatch];
  }

  return "Other";
};

const resolveQuestionTypeLabel = (...sources) => {
  const textMatch = findFirstString(sources, [
    "addedQuestionType",
    "questionTypeLabel",
    "questionTypeName",
    "questionCategory",
    "questionCategoryName",
    "questionType",
    "type",
  ]);

  if (textMatch) {
    return labelFromString(textMatch, QUESTION_TYPE_LOOKUP) ?? textMatch;
  }

  const numericMatch = findFirstNumber(sources, [
    "questionType",
    "questionTypeValue",
    "questionCategoryId",
    "questionTypeId",
    "type",
  ]);

  if (numericMatch !== undefined && QUESTION_TYPE_LABELS[numericMatch] !== undefined) {
    return QUESTION_TYPE_LABELS[numericMatch];
  }

  return "Other";
};

const resolveDifficultyMetadata = (...sources) => {
  const textMatch = findFirstString(sources, [
    "difficultyLabel",
    "difficultyName",
    "difficultyText",
    "difficulty",
  ]);

  const numericMatch = findFirstNumber(sources, [
    "difficulty",
    "difficultyValue",
    "difficultyId",
    "difficultyLevel",
  ]);

  const normalizedTextValue = labelFromString(textMatch, DIFFICULTY_LOOKUP);

  const valueFromText = normalizedTextValue
    ? DIFFICULTY_VALUE_BY_LABEL[normalizeKey(normalizedTextValue)]
    : DIFFICULTY_VALUE_BY_LABEL[normalizeKey(textMatch)];

  const finalValue =
    numericMatch !== undefined
      ? numericMatch
      : valueFromText !== undefined
        ? valueFromText
        : 1;

  const finalLabel =
    normalizedTextValue ??
    labelFromString(textMatch, DIFFICULTY_LOOKUP) ??
    textMatch ??
    DIFFICULTY_LABELS[finalValue] ??
    "Medium";

  return {
    value: finalValue,
    label: finalLabel,
  };
};

const DIFFICULTY_COLOR_MAP = {
  0: "!bg-green-100 !text-green-800 ring-green-600/20 border border-green-200",
  1: "!bg-orange-100 !text-orange-800 ring-orange-600/20 border border-orange-200",
  2: "!bg-red-100 !text-red-800 ring-red-600/20 border border-red-200",
};

const getDifficultyColorClasses = (difficultyValue) => {
  return DIFFICULTY_COLOR_MAP[difficultyValue] ?? DIFFICULTY_COLOR_MAP[1];
};

const getRoleTypeLabel = (value) => ROLE_TYPE_LABELS[value] ?? "Other";
const getQuestionTypeLabel = (value) => QUESTION_TYPE_LABELS[value] ?? "Other";
const getDifficultyLabel = (value) => DIFFICULTY_LABELS[value] ?? "Medium";

export {
  ROLE_TYPE_LABELS,
  QUESTION_TYPE_LABELS,
  DIFFICULTY_LABELS,
  getRoleTypeLabel,
  getQuestionTypeLabel,
  getDifficultyLabel,
  resolveRoleTypeLabel,
  resolveQuestionTypeLabel,
  resolveDifficultyMetadata,
  getDifficultyColorClasses,
};





