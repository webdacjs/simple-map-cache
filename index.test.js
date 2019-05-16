const cache = require('./index')

test(`Testing 'set' to add new entry to the cache`, () => {
  cache.set('day', 'friday')
  expect(cache.get('day')).toBe('friday')
})

test(`Testing persitance with 'get' from previous test`, () => {
  expect(cache.get('day')).toBe('friday')
})

test(`Testing 'set' to add new entry to the cache`, () => {
  cache.set('ephimeral', 'shouldberemovedsoon', 100)
  expect(cache.get('ephimeral')).toBe('shouldberemovedsoon')
})

test(`Testing ephimeral with 'get' from previous test to be gone`, () => {
  setTimeout(() => {
    const ephimeralVal = cache.get('ephimeral')
    expect(ephimeralVal).toBe(undefined)
  }, 500)
})

test(`Testing non-existant entry with 'get' to be undefined `, () => {
  expect(cache.get('shoudlnotexists')).toBe(undefined)
})

test(`Testing deleting the existing 'day' entry`, () => {
  cache.del('day')
  expect(cache.get('day')).toBe(undefined)
})
