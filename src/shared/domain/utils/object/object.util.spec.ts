import { ObjectUtil } from './object.util';

describe('ObjectUtil unit tests', () => {
  describe('accumulate', () => {
    it('should accumulate a value in an object', () => {
      const obj = { key: ['value1'] };
      const key = 'key';
      const value = 'value2';

      ObjectUtil.accumulate({ obj, key, value });

      expect(obj).toEqual({ key: ['value1', 'value2'] });
    });

    it('should create a new key in an object', () => {
      const obj = { key1: ['value1'] };
      const key = 'key2';
      const value = 'value2';

      ObjectUtil.accumulate({ obj, key, value });

      expect(obj).toEqual({ key1: ['value1'], key2: ['value2'] });
    });
  });
});
