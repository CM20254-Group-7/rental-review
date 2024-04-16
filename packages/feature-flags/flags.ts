import { get } from '@vercel/edge-config';
import {
  FlagDefinitionType,
  FlagOverridesType,
  JsonValue,
  decrypt,
} from '@vercel/flags';
import { cookies } from 'next/headers';
// defines the list of
type Features = {
  propertySearchView: () => void;
  // ...
  // newFeature: () => void;
};
type FeatureFlagDefinitions = {
  [Property in keyof Features]: FlagDefinitionType & {
    defaultValue: JsonValue;
  };
};
const flags: FeatureFlagDefinitions = {
  // newFeature: {
  //   description: 'Controls whether the new feature is visible',
  //   origin: 'https://example.com/#new-feature',
  //   options: [
  //     { value: false, label: 'Off' },
  //     { value: true, label: 'On' },
  //   ],
  //   defaultValue: false,
  // },
  propertySearchView: {
    description:
      'Used for A/B test on the property search page. Allows a reduced version of the page to be shown to allow results to be quicklly skimmed',
    options: [
      { value: false, label: 'Normal' },
      { value: true, label: 'Condenced' },
    ],
    defaultValue: false,
  },
};
const getFlagOverides = async () => {
  const overrideCookie = cookies().get('vercel-flag-overrides')?.value;
  return overrideCookie ? await decrypt<FlagOverridesType>(overrideCookie) : {};
};
const getFlagsConfig = async () =>
  (await get('featureFlags')) as { [key: string]: JsonValue } | undefined;
type FlagDetails = FlagDefinitionType & {
  name: keyof Features;
  defaultValue: JsonValue;
  configValue: JsonValue | undefined;
  overrideValue: JsonValue | undefined;
  value: JsonValue;
};
const getFlagDetails = async (
  flagName: keyof Features,
): Promise<FlagDetails> => {
  console.log('flagName', flagName);
  const override = (await getFlagOverides())?.[flagName];
  const config = (await getFlagsConfig())?.[flagName] as JsonValue | undefined;
  const defaultValue = flags[flagName].defaultValue;
  const flagDetails = {
    name: flagName,
    ...flags[flagName],
    configValue: config,
    overrideValue: override,
    value: override ?? config ?? defaultValue,
  };
  return flagDetails;
};
type FeatureFlagDetails = {
  [Property in keyof Features]: FlagDetails;
};
const getFeatureFlagDetails = async (): Promise<FeatureFlagDetails> => {
  const flagNames = Object.keys(flags) as Array<keyof Features>;
  const overrideValues = await getFlagOverides();
  const configValues = await getFlagsConfig();
  // console.log('configValues', await get('featureFlags'));
  const flagDetails = await Promise.all(
    flagNames.map((flagName) => {
      const flagConfig = configValues?.[flagName];
      const flagOverride = overrideValues?.[flagName];
      const flagValue =
        flagOverride ?? flagConfig ?? flags[flagName].defaultValue;
      return {
        name: flagName,
        ...flags[flagName],
        configValue: flagConfig,
        overrideValue: flagOverride,
        value: flagValue,
      };
    }),
  );

  return flagDetails.reduce((acc, flagDetail) => {
    return {
      ...acc,
      [flagDetail.name]: flagDetail,
    };
  }, {} as FeatureFlagDetails);
};

const flagValueLabel = (
  flagDefinition: FlagDetails,
  value: JsonValue | undefined,
) => {
  return (
    flagDefinition.options?.find((option) => option.value === value)?.label ??
    value
  );
};
const flagLabelValue = (
  flagDefinition: FlagDetails,
  label: string | undefined,
) => {
  return (
    flagDefinition.options?.find((option) => option.label === label)?.value ??
    label
  );
};

export {
  flags,
  getFlagOverides,
  getFlagsConfig,
  getFlagDetails,
  getFeatureFlagDetails,
  flagValueLabel,
  flagLabelValue,
};
export type {
  Features,
  FeatureFlagDefinitions,
  FlagDetails,
  FeatureFlagDetails,
};
