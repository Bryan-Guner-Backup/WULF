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
            0: "am",
            1: "pm",
          },
          DAY: {
            0: "\u0930\u0935\u093f\u0935\u093e\u0930",
            1: "\u0938\u094b\u092e\u0935\u093e\u0930",
            2: "\u092e\u0902\u0917\u0933\u0935\u093e\u0930",
            3: "\u092c\u0941\u0927\u0935\u093e\u0930",
            4: "\u0917\u0941\u0930\u0941\u0935\u093e\u0930",
            5: "\u0936\u0941\u0915\u094d\u0930\u0935\u093e\u0930",
            6: "\u0936\u0928\u093f\u0935\u093e\u0930",
          },
          MONTH: {
            0: "\u091c\u093e\u0928\u0947\u0935\u093e\u0930\u0940",
            1: "\u092b\u0947\u092c\u094d\u0930\u0941\u0935\u093e\u0930\u0940",
            2: "\u092e\u093e\u0930\u094d\u091a",
            3: "\u090f\u092a\u094d\u0930\u093f\u0932",
            4: "\u092e\u0947",
            5: "\u091c\u0942\u0928",
            6: "\u091c\u0941\u0932\u0948",
            7: "\u0911\u0917\u0938\u094d\u091f",
            8: "\u0938\u092a\u094d\u091f\u0947\u0902\u092c\u0930",
            9: "\u0911\u0915\u094d\u091f\u094b\u092c\u0930",
            10: "\u0928\u094b\u0935\u094d\u0939\u0947\u0902\u092c\u0930",
            11: "\u0921\u093f\u0938\u0947\u0902\u092c\u0930",
          },
          SHORTDAY: {
            0: "\u0930\u0935\u093f",
            1: "\u0938\u094b\u092e",
            2: "\u092e\u0902\u0917\u0933",
            3: "\u092c\u0941\u0927",
            4: "\u0917\u0941\u0930\u0941",
            5: "\u0936\u0941\u0915\u094d\u0930",
            6: "\u0936\u0928\u093f",
          },
          SHORTMONTH: {
            0: "\u091c\u093e\u0928\u0947",
            1: "\u092b\u0947\u092c\u094d\u0930\u0941",
            2: "\u092e\u093e\u0930\u094d\u091a",
            3: "\u090f\u092a\u094d\u0930\u093f",
            4: "\u092e\u0947",
            5: "\u091c\u0942\u0928",
            6: "\u091c\u0941\u0932\u0948",
            7: "\u0911\u0917",
            8: "\u0938\u0947\u092a\u094d\u091f\u0947\u0902",
            9: "\u0911\u0915\u094d\u091f\u094b\u092c\u0930",
            10: "\u0928\u094b\u0935\u094d\u0939\u0947\u0902",
            11: "\u0921\u093f\u0938\u0947\u0902",
          },
          fullDate: "EEEE d MMMM y",
          longDate: "d MMMM y",
          medium: "d MMM y h-mm-ss a",
          mediumDate: "d MMM y",
          mediumTime: "h-mm-ss a",
          short: "d-M-yy h-mm a",
          shortDate: "d-M-yy",
          shortTime: "h-mm a",
        },
        NUMBER_FORMATS: {
          CURRENCY_SYM: "\u20b9",
          DECIMAL_SEP: ".",
          GROUP_SEP: ",",
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
              negPre: "(\u00a4",
              negSuf: ")",
              posPre: "\u00a4",
              posSuf: "",
            },
          },
        },
        id: "mr-in",
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
