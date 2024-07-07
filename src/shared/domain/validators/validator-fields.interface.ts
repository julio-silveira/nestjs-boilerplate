export type FieldsErrors = {
  [field: string]: string[];
};

export interface ValidatorFieldsInterface<Props> {
  errors: FieldsErrors;
  validatedData: Props | null;
  validate(data: unknown): boolean;
}
