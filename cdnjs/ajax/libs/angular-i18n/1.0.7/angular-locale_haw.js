angular.module(
  "ngLocale",
  [],
  [
    "$provide",
    function ($provide) {
      var PLURAL_CATEGORY = {
        ZERO: "zero",
        ONE: "one",
        TWO: "two",
        FEW: "few",
        MANY: "many",
        OTHER: "other",
      };
      $provide.value("$locale", {
        DATETIME_FORMATS: {
          MONTH: [
            "Ianuali",
            "Pepeluali",
            "Malaki",
            "ʻApelila",
            "Mei",
            "Iune",
            "Iulai",
            "ʻAukake",
            "Kepakemapa",
            "ʻOkakopa",
            "Nowemapa",
            "Kekemapa",
          ],
          SHORTMONTH: [
            "Ian.",
            "Pep.",
            "Mal.",
            "ʻAp.",
            "Mei",
            "Iun.",
            "Iul.",
            "ʻAu.",
            "Kep.",
            "ʻOk.",
            "Now.",
            "Kek.",
          ],
          DAY: [
            "Lāpule",
            "Poʻakahi",
            "Poʻalua",
            "Poʻakolu",
            "Poʻahā",
            "Poʻalima",
            "Poʻaono",
          ],
          SHORTDAY: ["LP", "P1", "P2", "P3", "P4", "P5", "P6"],
          AMPMS: ["AM", "PM"],
          medium: "d MMM y h:mm:ss a",
          short: "d/M/yy h:mm a",
          fullDate: "EEEE, d MMMM y",
          longDate: "d MMMM y",
          mediumDate: "d MMM y",
          shortDate: "d/M/yy",
          mediumTime: "h:mm:ss a",
          shortTime: "h:mm a",
        },
        pluralCat: function (n) {
          if (n == 1) {
            return PLURAL_CATEGORY.ONE;
          }
          return PLURAL_CATEGORY.OTHER;
        },
        id: "haw",
      });
    },
  ]
);
