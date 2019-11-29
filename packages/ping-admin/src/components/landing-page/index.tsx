import React from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { ReactStripeElements } from "react-stripe-elements";

// Images
import PingButton from "../../media/button.png";
// import Illustration from "../../media/illustration.png";
import HuckleberryLogo from "../../media/huckleberry-white-logo.png";
import Logo from "../../media/logo.png";
import CheckMark from "../../media/checkmark.png";
import Secure from "../../media/secure.svg";
import Analytics from "../../media/analytics.svg";
import MultipleSites from "../../media/multiple-sites.svg";
import WordPress from "../../media/wordpress.svg";
import HowItWorks from "../../media/how-it-works.mp4";

// Button
import { Button } from "@rmwc/button";
import "@material/button/dist/mdc.button.css";

// UI Components
import { RegisterAccountForm } from "../account";

// Style
import "./style.css";

// Domain
import { Config } from "@huckleberryai/ping";

type Props = RouteComponentProps & {
  stripe: ReactStripeElements.StripeProps;
};

export const LandingPage = (props: Props) => (
  <div className="landing-page-container">
    <header className="landing-page-header">
      <Link to="/">
        <img src={Logo} alt="Ping" />
      </Link>
      <div>
        <HashLink to="/#registration">
          <Button>create my ping</Button>
        </HashLink>
        <Link to="/login">
          <Button unelevated>login</Button>
        </Link>
      </div>
    </header>
    <div className="landing-page-above-fold">
      <div>
        <h1>
          introducing ping, the world's most effective <br /> contact button.
        </h1>
        <img className="button-image" src={PingButton} alt="Ping Widget" />
      </div>
      <div>
        <h2>Q: what is ping?</h2>
        <h2>
          A: ping connects you with your website visitors directly via text
          messages.
        </h2>
      </div>
      <div>
        <h1>How It Works</h1>
        <video className="illustration" src={HowItWorks} autoPlay loop />
        {/* <img className="illustration" src={Illustration} alt="" /> */}
      </div>
    </div>
    <div className="landing-page-section-one">
      <div>
        <h2>Q: who should get ping?</h2>
        <h2>A: ping is perfect for solo entrepreneurs and small business.</h2>
      </div>
      <div className="landing-page-grid">
        <div className="landing-page-grid-item">
          <img className="checkmark-image" src={CheckMark} alt="" />
          <p>real estate agents + brokerages</p>
        </div>
        <div className="landing-page-grid-item">
          <img className="checkmark-image" src={CheckMark} alt="" />
          <p>local restaurants + retail + health & beauty</p>
        </div>
        <div className="landing-page-grid-item">
          <img className="checkmark-image" src={CheckMark} alt="" />
          <p>contractors + freelancers</p>
        </div>
        <div className="landing-page-grid-item">
          <img className="checkmark-image" src={CheckMark} alt="" />
          <p>accountants, finance + legal professionals</p>
        </div>
      </div>
    </div>
    <div className="landing-page-section-two">
      <h2>why ping vs. contact forms?</h2>
      <div className="landing-page-grid">
        <div className="landing-page-grid-item">
          <h3>98% 'open rate'.</h3>
          <p>
            versus email open rates at 20% and declining. this is mainly because
            email has become polluted with spam. email is also easy to ignore
            and often 'pushed off' into never-never land.
          </p>
        </div>
        <div className="landing-page-grid-item">
          <h3>65% of people prefer text.</h3>
          <p>
            customers find call timing to be intrusive and prefer a text message
            to exchange questions and answers before a phone call.
          </p>
        </div>
        <div className="landing-page-grid-item">
          <h3>texting gets a response.</h3>
          <p>
            9/10 people say they would eventually respond to a text. emails go
            unanswered because they seem too 'salesy and automated'.
          </p>
        </div>
      </div>
    </div>
    <div className="landing-page-section-three">
      <h2>why ping vs. live chat?</h2>
      <div className="landing-page-grid">
        <div className="landing-page-grid-item">
          <h3>deserted live chat windows.</h3>
          <p>
            Small business owners have trouble staying on top of live chat
            windows. With ping, web visits are converted into text messages,
            directly to your phone.
          </p>
        </div>
        <div className="landing-page-grid-item">
          <h3>more customer engagement.</h3>
          <p>
            unlike live chat, ping conversations don't end when your website
            visitors decide to leave your site.
          </p>
        </div>
        <div className="landing-page-grid-item">
          <h3>built for big business.</h3>
          <p>
            live chat competitors like Intercom and Drift are designed with
            enterprise customers in mind. We are commited to small business, in
            our pricing, product and support.
          </p>
        </div>
      </div>
    </div>
    <div className="landing-page-section-four">
      <h2>product features</h2>
      <div className="landing-page-grid">
        <div className="landing-page-grid-item">
          <img className="feature-image" src={MultipleSites} alt="" />
          <h3>unlimited sites.</h3>
          <p>
            ping allows you to create as many widgets as you'd like. Our pricing
            is per unique receiving phone number.
          </p>
        </div>
        <div className="landing-page-grid-item">
          <img className="feature-image" src={Secure} alt="" />
          <h3>no more spam.</h3>
          <p>
            ping never exposes your number directly on the web, protecting you
            from web scrapers.
          </p>
        </div>
        <div className="landing-page-grid-item">
          <img className="feature-image" src={Analytics} alt="" />
          <h3>powerful analytics.</h3>
          <p>
            log in at any time to view visitor engagement analytics and reports.
          </p>
        </div>
        <div className="landing-page-grid-item">
          <img className="feature-image" src={WordPress} alt="" />
          <h3>compatible with any website.</h3>
          <p>
            ping works with WordPress, Shopify, Squarespace, Weebly, Wix and any
            other web technology.
          </p>
        </div>
      </div>
    </div>
    <div className="landing-page-section-five">
      <div className="landing-page-section-five-text">
        <h1>
          2 week trial. 5 minute setup.{" "}
          <span className="secondary-underline">$10 CAD</span> a month.
        </h1>
        <br />
        <h3>free for charities. ask us about our reseller program.</h3>
      </div>
      <div id="registration">
        <RegisterAccountForm {...props} />
      </div>
    </div>
    <div className="landing-page-footer">
      <div>
        <p>Ping, By Huckleberry</p>
        <br />
        <a href="https://huckleberry.app">
          <img src={HuckleberryLogo} alt="Huckleberry Logo" />
        </a>
      </div>
      <div>
        <p>Made with ♥ in Waterloo</p>
        <br />

        <p>Office</p>
        <p>
          173 Roger Street
          <br />
          Waterloo, Ontario, Canada
        </p>
      </div>
      <div>
        <p>Support.</p>
        <br />
        <p>
          We are quick to respond on email and text.
          <br />
          Try us.
          <br />
          <br />
          <a href={`mail-to:${Config.SupportEmail}`}>{Config.SupportEmail}</a>
        </p>
      </div>
    </div>
  </div>
);
