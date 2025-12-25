/**
 * Step Reference Detection Service - US-QC-IMPL-013
 * Detects step IDs in commit messages, comments, and test cases
 * Creates backlinks for traceability
 */

import { storage } from '../storage';

// Regex to detect step IDs: DEF-XXX-S001, DEF-REF-009-S002, etc.
const STEP_ID_PATTERN = /\b(DEF-[A-Z0-9\-]+-S\d{3})\b/g;

export interface DetectedStepReference {
  fullStepId: string; // e.g., "DEF-003-S002"
  defectId: string; // e.g., "DEF-003"
  stepId: string; // e.g., "S002"
}

/**
 * Extract all step IDs from text
 */
export function detectStepIds(text: string): DetectedStepReference[] {
  const matches = text.matchAll(STEP_ID_PATTERN);
  const detected: DetectedStepReference[] = [];
  const seen = new Set<string>();

  for (const match of matches) {
    const fullStepId = match[1];
    
    // Avoid duplicates
    if (seen.has(fullStepId)) continue;
    seen.add(fullStepId);

    // Parse the step ID
    // Format: DEF-XXX-S001 or DEF-REF-009-S002
    // We need to extract defectId (everything before last -S###) and stepId (S###)
    const lastDashIndex = fullStepId.lastIndexOf('-S');
    if (lastDashIndex === -1) continue;

    const defectId = fullStepId.substring(0, lastDashIndex);
    const stepId = fullStepId.substring(lastDashIndex + 1); // Remove the leading dash

    detected.push({
      fullStepId,
      defectId,
      stepId,
    });
  }

  return detected;
}

/**
 * Process a commit message and create step references
 */
export async function processCommitForStepReferences(
  commitSha: string,
  commitMessage: string,
  commitUrl?: string,
  authorUsername?: string
): Promise<number> {
  const detectedSteps = detectStepIds(commitMessage);
  
  if (detectedSteps.length === 0) {
    return 0;
  }

  let referencesCreated = 0;

  for (const detected of detectedSteps) {
    try {
      // Find the actual reproduction step
      const steps = await storage.getReproductionStepsByDefect(detected.defectId);
      const step = steps.find(s => s.stepId === detected.stepId);

      if (!step) {
        console.warn(`Step not found: ${detected.fullStepId}`);
        continue;
      }

      // Check if reference already exists
      const existingRefs = await storage.getStepReferences(step.id);
      const alreadyExists = existingRefs.some(
        ref => ref.referenceType === 'commit' && ref.referenceId === commitSha
      );

      if (alreadyExists) {
        console.log(`Reference already exists for ${detected.fullStepId} -> commit ${commitSha}`);
        continue;
      }

      // Create the reference
      await storage.createStepReference({
        stepId: step.id,
        referenceType: 'commit',
        referenceId: commitSha,
        referenceUrl: commitUrl || null,
        referenceText: `${authorUsername ? `${authorUsername}: ` : ''}${commitMessage.substring(0, 200)}`,
      });

      referencesCreated++;
      console.log(`✓ Created reference: ${detected.fullStepId} -> commit ${commitSha}`);
    } catch (error) {
      console.error(`Failed to create reference for ${detected.fullStepId}:`, error);
    }
  }

  return referencesCreated;
}

/**
 * Process a test case description for step references
 */
export async function processTestCaseForStepReferences(
  testCaseId: string,
  description: string,
  testCaseUrl?: string
): Promise<number> {
  const detectedSteps = detectStepIds(description);
  
  if (detectedSteps.length === 0) {
    return 0;
  }

  let referencesCreated = 0;

  for (const detected of detectedSteps) {
    try {
      const steps = await storage.getReproductionStepsByDefect(detected.defectId);
      const step = steps.find(s => s.stepId === detected.stepId);

      if (!step) {
        console.warn(`Step not found: ${detected.fullStepId}`);
        continue;
      }

      // Check if reference already exists
      const existingRefs = await storage.getStepReferences(step.id);
      const alreadyExists = existingRefs.some(
        ref => ref.referenceType === 'test_case' && ref.referenceId === testCaseId
      );

      if (alreadyExists) {
        continue;
      }

      await storage.createStepReference({
        stepId: step.id,
        referenceType: 'test_case',
        referenceId: testCaseId,
        referenceUrl: testCaseUrl || null,
        referenceText: description.substring(0, 200),
      });

      referencesCreated++;
    } catch (error) {
      console.error(`Failed to create reference for ${detected.fullStepId}:`, error);
    }
  }

  return referencesCreated;
}

/**
 * Batch process all code changes for step references
 * Useful for initial migration or periodic sync
 */
export async function batchProcessCodeChangesForStepReferences(): Promise<{
  processed: number;
  referencesCreated: number;
}> {
  console.log('🔍 Starting batch processing of code changes for step references...');
  
  const codeChanges = await storage.getAllCodeChanges();
  let processed = 0;
  let referencesCreated = 0;

  for (const change of codeChanges) {
    processed++;

    // Process commit message
    if (change.commitMessage) {
      const refs = await processCommitForStepReferences(
        change.commitSha || change.prNumber?.toString() || change.id,
        change.commitMessage,
        undefined, // URL can be constructed from repo + SHA
        change.authorUsername || undefined
      );
      referencesCreated += refs;
    }

    // Process PR title if available
    if (change.prTitle) {
      const refs = await processCommitForStepReferences(
        change.prNumber?.toString() || change.id,
        change.prTitle,
        undefined,
        change.authorUsername || undefined
      );
      referencesCreated += refs;
    }

    if (processed % 10 === 0) {
      console.log(`  Processed ${processed}/${codeChanges.length} code changes...`);
    }
  }

  console.log(`✅ Batch processing complete: ${processed} changes, ${referencesCreated} references created`);
  
  return { processed, referencesCreated };
}

/**
 * Get all references for a specific step (enriched with metadata)
 */
export async function getEnrichedStepReferences(stepId: string) {
  const references = await storage.getStepReferences(stepId);

  // Enrich references with additional data
  const enriched = await Promise.all(
    references.map(async (ref) => {
      const enrichedRef: any = { ...ref };

      // Add type-specific metadata
      if (ref.referenceType === 'commit' || ref.referenceType === 'pull_request') {
        // Try to find the code change
        const codeChanges = await storage.getAllCodeChanges();
        const codeChange = codeChanges.find(
          cc => cc.commitSha === ref.referenceId || cc.prNumber?.toString() === ref.referenceId
        );

        if (codeChange) {
          enrichedRef.codeChange = {
            prNumber: codeChange.prNumber,
            commitSha: codeChange.commitSha,
            branchName: codeChange.branchName,
            prState: codeChange.prState,
            authorUsername: codeChange.authorUsername,
          };
        }
      }

      if (ref.referenceType === 'test_case') {
        // Try to find the test case
        try {
          const testCase = await storage.getTestCaseById(parseInt(ref.referenceId, 10));
          if (testCase) {
            enrichedRef.testCase = {
              id: testCase.id,
              title: testCase.title,
              suiteId: testCase.suiteId,
            };
          }
        } catch (error) {
          // Test case not found or invalid ID
        }
      }

      return enrichedRef;
    })
  );

  return enriched;
}

