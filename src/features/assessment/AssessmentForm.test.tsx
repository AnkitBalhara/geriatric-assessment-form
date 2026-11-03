import { render, screen, userEvent, waitFor } from '@test-utils';
import { describe, expect, it, vi } from 'vitest';
import { AssessmentForm } from './AssessmentForm';
import { sampleAssessment } from './fixtures';

describe('AssessmentForm', () => {
  it('loads sample patient and submits successfully', async () => {
    const user = userEvent.setup();
    const mockOnSave = vi.fn().mockResolvedValue(undefined);

    render(<AssessmentForm onSave={mockOnSave} />);

    await user.click(screen.getByRole('button', { name: /load sample patient/i }));
    await user.click(screen.getByRole('button', { name: /save assessment/i }));

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledTimes(1);
      expect(mockOnSave).toHaveBeenCalledWith(sampleAssessment);
    });
  });
});
