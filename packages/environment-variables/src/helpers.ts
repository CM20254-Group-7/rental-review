import { z } from "zod";
import envType from "./env-type";

// used to give variables a default value when in development while requiring them to be set in production
export const defaultIfDev = (zObject: z.ZodString, defaultValue: string) => {
  if (envType.VERCEL_ENV === 'development') {
    return zObject.default(defaultValue);
  }
  return zObject;
};

// used to make variables optional when in development while requiring them to be set in production
export const optionalIfDev = (zObject: z.ZodString) => {
  if (envType.VERCEL_ENV === 'development') {
    return zObject.optional();
  }
  return zObject;
};
