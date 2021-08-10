import { Scalar, CustomScalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';

@Scalar('Date', (type) => Date)
export class DateScalar implements CustomScalar<number, Date> {
  description = 'Date custom scalar type';

  parseValue(value: number): any {
    if (value) {
      return new Date(value); // value from the client
    }
    return ""
  }

  serialize(value: Date): any {
    if (value) {
      return value.getTime(); // value sent to the client
    }
    return ""
  }

  parseLiteral(ast: ValueNode): Date {
    if (ast.kind === Kind.INT) {
      return new Date(parseInt(ast.value));
    }
    return null;
  }
}