import {normalizeArg} from '../src/pipeline';
import _ from 'lodash';
import chai from 'chai';

const {assert} = chai;

export default function () {

  const checkSignature = (result) => {
    assert.isFunction(result.select);
    assert.isFunction(result.merge);
    assert.isFunction(result.reducer);
  };

  describe('function', function () {

    const arg = function (state) {
      return state;
    };
    const pipelineArg = normalizeArg(arg);

    it('should have a pipeline arg signature', function () {
      checkSignature(pipelineArg);
    });
    it('should produce an identity merge and select', function () {
      assert.equal(_.identity, pipelineArg.select);
      assert.equal(_.identity, pipelineArg.merge);
    });
    it('should have original arg as a reducer', function () {
      assert.equal(arg, pipelineArg.reducer);
    });
  });

  describe('config object long', function () {

    const arg = {select: state => state, merge: (result, state) => result, reducer: _.identity};
    const pipelineArg = normalizeArg(arg);

    it('should have a pipeline arg signature', function () {
      checkSignature(pipelineArg);
    });
    it('should not alter reducer, merge, and select', function () {
      assert.equal(arg.merge, pipelineArg.merge);
      assert.equal(arg.select, pipelineArg.select);
      assert.equal(arg.reducer, pipelineArg.reducer);
    });
  });

  describe('config array long', function () {

    const arg = [state => state, (result, state) => result, _.identity];
    const pipelineArg = normalizeArg(arg);

    it('should have a pipeline arg signature', function () {
      checkSignature(pipelineArg);
    });
    it('should not alter reducer, merge, and select', function () {
      assert.equal(arg[0], pipelineArg.select);
      assert.equal(arg[1], pipelineArg.merge);
      assert.equal(arg[2], pipelineArg.reducer);
    });
  });

  describe('config object short', function () {

    const arg = {select: 'key', reducer: _.identity};
    const pipelineArg = normalizeArg(arg);

    it('should have a pipeline arg signature', function () {
      checkSignature(pipelineArg);
    });
    it('should not alter reducer', function () {
      assert.equal(arg.reducer, pipelineArg.reducer);
    });
  });

  describe('config array short', function () {

    const arg = ['key', _.identity];
    const pipelineArg = normalizeArg(arg);

    it('should have a pipeline arg signature', function () {
      checkSignature(pipelineArg);
    });
    it('should not alter reducer', function () {
      assert.equal(arg[1], pipelineArg.reducer);
    });
  });

  describe('defaults', function () {
    const arg = {foo: 'bar'};
    const pipelineArg = normalizeArg(arg);

    it('should have a pipeline arg signature', function () {
      checkSignature(pipelineArg);
    });
    it('should produce an identity merge and select', function () {
      assert.equal(_.identity, pipelineArg.select);
      assert.equal(_.identity, pipelineArg.merge);
    });
    it('calling reducer should produce default', function () {
      assert.deepEqual(arg, pipelineArg.reducer());
    });
  });
}
