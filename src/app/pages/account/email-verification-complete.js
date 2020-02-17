import Link from 'next/link'
import Container from '../../components/atoms/Container'
import Main from '../../components/atoms/Main'

const EmailVerificationComplete = () => (
  <Container>
    <Main>
      <div className="alert">
        <span className="text">
          Thank you for registration.
          <br />
          Your email has been verified
          <br />
          You can now sign in with your new account
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

export default EmailVerificationComplete