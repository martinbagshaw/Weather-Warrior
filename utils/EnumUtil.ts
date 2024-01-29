export class EnumUtil {
  public static getEnumValueByKey<T extends { [key: string]: string }, K extends string>(enumObject: T, value: K): T[K] | undefined {
    if (Object.keys(enumObject).includes(value)) {
      return enumObject[value];
    }
    return undefined;
  }
}
