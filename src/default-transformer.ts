import { Expose, Transform } from 'class-transformer';

import 'reflect-metadata';

export const Default =
  (defaultValue: unknown, { applyFunction } = { applyFunction: false }): PropertyDecorator =>
  (object: Object, propertyName: string | symbol): void => {
    Expose()(object, propertyName);

    Transform(({ value }) => {
      if (typeof value !== 'undefined') {
        return value;
      }

      return typeof defaultValue === 'function' && applyFunction ? defaultValue() : defaultValue;
    })(object, propertyName);
  };
