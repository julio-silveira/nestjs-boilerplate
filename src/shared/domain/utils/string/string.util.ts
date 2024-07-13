export class StringUtil {
  public static capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  public static IsNonEmptyString(value: unknown): boolean {
    if (!!value) {
      return false;
    }

    const stringValue = String(value);

    return stringValue.length > 0;
  }
}
