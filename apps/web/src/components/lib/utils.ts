import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines clsx and tailwind-merge for optimal class merging.
 *
 * For more details refer to the following article:
 * https://tigerabrodi.blog/the-story-behind-tailwinds-cn-function
 *
 * @param inputs - Class names or conditional class values.
 * @returns A single string with merged class names.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
