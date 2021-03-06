AmCharts.AmFunnelChart = AmCharts.Class({
  inherits: AmCharts.AmSlicedChart,
  construct: function (g) {
    this.type = "funnel";
    AmCharts.AmFunnelChart.base.construct.call(this, g);
    this.cname = "AmFunnelChart";
    this.startX = this.startY = 0;
    this.baseWidth = "100%";
    this.neckHeight = this.neckWidth = 0;
    this.rotate = !1;
    this.valueRepresents = "height";
    this.pullDistance = 30;
    this.labelPosition = "center";
    this.labelText = "[[title]]: [[value]]";
    this.balloonText = "[[title]]: [[value]]\n[[description]]";
    AmCharts.applyTheme(this, g, this.cname);
  },
  drawChart: function () {
    AmCharts.AmFunnelChart.base.drawChart.call(this);
    var g = this.chartData;
    if (AmCharts.ifArray(g))
      if (0 < this.realWidth && 0 < this.realHeight) {
        var d = Math.round(
            this.depth3D * Math.cos((this.angle * Math.PI) / 180)
          ),
          l = Math.round(
            -this.depth3D * Math.sin((this.angle * Math.PI) / 180)
          ),
          b = this.container,
          c = this.startDuration,
          e = this.rotate,
          m = this.updateWidth();
        this.realWidth = m;
        var x = this.updateHeight();
        this.realHeight = x;
        var f = AmCharts.toCoordinate,
          n = f(this.marginLeft, m),
          p = f(this.marginRight, m),
          a = f(this.marginTop, x) + this.getTitleHeight(),
          f = f(this.marginBottom, x);
        0 < d &&
          0 > l &&
          ((this.neckHeight = this.neckWidth = 0),
          e ? (f -= l / 2) : (a -= l / 2));
        var p = m - n - p,
          B = AmCharts.toCoordinate(this.baseWidth, p),
          I = AmCharts.toCoordinate(this.neckWidth, p),
          D = x - f - a,
          E = AmCharts.toCoordinate(this.neckHeight, D),
          y = a + D - E;
        e && ((a = x - f), (y = a - D + E));
        this.firstSliceY = a;
        AmCharts.VML && (this.startAlpha = 1);
        for (
          var z = p / 2 + n,
            F = (D - E) / ((B - I) / 2),
            A = 1,
            q = B / 2,
            B = ((D - E) * (B + I)) / 2 + I * E,
            G = a,
            L = 0,
            E = 0;
          E < g.length;
          E++
        ) {
          var h = g[E],
            r;
          if (!0 !== h.hidden) {
            var u = [],
              w = [],
              k;
            if ("height" == this.valueRepresents) k = (D * h.percents) / 100;
            else {
              var C = (-B * h.percents) / 100 / 2,
                J = q;
              r = -1 / (2 * F);
              k = Math.pow(J, 2) - 4 * r * C;
              0 > k && (k = 0);
              k = (Math.sqrt(k) - J) / (2 * r);
              if ((!e && a >= y) || (e && a <= y)) k = (2 * -C) / I;
              else if ((!e && a + k > y) || (e && a - k < y))
                (r = e
                  ? Math.round(k + (a - k - y))
                  : Math.round(k - (a + k - y))),
                  (k = r / F),
                  (k = r + (2 * (-C - (J - k / 2) * r)) / I);
            }
            C = q - k / F;
            J = !1;
            (!e && a + k > y) || (e && a - k < y)
              ? ((C = I / 2),
                u.push(z - q, z + q, z + C, z + C, z - C, z - C),
                e
                  ? ((r = k + (a - k - y)),
                    a < y && (r = 0),
                    w.push(a, a, a - r, a - k, a - k, a - r, a))
                  : ((r = k - (a + k - y)),
                    a > y && (r = 0),
                    w.push(a, a, a + r, a + k, a + k, a + r, a)),
                (J = !0))
              : (u.push(z - q, z + q, z + C, z - C),
                e ? w.push(a, a, a - k, a - k) : w.push(a, a, a + k, a + k));
            b.set();
            r = b.set();
            0 < d && 0 > l
              ? ((w = C / q),
                (u = -1),
                e || (u = 1),
                isNaN(A) && (A = 0),
                (u = new AmCharts.Cuboid(
                  b,
                  2 * q,
                  u * k,
                  d,
                  l * A,
                  h.color,
                  h.alpha,
                  this.outlineThickness,
                  this.outlineColor,
                  this.outlineAlpha,
                  90,
                  0,
                  !1,
                  0,
                  h.pattern,
                  w
                ).set),
                u.translate(z - q, a - (l / 2) * A),
                (A *= w))
              : (u = AmCharts.polygon(
                  b,
                  u,
                  w,
                  h.color,
                  h.alpha,
                  this.outlineThickness,
                  this.outlineColor,
                  this.outlineAlpha
                ));
            AmCharts.setCN(this, r, "funnel-item");
            AmCharts.setCN(this, u, "funnel-slice");
            AmCharts.setCN(this, r, h.className, !0);
            r.push(u);
            this.graphsSet.push(r);
            e || r.toBack();
            h.wedge = r;
            h.index = E;
            if ((w = this.gradientRatio)) {
              var v = [],
                t;
              for (t = 0; t < w.length; t++)
                v.push(AmCharts.adjustLuminosity(h.color, w[t]));
              0 < v.length && u.gradient("linearGradient", v);
              h.pattern && u.pattern(h.pattern);
            }
            0 < c &&
              (this.chartCreated || r.setAttr("opacity", this.startAlpha));
            this.addEventListeners(r, h);
            h.ty0 = a - k / 2;
            if (
              this.labelsEnabled &&
              this.labelText &&
              h.percents >= this.hideLabelsPercent
            ) {
              v = this.formatString(this.labelText, h);
              (u = this.labelFunction) && (v = u(h, v));
              t = h.labelColor;
              t || (t = this.color);
              var w = this.labelPosition,
                H = "left";
              "center" == w && (H = "middle");
              "left" == w && (H = "right");
              u = void 0;
              "" != v &&
                ((u = AmCharts.wrappedText(
                  b,
                  v,
                  t,
                  this.fontFamily,
                  this.fontSize,
                  H,
                  !1,
                  this.maxLabelWidth
                )),
                AmCharts.setCN(this, u, "funnel-label"),
                AmCharts.setCN(this, u, h.className, !0),
                (u.node.style.pointerEvents = "none"),
                r.push(u),
                (v = z),
                e
                  ? ((t = a - k / 2), (h.ty0 = t))
                  : ((t = a + k / 2),
                    (h.ty0 = t),
                    t < G + L + 5 && (t = G + L + 5),
                    t > x - f && (t = x - f)),
                "right" == w &&
                  ((v = p + 10 + n),
                  (h.tx0 = z + (q - k / 2 / F)),
                  J && (h.tx0 = z + C)),
                "left" == w &&
                  ((h.tx0 = z - (q - k / 2 / F)),
                  J && (h.tx0 = z - C),
                  (v = n)),
                (h.label = u),
                (h.labelX = v),
                (h.labelY = t),
                (h.labelHeight = u.getBBox().height),
                u.translate(v, t),
                (q = u.getBBox()),
                (G = AmCharts.rect(
                  b,
                  q.width + 5,
                  q.height + 5,
                  "#ffffff",
                  0.005
                )),
                G.translate(v + q.x, t + q.y),
                r.push(G),
                (h.hitRect = G),
                (L = u.getBBox().height),
                (G = t));
            }
            (0 === h.alpha || (0 < c && !this.chartCreated)) && r.hide();
            a = e ? a - k : a + k;
            q = C;
            h.startX = AmCharts.toCoordinate(this.startX, m);
            h.startY = AmCharts.toCoordinate(this.startY, x);
            h.pullX = AmCharts.toCoordinate(this.pullDistance, m);
            h.pullY = 0;
            h.balloonX = z;
            h.balloonY = h.ty0;
          }
        }
        this.arrangeLabels();
        this.initialStart();
        (g = this.legend) && g.invalidateSize();
      } else this.cleanChart();
    this.dispDUpd();
    this.chartCreated = !0;
  },
  arrangeLabels: function () {
    var g = this.rotate,
      d;
    d = g ? 0 : this.realHeight;
    for (var l = 0, b = this.chartData, c = b.length, e, m = 0; m < c; m++) {
      e = b[c - m - 1];
      var x = e.label,
        f = e.labelY,
        n = e.labelX,
        p = e.labelHeight,
        a = f;
      g ? d + l + 5 > f && (a = d + l + 5) : f + p + 5 > d && (a = d - 5 - p);
      d = a;
      l = p;
      if (x) {
        x.translate(n, a);
        var B = x.getBBox();
      }
      e.hitRect && e.hitRect.translate(n + B.x, a + B.y);
      e.labelY = a;
      e.tx = n;
      e.ty = a;
      e.tx2 = n;
    }
    "center" != this.labelPosition && this.drawTicks();
  },
});
AmCharts.Cuboid = AmCharts.Class({
  construct: function (g, d, l, b, c, e, m, x, f, n, p, a, B, I, D, E, y) {
    this.set = g.set();
    this.container = g;
    this.h = Math.round(l);
    this.w = Math.round(d);
    this.dx = b;
    this.dy = c;
    this.colors = e;
    this.alpha = m;
    this.bwidth = x;
    this.bcolor = f;
    this.balpha = n;
    this.dashLength = I;
    this.topRadius = E;
    this.pattern = D;
    this.rotate = B;
    this.bcn = y;
    B ? 0 > d && 0 === p && (p = 180) : 0 > l && 270 == p && (p = 90);
    this.gradientRotation = p;
    0 === b && 0 === c && (this.cornerRadius = a);
    this.draw();
  },
  draw: function () {
    var g = this.set;
    g.clear();
    var d = this.container,
      l = d.chart,
      b = this.w,
      c = this.h,
      e = this.dx,
      m = this.dy,
      x = this.colors,
      f = this.alpha,
      n = this.bwidth,
      p = this.bcolor,
      a = this.balpha,
      B = this.gradientRotation,
      I = this.cornerRadius,
      D = this.dashLength,
      E = this.pattern,
      y = this.topRadius,
      z = this.bcn,
      F = x,
      A = x;
    "object" == typeof x && ((F = x[0]), (A = x[x.length - 1]));
    var q,
      G,
      L,
      h,
      r,
      u,
      w,
      k,
      C,
      J = f;
    E && (f = 0);
    var v,
      t,
      H,
      K,
      M = this.rotate;
    if (0 < Math.abs(e) || 0 < Math.abs(m))
      if (isNaN(y))
        (w = A),
          (A = AmCharts.adjustLuminosity(F, -0.2)),
          (A = AmCharts.adjustLuminosity(F, -0.2)),
          (q = AmCharts.polygon(
            d,
            [0, e, b + e, b, 0],
            [0, m, m, 0, 0],
            A,
            f,
            1,
            p,
            0,
            B
          )),
          0 < a && (C = AmCharts.line(d, [0, e, b + e], [0, m, m], p, a, n, D)),
          (G = AmCharts.polygon(
            d,
            [0, 0, b, b, 0],
            [0, c, c, 0, 0],
            A,
            f,
            1,
            p,
            0,
            B
          )),
          G.translate(e, m),
          0 < a && (L = AmCharts.line(d, [e, e], [m, m + c], p, a, n, D)),
          (h = AmCharts.polygon(
            d,
            [0, 0, e, e, 0],
            [0, c, c + m, m, 0],
            A,
            f,
            1,
            p,
            0,
            B
          )),
          (r = AmCharts.polygon(
            d,
            [b, b, b + e, b + e, b],
            [0, c, c + m, m, 0],
            A,
            f,
            1,
            p,
            0,
            B
          )),
          0 < a &&
            (u = AmCharts.line(
              d,
              [b, b + e, b + e, b],
              [0, m, c + m, c],
              p,
              a,
              n,
              D
            )),
          (A = AmCharts.adjustLuminosity(w, 0.2)),
          (w = AmCharts.polygon(
            d,
            [0, e, b + e, b, 0],
            [c, c + m, c + m, c, c],
            A,
            f,
            1,
            p,
            0,
            B
          )),
          0 < a &&
            (k = AmCharts.line(
              d,
              [0, e, b + e],
              [c, c + m, c + m],
              p,
              a,
              n,
              D
            ));
      else {
        var N, O, P;
        M
          ? ((N = c / 2),
            (A = e / 2),
            (P = c / 2),
            (O = b + e / 2),
            (t = Math.abs(c / 2)),
            (v = Math.abs(e / 2)))
          : ((A = b / 2),
            (N = m / 2),
            (O = b / 2),
            (P = c + m / 2 + 1),
            (v = Math.abs(b / 2)),
            (t = Math.abs(m / 2)));
        H = v * y;
        K = t * y;
        0.1 < v &&
          0.1 < v &&
          ((q = AmCharts.circle(d, v, F, f, n, p, a, !1, t)),
          q.translate(A, N));
        0.1 < H &&
          0.1 < H &&
          ((w = AmCharts.circle(
            d,
            H,
            AmCharts.adjustLuminosity(F, 0.5),
            f,
            n,
            p,
            a,
            !1,
            K
          )),
          w.translate(O, P));
      }
    f = J;
    1 > Math.abs(c) && (c = 0);
    1 > Math.abs(b) && (b = 0);
    !isNaN(y) && (0 < Math.abs(e) || 0 < Math.abs(m))
      ? ((x = [F]),
        (x = {
          fill: x,
          stroke: p,
          "stroke-width": n,
          "stroke-opacity": a,
          "fill-opacity": f,
        }),
        M
          ? ((f = "M0,0 L" + b + "," + (c / 2 - (c / 2) * y)),
            (n = " B"),
            0 < b && (n = " A"),
            AmCharts.VML
              ? ((f +=
                  n +
                  Math.round(b - H) +
                  "," +
                  Math.round(c / 2 - K) +
                  "," +
                  Math.round(b + H) +
                  "," +
                  Math.round(c / 2 + K) +
                  "," +
                  b +
                  ",0," +
                  b +
                  "," +
                  c),
                (f =
                  f +
                  (" L0," + c) +
                  (n +
                    Math.round(-v) +
                    "," +
                    Math.round(c / 2 - t) +
                    "," +
                    Math.round(v) +
                    "," +
                    Math.round(c / 2 + t) +
                    ",0," +
                    c +
                    ",0,0")))
              : ((f +=
                  "A" +
                  H +
                  "," +
                  K +
                  ",0,0,0," +
                  b +
                  "," +
                  (c - (c / 2) * (1 - y)) +
                  "L0," +
                  c),
                (f += "A" + v + "," + t + ",0,0,1,0,0")),
            (v = 90))
          : ((n = b / 2 - (b / 2) * y),
            (f = "M0,0 L" + n + "," + c),
            AmCharts.VML
              ? ((f = "M0,0 L" + n + "," + c),
                (n = " B"),
                0 > c && (n = " A"),
                (f +=
                  n +
                  Math.round(b / 2 - H) +
                  "," +
                  Math.round(c - K) +
                  "," +
                  Math.round(b / 2 + H) +
                  "," +
                  Math.round(c + K) +
                  ",0," +
                  c +
                  "," +
                  b +
                  "," +
                  c),
                (f += " L" + b + ",0"),
                (f +=
                  n +
                  Math.round(b / 2 + v) +
                  "," +
                  Math.round(t) +
                  "," +
                  Math.round(b / 2 - v) +
                  "," +
                  Math.round(-t) +
                  "," +
                  b +
                  ",0,0,0"))
              : ((f +=
                  "A" +
                  H +
                  "," +
                  K +
                  ",0,0,0," +
                  (b - (b / 2) * (1 - y)) +
                  "," +
                  c +
                  "L" +
                  b +
                  ",0"),
                (f += "A" + v + "," + t + ",0,0,1,0,0")),
            (v = 180)),
        (d = d.path(f).attr(x)),
        d.gradient(
          "linearGradient",
          [
            F,
            AmCharts.adjustLuminosity(F, -0.3),
            AmCharts.adjustLuminosity(F, -0.3),
            F,
          ],
          v
        ),
        M ? d.translate(e / 2, 0) : d.translate(0, m / 2))
      : (d =
          0 === c
            ? AmCharts.line(d, [0, b], [0, 0], p, a, n, D)
            : 0 === b
            ? AmCharts.line(d, [0, 0], [0, c], p, a, n, D)
            : 0 < I
            ? AmCharts.rect(d, b, c, x, f, n, p, a, I, B, D)
            : AmCharts.polygon(
                d,
                [0, 0, b, b, 0],
                [0, c, c, 0, 0],
                x,
                f,
                n,
                p,
                a,
                B,
                !1,
                D
              ));
    b = isNaN(y)
      ? 0 > c
        ? [q, C, G, L, h, r, u, w, k, d]
        : [w, k, G, L, h, r, q, C, u, d]
      : M
      ? 0 < b
        ? [q, d, w]
        : [w, d, q]
      : 0 > c
      ? [q, d, w]
      : [w, d, q];
    AmCharts.setCN(l, d, z + "front");
    AmCharts.setCN(l, G, z + "back");
    AmCharts.setCN(l, w, z + "top");
    AmCharts.setCN(l, q, z + "bottom");
    AmCharts.setCN(l, h, z + "left");
    AmCharts.setCN(l, r, z + "right");
    for (q = 0; q < b.length; q++)
      if ((G = b[q])) g.push(G), AmCharts.setCN(l, G, z + "element");
    E && d.pattern(E);
  },
  width: function (g) {
    isNaN(g) && (g = 0);
    this.w = Math.round(g);
    this.draw();
  },
  height: function (g) {
    isNaN(g) && (g = 0);
    this.h = Math.round(g);
    this.draw();
  },
  animateHeight: function (g, d) {
    var l = this;
    l.easing = d;
    l.totalFrames = Math.round((1e3 * g) / AmCharts.updateRate);
    l.rh = l.h;
    l.frame = 0;
    l.height(1);
    setTimeout(function () {
      l.updateHeight.call(l);
    }, AmCharts.updateRate);
  },
  updateHeight: function () {
    var g = this;
    g.frame++;
    var d = g.totalFrames;
    g.frame <= d &&
      ((d = g.easing(0, g.frame, 1, g.rh - 1, d)),
      g.height(d),
      setTimeout(function () {
        g.updateHeight.call(g);
      }, AmCharts.updateRate));
  },
  animateWidth: function (g, d) {
    var l = this;
    l.easing = d;
    l.totalFrames = Math.round((1e3 * g) / AmCharts.updateRate);
    l.rw = l.w;
    l.frame = 0;
    l.width(1);
    setTimeout(function () {
      l.updateWidth.call(l);
    }, AmCharts.updateRate);
  },
  updateWidth: function () {
    var g = this;
    g.frame++;
    var d = g.totalFrames;
    g.frame <= d &&
      ((d = g.easing(0, g.frame, 1, g.rw - 1, d)),
      g.width(d),
      setTimeout(function () {
        g.updateWidth.call(g);
      }, AmCharts.updateRate));
  },
});
