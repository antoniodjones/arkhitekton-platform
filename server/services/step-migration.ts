/**
 * Step Migration Service - US-QC-IMPL-014
 * Converts textarea reproduction steps to structured format
 */

export interface ParsedStep {
  sequence: number;
  description: string;
}

/**
 * Parse numbered list format (1. 2. 3. or 1) 2) 3))
 */
export function parseNumberedList(text: string): ParsedStep[] {
  const steps: ParsedStep[] = [];
  
  // Match patterns like:
  // "1. Open the page"
  // "1) Click the button"
  // "Step 1: Do something"
  const lines = text.split('\n');
  let currentStep: ParsedStep | null = null;
  let sequence = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Match numbered patterns
    const numberedMatch = trimmed.match(/^(\d+)[\.\):\-]\s*(.+)$/);
    const stepMatch = trimmed.match(/^Step\s+(\d+)[\.\):\-]\s*(.+)$/i);

    if (numberedMatch) {
      // Save previous step if exists
      if (currentStep) {
        steps.push(currentStep);
      }

      sequence++;
      currentStep = {
        sequence,
        description: numberedMatch[2].trim(),
      };
    } else if (stepMatch) {
      // Save previous step if exists
      if (currentStep) {
        steps.push(currentStep);
      }

      sequence++;
      currentStep = {
        sequence,
        description: stepMatch[2].trim(),
      };
    } else if (currentStep) {
      // Continuation of previous step
      currentStep.description += ' ' + trimmed;
    } else if (trimmed) {
      // First line without number - treat as first step
      sequence++;
      currentStep = {
        sequence,
        description: trimmed,
      };
    }
  }

  // Add last step
  if (currentStep) {
    steps.push(currentStep);
  }

  return steps;
}

/**
 * Parse bullet list format (- * •)
 */
export function parseBulletList(text: string): ParsedStep[] {
  const steps: ParsedStep[] = [];
  const lines = text.split('\n');
  let currentStep: ParsedStep | null = null;
  let sequence = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Match bullet patterns: -, *, •, ◦, ▪, ▫
    const bulletMatch = trimmed.match(/^[\-\*\•\◦\▪\▫]\s+(.+)$/);

    if (bulletMatch) {
      // Save previous step if exists
      if (currentStep) {
        steps.push(currentStep);
      }

      sequence++;
      currentStep = {
        sequence,
        description: bulletMatch[1].trim(),
      };
    } else if (currentStep) {
      // Continuation of previous step
      currentStep.description += ' ' + trimmed;
    }
  }

  // Add last step
  if (currentStep) {
    steps.push(currentStep);
  }

  return steps;
}

/**
 * Parse unstructured text by sentence boundaries
 */
export function parseSentences(text: string): ParsedStep[] {
  const steps: ParsedStep[] = [];
  
  // Split by sentence-ending punctuation followed by space or newline
  const sentences = text
    .split(/[.!?]+\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);

  sentences.forEach((sentence, index) => {
    // Clean up the sentence
    let description = sentence.trim();
    
    // Remove leading numbers, bullets, etc. if present
    description = description.replace(/^[\d\-\*\•\◦\▪\▫\)\.\:]+\s*/, '');
    
    if (description) {
      steps.push({
        sequence: index + 1,
        description: description,
      });
    }
  });

  return steps;
}

/**
 * Auto-detect format and parse steps
 */
export function autoParseSteps(text: string): ParsedStep[] {
  if (!text || !text.trim()) {
    return [];
  }

  // Try numbered list first
  const numberedSteps = parseNumberedList(text);
  if (numberedSteps.length >= 2) {
    return numberedSteps;
  }

  // Try bullet list
  const bulletSteps = parseBulletList(text);
  if (bulletSteps.length >= 2) {
    return bulletSteps;
  }

  // Fall back to sentence parsing
  const sentenceSteps = parseSentences(text);
  if (sentenceSteps.length > 0) {
    return sentenceSteps;
  }

  // If all else fails, treat entire text as single step
  return [
    {
      sequence: 1,
      description: text.trim(),
    },
  ];
}

/**
 * Validate parsed steps
 */
export function validateParsedSteps(steps: ParsedStep[]): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (steps.length === 0) {
    errors.push('No steps were parsed from the text');
  }

  // Check for empty descriptions
  const emptySteps = steps.filter(s => !s.description || !s.description.trim());
  if (emptySteps.length > 0) {
    errors.push(`${emptySteps.length} step(s) have empty descriptions`);
  }

  // Check for duplicate sequences
  const sequences = steps.map(s => s.sequence);
  const uniqueSequences = new Set(sequences);
  if (sequences.length !== uniqueSequences.size) {
    errors.push('Duplicate sequence numbers detected');
  }

  // Check sequence order
  const sortedSequences = [...sequences].sort((a, b) => a - b);
  const isSequential = sortedSequences.every((seq, i) => seq === i + 1);
  if (!isSequential) {
    errors.push('Sequence numbers are not sequential (1, 2, 3, ...)');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Format preview text for UI display
 */
export function formatPreviewText(steps: ParsedStep[]): string {
  return steps
    .map(step => `${step.sequence}. ${step.description}`)
    .join('\n\n');
}

