ace.define(
  "ace/ext/modelist",
  ["require", "exports", "module"],
  function (e, t, n) {
    function i(e) {
      var t = a.text,
        n = e.split(/[\/\\]/).pop();
      for (var i = 0; i < r.length; i++)
        if (r[i].supportsFile(n)) {
          t = r[i];
          break;
        }
      return t;
    }
    var r = [],
      s = function (e, t, n) {
        (this.name = e),
          (this.caption = t),
          (this.mode = "ace/mode/" + e),
          (this.extensions = n);
        if (/\^/.test(n))
          var r =
            n.replace(/\|(\^)?/g, function (e, t) {
              return "$|" + (t ? "^" : "^.*\\.");
            }) + "$";
        else var r = "^.*\\.(" + n + ")$";
        this.extRe = new RegExp(r, "gi");
      };
    s.prototype.supportsFile = function (e) {
      return e.match(this.extRe);
    };
    var o = {
        ABAP: ["abap"],
        ADA: ["ada|adb"],
        ActionScript: ["as"],
        AsciiDoc: ["asciidoc"],
        Assembly_x86: ["asm"],
        AutoHotKey: ["ahk"],
        BatchFile: ["bat|cmd"],
        C9Search: ["c9search_results"],
        C_Cpp: ["c|cc|cpp|cxx|h|hh|hpp"],
        Clojure: ["clj"],
        Cobol: ["^CBL|COB"],
        coffee: ["^Cakefile|coffee|cf|cson"],
        ColdFusion: ["cfm"],
        CSharp: ["cs"],
        CSS: ["css"],
        Curly: ["curly"],
        D: ["d|di"],
        Dart: ["dart"],
        Diff: ["diff|patch"],
        Dot: ["dot"],
        Erlang: ["erl|hrl"],
        EJS: ["ejs"],
        Forth: ["frt|fs|ldr"],
        FreeMarker: ["ftl"],
        Glsl: ["glsl|frag|vert"],
        golang: ["go"],
        Groovy: ["groovy"],
        HAML: ["haml"],
        Haskell: ["hs"],
        haXe: ["hx"],
        HTML: ["htm|html|xhtml"],
        HTML_Ruby: ["erb|rhtml|html.erb"],
        Ini: ["Ini|conf"],
        Jade: ["jade"],
        Java: ["java"],
        JavaScript: ["js"],
        JSON: ["json"],
        JSONiq: ["jq"],
        JSP: ["jsp"],
        JSX: ["jsx"],
        Julia: ["jl"],
        LaTeX: ["latex|tex|ltx|bib"],
        LESS: ["less"],
        Liquid: ["liquid"],
        Lisp: ["lisp"],
        LiveScript: ["ls"],
        LogiQL: ["logic|lql"],
        LSL: ["lsl"],
        Lua: ["lua"],
        LuaPage: ["lp"],
        Lucene: ["lucene"],
        Makefile: ["^GNUmakefile|^makefile|^Makefile|^OCamlMakefile|make"],
        MATLAB: ["matlab"],
        Markdown: ["md|markdown"],
        MySQL: ["mysql"],
        MUSHCode: ["mc|mush"],
        ObjectiveC: ["m|mm"],
        OCaml: ["ml|mli"],
        Pascal: ["pas|p"],
        Perl: ["pl|pm"],
        pgSQL: ["pgsql"],
        PHP: ["php|phtml"],
        Powershell: ["ps1"],
        Prolog: ["plg|prolog"],
        Properties: ["properties"],
        Python: ["py"],
        R: ["r"],
        RDoc: ["Rd"],
        RHTML: ["Rhtml"],
        Ruby: ["ru|gemspec|rake|rb"],
        Rust: ["rs"],
        SASS: ["sass"],
        SCAD: ["scad"],
        Scala: ["scala"],
        Scheme: ["scm|rkt"],
        SCSS: ["scss"],
        SH: ["sh|bash"],
        snippets: ["snippets"],
        SQL: ["sql"],
        Stylus: ["styl|stylus"],
        SVG: ["svg"],
        Tcl: ["tcl"],
        Tex: ["tex"],
        Text: ["txt"],
        Textile: ["textile"],
        Toml: ["toml"],
        Twig: ["twig"],
        Typescript: ["typescript|ts|str"],
        VBScript: ["vbs"],
        Velocity: ["vm"],
        XML: ["xml|rdf|rss|wsdl|xslt|atom|mathml|mml|xul|xbl"],
        XQuery: ["xq"],
        YAML: ["yaml"],
      },
      u = {
        ObjectiveC: "Objective-C",
        CSharp: "C#",
        golang: "Go",
        C_Cpp: "C/C++",
        coffee: "CoffeeScript",
        HTML_Ruby: "HTML (Ruby)",
      },
      a = {};
    for (var f in o) {
      var l = o[f],
        c = u[f] || f,
        h = f.toLowerCase(),
        p = new s(h, c, l[0]);
      (a[h] = p), r.push(p);
    }
    n.exports = { getModeForPath: i, modes: r, modesByName: a };
  }
);
