import Vue from 'vue'
import iosBounce from '@/directives/ios-bounce'

describe('ios-bounce', () => {
  it('should have bind', () => {
    expect(typeof iosBounce.bind).toEqual('function')
  })
})
