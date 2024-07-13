export class NumberUtil {
  static IsNumber(value: unknown): boolean {
    return typeof value === 'number';
  }

  static IsNumericValue(value: unknown): boolean {
    const numericValue = Number(value);

    return !Number.isNaN(numericValue);
  }

  static IsInteger(value: number): boolean {
    return Number.isInteger(value);
  }

  static IsPositiveInteger(value: unknown): boolean {
    if (!NumberUtil.IsNumericValue(value)) {
      return false;
    }
    const numberValue = Number(value);

    if (!NumberUtil.IsInteger(numberValue)) {
      return false;
    }

    return numberValue > 0;
  }
}
