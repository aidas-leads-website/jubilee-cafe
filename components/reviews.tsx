import type { CSSProperties } from "react";
import { CateringForm } from "./catering-form";
import { Score } from "./score";
import { Station } from "./station";
import { SITE } from "@/lib/site";
import { clamp, stagger } from "@/lib/util";

const STAR = "M12 2l3 6.6 7.1.8-5.3 4.8 1.5 7L12 17.6 5.7 21.2l1.5-7L1.9 9.4 9 8.6z";

/* Paraphrased from public reviews until the owner exports the real ones. */
const SAID = [
  { line: "A regular of almost ten years says it has been great every time.", from: "From a Google review" },
  {
    line: "A new Building 14 tenant liked the range: hot food, cold food and breakfast.",
    from: "From a Yelp review, July 2023",
  },
  { line: "Another points to the size of the salad bar.", from: "From a Google review" },
];

/* Five stars fill left to right; the last is cut short to show the rating's decimal. */
function Stars({ rating }: { rating: number }) {
  return (
    <div className="stars" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => {
        const cut = Math.round(clamp(i + 1 - rating) * 100);
        return (
          <span key={i}>
            <svg className="off" viewBox="0 0 24 24" fill="currentColor">
              <path d={STAR} />
            </svg>
            <svg
              className="on"
              style={{ "--i": i, ...(cut ? { "--cut": `${cut}%` } : {}) } as CSSProperties}
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d={STAR} />
            </svg>
          </span>
        );
      })}
    </div>
  );
}

export function Reviews() {
  return (
    <Station className="wide reviews" id="reviews">
      <div className="wrap">
        <div>
          <h2 className="sr">Reviews</h2>
          <Score />
          <Stars rating={SITE.rating.value} />
          <p>out of 5, from {SITE.rating.count} Google reviews</p>
        </div>
        <div>
          <ul className="said">
            {SAID.map((s, i) => (
              <li className="rise" style={stagger(i)} key={s.line}>
                {s.line}
                <small>{s.from}</small>
              </li>
            ))}
          </ul>
          <p className="more">
            <a target="_blank" rel="noopener" href={SITE.mapsUrl}>
              Read or leave a review on Google
            </a>
          </p>
        </div>
      </div>
    </Station>
  );
}

export function Catering() {
  return (
    <Station className="wide cater" id="catering">
      <div className="wrap">
        <div>
          <h2 className="sign">
            <span>Lunch for the whole floor?</span>
          </h2>
          <p>
            Tell the cafe the date and how many people. They will get back to you about what they can put
            together.
          </p>
        </div>
        <CateringForm />
      </div>
    </Station>
  );
}
