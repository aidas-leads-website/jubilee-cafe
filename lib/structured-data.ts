import { DELI, HOT, SOUP } from "./menu";
import { SITE } from "./site";

const menuItem = (name: string, price: number, description?: string) => ({
  "@type": "MenuItem",
  name,
  ...(description ? { description } : {}),
  offers: { "@type": "Offer", price: price.toFixed(2), priceCurrency: "USD" },
});

/* Restaurant, opening hours and menu for search engines. */
export const restaurantJsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: SITE.name,
  telephone: SITE.tel,
  priceRange: "$",
  servesCuisine: ["Breakfast", "Sandwiches", "Salads"],
  address: {
    "@type": "PostalAddress",
    streetAddress: `${SITE.street}, Building 14, Floor C, ${SITE.suite}`,
    addressLocality: SITE.city,
    addressRegion: SITE.region,
    postalCode: SITE.zip,
    addressCountry: "US",
  },
  geo: { "@type": "GeoCoordinates", ...SITE.geo },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "07:00",
      closes: "15:00",
    },
  ],
  hasMenu: {
    "@type": "Menu",
    hasMenuSection: [
      {
        "@type": "MenuSection",
        name: "Soup of the day",
        hasMenuItem: SOUP.map((s) => menuItem(`Soup of the day, ${s.oz} oz`, s.price)),
      },
      {
        "@type": "MenuSection",
        name: "Deli",
        hasMenuItem: DELI.flatMap((d) => [
          menuItem(`${d.name} sandwich`, d.sandwich, d.note),
          menuItem(`${d.name} wrap or sub`, d.wrap, d.note),
        ]),
      },
      {
        "@type": "MenuSection",
        name: "Grill and hot food",
        hasMenuItem: HOT.map((h) => menuItem(h.name, h.price, h.note)),
      },
    ],
  },
};
