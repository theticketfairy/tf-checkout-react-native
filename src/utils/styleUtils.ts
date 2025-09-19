/**
 * Style utilities for deep merging user styles with default styles
 * This makes the styling API more user-friendly by automatically preserving defaults
 */

/**
 * Deep merge function that handles nested objects and arrays
 * Preserves all default values while allowing user overrides
 */
function deepMerge<T>(target: T, source: Partial<T>): T {
  if (!source || typeof source !== 'object') {
    return target
  }

  if (!target || typeof target !== 'object') {
    return source as T
  }

  const result = { ...target }

  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      const sourceValue = source[key]
      const targetValue = result[key]

      if (
        sourceValue &&
        typeof sourceValue === 'object' &&
        !Array.isArray(sourceValue) &&
        targetValue &&
        typeof targetValue === 'object' &&
        !Array.isArray(targetValue)
      ) {
        // Recursively merge nested objects
        result[key] = deepMerge(targetValue, sourceValue as any)
      } else {
        // Direct assignment for primitives, arrays, or null values
        result[key] = sourceValue as any
      }
    }
  }

  return result
}

/**
 * Merges user-provided config with default config
 * Users only need to provide the config they want to override
 * All defaults are automatically preserved
 */
export function mergeConfig(
  defaultConfig: any,
  userConfig?: Partial<any>
): any {
  if (!userConfig) {
    return defaultConfig
  }

  return deepMerge(defaultConfig, userConfig)
}

/**
 * Type-safe merger for any object type
 * Can be used for other objects in the future
 */
export function merge<T>(defaults: T, overrides?: Partial<T>): T {
  if (!overrides) {
    return defaults
  }

  return deepMerge(defaults, overrides)
}

// Legacy functions for backwards compatibility
export const mergeCheckoutStyles = (defaults: any, overrides?: Partial<any>) =>
  merge(defaults, overrides)

export const mergeStyles = <T>(defaults: T, overrides?: Partial<T>) =>
  merge(defaults, overrides)
