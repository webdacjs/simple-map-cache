let cacheMap = new Map()
const defaultTTL = -1
const cleanupMsec = 600000 // 10 min
const {
  getHashCode,
  mapEntriesToDisk,
  initializeMapCache
} = require('./utils')

initializeMapCache().then(newmap => {
  cacheMap = newmap
})

const getTTL = ttl => ttl || defaultTTL

// CleanUp function.
setInterval(() => {
  const nowts = Date.now()
  cacheMap.forEach((value, key) => {
    if (value.ttl !== -1 && (nowts - value.ts) > value.ttl) {
      cacheMap.delete(key)
      mapEntriesToDisk(cacheMap)
    }
  })
}, cleanupMsec)

function checkTTlVal (entry, k) {
  if (!entry) return
  if (entry.ttl === -1 || (Date.now() - entry.ts) < entry.ttl) {
    return entry.val
  } else {
    del(k)
    mapEntriesToDisk(cacheMap)
  }
}

function markTtlVal (v, ttl) {
  return { val: v, ttl: getTTL(ttl), ts: Date.now() }
}

function set (k, v, ttl) {
  cacheMap.set(getHashCode(k), markTtlVal(v, ttl))
  mapEntriesToDisk(cacheMap)
}

function get (k) {
  return checkTTlVal(cacheMap.get(getHashCode(k)), k)
}

function del (k) {
  cacheMap.delete(getHashCode(k))
  mapEntriesToDisk(cacheMap)
}

function clear () {
  cacheMap.clear()
  mapEntriesToDisk(cacheMap)
}

module.exports = {
  set,
  get,
  del,
  clear
}
