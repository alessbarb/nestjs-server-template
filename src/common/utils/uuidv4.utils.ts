import * as crypto from 'crypto';

/**
 * @class UUIDv4
 *
 * This class provides a utility method to generate a UUIDv4 string.
 * A UUID (Universally Unique Identifier) is a 128-bit number used to
 * uniquely identify information. The version 4 UUIDs are randomly generated.
 *
 * @example
 *
 * const uuid = UUIDv4.generate();
 * console.log(uuid);  // Outputs something like: "f47ac10b-58cc-4372-a567-0e02b2c3d479"
 */
class UUIDv4 {
  /**
   * Generates a UUIDv4 string.
   *
   * @returns {string} A version 4 UUID string.
   */
  static generate(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        // Generate a random byte
        const r: number = crypto.randomBytes(1)[0] % 16 | 0;
        // Determine the value based on the character
        const v: number = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      },
    );
  }
}

export default UUIDv4;
