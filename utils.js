const jsonfile = require('jsonfile')

function getHashCode (str) {
  for (var i = 0, h = 0; i < str.length; i++) {
    h = Math.imul(31, h) + str.charCodeAt(i) | 0
  }
  return String(h)
}

function getObjFromMap (mapvalue) {
  const newObj = {}
  for (let [k, v] of mapvalue) {
    newObj[k] = v
  }
  return newObj
}
function getMapFromObj (objvalue) {
  const newMap = new Map()
  for (let k of Object.keys(objvalue)) {
    newMap.set(k, objvalue[k])
  }
  return newMap
}

function mapEntriesToDisk (cacheMap) {
  jsonfile.writeFile('./simpleMapCacheEntries.json', getObjFromMap(cacheMap))
}

function initializeMapCache () {
  return jsonfile.readFile('./simpleMapCacheEntries.json')
    .then(objEntries => {
      const newMap = getMapFromObj(objEntries)
      return newMap
    })
    .catch(error => {
      if (error.code === 'ENOENT') {
        const newMap = new Map()
        mapEntriesToDisk(newMap)
        return newMap
      }
    })
}

module.exports = {
  getHashCode,
  getMapFromObj,
  getObjFromMap,
  mapEntriesToDisk,
  initializeMapCache
}
