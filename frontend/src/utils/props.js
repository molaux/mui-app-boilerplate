export const requiredPropsCheck = (propsList) => (props, propName, componentName) => {
  // eslint-disable-next-line react/destructuring-assignment
  if (!propsList.reduce((isPresent, prop) => isPresent || props[prop] !== undefined, false)) {
    return new Error(`One of '${propsList.join('\', \'')}' is required by '${componentName}' component.`)
  }
  return null
}

export default requiredPropsCheck
