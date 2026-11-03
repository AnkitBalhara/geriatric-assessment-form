import dayjs from 'dayjs';
import { useState } from 'react';
import {
  Alert,
  Button,
  Checkbox,
  Code,
  Container,
  Group,
  Input,
  NumberInput,
  Paper,
  Select,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { schemaResolver, useForm } from '@mantine/form';
import { sampleAssessment } from './fixtures';
import { mobilityOptions } from './mobilityOptions';
import { type Assessment, assessmentSchema } from './schema';

export type AssessmentFormValues = {
  [K in keyof Assessment]: Assessment[K] extends boolean ? boolean : Assessment[K] | '' | null;
};

export const initialValues: AssessmentFormValues = {
  mrn: '',
  patientName: '',
  dateOfBirth: '',
  assessmentDate: '',
  mobility: null,
  barthelIndex: '',
  medicationCount: '',
  pharmacistReviewRequested: false,
  followUpDate: '',
  consentObtained: false,
};

const defaultOnSave = async (_values: Assessment): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 800));
};

export interface AssessmentFormProps {
  onSave?: (values: Assessment) => Promise<void> | void;
}

export function AssessmentForm({ onSave = defaultOnSave }: AssessmentFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [savedAssessment, setSavedAssessment] = useState<Assessment | null>(null);

  const form = useForm<AssessmentFormValues, Assessment>({
    initialValues,
    validate: schemaResolver(assessmentSchema),
    validateInputOnBlur: true,
    transformValues: (values) => assessmentSchema.parse(values),
  });

  const today = dayjs().format('YYYY-MM-DD');

  const handleLoadSample = () => {
    setSavedAssessment(null);
    form.setValues(sampleAssessment);
    form.clearErrors();
  };

  const handleSubmit = form.onSubmit(async (values) => {
    setSavedAssessment(null);
    setIsSaving(true);
    try {
      await onSave(values);
      setSavedAssessment(values);
    } finally {
      setIsSaving(false);
    }
  });

  return (
    <Container size="sm" py="xl">
      <Paper withBorder p="xl">
        <Title order={2} mb="lg">
          Geriatric Care Assessment
        </Title>
        <form noValidate onSubmit={handleSubmit}>
          <Stack>
            <TextInput
              label="Medical record number"
              placeholder="MRN-004821"
              {...form.getInputProps('mrn')}
            />

            <TextInput label="Patient name" {...form.getInputProps('patientName')} />

            <DateInput
              label="Date of birth"
              valueFormat="YYYY-MM-DD"
              {...form.getInputProps('dateOfBirth')}
            />

            <DateInput
              label="Assessment date"
              valueFormat="YYYY-MM-DD"
              maxDate={today}
              {...form.getInputProps('assessmentDate')}
            />

            <Select label="Mobility" data={mobilityOptions} {...form.getInputProps('mobility')} />

            <NumberInput
              label="Barthel Index"
              step={5}
              min={0}
              max={100}
              clampBehavior="none"
              {...form.getInputProps('barthelIndex')}
            />

            <NumberInput
              label="Regular medications"
              min={0}
              max={30}
              clampBehavior="none"
              {...form.getInputProps('medicationCount')}
            />

            <Checkbox
              label="Pharmacist review requested"
              {...form.getInputProps('pharmacistReviewRequested', { type: 'checkbox' })}
            />

            <DateInput
              label="Next review date"
              valueFormat="YYYY-MM-DD"
              {...form.getInputProps('followUpDate')}
            />

            <Input.Wrapper label="Consent">
              <Checkbox
                label="Patient or representative has given consent"
                {...form.getInputProps('consentObtained', { type: 'checkbox' })}
              />
            </Input.Wrapper>

            <Group justify="flex-end" mt="md">
              <Button type="button" variant="default" onClick={handleLoadSample}>
                Load sample patient
              </Button>
              <Button type="submit" loading={isSaving} disabled={isSaving}>
                Save assessment
              </Button>
            </Group>
          </Stack>
        </form>

        {savedAssessment && (
          <Alert color="green" title="Assessment saved" mt="lg">
            <Code block>{JSON.stringify(savedAssessment, null, 2)}</Code>
          </Alert>
        )}
      </Paper>
    </Container>
  );
}
