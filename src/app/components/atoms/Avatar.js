
const Avatar = ({ url, size = 'medium' }) => (
  <>
    <div
      className={`avatar ${size}`}
      style={{
        backgroundImage: `url('${url}')`
      }}
    />
  </>
)

export default Avatar