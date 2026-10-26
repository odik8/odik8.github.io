import getAttrNameFromSelector from './getAttrNameFromSelector.js'

const getParams = (element, dataAttrSelector) => {
  const value = element.getAttribute(getAttrNameFromSelector(dataAttrSelector))

  return value ? JSON.parse(value) : {}
}

export default getParams
