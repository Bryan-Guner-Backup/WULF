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
          AMPMS: {
            0: "vorm.",
            1: "nachm.",
          },
          DAY: {
            0: "Sonntag",
            1: "Montag",
            2: "Dienstag",
            3: "Mittwoch",
            4: "Donnerstag",
            5: "Freitag",
            6: "Samstag",
          },
          MONTH: {
            0: "J\u00e4nner",
            1: "Februar",
            2: "M\u00e4rz",
            3: "April",
            4: "Mai",
            5: "Juni",
            6: "Juli",
            7: "August",
            8: "September",
            9: "Oktober",
            10: "November",
            11: "Dezember",
          },
          SHORTDAY: {
            0: "So.",
            1: "Mo.",
            2: "Di.",
            3: "Mi.",
            4: "Do.",
            5: "Fr.",
            6: "Sa.",
          },
          SHORTMONTH: {
            0: "J\u00e4n",
            1: "Feb",
            2: "M\u00e4r",
            3: "Apr",
            4: "Mai",
            5: "Jun",
            6: "Jul",
            7: "Aug",
            8: "Sep",
            9: "Okt",
            10: "Nov",
            11: "Dez",
          },
          fullDate: "EEEE, dd. MMMM y",
          longDate: "dd. MMMM y",
          medium: "dd.MM.yyyy HH:mm:ss",
          mediumDate: "dd.MM.yyyy",
          mediumTime: "HH:mm:ss",
          short: "dd.MM.yy HH:mm",
          shortDate: "dd.MM.yy",
          shortTime: "HH:mm",
        },
        NUMBER_FORMATS: {
          CURRENCY_SYM: "\u20ac",
          DECIMAL_SEP: ",",
          GROUP_SEP: ".",
          PATTERNS: {
            0: {
              gSize: 3,
              lgSize: 3,
              macFrac: 0,
              maxFrac: 3,
              minFrac: 0,
              minInt: 1,
              negPre: "-",
              negSuf: "",
              posPre: "",
              posSuf: "",
            },
            1: {
              gSize: 3,
              lgSize: 3,
              macFrac: 0,
              maxFrac: 2,
              minFrac: 2,
              minInt: 1,
              negPre: "\u00a4\u00a0-",
              negSuf: "",
              posPre: "\u00a4\u00a0",
              posSuf: "",
            },
          },
        },
        id: "de-at",
        pluralCat: function (n) {
          if (n == 1) {
            return PLURAL_CATEGORY.ONE;
          }
          return PLURAL_CATEGORY.OTHER;
        },
      });
    },
  ]
);
