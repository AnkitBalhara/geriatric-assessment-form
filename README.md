# Geriatric Care Assessment Form

A single-page Geriatric Care Assessment form application built with React 19, Mantine v9, TypeScript, and Zod 4 for healthcare practitioners to capture, validate, and record standardized clinical evaluations for patients aged 60 and over.

## Live Demo

- **Live URL**: https://stalwart-melba-d63973.netlify.app

## Getting Started

### Prerequisites

- Node.js (v20+ recommended)
- Corepack / Yarn 4

### Installation & Run Commands

```bash
# Enable Yarn 4 via corepack if needed
corepack enable

# Install dependencies
yarn install

# Start local development server
yarn dev

# Run unit tests with Vitest
yarn vitest run

# Run full quality gate (lint, format, typecheck, vitest, build)
yarn test
```

## Key Decisions & Architecture

1. **Handling the Empty-Values vs. `Assessment` Type Gap**:
   The domain `Assessment` type (`z.infer<typeof assessmentSchema>`) strictly requires validated numbers, booleans, and non-empty ISO date strings. An initially blank form cannot satisfy this type. Rather than writing a duplicate, error-prone manual interface or using `any` / `@ts-ignore`, we derive the form input type directly from `Assessment` using TypeScript mapped types:
   ```ts
   type AssessmentFormValues = {
     [K in keyof Assessment]: Assessment[K] extends boolean ? boolean : Assessment[K] | '' | null;
   };
   ```
   We then pass this derived type along with the transformed output type into Mantine's `useForm`:
   ```ts
   useForm<AssessmentFormValues, Assessment>({
     initialValues,
     validate: schemaResolver(assessmentSchema),
     validateInputOnBlur: true,
     transformValues: (values) => assessmentSchema.parse(values),
   });
   ```
   This ensures complete end-to-end type safety: `initialValues` permits empty strings and nulls, `schemaResolver` validates according to the Zod schema, and `onSubmit` receives an authentically validated `Assessment` without type assertions.

2. **`clampBehavior="none"` on Number Inputs**:
   Mantine's `NumberInput` clamps out-of-range values to `min` or `max` on blur by default (e.g., turning 105 into 100). In a healthcare setting, silently altering clinical input entered by a clinician is dangerous. Setting `clampBehavior="none"` and leaving `allowDecimal` and `allowNegative` unconstrained allows the raw typed value (e.g., 82 or 105) to persist so Zod's schema rules (`multipleOf(5)` or `max(100)`) can reject them with exact, helpful clinical messages.

3. **Dynamic Select Options from `MOBILITY`**:
   Options for the mobility dropdown are dynamically constructed from the readonly `MOBILITY` tuple defined in `schema.ts`. `mobilityOptions.ts` transforms keys by replacing underscores with spaces and capitalizing the first letter (e.g., `'cane'` -> `'Cane'`). Adding any new status to `MOBILITY` in the schema automatically updates the UI without any hardcoded dropdown lists.

4. **`maxDate` as a UI Hint Only**:
   The `maxDate` prop on the `assessmentDate` `DateInput` is configured to today's date formatted as `YYYY-MM-DD` via dayjs. This assists nurses within the calendar picker UI without duplicating date validation in the component. The Zod schema remains the single source of truth for domain logic.

5. **Validation on Blur and Submit Only**:
   Configured with `validateInputOnBlur: true` without validate-on-change so untouched fields stay quiet while the nurse fills out the assessment. Because Mantine validates single fields on blur, the polypharmacy cross-field validation rule targeting `pharmacistReviewRequested` surfaces when that checkbox is blurred or when the form is submitted.

6. **Ambiguities Resolved**:
   - *Consent Label & Error*: Wrapped the consent checkbox inside Mantine's `<Input.Wrapper label="Consent">` without passing the error prop to the wrapper. This presents the field header "Consent" while letting `<Checkbox>` render the consent statement and the single validation error directly beneath it.
   - *ISO Dates Everywhere*: All dates are stored and passed as plain `'YYYY-MM-DD'` ISO strings throughout the form state and output, avoiding timezone offsets and `Date` object mutation.

## Data Notice

All patient records, names, dates, and medical record numbers used in fixtures and test cases are entirely fictional and invented.

## Unfinished Work

- nothing

## Time Spent

- [HOURS_PLACEHOLDER]

## What I Would Do Next

1. **Accessibility Pass (a11y)**: Audit focus rings, ARIA live regions, and screen-reader announcements for dynamic validation states and the post-submission alert.
2. **End-to-End Testing**: Add Playwright test coverage verifying calendar popover interaction, keyboard navigation, and full submission flows in actual browser engines.
3. **Reactive Cross-Field Validation**: Automatically trigger re-validation of `pharmacistReviewRequested` when `medicationCount` reaches or drops below 5 without requiring a blur event on the checkbox.
