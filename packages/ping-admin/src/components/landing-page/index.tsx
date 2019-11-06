import React from "react";
import { RouteComponentProps } from "react-router";
import { ReactStripeElements } from "react-stripe-elements";

// Icon
import { Icon } from "@rmwc/icon";
import "@rmwc/icon/icon.css";

// Images
import Button from "../../media/button.png";
import Illustration from "../../media/illustration.png";
import WhiteLogo from "../../media/huckleberry-white-logo.png";

// Registration
import { RegisterAccount } from "../account";

// Style
import "./style.css";
import { AppBar } from "../app";

// Domain
import { Config } from "@huckleberryai/ping";

type Props = RouteComponentProps & {
  stripe: ReactStripeElements.StripeProps;
};

export const LandingPage = (props: Props) => (
  <div className="landing-page-container">
    <AppBar isLoggedIn={false} fixed={false} />
    <div className="landing-page-above-fold">
      <div>
        <h1>Introducing Ping, the world's most effective contact button.</h1>
      </div>
      <div>
        <img src={Button} />
      </div>
      <div>
        <h2>Q: What is Ping?</h2>
        <h2>A: Ping is text messaging for your website.</h2>
      </div>
      <div>
        <img src={Illustration} />
      </div>
    </div>
    <div className="landing-page-section-one">
      <div>
        <h2>Q: Who should get Ping?</h2>
        <h2>A: Ping is perfect for solo entrepreneurs and small business.</h2>
      </div>
      <div className="landing-page-grid">
        <div className="landing-page-grid-item">
          <Icon icon="house" />
          <p>Real estate agents + brokerages</p>
        </div>
        <div className="landing-page-grid-item">
          <Icon icon="storefront" />
          <p>Local restaurants + retail + health & beauty</p>
        </div>
        <div className="landing-page-grid-item">
          <Icon icon="business" />
          <p>Contractors + freelancers</p>
        </div>
        <div className="landing-page-grid-item">
          <Icon icon="business_center" />
          <p>Accounting, finance + legal professionals</p>
        </div>
      </div>
    </div>
    <div className="landing-page-section-two">
      <h2>Why Ping vs. Contact Forms?</h2>
      <div className="landing-page-grid">
        <div className="landing-page-grid-item">
          <h3>98% 'open rate'.</h3>
          <p>
            Versus email open rates at 20% and declining. This is mainly because
            email has become polluted with spam. Email is also easy to ignore
            and often 'pushed off' into never-never land.
          </p>
        </div>
        <div className="landing-page-grid-item">
          <h3>65% of people prefer text.</h3>
          <p>
            Customers find call timing to be intrusive and prefer a text message
            to exchange questions and answers before a phone call.
          </p>
        </div>
        <div className="landing-page-grid-item">
          <h3>Texting gets a response.</h3>
          <p>
            9/10 people say they would eventually respond to a text. Emails go
            unanswered because they seem too 'salesy and automated'.
          </p>
        </div>
      </div>
    </div>
    <div className="landing-page-section-three">
      <h2>Why Ping vs. Live Chat?</h2>
      <div className="landing-page-grid">
        <div className="landing-page-grid-item">
          <h3>Deserted live chat windows.</h3>
          <p>
            Small business owners have trouble staying on top of live chat
            windows. With Ping, web visits are converted into text messages,
            directly to your phone.
          </p>
        </div>
        <div className="landing-page-grid-item">
          <h3>Better customer engagement.</h3>
          <p>
            Unlike Live Chat, Ping conversations don't end when your website
            visitors decide to leave your site.
          </p>
        </div>
        <div className="landing-page-grid-item">
          <h3>Built for big business.</h3>
          <p>
            Live Chat competitors like Intercom and Drift are designed with
            enterprise customers in mind. We are commited to small business, in
            our pricing, product and support.
          </p>
        </div>
      </div>
    </div>
    <div className="landing-page-section-four">
      <h2>Product Features</h2>
      <div className="landing-page-grid">
        <div className="landing-page-grid-item">
          <h3>Unlimited Websites.</h3>
          <p>
            Ping allows you to create as many widgets as you'd like. Our pricing
            is per unique receiving phone number.
          </p>
        </div>
        <div className="landing-page-grid-item">
          <h3>Prevent Spam Calls.</h3>
          <p>
            Tired of getting calls from credit card companies and air duct
            cleaners? Us too. Ping never exposes your number directly on the
            web, protecting you from web scrapers.
          </p>
        </div>
        <div className="landing-page-grid-item">
          <h3>Powerful analytics and reports.</h3>
          <p>
            Log in at any time to view visitor engagement analytics and reports.
          </p>
        </div>
        <div className="landing-page-grid-item">
          <h3>Smart routing.</h3>
          <p>
            Distribute incoming text messages to multiple phone numbers
            round-robin style, according to a schedule or even based on the
            website content being viewed.
          </p>
        </div>
        <div className="landing-page-grid-item">
          <h3>Have suggestions?</h3>
          <p>
            You help us realize our potential – let us help you realize yours.
            Tell us what your business needs and our development team will build
            it.
          </p>
        </div>
      </div>
    </div>
    <div className="landing-page-section-five">
      <div className="landing-page-section-five-text">
        <h1>$10 CAD a month. 2 week trial. 5 minute setup.</h1>
        <p>
          Free for charities. Bulk pricing available. Ask us about our reseller
          program.
        </p>
      </div>
      <RegisterAccount {...props} />
    </div>
    <div className="landing-page-footer">
      <img src={WhiteLogo} />
      <p>Ping, by Huckleberry.</p>
      <p>Made with ♥ in Waterloo.</p>
      <p>173 Roger Street Waterloo, Ontario, Canada</p>
      <p>
        We are quick to respond on email and text. Try us.{" "}
        <a href={`mail-to:${Config.SupportEmail}`}>{Config.SupportEmail}</a>
      </p>
    </div>
  </div>
);
