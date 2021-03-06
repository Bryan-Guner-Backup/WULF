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
            "Ionawr",
            "Chwefror",
            "Mawrth",
            "Ebrill",
            "Mai",
            "Mehefin",
            "Gorffenaf",
            "Awst",
            "Medi",
            "Hydref",
            "Tachwedd",
            "Rhagfyr",
          ],
          SHORTMONTH: [
            "Ion",
            "Chwef",
            "Mawrth",
            "Ebrill",
            "Mai",
            "Meh",
            "Gorff",
            "Awst",
            "Medi",
            "Hyd",
            "Tach",
            "Rhag",
          ],
          DAY: [
            "Dydd Sul",
            "Dydd Llun",
            "Dydd Mawrth",
            "Dydd Mercher",
            "Dydd Iau",
            "Dydd Gwener",
            "Dydd Sadwrn",
          ],
          SHORTDAY: ["Sul", "Llun", "Maw", "Mer", "Iau", "Gwen", "Sad"],
          AMPMS: ["AM", "PM"],
          medium: "d MMM y HH:mm:ss",
          short: "dd/MM/yyyy HH:mm",
          fullDate: "EEEE, d MMMM y",
          longDate: "d MMMM y",
          mediumDate: "d MMM y",
          shortDate: "dd/MM/yyyy",
          mediumTime: "HH:mm:ss",
          shortTime: "HH:mm",
        },
        pluralCat: function (n) {
          if (n == 1) {
            return PLURAL_CATEGORY.ONE;
          }
          return PLURAL_CATEGORY.OTHER;
        },
        id: "cy",
      });
    },
  ]
);
