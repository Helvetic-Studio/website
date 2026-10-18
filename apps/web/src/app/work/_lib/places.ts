import type { StaticImageData } from "next/image";

import alpstein from "@/app/work/_assets/alpstein.jpg";
import rorschach from "@/app/work/_assets/rorschach.jpg";
import saentis from "@/app/work/_assets/saentis.jpg";
import stGallen from "@/app/work/_assets/st-gallen.jpg";
import walensee from "@/app/work/_assets/walensee.jpg";
import werdenberg from "@/app/work/_assets/werdenberg.jpg";
import wildhaus from "@/app/work/_assets/wildhaus.jpg";
import zurich from "@/app/work/_assets/zurich.jpg";

/** Who took a photograph and on what terms; every one is credited on the Work page. */
export interface Credit {
  title: string;
  author: string;
  licence: string;
  licenceUrl: string;
  /** The file's page on Wikimedia Commons. */
  source: string;
}

/**
 * A photograph of the place a client works in. It shows the client's world, never the client's
 * own premises or product: the work itself is drawn in front of it (see ProjectCover).
 */
interface Place {
  photo: StaticImageData;
  alt: string;
  /** What the photograph shows, as its caption. */
  caption: string;
  credit: Credit;
}

const BY_SA_4 = "https://creativecommons.org/licenses/by-sa/4.0";
const BY_SA_3 = "https://creativecommons.org/licenses/by-sa/3.0";

export const PLACES = {
  "st-gallen": {
    photo: stGallen,
    alt: "Painted and half-timbered houses in the old town of St. Gallen.",
    caption: "Old town, St. Gallen",
    credit: {
      title: "St. Gallen SG - Stiftsbezirk - 01",
      author: "HaSt",
      licence: "CC BY-SA 4.0",
      licenceUrl: BY_SA_4,
      source:
        "https://commons.wikimedia.org/wiki/File:St._Gallen_SG_-_Stiftsbezirk_-_01.jpg",
    },
  },
  werdenberg: {
    photo: werdenberg,
    alt: "Werdenberg castle above the little town, with the Alvier range behind, at sunset.",
    caption: "Werdenberg, Buchs SG",
    credit: {
      title: "Sunset in Werdenberg",
      author: "Haj3s29a",
      licence: "CC BY-SA 4.0",
      licenceUrl: BY_SA_4,
      source:
        "https://commons.wikimedia.org/wiki/File:Sunset_in_Werdenberg.jpg",
    },
  },
  saentis: {
    photo: saentis,
    alt: "The summit of the Säntis with its transmitter mast under a deep blue sky.",
    caption: "The Säntis",
    credit: {
      title: "Säntis Bergstation und Gipfel 20210812",
      author: "Daniel Kraft",
      licence: "CC BY-SA 3.0",
      licenceUrl: BY_SA_3,
      source:
        "https://commons.wikimedia.org/wiki/File:S%C3%A4ntis_Bergstation_und_Gipfel_20210812.jpg",
    },
  },
  wildhaus: {
    photo: wildhaus,
    alt: "Meadows and chalets of Wildhaus below the jagged ridge of the Churfirsten.",
    caption: "The Churfirsten above Wildhaus",
    credit: {
      title: "Wildhaus Churfirsten",
      author: "Paebi",
      licence: "CC BY-SA 4.0",
      licenceUrl: BY_SA_4,
      source:
        "https://commons.wikimedia.org/wiki/File:Wildhaus_Churfirsten.jpg",
    },
  },
  zurich: {
    photo: zurich,
    alt: "The twin towers of the Grossmünster above the Limmat in Zürich.",
    caption: "Grossmünster and Limmat, Zürich",
    credit: {
      title: "Grossmünster and Limmat River, Zurich, 20250330 1239 7929",
      author: "Jakub Hałun",
      licence: "CC BY 4.0",
      licenceUrl: "https://creativecommons.org/licenses/by/4.0",
      source:
        "https://commons.wikimedia.org/wiki/File:Grossm%C3%BCnster_and_Limmat_River,_Zurich,_20250330_1239_7929.jpg",
    },
  },
  walensee: {
    photo: walensee,
    alt: "The turquoise Walensee far below, seen from the grassy slopes of the Chäserrugg.",
    caption: "The Walensee from the Chäserrugg",
    credit: {
      title: "Walensee from Chäserrugg",
      author: "Daniel Kraft",
      licence: "CC BY-SA 3.0",
      licenceUrl: BY_SA_3,
      source:
        "https://commons.wikimedia.org/wiki/File:Walensee_from_Ch%C3%A4serrugg.jpg",
    },
  },
  rorschach: {
    photo: rorschach,
    alt: "The baroque Kornhaus and the harbour of Rorschach on Lake Constance.",
    caption: "Kornhaus and harbour, Rorschach",
    credit: {
      title: "Kornhaus Hafen Rorschach",
      author: "Paebi",
      licence: "CC BY-SA 4.0",
      licenceUrl: BY_SA_4,
      source:
        "https://commons.wikimedia.org/wiki/File:Kornhaus_Hafen_Rorschach.jpg",
    },
  },
  alpstein: {
    photo: alpstein,
    alt: "Panorama of the Alpstein range with the Säntis, seen across the hills from Teufen.",
    caption: "The Alpstein from Teufen",
    credit: {
      title: "Alpstein Teufen Panorama",
      author: "böhringer friedrich",
      licence: "CC BY-SA 2.5",
      licenceUrl: "https://creativecommons.org/licenses/by-sa/2.5",
      source:
        "https://commons.wikimedia.org/wiki/File:Alpstein_Teufen_Panorama.jpg",
    },
  },
} as const satisfies Record<string, Place>;

export type PlaceKey = keyof typeof PLACES;

/** Every photograph on the page, for the credits. */
export const CREDITS: readonly Credit[] = Object.values(PLACES).map(
  (place) => place.credit
);
