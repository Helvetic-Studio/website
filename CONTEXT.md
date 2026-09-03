# Helvetic Studio Website

The marketing website for Helvetic Studio. Its navigation is built around a layered silhouette of the Churfirsten range: summits stand in for pages, and moving between pages flies the camera into a summit.

## Language

### The range

**Ridge**: The layered mountain silhouette behind every page — three parallax layers, a mist band and a bottom fade. Persistent site chrome; it never remounts. _Avoid_: Background, hero image, mountains

**Summit**: A single peak in the ridge. Every summit is a gateway, a cairn, or a ridgeline summit. _Avoid_: Peak (ambiguous between the shape and the marker on it)

**Gateway**: A summit carrying an interactive pin that navigates to a page. There are four. _Avoid_: Peak link, nav peak, pin peak

**Cairn**: A summit carrying a quiet, non-interactive marker. Present so the gateways read as chosen rather than as every peak that exists. There are two, carved into the near layer at x 622 and x 1028 so they sit inside the visible window. They are unnamed — not real Churfirsten peaks. _Avoid_: Decorative peak, dummy peak

**Ridgeline summit**: Any other vertex in the ridge silhouette. Carries no data and no marker. _Avoid_: Unused peak, empty peak

### Motion

**Zoom**: The camera move that scales the ridge into a gateway when the route changes, and back out on return. Derived from the URL, never from a click. _Avoid_: Transition, animation, fly-in

**Lateral**: A zoom between two gateways with no stop at the range — the direct move from one inner page to another. _Avoid_: Peak-to-peak, side move

**Summit page**: Any page seen from one gateway's camera position. `/work` and every Work filter (`/work/<service>`) are pages of the Work summit: moving between them is neither a zoom nor a fade, only the content beneath the header changes. _Avoid_: Sub-page, nested route

### Catalogue

**Service**: One of the five things the studio sells (websites, online shops, web applications, design, care & growth), in the order they are sold. Each owns a Work filter. _Avoid_: Offering, category, product

**Work filter**: The Work page narrowed to the projects tagged with one service. One static page per service. _Avoid_: Tag page, portfolio category

### Surfaces

**Glass**: The frosted translucent surface used for chrome and panels. Exactly two tiers exist: `glass-chrome` for the navbar and pins, `glass-panel` for content surfaces. _Avoid_: Frosted, blur, acrylic
