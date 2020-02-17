const Container = ({ children, outerProps = {}, innerProps = {} }) => {

  let outerClassName = 'section'
  if (outerProps && outerProps.className) {
    outerClassName += ` ${outerProps.className}`
    delete(outerProps.className)
  }

  let innerClassName = 'inner'
  if (innerProps && innerProps.className) {
    innerClassName += ` ${innerProps.className}`
    delete(innerProps.className)
  }

  return (
    <section className={outerClassName} {...outerProps}>
      <div className={innerClassName} {...innerProps}>
        {children}
      </div>
    </section>
  )
}

export default Container
