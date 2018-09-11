const getQueryParams = () => {
  const params = {}
  window.location.href.replace(/([^(?|#)=&]+)(=([^&]*))?/g, ($0, $1, $2, $3) => {
    params[$1] = $3
  })
  return params
}

export const extractInfoFromHash = () => {
  if (process.SERVER_BUILD) return
  const { ownerId } = getQueryParams()
  return {
    ownerId: ownerId
  }
}


// 修改SessionStorage
export const setOwnerId = (value) => window.localStorage.setItem('ownerId', value)

// 获取SessionStorage
export const getOwnerId = () => window.localStorage.getItem('ownerId')
