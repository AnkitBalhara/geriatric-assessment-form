import { describe, expect, it } from 'vitest';
import { sampleAssessment } from './fixtures';
import { assessmentSchema } from './schema';

describe('assessmentSchema', () => {
  it('validates the age-60 boundary based on the assessment date', () => {
    const validPatient = {
      ...sampleAssessment,
      assessmentDate: '2026-08-07',
      dateOfBirth: '1966-08-07',
    };
    const validResult = assessmentSchema.safeParse(validPatient);
    expect(validResult.success).toBe(true);

    const invalidPatient = {
      ...sampleAssessment,
      assessmentDate: '2026-08-07',
      dateOfBirth: '1966-08-08',
    };
    const invalidResult = assessmentSchema.safeParse(invalidPatient);
    expect(invalidResult.success).toBe(false);
    expect(invalidResult.error?.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: ['dateOfBirth'],
          message: 'This pathway is for patients aged 60 and over',
        }),
      ])
    );
  });
});
