import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';

import { Default } from './default-transformer';

describe('@Default()', () => {
  describe('when default value is not a function', () => {
    const defaultValue = Symbol('default');
    class TestClass {
      @Default(defaultValue)
      public value!: unknown;
    }

    it('does not override already set value', () => {
      const value = Symbol('value');
      const testClass = plainToClass(TestClass, { value });
      const errors = validateSync(testClass, { skipMissingProperties: false });
      expect(testClass.value).toEqual(value);
      expect(errors).toEqual([]);
    });

    it('replaces undefined by the default value', () => {
      const testClass = plainToClass(TestClass, { value: undefined });
      const errors = validateSync(testClass, { skipMissingProperties: false });
      expect(testClass.value).toEqual(defaultValue);
      expect(errors).toEqual([]);
    });

    it('adds property event if provided object does not contains it', () => {
      const testClass = plainToClass(TestClass, {});
      const errors = validateSync(testClass, { skipMissingProperties: false });
      expect(testClass.value).toEqual(defaultValue);
      expect(errors).toEqual([]);
    });
  });

  describe('when default value is a function', () => {
    it('does not apply the function if there is no option', () => {
      const defaultValue = (): string => JSON.stringify({ hello: 'world' });
      class TestClass {
        @Default(defaultValue)
        public value!: unknown;
      }

      const testClass = plainToClass(TestClass, {});
      const errors = validateSync(testClass, { skipMissingProperties: false });
      expect(testClass.value).toEqual(defaultValue);
      expect(errors).toEqual([]);
    });

    it('does not apply the function if the option applyFunction set to false', () => {
      const defaultValue = (): string => JSON.stringify({ hello: 'world' });
      class TestClass {
        @Default(defaultValue, { applyFunction: false })
        public value!: unknown;
      }

      const testClass = plainToClass(TestClass, {});
      const errors = validateSync(testClass, { skipMissingProperties: false });
      expect(testClass.value).toEqual(defaultValue);
      expect(errors).toEqual([]);
    });

    it('applies the function if the option applyFunction set to true ', () => {
      const defaultValue = (): string => JSON.stringify({ hello: 'world' });
      class TestClass {
        @Default(defaultValue, { applyFunction: true })
        public value!: unknown;
      }

      const testClass = plainToClass(TestClass, {});
      const errors = validateSync(testClass, { skipMissingProperties: false });
      expect(testClass.value).toEqual('{"hello":"world"}');
      expect(errors).toEqual([]);
    });
  });
});
