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
          CURRENCY_SYM: "€",
        },
        pluralCat: function (n) {
          if (n == 1) {
            return PLURAL_CATEGORY.ONE;
          }
          return PLURAL_CATEGORY.OTHER;
        },
        DATETIME_FORMATS: {
          MONTH: [
            "Ιανουαρίου",
            "Φεβρουαρίου",
            "Μαρτίου",
            "Απριλίου",
            "Μαΐου",
            "Ιουνίου",
            "Ιουλίου",
            "Αυγούστου",
            "Σεπτεμβρίου",
            "Οκτωβρίου",
            "Νοεμβρίου",
            "Δεκεμβρίου",
          ],
          SHORTMONTH: [
            "Ιαν",
            "Φεβ",
            "Μαρ",
            "Απρ",
            "Μαϊ",
            "Ιουν",
            "Ιουλ",
            "Αυγ",
            "Σεπ",
            "Οκτ",
            "Νοε",
            "Δεκ",
          ],
          DAY: [
            "Κυριακή",
            "Δευτέρα",
            "Τρίτη",
            "Τετάρτη",
            "Πέμπτη",
            "Παρασκευή",
            "Σάββατο",
          ],
          SHORTDAY: ["Κυρ", "Δευ", "Τρι", "Τετ", "Πεμ", "Παρ", "Σαβ"],
          AMPMS: ["π.μ.", "μ.μ."],
          medium: "d MMM y h:mm:ss a",
          short: "d/M/yy h:mm a",
          fullDate: "EEEE, d MMMM y",
          longDate: "d MMMM y",
          mediumDate: "d MMM y",
          shortDate: "d/M/yy",
          mediumTime: "h:mm:ss a",
          shortTime: "h:mm a",
        },
        id: "el-polyton",
      });
    },
  ]
);
