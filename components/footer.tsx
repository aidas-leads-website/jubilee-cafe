import { SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div>
          <span className="mark">Jubilee Cafe</span>
          <p style={{ marginTop: 10, opacity: 0.8 }}>Floor C, Piedmont Center Building 14</p>
        </div>
        <div>
          <h3>Find us</h3>
          <p>
            {SITE.street}
            <br />
            {SITE.suite}
            <br />
            {SITE.city}, {SITE.region} {SITE.zip}
          </p>
        </div>
        <div>
          <h3>Open</h3>
          <p>
            Monday to Friday
            <br />
            7:00 am to 3:00 pm
          </p>
          <p style={{ marginTop: 10 }}>
            <a href={`tel:${SITE.tel}`}>{SITE.phone}</a>
          </p>
        </div>
        <p className="note">
          Preview build. Menu items and prices come from the cafe&apos;s Uber Eats listing and may differ at
          the counter. Ordering, payment and the catering inquiry are not connected yet, and the catering
          section is a proposal for the cafe to confirm. Review lines are paraphrased from public reviews.
        </p>
      </div>
    </footer>
  );
}
