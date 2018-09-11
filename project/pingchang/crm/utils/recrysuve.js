/**
 * [双重递归搜索]
 * @param  {[type]} json    [json对象]
 * @param  {[type]} nodeId  [查找key的val]
 * @param  {[type]} key     [关键key]
 * @param  {[type]} objName [下级对象名]
 * @return {[type]}         [返回结果]
 */

/*function recrysuve(json, nodeId, key, objName, spe) {
  let node = null,
    zc = null,
    parentNode = null,
    speArray = [],
    resultarr = [];
  let getNode = (json, nodeId, key, objName) => {
    for (let item of json) {
      if (node) break;
      if (!item || !item['' + key + '']) continue;
      if (item['' + key + ''] === nodeId) {
        if(item[''+spe+'']){
          speArray=item['' + spe + '']

          break;
        }
        node = item
        break;
      } else {
        if (item['' + objName + '']) {
          parentNode = item
          getNode(item['' + objName + ''], nodeId, key, objName)
        } else {
          continue
        }
      }
    }
    if (!node) parentNode = null;
    return {
      parentNode: parentNode,
      node: node,
      speArray:speArray
    }
  }
  let traverseTree = (json, nodeId, key, objName) => {
    node = null
    parentNode = 1
    zc = getNode(json, nodeId, key, objName);    
    if (zc.parentNode === null) return zc;
    if (zc.parentNode) {
      // resultarr.unshift(zc)
      resultarr.push(zc)
      console.log(111111);
      traverseTree(json, zc.parentNode['' + objName + ''], key, objName)
    }
  }
  traverseTree(json, nodeId, key, objName)
    console.log(resultarr)

  return resultarr
}*/

/*function recrysuve(json, nodeId, key, objName, spe) {
  let node = null,
    zc = null,
    parentNode = null,
    speArray = [],
    resultarr = [];

  let getNode = (json, nodeId, key, objName, spe) => {
    for (let item of json) {
      if (!item || !item['' + key + '']) continue;
      console.log(item['' + key + ''])
      if (item['' + key + ''] === nodeId) {
        if (item['' + spe + '']) {
          speArray = item['' + spe + '']
        }
        node = item        
        break;
      } else {
        if (item['' + objName + '']) {
          parentNode = item
          getNode(item['' + objName + ''], nodeId, key, objName, spe)
        } else {
          continue
        }
      }
      if (!node) parentNode = null;
      return {
        parentNode: parentNode,
        node: node,
        speArray: speArray
      }
    }
  }

  let traverseTree = (json, nodeId, key, objName,spe) => {
    node = null
    parentNode = 1
    zc = getNode(json, nodeId, key, objName,spe);    
    if (zc.parentNode === null) return zc;
    if (zc.parentNode) {
      resultarr.unshift(zc)
      // resultarr.push(zc)
      // console.log(111111);
      traverseTree(json, zc.parentNode['' + objName + ''], key, objName,spe)
    }
  }
  traverseTree(json, nodeId, key, objName)
  // console.log(resultarr)
  // getNode(json, nodeId, key, objName, spe)
  return resultarr
}*/

export default function recrysuve(json, nodeId, key, objName, spe) {
  let node = null,
    zc = null,
    speArray = [],
    parentNode = null,
    resultarr = [];
  let getNode = (json, nodeId, key, objName, spe) => {
    for (let item of json) {
      if (node) break;
      if (!item || !item['' + key + '']) continue;
      if (item['' + key + ''] === nodeId) {
        if (item['' + spe + '']) {
          speArray = item['' + spe + '']
        }
        node = item
        break;
      } else {
        if (item['' + objName + ''] && item['' + objName + ''].length > 0) {
          parentNode = item
          getNode(item['' + objName + ''], nodeId, key, objName, spe)
        } else {
          continue
        }
      }
    }
    if (!node) parentNode = null;
    return {
      speArray: speArray,
      parentNode: parentNode,
      node: node
    }
  }
  let traverseTree = (json, nodeId, key, objName, spe) => {
    if(!json) {
      console.log(typeof json)
      return;
    };
    
    node = null
    parentNode = 1
    zc = getNode(json, nodeId, key, objName, spe);
    if (zc.parentNode === null) return zc;
    if (zc.parentNode) {
      resultarr.unshift(zc)
      traverseTree(json, zc.parentNode['' + objName + ''], key, objName, spe)
    }
  }
  traverseTree(json, nodeId, key, objName, spe)
  // console.log(resultarr)
  return resultarr
}

