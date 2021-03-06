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
            "ᎤᏃᎸᏔᏅ",
            "ᎧᎦᎵ",
            "ᎠᏅᏱ",
            "ᎧᏬᏂ",
            "ᎠᏂᏍᎬᏘ",
            "ᏕᎭᎷᏱ",
            "ᎫᏰᏉᏂ",
            "ᎦᎶᏂ",
            "ᏚᎵᏍᏗ",
            "ᏚᏂᏅᏗ",
            "ᏅᏓᏕᏆ",
            "ᎤᏍᎩᏱ",
          ],
          SHORTMONTH: [
            "ᎤᏃ",
            "ᎧᎦ",
            "ᎠᏅ",
            "ᎧᏬ",
            "ᎠᏂ",
            "ᏕᎭ",
            "ᎫᏰ",
            "ᎦᎶ",
            "ᏚᎵ",
            "ᏚᏂ",
            "ᏅᏓ",
            "ᎤᏍ",
          ],
          DAY: [
            "ᎤᎾᏙᏓᏆᏍᎬ",
            "ᎤᎾᏙᏓᏉᏅᎯ",
            "ᏔᎵᏁᎢᎦ",
            "ᏦᎢᏁᎢᎦ",
            "ᏅᎩᏁᎢᎦ",
            "ᏧᎾᎩᎶᏍᏗ",
            "ᎤᎾᏙᏓᏈᏕᎾ",
          ],
          SHORTDAY: ["ᏆᏍᎬ", "ᏉᏅᎯ", "ᏔᎵᏁ", "ᏦᎢᏁ", "ᏅᎩᏁ", "ᏧᎾᎩ", "ᏈᏕᎾ"],
          AMPMS: ["ᏌᎾᎴ", "ᏒᎯᏱᎢᏗᏢ"],
          medium: "MMM d, y h:mm:ss a",
          short: "M/d/yy h:mm a",
          fullDate: "EEEE, MMMM d, y",
          longDate: "MMMM d, y",
          mediumDate: "MMM d, y",
          shortDate: "M/d/yy",
          mediumTime: "h:mm:ss a",
          shortTime: "h:mm a",
        },
        pluralCat: function (n) {
          if (n == 1) {
            return PLURAL_CATEGORY.ONE;
          }
          return PLURAL_CATEGORY.OTHER;
        },
        id: "chr",
      });
    },
  ]
);
