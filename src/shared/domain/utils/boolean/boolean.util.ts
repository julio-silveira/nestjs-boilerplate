class BooleanUtil {
  static isFalsy(value: unknown): boolean {
    return !value;
  }

  static isTruthy(value: unknown): boolean {
    return !!value;
  }
}
