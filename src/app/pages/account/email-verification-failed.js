import Link from 'next/link'
import Container from '../../components/atoms/Container'
import Main from '../../components/atoms/Main'

const EmailVerificationFailed = () => (
  <Container>
    <Main>
      <div className="alert">
        <span className="text">
          Try verifying your email again
          <br />
          Your request to verify your email has expired or the link has already been used
        </span>
      </div>
      <footer className="email-verification-footer">
        <div className="is-right">
          <Link href="/">
            <a className="text is-link">go to top</a>
          </Link>
        </div>
      </footer>
    </Main>
  </Container>
)

export default EmailVerificationFailed