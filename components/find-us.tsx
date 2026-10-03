import { Station } from "./station";
import { SITE } from "@/lib/site";
import { stagger } from "@/lib/util";

const STEPS = [
  `Come in through the Building 14 lobby at ${SITE.street}.`,
  "Take the elevator down to C.",
  `Jubilee Cafe is ${SITE.suite}.`,
];

/* The route line, lift car and pin are drawn by the scroll director as the section scrolls in. */
export function FindUs() {
  return (
    <Station className="wide find" id="find">
      <div className="wrap">
        <div>
          <h2 className="sign">
            <span>
              Building 14,
              <br />
              Floor C
            </span>
          </h2>
          <ol>
            {STEPS.map((step, i) => (
              <li className="rise" style={stagger(i)} key={step}>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <dl className="facts rise" style={stagger(3)}>
            <dt>Address</dt>
            <dd>
              {SITE.street}, {SITE.suite}, {SITE.city}, {SITE.region} {SITE.zip}
            </dd>
            <dt>Hours</dt>
            <dd>Monday to Friday, 7:00 am to 3:00 pm</dd>
            <dt>Phone</dt>
            <dd>{SITE.phone}</dd>
          </dl>
          <div className="acts rise" style={stagger(4)}>
            <a className="btn primary" target="_blank" rel="noopener" href={SITE.mapsUrl}>
              Get directions
            </a>
            <a className="btn ghost" href={`tel:${SITE.tel}`}>
              Call {SITE.phone}
            </a>
          </div>
        </div>
        <svg
          className="route"
          viewBox="0 0 440 400"
          role="img"
          aria-label="Route: through the Building 14 lobby, down the elevator to Floor C, to the Jubilee Cafe counter."
        >
          <g fill="none" stroke="rgba(255,255,255,.55)" strokeWidth="2">
            <rect x="150" y="20" width="200" height="230" rx="6" />
            <path d="M150 62H350M150 104H350M150 146H350M150 188H350" />
            <path d="M20 250H420" />
            <rect x="100" y="250" width="300" height="100" rx="6" />
            <rect x="232" y="30" width="36" height="312" rx="4" strokeDasharray="5 6" />
            <path d="M150 204v46" stroke="var(--brand)" strokeWidth="6" />
          </g>
          <text className="lbl" x="162" y="226">
            Lobby
          </text>
          <text className="lbl" x="112" y="276">
            Floor C
          </text>
          <path
            id="route-path"
            d="M34 232H250V318H338"
            fill="none"
            stroke="var(--marigold)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <g id="car">
            <rect x="236" y="204" width="28" height="40" rx="5" fill="var(--marigold)" />
          </g>
          <g id="pin">
            <circle cx="350" cy="318" r="12" fill="var(--marigold)" />
            <circle cx="350" cy="318" r="4.5" fill="var(--brand-deep)" />
          </g>
          <text className="cafe" x="398" y="374" textAnchor="end">
            Jubilee Cafe, C-10
          </text>
          <circle cx="34" cy="232" r="6" fill="#fff" />
        </svg>
      </div>
    </Station>
  );
}
