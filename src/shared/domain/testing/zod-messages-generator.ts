export class ZodMessagesGenerator {
  static smallString(min: number): string {
    return `String must contain at least ${min} character(s)`;
  }

  static longString(max: number): string {
    return `String must contain at most ${max} character(s)`;
  }

  static invalidInput(expected: string, received: string): string {
    return `Expected ${expected}, received ${received}`;
  }

  static invalidEmail(): string {
    return 'Invalid email';
  }
}
