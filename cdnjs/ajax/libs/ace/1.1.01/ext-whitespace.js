ace.define(
  "ace/ext/whitespace",
  ["require", "exports", "module", "ace/lib/lang"],
  function (e, t, n) {
    var r = e("../lib/lang");
    (t.$detectIndentation = function (e, t) {
      function h(e) {
        var t = 0;
        for (var r = e; r < n.length; r += e) t += n[r] || 0;
        return t;
      }
      var n = [],
        r = [],
        i = 0,
        s = 0,
        o = Math.min(e.length, 1e3);
      for (var u = 0; u < o; u++) {
        var a = e[u];
        if (!/^\s*[^*+\-\s]/.test(a)) continue;
        var f = a.match(/^\t*/)[0].length;
        a[0] == "	" && i++;
        var l = a.match(/^ */)[0].length;
        if (l && a[l] != "	") {
          var c = l - s;
          c > 0 && !(s % c) && !(l % c) && (r[c] = (r[c] || 0) + 1),
            (n[l] = (n[l] || 0) + 1);
        }
        s = l;
        while (a[a.length - 1] == "\\") a = e[u++];
      }
      var p = r.reduce(function (e, t) {
          return e + t;
        }, 0),
        d = { score: 0, length: 0 },
        v = 0;
      for (var u = 1; u < 12; u++) {
        if (u == 1) {
          v = h(u);
          var m = 1;
        } else var m = h(u) / v;
        r[u] && (m += r[u] / p), m > d.score && (d = { score: m, length: u });
      }
      if (d.score && d.score > 1.4) var g = d.length;
      if (i > v + 1) return { ch: "	", length: g };
      if (v + 1 > i) return { ch: " ", length: g };
    }),
      (t.detectIndentation = function (e) {
        var n = e.getLines(0, 1e3),
          r = t.$detectIndentation(n) || {};
        return (
          r.ch && e.setUseSoftTabs(r.ch == " "),
          r.length && e.setTabSize(r.length),
          r
        );
      }),
      (t.trimTrailingSpace = function (e) {
        var t = e.getDocument(),
          n = t.getAllLines();
        for (var r = 0, i = n.length; r < i; r++) {
          var s = n[r],
            o = s.search(/\s+$/);
          o !== -1 && t.removeInLine(r, o, s.length);
        }
      }),
      (t.convertIndentation = function (e, t, n) {
        var i = e.getTabString()[0],
          s = e.getTabSize();
        n || (n = s), t || (t = i);
        var o = t == "	" ? t : r.stringRepeat(t, n),
          u = e.doc,
          a = u.getAllLines(),
          f = {},
          l = {};
        for (var c = 0, h = a.length; c < h; c++) {
          var p = a[c],
            d = p.match(/^\s*/)[0];
          if (d) {
            var v = e.$getStringScreenWidth(d)[0],
              m = Math.floor(v / s),
              g = v % s,
              y = f[m] || (f[m] = r.stringRepeat(o, m));
            (y += l[g] || (l[g] = r.stringRepeat(" ", g))),
              y != d &&
                (u.removeInLine(c, 0, d.length),
                u.insertInLine({ row: c, column: 0 }, y));
          }
        }
        e.setTabSize(n), e.setUseSoftTabs(t == " ");
      }),
      (t.$parseStringArg = function (e) {
        var t = {};
        /t/.test(e) ? (t.ch = "	") : /s/.test(e) && (t.ch = " ");
        var n = e.match(/\d+/);
        return n && (t.length = parseInt(n[0])), t;
      }),
      (t.$parseArg = function (e) {
        return e
          ? typeof e == "string"
            ? t.$parseStringArg(e)
            : typeof e.text == "string"
            ? t.$parseStringArg(e.text)
            : e
          : {};
      }),
      (t.commands = [
        {
          name: "detectIndentation",
          exec: function (e) {
            t.detectIndentation(e.session);
          },
        },
        {
          name: "trimTrailingSpace",
          exec: function (e) {
            t.trimTrailingSpace(e.session);
          },
        },
        {
          name: "convertIndentation",
          exec: function (e, n) {
            var r = t.$parseArg(n);
            t.convertIndentation(e.session, n.ch, n.length);
          },
        },
        {
          name: "setIndentation",
          exec: function (e, n) {
            var r = t.$parseArg(n);
            r.length && e.session.setTabSize(r.length),
              r.ch && e.session.setUseSoftTabs(r.ch == " ");
          },
        },
      ]);
  }
);
