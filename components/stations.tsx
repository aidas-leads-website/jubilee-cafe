import { AddButton } from "./add-button";
import { FlipBoard } from "./flip-board";
import { HotCard } from "./hot-card";
import { MagneticLink } from "./magnetic-link";
import { OpenStatus } from "./open-status";
import { OrderTicket } from "./order-ticket";
import { Station } from "./station";
import { COUNTER_ONLY, DELI, HOT, SOUP } from "@/lib/menu";
import { stagger } from "@/lib/util";

/* The left-hand column: the stations a customer passes on the way to the till, in order. */

export function Hero() {
  return (
    <section className="st hero" id="top">
      <OpenStatus className="fade" />
      <h1>
        <span className="l">
          <span>Lunch is</span>
        </span>{" "}
        <span className="l">
          <span>downstairs.</span>
        </span>
      </h1>
      <p className="fade">
        Breakfast and lunch on Floor C of Piedmont Center, Building 14. Order ahead and pick it up at the
        counter.
      </p>
      <div className="acts fade">
        <MagneticLink className="btn primary" href="#order">
          Order pickup
        </MagneticLink>
        <a className="btn ghost" href="#today">
          See the menu
        </a>
      </div>
      <p className="hours fade">Monday to Friday, 7:00 am to 3:00 pm. Closed weekends.</p>
    </section>
  );
}

export function Today() {
  return (
    <Station className="st" id="today">
      <h2 className="sign">
        <span>Today</span>
      </h2>
      <FlipBoard />
      <div className="pair rise" style={stagger(2)}>
        {SOUP.map((s) => (
          <AddButton
            key={s.id}
            id={s.id}
            name={`Soup of the day, ${s.oz} oz`}
            label={`soup of the day, ${s.oz} ounce`}
            price={s.price}
            way={`${s.oz} oz soup`}
          />
        ))}
      </div>
    </Station>
  );
}

export function Deli() {
  return (
    <Station className="st" id="deli">
      <h2 className="sign">
        <span>Deli</span>
      </h2>
      <p>Pick a filling. Have it on sliced bread, or as a wrap or sub for 75 cents more.</p>
      <div className="rows">
        {DELI.map((d, i) => (
          <div className="row rise" style={stagger(i)} key={d.id}>
            <div>
              <h3>{d.name}</h3>
              {d.note && <p>{d.note}</p>}
            </div>
            <div className="ways">
              <AddButton id={`${d.id}-s`} name={`${d.name} sandwich`} price={d.sandwich} way="Sandwich" />
              <AddButton id={`${d.id}-w`} name={`${d.name} wrap or sub`} price={d.wrap} way="Wrap or sub" />
            </div>
          </div>
        ))}
      </div>
    </Station>
  );
}

export function Grill() {
  return (
    <Station className="st" id="grill">
      <h2 className="sign">
        <span>Grill and hot food</span>
      </h2>
      <div className="cards">
        {HOT.map((h, i) => (
          <HotCard key={h.id} item={h} index={i} />
        ))}
      </div>
      <p className="also rise" style={stagger(6)}>
        Also at the grill: burgers, chicken wings and the hibachi grill. Priced at the counter.
      </p>
    </Station>
  );
}

export function Salad() {
  return (
    <Station className="st" id="salad">
      <h2 className="sign">
        <span>Salad bar, sides and sweets</span>
      </h2>
      <p>Build your own at the salad bar, add a side, finish with something sweet.</p>
      <ul className="counter">
        {COUNTER_ONLY.map((name, i) => (
          <li className="rise" style={stagger(i)} key={name}>
            <b>{name}</b>
            <span>Priced at the counter</span>
          </li>
        ))}
      </ul>
    </Station>
  );
}

export function Order() {
  return (
    <Station className="st" id="order">
      <h2 className="sign">
        <span>Your tray</span>
      </h2>
      <OrderTicket />
    </Station>
  );
}
