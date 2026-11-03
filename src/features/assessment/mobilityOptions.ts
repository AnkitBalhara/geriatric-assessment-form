import { MOBILITY } from './schema';

export const formatMobilityLabel = (value: string): string => {
  const spaced = value.replace(/_/g, ' ');
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
};

export const mobilityOptions = MOBILITY.map((value) => ({
  value,
  label: formatMobilityLabel(value),
}));
