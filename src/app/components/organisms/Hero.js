export default (props) => (
  <>
    <img src={props.img} className="hero-image" />
    <style jsx>{`
      img {
        width: 100vw;
        max-width: 100vw;
        height: 300px;
        margin-left: calc(50% - 50vw);
        object-fit: cover;
      }
    `}</style>
  </>
)