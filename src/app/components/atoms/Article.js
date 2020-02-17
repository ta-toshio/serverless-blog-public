const Article = ({ children, ...others }) => {

  let className = 'article'
  if (others && others.className) {
    className += ` ${others.className}`
    delete(others.className)
  }

  return (
    <article className={className} {...others}>
      {children}
    </article>
  )
}

export default Article