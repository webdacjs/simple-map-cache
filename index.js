const cacheMap = new Map()
const defaultTTL = -1
const cleanupMsec = 3600000 // 1h default cleanup
const jsonfile = require('jsonfile')

jsonfile.readFile('./simpleCache.json')
  .then(cachedJson => {
    fillCacheFromJson(cachedJson)
  }).catch(() => {
    saveCacheToDisk()
  })

// CleanUp function.
setInterval(() => {
  const nowts = Date.now()
  cacheMap.forEach((value, key) => {
    if (value.ttl !== -1 && (nowts - value.ts) > value.ttl) {
      cacheMap.delete(key)
    }
  })
  saveCacheToDisk()
}, cleanupMsec)

const checkStr = val => typeof (val) === 'string'

const getTTL = ttl => ttl || defaultTTL

function fillCacheFromJson (jsonOjb) {
  jsonOjb.forEach(x => {
    const [key, payload] = x
    cacheMap.set(key, payload)
  })
}

function saveCacheToDisk () {
  try {
    jsonfile.writeFile('./simpleCache.json', [...cacheMap])
  } catch (e) {
    console.log('Impossible to write to the disk!')
  }
}

function getEncodedStr (str) {
  const value = checkStr(str) ? str : JSON.stringify(str)
  return Buffer.from(value).toString('base64')
}

function getDecoded (enc) {
  return Buffer.from(enc, 'base64').toString()
}

function checkTTlVal (entry, k) {
  if (!entry) return {}
  const { val, isStr, ts, ttl } = entry
  if (ttl === -1 || (Date.now() - ts) < ttl) {
    return { val, isStr }
  } else {
    del(k)
  }
}

function markTtlVal (v, ttl) {
  const isStr = checkStr(v)
  return {
    val: getEncodedStr(v),
    ttl: getTTL(ttl),
    ts: Date.now(),
    isStr
  }
}

function set (k, v, ttl) {
  if (!k || !v) {
    return
  }
  cacheMap.set(getEncodedStr(k), markTtlVal(v, ttl))
  saveCacheToDisk()
}

function get (k) {
  const { val, isStr } = checkTTlVal(cacheMap.get(getEncodedStr(k)), k)
  if (val) {
    return isStr ? getDecoded(val) : JSON.parse(getDecoded(val))
  }
}

function del (k) {
  cacheMap.delete(getEncodedStr(k))
  saveCacheToDisk()
}

function clear () {
  cacheMap.clear()
}

module.exports = {
  set,
  get,
  del,
  clear
}
