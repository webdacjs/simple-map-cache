const clean = require('get-clean-string')('-')
const cacheMap = new Map()
const defaultTTL = -1
const cleanupMsec = 3600000 // 1h default cleanup

// CleanUp function.
setInterval(() => {
  const nowts = Date.now()
  cacheMap.forEach((value, key) => {
    if (value.ttl !== -1 && (nowts - value.ts) > value.ttl) {
      cacheMap.delete(key)
    }
  })
}, cleanupMsec)

function getCacheKey (str) {
  return str.constructor.name === 'String' ? clean(str) : clean(JSON.stringify(str))
}

function checkTTlVal (entry, k) {
  if (!entry) return
  if (entry.ttl === -1 || (Date.now() - entry.ts) < entry.ttl) {
    return entry.val
  } else {
    del(k)
  }
}

const getTTL = ttl => ttl ? ttl : defaultTTL

const markTtlVal = (v, ttl) => ({val: v, ttl: getTTL(ttl), ts: Date.now()})

const set = (k, v, ttl) => {
  cacheMap.set(getCacheKey(k), markTtlVal(v, ttl))
}

const get = k => checkTTlVal(cacheMap.get(getCacheKey(k)), k)

const del = k => cacheMap.delete(getCacheKey(k))

const clear = () => cacheMap.clear()

module.exports = {
  set,
  get,
  del,
  clear
}
