interface AccumulatorProps<T> {
  obj: Record<string, T[]>;
  key: string;
  value: T;
}

export class ObjectUtil {
  static accumulate<T>({ obj, key, value }: AccumulatorProps<T>): void {
    if (!obj[key]) {
      obj[key] = [];
    }

    obj[key].push(value);
  }
}
