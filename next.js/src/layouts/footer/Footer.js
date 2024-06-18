
import logoImage from '../../assets/images/logos/logo_footer.png';
import logomobileImage from '../../assets/images/logos/logo_footer_mobile.png';
import Image from 'next/image';
import Link from 'next/link';

const CustomFooter = () => (
  <>
    <div className="background-footer row col-12 px-sm-5 m-0 p-0 d-sm-flex d-none py-5">
      <div className="col-12 col-md-4 mt-5  m-0 p-0 bookmark-wrapper">
        <Link href="/" passHref className="navbar-brand">
          <span className="brand-logo">
            <Image className="px-3 logo d-sm-flex d-none" src={logoImage} alt="logo" />
            <Image className="px-2 logo d-sm-none d-flex" src={logomobileImage} alt="logo" />
          </span>
        </Link>
      </div>
      <div className="col-md-8 col-12  mt-2">
        <div className="row col-12 ">
          <div className="col-3">
            <div>
              <Link href="/products" passHref className="navbar-brand" onClick={() => window.scrollTo(0, 0)}>
                <p className="sentient-footer" style={{ fontWeight: '700' }}>
                  Buy
                </p>
              </Link>
            </div>
            <div>
              <Link href="/sell" passHref className="navbar-brand">
                <p className="sentient-footer">
                  Sell
                </p>
              </Link>
            </div>
            <div>
              <Link href="/service" passHref className="navbar-brand">
                <p className="sentient-footer">
                  Services
                </p>
              </Link>
            </div>
            <div>
              <a
                className="align-items-center navbar-brand"
                href="http://shopsentientlasers.com/"
                target="_blank"
                rel="noreferrer"
                onClick={() => window.scrollTo(0, 0)}
              >
                <p className="sentient-footer">
                  Parts
                </p>
              </a>
            </div>
            <div>
              <Link href="/about" passHref className="navbar-brand" onClick={() => window.scrollTo(0, 0)}>
                <p className="sentient-footer">
                  About
                </p>
              </Link>
            </div>
            <div>
              <Link href="/blog" passHref className="navbar-brand" onClick={() => window.scrollTo(0, 0)}>
                <p className="sentient-footer">
                  Blog
                </p>
              </Link>
            </div>
            <div>
              <Link href="/watchlist" passHref className="navbar-brand" onClick={() => window.scrollTo(0, 0)}>
                <p className="sentient-footer">
                  Watch List
                </p>
              </Link>
            </div>
            <div>
              <Link href="/service" passHref className="navbar-brand" onClick={() => window.scrollTo(0, 0)}>
                <p className="sentient-footer" style={{ whiteSpace: 'break-spaces' }}>
                  Service & Repair
                </p>
              </Link>
            </div>
            <div>
              <Link href="/sell/listdevice" passHref className="navbar-brand" onClick={() => window.scrollTo(0, 0)}>
                <p className="sentient-footer" style={{ whiteSpace: 'break-spaces' }}>
                  Post Sale Support
                </p>
              </Link>
            </div>
            <div>
              <a
                href="https://www.sentientlasers.com/provider-login"
                target="_blank"
                rel="noreferrer"
                className="navbar-brand"
                onClick={() => { window.scrollTo(0, 0); }}
              >
                <p className="sentient-footer" style={{ whiteSpace: 'break-spaces' }}>Provider Portal</p>
              </a>
            </div>
          </div>

          <div className="col-3">
            <div>
              <Link href="/contact-us" passHref className="navbar-brand" onClick={() => window.scrollTo(0, 0)}>
                <p className="sentient-footer" style={{ fontWeight: '700' }}>
                  Contact Us
                </p>
              </Link>
            </div>
          </div>

          <div className="col-3">
            <a
              className="align-items-center navbar-brand"
              href="https://sentientlasers.com/"
              target="_blank"
              rel="noreferrer"
              onClick={() => window.scrollTo(0, 0)}
            >
              <p className="sentient-footer">
                Sentient.com
              </p>
            </a>
          </div>

          <div className="col-3">
            <div>
              <Link href="/#" passHref className="navbar-brand">
                <p className="sentient-footer" style={{ fontWeight: '700' }}>
                  Social
                </p>
              </Link>
            </div>
            <div>
              <a href="https://www.facebook.com/SentientLasers/" target="_blank" className="navbar-brand" rel="noreferrer">
                <p className="sentient-footer">
                  Facebook
                </p>
              </a>
            </div>
            <div>
              <a href="https://www.instagram.com/sentientlasers/" target="_blank" rel="noreferrer" className="navbar-brand">
                <p className="sentient-footer">
                  Instagram
                </p>
              </a>
            </div>
            <div>
              <a href="https://linkedin.com/company/sentient-lasers" className="navbar-brand" target="_blank" rel="noreferrer">
                <p className="sentient-footer">
                  LinkedIn
                </p>
              </a>
            </div>
            <div>
              <a href="https://www.tiktok.com/@sentientlasers?_t=8dc4Ltu1Lvm&_r=1" className="navbar-brand" target="_blank" rel="noreferrer">
                <p className="sentient-footer">
                  TikTok
                </p>
              </a>
            </div>
          </div>
        </div>

        <div className="row col-12 mt-5">
          <div className="offset-9 col-3">
            <div>
              <a href="https://www.sentientlasers.com" className="navbar-brand" target="_blank" rel="noreferrer">
                <p className="sentient-footer" style={{ fontWeight: '700' }}>
                  Sentient
                </p>
              </a>
            </div>
            <div>
              <div className="navbar-brand">
                <p className="sentient-footer" style={{ whiteSpace: 'break-spaces' }}>
                  4383 North Forestdale Dr.
                  <br />
                  Park City, UT 84098
                </p>
              </div>
            </div>
            <div>
              <a href="tel:855-819-3781" className="navbar-brand">
                <p className="sentient-footer">
                  855-819-3781
                </p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    {/* mobile */}
    <div className="background-footer row col-12 pb-5 mx-0 px-0 d-sm-none d-flex">
      <div className="p-1 col-5 bookmark-wrapper my-2">
        <Link href="/" passHref className="navbar-brand">
          <span className="brand-logo">
            <Image className="px-3 logo d-sm-flex d-none" src={logoImage} alt="logo" />
            <Image className="px-2 logo d-sm-none d-flex" src={logomobileImage} alt="logo" />
          </span>
        </Link>
      </div>
      <div className="row col-12">
        <div className="col-6">
          <div>
            <Link href="/products" passHref className="navbar-brand" onClick={() => window.scrollTo(0, 0)}>
              <p className="sentient-footer" style={{ fontWeight: '700' }}>
                Buy
              </p>
            </Link>
          </div>
          <div>
            <Link href="/sell" passHref className="navbar-brand">
              <p className="sentient-footer">
                Sell
              </p>
            </Link>
          </div>
          <div>
            <a
              className="align-items-center navbar-brand"
              href="http://shopsentientlasers.com/"
              target="_blank"
              rel="noreferrer"
              onClick={() => window.scrollTo(0, 0)}
            >
              <p className="sentient-footer">
                Device Parts
              </p>
            </a>
          </div>
          <div>
            <Link href="/watchlist" passHref className="navbar-brand" onClick={() => window.scrollTo(0, 0)}>
              <p className="sentient-footer">
                Watch List
              </p>
            </Link>
          </div>
          <div>
            <Link href="/service" passHref className="navbar-brand" onClick={() => window.scrollTo(0, 0)}>
              <p className="sentient-footer" style={{ whiteSpace: 'break-spaces' }}>
                Service & Repair
              </p>
            </Link>
          </div>
          <div>
            <Link href="/sell/listdevice" passHref className="navbar-brand" onClick={() => window.scrollTo(0, 0)}>
              <p className="sentient-footer" style={{ whiteSpace: 'break-spaces' }}>
                Post Sale Support
              </p>
            </Link>
          </div>
          <div>
            <a
              href="https://www.sentientlasers.com/provider-login"
              target="_blank"
              rel="noreferrer"
              className="navbar-brand"
              onClick={() => { window.scrollTo(0, 0); }}
            >
              <p className="sentient-footer" style={{ whiteSpace: 'break-spaces' }}>Provider Portal</p>
            </a>
          </div>
          <br />
          <a
            className="align-items-center navbar-brand"
            href="https://sentientlasers.com/"
            target="_blank"
            rel="noreferrer"
            onClick={() => window.scrollTo(0, 0)}
          >
            <p className="sentient-footer">
              Sentient.com
            </p>
          </a>
          <br />
          <br />
          <div>
            <Link href="/contact-us" passHref className="navbar-brand" onClick={() => window.scrollTo(0, 0)}>
              <p className="sentient-footer" style={{ fontWeight: '700' }}>
                Contact Us
              </p>
            </Link>
          </div>
        </div>

        <div className="col-6">
          <div>
            <Link href="/#" passHref className="navbar-brand">
              <p className="sentient-footer" style={{ fontWeight: '700' }}>
                Social
              </p>
            </Link>
          </div>
          <div>
            <a href="https://www.facebook.com/SentientLasers/" target="_blank" className="navbar-brand" rel="noreferrer">
              <p className="sentient-footer">
                Facebook
              </p>
            </a>
          </div>
          <div>
            <a href="https://www.instagram.com/sentientlasers/" target="_blank" rel="noreferrer" className="navbar-brand">
              <p className="sentient-footer">
                Instagram
              </p>
            </a>
          </div>
          <div>
            <a href="https://linkedin.com/company/sentient-lasers" className="navbar-brand" target="_blank" rel="noreferrer">
              <p className="sentient-footer">
                LinkedIn
              </p>
            </a>
          </div>
          <div>
            <a href="https://www.tiktok.com/@sentientlasers?_t=8dc4Ltu1Lvm&_r=1" className="navbar-brand" target="_blank" rel="noreferrer">
              <p className="sentient-footer">
                TikTok
              </p>
            </a>
          </div>
          <br />
          <div>
            <a href="https://www.sentientlasers.com" className="navbar-brand" target="_blank" rel="noreferrer">
              <p className="sentient-footer" style={{ fontWeight: '700' }}>
                Sentient
              </p>
            </a>
          </div>
          <div>
            <div className="navbar-brand">
              <p className="sentient-footer" style={{ whiteSpace: 'break-spaces' }}>
                4383 North Forestdale Dr.
                <br />
                Park City, UT 84098
              </p>
            </div>
          </div>
          <div>
            <a href="tel:855-819-3781" className="navbar-brand">
              <p className="sentient-footer">
                855-819-3781
              </p>
            </a>
          </div>
        </div>
      </div>
    </div>
  </>
);

export default CustomFooter;
