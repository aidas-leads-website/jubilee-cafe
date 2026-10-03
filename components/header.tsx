import { MagneticLink } from "./magnetic-link";
import { OpenStatus } from "./open-status";
import { TrayCount } from "./tray-count";

/* First visit only: a lift indicator ticks from L down to C, then the page opens. CSS only. */
export function LiftIntro() {
  return (
    <div className="lift-intro" aria-hidden="true">
      <div className="panel">
        <div className="arrow" />
        <div className="win">
          <div className="reel">
            <span>L</span>
            <span>C</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Header() {
  return (
    <header className="bar">
      <a className="mark" href="#top">
        Jubilee Cafe
      </a>
      <span className="lift" title="Floor C" aria-hidden="true">
        <i />
        <span className="slot">
          <b>L</b>
          <b>C</b>
        </span>
      </span>
      <span className="gap" />
      <OpenStatus />
      <MagneticLink className="btn primary small" href="#order">
        Order pickup <TrayCount id="bar-count" />
      </MagneticLink>
    </header>
  );
}
