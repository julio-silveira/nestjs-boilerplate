export type FieldsErrors = {
  [field: string]: string[];
};

export interface ValidatorFieldsInterface<Props> {
  errors: FieldsErrors;
  validatedData: Props;
  validate(data: unknown): boolean;
}
