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
        NUMBER_FORMATS: {
          DECIMAL_SEP: ".",
          GROUP_SEP: ",",
          PATTERNS: [
            {
              minInt: 1,
              minFrac: 0,
              macFrac: 0,
              posPre: "",
              posSuf: "",
              negPre: "-",
              negSuf: "",
              gSize: 3,
              lgSize: 3,
              maxFrac: 3,
            },
            {
              minInt: 1,
              minFrac: 2,
              macFrac: 0,
              posPre: "\u00A4 ",
              posSuf: "",
              negPre: "\u00A4 -",
              negSuf: "",
              gSize: 3,
              lgSize: 3,
              maxFrac: 2,
            },
          ],
          CURRENCY_SYM: "P",
        },
        pluralCat: function (n) {
          if (n == 0 || n == 1) {
            return PLURAL_CATEGORY.ONE;
          }
          return PLURAL_CATEGORY.OTHER;
        },
        DATETIME_FORMATS: {
          MONTH: [
            "Enero",
            "Pebrero",
            "Marso",
            "Abril",
            "Mayo",
            "Hunyo",
            "Hulyo",
            "Agosto",
            "Setyembre",
            "Oktubre",
            "Nobyembre",
            "Disyembre",
          ],
          SHORTMONTH: [
            "Ene",
            "Peb",
            "Mar",
            "Abr",
            "May",
            "Hun",
            "Hul",
            "Ago",
            "Set",
            "Okt",
            "Nob",
            "Dis",
          ],
          DAY: [
            "Linggo",
            "Lunes",
            "Martes",
            "Miyerkules",
            "Huwebes",
            "Biyernes",
            "Sabado",
          ],
          SHORTDAY: ["Lin", "Lun", "Mar", "Mye", "Huw", "Bye", "Sab"],
          AMPMS: ["AM", "PM"],
          medium: "MMM d, y HH:mm:ss",
          short: "M/d/yy HH:mm",
          fullDate: "EEEE, MMMM dd y",
          longDate: "MMMM d, y",
          mediumDate: "MMM d, y",
          shortDate: "M/d/yy",
          mediumTime: "HH:mm:ss",
          shortTime: "HH:mm",
        },
        id: "tl-ph",
      });
    },
  ]
);
