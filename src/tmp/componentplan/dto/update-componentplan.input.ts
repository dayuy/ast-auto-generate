import { CreateComponentplanInput } from './create-componentplan.input';
import { InputType, OmitType } from '@nestjs/graphql';

@InputType()
export class UpdateComponentplanInput extends OmitType(
  CreateComponentplanInput,
  ['name'],
  InputType
) {}
