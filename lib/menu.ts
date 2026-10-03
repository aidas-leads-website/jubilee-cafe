/* Menu data from the cafe's Uber Eats listing. Counter prices may differ. */

export type DeliFilling = {
  id: string;
  name: string;
  note: string;
  sandwich: number;
  wrap: number;
};

export const DELI: DeliFilling[] = [
  { id: "club", name: "Club", note: "Ham, turkey, bacon", sandwich: 9.99, wrap: 10.74 },
  { id: "italian", name: "Italian", note: "Pepperoni, salami, ham, pepper ham", sandwich: 9.99, wrap: 10.74 },
  { id: "chicken-salad", name: "Chicken salad", note: "With lettuce and tomato", sandwich: 8.99, wrap: 9.74 },
  { id: "tuna-salad", name: "Tuna salad", note: "", sandwich: 8.99, wrap: 9.74 },
  { id: "ham", name: "Smoked ham", note: "Smoke Master ham", sandwich: 8.99, wrap: 9.74 },
  { id: "turkey", name: "Turkey", note: "Oven Gold turkey", sandwich: 8.99, wrap: 9.74 },
  { id: "blt", name: "B.L.T.", note: "Bacon, lettuce, tomato", sandwich: 7.99, wrap: 8.74 },
  { id: "veggie", name: "Veggie", note: "Meatless", sandwich: 6.99, wrap: 7.74 },
];

export type HotItem = {
  id: string;
  kind: string;
  name: string;
  note: string;
  price: number;
};

export const HOT: HotItem[] = [
  { id: "cajun", kind: "Panini", name: "Cajun chicken", note: "Cajun chicken, cheddar, lettuce", price: 9.99 },
  { id: "arizona", kind: "Panini", name: "Arizona turkey", note: "Sliced turkey, pressed", price: 9.99 },
  { id: "bcr", kind: "Panini", name: "Bacon chicken ranch", note: "Chicken, bacon, ranch", price: 9.99 },
  { id: "philly", kind: "Grilled sandwich", name: "Philly cheesesteak", note: "Beef, cheese and onions on a hoagie roll", price: 9.49 },
  { id: "quesadilla", kind: "From the grill", name: "Chicken quesadilla", note: "Seasoned chicken, melted cheese", price: 9.99 },
  { id: "tenders", kind: "From the fryer", name: "Chicken tenders", note: "Four pieces", price: 8.99 },
];

export const SOUP = [
  { id: "soup-12", oz: 12, price: 3.29 },
  { id: "soup-16", oz: 16, price: 5.29 },
] as const;

/* Stations with no prices captured yet. */
export const COUNTER_ONLY = ["Fresh salad bar", "Fried sides", "Sweets"];
