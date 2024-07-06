import { ZodError, ZodSchema } from 'zod';
import {
  FieldsErrors,
  ValidatorFieldsInterface,
} from './validator-fields.interface';

export abstract class ZodFields<Props>
  implements ValidatorFieldsInterface<Props>
{
  errors: FieldsErrors = null;

  validatedData: Props = null;

  schema: ZodSchema<Props>;

  validate(data: unknown): boolean {
    try {
      this.validatedData = this.schema.parse(data) as Props;
      return true;
    } catch (error) {
      this.errors = this.parseErrors(error);
      return false;
    }
  }

  private parseErrors(error: unknown): FieldsErrors {
    if (error instanceof ZodError) {
      return this.parseZodError(error);
    }

    if (error instanceof Error) {
      return this.parseCommonError(error);
    }

    return {};
  }

  private parseZodError(error: ZodError): FieldsErrors {
    const errors = {};

    for (const issue of error.issues) {
      errors[issue.path.join('.')] = issue.message;
    }

    return errors;
  }

  private parseCommonError(error: Error): FieldsErrors {
    return { [error.name]: [error.message] };
  }
}
