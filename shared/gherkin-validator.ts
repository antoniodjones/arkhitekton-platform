// Gherkin Format Validator for Acceptance Criteria
// Validates Given/When/Then format as per US-XIGJUQ7

export interface GherkinValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface GherkinClauses {
  given: string[];
  when: string[];
  then: string[];
  and: string[];
}

/**
 * Validates acceptance criteria follows Gherkin format
 * Required clauses: Given (context), When (action), Then (outcome)
 * Optional clauses: And (additional steps)
 */
export function validateGherkinFormat(acceptanceCriteria: string): GherkinValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Trim and normalize whitespace
  const normalized = acceptanceCriteria.trim();

  if (!normalized) {
    errors.push('Acceptance criteria cannot be empty');
    return { isValid: false, errors, warnings };
  }

  // Extract clauses
  const clauses = extractGherkinClauses(normalized);

  // Validate required clauses
  if (clauses.given.length === 0) {
    errors.push('Missing required "Given" clause (context)');
  }

  if (clauses.when.length === 0) {
    errors.push('Missing required "When" clause (action)');
  }

  if (clauses.then.length === 0) {
    errors.push('Missing required "Then" clause (expected outcome)');
  }

  // Check for placeholder text
  if (normalized.includes('[context]') || normalized.includes('[action]') || normalized.includes('[expected outcome]')) {
    warnings.push('Acceptance criteria contains placeholder text - please provide specific details');
  }

  // Check for common mistakes
  if (clauses.given.length > 0 && clauses.given[0].toLowerCase().trim().startsWith('given given')) {
    warnings.push('Avoid duplicating "Given" keyword');
  }

  if (clauses.when.length > 0 && clauses.when[0].toLowerCase().trim().startsWith('when when')) {
    warnings.push('Avoid duplicating "When" keyword');
  }

  if (clauses.then.length > 0 && clauses.then[0].toLowerCase().trim().startsWith('then then')) {
    warnings.push('Avoid duplicating "Then" keyword');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Extracts Gherkin clauses from acceptance criteria text
 * Supports:
 * - Multi-line format: "Given...\nWhen...\nThen..."
 * - Single-line format: "GIVEN ... WHEN ... THEN ..."
 * - Optional Scenario headers: "Scenario: name\nGiven..."
 */
export function extractGherkinClauses(text: string): GherkinClauses {
  const clauses: GherkinClauses = {
    given: [],
    when: [],
    then: [],
    and: []
  };

  // Remove optional Scenario header
  let workingText = text.trim();
  const scenarioMatch = workingText.match(/^Scenario:\s*[^\n]*\n/i);
  if (scenarioMatch) {
    workingText = workingText.substring(scenarioMatch[0].length).trim();
  }

  // Try to extract clauses from single-line format first (GIVEN ... WHEN ... THEN ...)
  const singleLineMatch = workingText.match(/\b(GIVEN|given)\b([\s\S]*?)\b(WHEN|when)\b([\s\S]*?)\b(THEN|then)\b([\s\S]*?)(?:\b(AND|and)\b([\s\S]*?))?$/i);
  
  if (singleLineMatch) {
    // Single-line format found
    clauses.given.push(singleLineMatch[2].trim());
    clauses.when.push(singleLineMatch[4].trim());
    
    // Extract THEN and any AND clauses
    let thenAndText = singleLineMatch[6].trim();
    if (singleLineMatch[7] && singleLineMatch[8]) {
      thenAndText = thenAndText.replace(/\b(AND|and)\b.*$/i, '').trim();
      clauses.then.push(thenAndText);
      
      // Extract all AND clauses from the remaining text
      const remainingText = singleLineMatch[6].substring(thenAndText.length).trim();
      const andMatches = remainingText.split(/\b(AND|and)\b/i);
      for (let i = 2; i < andMatches.length; i += 2) {
        const andText = andMatches[i]?.trim();
        if (andText) {
          clauses.and.push(andText);
        }
      }
    } else {
      clauses.then.push(thenAndText);
    }
  } else {
    // Multi-line format - parse line by line
    const lines = workingText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    let currentClauseType: 'given' | 'when' | 'then' | 'and' | null = null;

    for (const line of lines) {
      const lowerLine = line.toLowerCase();

      if (lowerLine.startsWith('given ')) {
        currentClauseType = 'given';
        clauses.given.push(line.substring(6).trim());
      } else if (lowerLine.startsWith('when ')) {
        currentClauseType = 'when';
        clauses.when.push(line.substring(5).trim());
      } else if (lowerLine.startsWith('then ')) {
        currentClauseType = 'then';
        clauses.then.push(line.substring(5).trim());
      } else if (lowerLine.startsWith('and ')) {
        currentClauseType = 'and';
        clauses.and.push(line.substring(4).trim());
      } else if (currentClauseType && !lowerLine.startsWith('scenario:')) {
        // Continuation of previous clause (ignore scenario lines)
        const lastClause = clauses[currentClauseType];
        if (lastClause.length > 0) {
          lastClause[lastClause.length - 1] += ' ' + line;
        }
      }
    }
  }

  return clauses;
}

/**
 * Formats Gherkin clauses into a pretty string
 */
export function formatGherkinClauses(clauses: GherkinClauses): string {
  const lines: string[] = [];

  clauses.given.forEach(text => lines.push(`Given ${text}`));
  clauses.when.forEach(text => lines.push(`When ${text}`));
  clauses.then.forEach(text => lines.push(`Then ${text}`));
  clauses.and.forEach(text => lines.push(`And ${text}`));

  return lines.join('\n');
}

/**
 * Zod refinement function for Gherkin validation
 * Use with: .refine(isValidGherkin, { message: "Must follow Gherkin format" })
 */
export function isValidGherkin(acceptanceCriteria: string): boolean {
  const result = validateGherkinFormat(acceptanceCriteria);
  return result.isValid;
}

/**
 * Get validation message for display in UI
 */
export function getGherkinValidationMessage(acceptanceCriteria: string): string {
  const result = validateGherkinFormat(acceptanceCriteria);
  
  if (result.isValid && result.warnings.length === 0) {
    return '';
  }

  const messages: string[] = [];
  
  if (result.errors.length > 0) {
    messages.push(...result.errors);
  }
  
  if (result.warnings.length > 0) {
    messages.push(...result.warnings);
  }

  return messages.join('; ');
}
