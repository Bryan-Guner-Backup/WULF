ace.define(
  "ace/mode/plain_text",
  [
    "require",
    "exports",
    "module",
    "ace/lib/oop",
    "ace/mode/text",
    "ace/tokenizer",
    "ace/mode/text_highlight_rules",
    "ace/mode/behaviour",
  ],
  function (e, t, n) {
    var r = e("../lib/oop"),
      i = e("./text").Mode,
      s = e("../tokenizer").Tokenizer,
      o = e("./text_highlight_rules").TextHighlightRules,
      u = e("./behaviour").Behaviour,
      a = function () {
        (this.HighlightRules = o), (this.$behaviour = new u());
      };
    r.inherits(a, i),
      function () {
        (this.type = "text"),
          (this.getNextLineIndent = function (e, t, n) {
            return "";
          }),
          (this.$id = "ace/mode/plain_text");
      }.call(a.prototype),
      (t.Mode = a);
  }
);
