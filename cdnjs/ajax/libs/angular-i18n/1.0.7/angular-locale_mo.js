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
            "ianuarie",
            "februarie",
            "martie",
            "aprilie",
            "mai",
            "iunie",
            "iulie",
            "august",
            "septembrie",
            "octombrie",
            "noiembrie",
            "decembrie",
          ],
          SHORTMONTH: [
            "ian.",
            "feb.",
            "mar.",
            "apr.",
            "mai",
            "iun.",
            "iul.",
            "aug.",
            "sept.",
            "oct.",
            "nov.",
            "dec.",
          ],
          DAY: [
            "duminică",
            "luni",
            "marți",
            "miercuri",
            "joi",
            "vineri",
            "sâmbătă",
          ],
          SHORTDAY: ["Du", "Lu", "Ma", "Mi", "Jo", "Vi", "Sâ"],
          AMPMS: ["AM", "PM"],
          medium: "dd.MM.yyyy HH:mm:ss",
          short: "dd.MM.yyyy HH:mm",
          fullDate: "EEEE, d MMMM y",
          longDate: "d MMMM y",
          mediumDate: "dd.MM.yyyy",
          shortDate: "dd.MM.yyyy",
          mediumTime: "HH:mm:ss",
          shortTime: "HH:mm",
        },
        NUMBER_FORMATS: {
          DECIMAL_SEP: ",",
          GROUP_SEP: ".",
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
              posPre: "",
              posSuf: " \u00A4",
              negPre: "-",
              negSuf: " \u00A4",
              gSize: 3,
              lgSize: 3,
              maxFrac: 2,
            },
          ],
          CURRENCY_SYM: "MDL",
        },
        pluralCat: function (n) {
          if (n == 1) {
            return PLURAL_CATEGORY.ONE;
          }
          if (
            n == 0 ||
            (n != 1 && n % 100 >= 1 && n % 100 <= 19 && n == Math.floor(n))
          ) {
            return PLURAL_CATEGORY.FEW;
          }
          return PLURAL_CATEGORY.OTHER;
        },
        id: "mo",
      });
    },
  ]
);
