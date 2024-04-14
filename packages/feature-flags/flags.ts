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
  newFeature: () => void;
  // ...
  // otherFeatureName: () => void;
};
type FeatureFlagDefinitions = {
  [Property in keyof Features]: FlagDefinitionType & {
    defaultValue: JsonValue;
  };
};
const flags: FeatureFlagDefinitions = {
  newFeature: {
    description: 'Controls whether the new feature is visible',
    origin: 'https://example.com/#new-feature',
    options: [
      { value: false, label: 'Off' },
      { value: true, label: 'On' },
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

export {
  flags,
  getFlagOverides,
  getFlagsConfig,
  getFlagDetails,
  getFeatureFlagDetails,
};
export type {
  Features,
  FeatureFlagDefinitions,
  FlagDetails,
  FeatureFlagDetails,
};
