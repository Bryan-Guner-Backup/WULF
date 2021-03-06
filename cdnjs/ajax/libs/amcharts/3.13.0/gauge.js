AmCharts.GaugeAxis = AmCharts.Class({
  construct: function (a) {
    this.cname = "GaugeAxis";
    this.radius = "95%";
    this.labelsEnabled = !0;
    this.startAngle = -120;
    this.endAngle = 120;
    this.startValue = 0;
    this.endValue = 200;
    this.gridCount = 5;
    this.tickLength = 10;
    this.minorTickLength = 5;
    this.tickColor = "#555555";
    this.labelFrequency = this.tickThickness = this.tickAlpha = 1;
    this.inside = !0;
    this.labelOffset = 10;
    this.showLastLabel = this.showFirstLabel = !0;
    this.axisThickness = 1;
    this.axisColor = "#000000";
    this.axisAlpha = 1;
    this.gridInside = !0;
    this.topTextYOffset = 0;
    this.topTextBold = !0;
    this.bottomTextYOffset = 0;
    this.bottomTextBold = !0;
    this.centerY = this.centerX = "0%";
    this.bandOutlineAlpha = this.bandOutlineThickness = 0;
    this.bandOutlineColor = "#000000";
    this.bandAlpha = 1;
    this.bcn = "gauge-axis";
    AmCharts.applyTheme(this, a, "GaugeAxis");
  },
  value2angle: function (a) {
    return (
      ((a - this.startValue) / (this.endValue - this.startValue)) *
        (this.endAngle - this.startAngle) +
      this.startAngle
    );
  },
  setTopText: function (a) {
    if (void 0 !== a) {
      this.topText = a;
      var b = this.chart;
      if (this.axisCreated) {
        this.topTF && this.topTF.remove();
        var d = this.topTextFontSize;
        d || (d = b.fontSize);
        var c = this.topTextColor;
        c || (c = b.color);
        a = AmCharts.text(
          b.container,
          a,
          c,
          b.fontFamily,
          d,
          void 0,
          this.topTextBold
        );
        AmCharts.setCN(b, a, "axis-top-label");
        a.translate(
          this.centerXReal,
          this.centerYReal - this.radiusReal / 2 + this.topTextYOffset
        );
        this.set.push(a);
        this.topTF = a;
      }
    }
  },
  setBottomText: function (a) {
    if (void 0 !== a) {
      this.bottomText = a;
      var b = this.chart;
      if (this.axisCreated) {
        this.bottomTF && this.bottomTF.remove();
        var d = this.bottomTextFontSize;
        d || (d = b.fontSize);
        var c = this.bottomTextColor;
        c || (c = b.color);
        a = AmCharts.text(
          b.container,
          a,
          c,
          b.fontFamily,
          d,
          void 0,
          this.bottomTextBold
        );
        AmCharts.setCN(b, a, "axis-bottom-label");
        a.translate(
          this.centerXReal,
          this.centerYReal + this.radiusReal / 2 + this.bottomTextYOffset
        );
        this.bottomTF = a;
        this.set.push(a);
      }
    }
  },
  draw: function () {
    var a = this.chart,
      b = a.container.set();
    this.set = b;
    AmCharts.setCN(a, b, this.bcn);
    AmCharts.setCN(a, b, this.bcn + "-" + this.id);
    a.graphsSet.push(b);
    var d = this.startValue,
      c = this.endValue,
      f = this.valueInterval;
    isNaN(f) && (f = (c - d) / this.gridCount);
    var l = this.minorTickInterval;
    isNaN(l) && (l = f / 5);
    var u = this.startAngle,
      h = this.endAngle,
      g = this.tickLength,
      c = (c - d) / f + 1,
      v = (h - u) / (c - 1),
      e = v / f;
    this.singleValueAngle = e;
    var n = a.container,
      F = this.tickColor,
      D = this.tickAlpha,
      L = this.tickThickness,
      l = f / l,
      M = v / l,
      G = this.minorTickLength,
      H = this.labelFrequency,
      x = this.radiusReal;
    this.inside || (x -= 15);
    var A = a.centerX + AmCharts.toCoordinate(this.centerX, a.realWidth),
      B = a.centerY + AmCharts.toCoordinate(this.centerY, a.realHeight);
    this.centerXReal = A;
    this.centerYReal = B;
    var y = {
        fill: this.axisColor,
        "fill-opacity": this.axisAlpha,
        "stroke-width": 0,
        "stroke-opacity": 0,
      },
      q,
      E;
    this.gridInside ? (E = q = x) : ((q = x - g), (E = q + G));
    var r = this.bands;
    if (r)
      for (var p = 0; p < r.length; p++) {
        var m = r[p];
        if (m) {
          var w = m.startValue,
            z = m.endValue,
            k = AmCharts.toCoordinate(m.radius, x);
          isNaN(k) && (k = E);
          var t = AmCharts.toCoordinate(m.innerRadius, x);
          isNaN(t) && (t = k - G);
          var I = u + e * (w - this.startValue),
            z = e * (z - w),
            C = m.outlineColor;
          void 0 == C && (C = this.bandOutlineColor);
          var J = m.outlineThickness;
          isNaN(J) && (J = this.bandOutlineThickness);
          var K = m.outlineAlpha;
          isNaN(K) && (K = this.bandOutlineAlpha);
          w = m.alpha;
          isNaN(w) && (w = this.bandAlpha);
          k = AmCharts.wedge(n, A, B, I, z, k, k, t, 0, {
            fill: m.color,
            stroke: C,
            "stroke-width": J,
            "stroke-opacity": K,
          });
          AmCharts.setCN(a, k.wedge, "axis-band");
          void 0 != m.id && AmCharts.setCN(a, k.wedge, "axis-band-" + m.id);
          k.setAttr("opacity", w);
          this.set.push(k);
          this.addEventListeners(k, m);
        }
      }
    e = this.axisThickness / 2;
    h = AmCharts.wedge(n, A, B, u, h - u, q + e, q + e, q - e, 0, y);
    AmCharts.setCN(a, h.wedge, "axis-line");
    b.push(h);
    h = AmCharts.doNothing;
    AmCharts.isModern || (h = Math.round);
    f = AmCharts.roundTo(f, 14);
    e = AmCharts.getDecimals(f);
    for (y = 0; y < c; y++)
      if (
        ((r = d + y * f),
        (q = u + y * v),
        (p = h(A + x * Math.sin((q / 180) * Math.PI))),
        (m = h(B - x * Math.cos((q / 180) * Math.PI))),
        (k = h(A + (x - g) * Math.sin((q / 180) * Math.PI))),
        (t = h(B - (x - g) * Math.cos((q / 180) * Math.PI))),
        (p = AmCharts.line(n, [p, k], [m, t], F, D, L, 0, !1, !1, !0)),
        AmCharts.setCN(a, p, "axis-tick"),
        b.push(p),
        (p = -1),
        (k = this.labelOffset),
        this.inside || ((k = -k - g), (p = 1)),
        (m = Math.sin((q / 180) * Math.PI)),
        (t = Math.cos((q / 180) * Math.PI)),
        (m = A + (x - g - k) * m),
        (k = B - (x - g - k) * t),
        (w = this.fontSize),
        isNaN(w) && (w = a.fontSize),
        (t = Math.sin(((q - 90) / 180) * Math.PI)),
        (I = Math.cos(((q - 90) / 180) * Math.PI)),
        0 < H &&
          this.labelsEnabled &&
          y / H == Math.round(y / H) &&
          (this.showLastLabel || y != c - 1) &&
          (this.showFirstLabel || 0 !== y) &&
          ((z = this.usePrefixes
            ? AmCharts.addPrefix(
                r,
                a.prefixesOfBigNumbers,
                a.prefixesOfSmallNumbers,
                a.nf,
                !0
              )
            : AmCharts.formatNumber(r, a.nf, e)),
          (C = this.unit) && (z = "left" == this.unitPosition ? C + z : z + C),
          (C = this.labelFunction) && (z = C(r)),
          (r = AmCharts.text(n, z, a.color, a.fontFamily, w)),
          AmCharts.setCN(a, r, "axis-label"),
          (w = r.getBBox()),
          r.translate(
            m + ((p * w.width) / 2) * I,
            k + ((p * w.height) / 2) * t
          ),
          b.push(r)),
        y < c - 1)
      )
        for (r = 1; r < l; r++)
          (t = q + M * r),
            (p = h(A + E * Math.sin((t / 180) * Math.PI))),
            (m = h(B - E * Math.cos((t / 180) * Math.PI))),
            (k = h(A + (E - G) * Math.sin((t / 180) * Math.PI))),
            (t = h(B - (E - G) * Math.cos((t / 180) * Math.PI))),
            (p = AmCharts.line(n, [p, k], [m, t], F, D, L, 0, !1, !1, !0)),
            AmCharts.setCN(a, p, "axis-tick-minor"),
            b.push(p);
    this.axisCreated = !0;
    this.setTopText(this.topText);
    this.setBottomText(this.bottomText);
    a = a.graphsSet.getBBox();
    this.width = a.width;
    this.height = a.height;
  },
  addEventListeners: function (a, b) {
    var d = this.chart;
    a.mouseover(function (a) {
      d.showBalloon(b.balloonText, b.color, !0);
    }).mouseout(function (a) {
      d.hideBalloon();
    });
  },
});
AmCharts.GaugeArrow = AmCharts.Class({
  construct: function (a) {
    this.cname = "GaugeArrow";
    this.color = "#000000";
    this.nailAlpha = this.alpha = 1;
    this.startWidth = this.nailRadius = 8;
    this.endWidth = 0;
    this.borderAlpha = 1;
    this.radius = "90%";
    this.nailBorderAlpha = this.innerRadius = 0;
    this.nailBorderThickness = 1;
    this.frame = 0;
    AmCharts.applyTheme(this, a, "GaugeArrow");
  },
  setValue: function (a) {
    var b = this.chart;
    b
      ? b.setValue
        ? b.setValue(this, a)
        : (this.previousValue = this.value = a)
      : (this.previousValue = this.value = a);
  },
});
AmCharts.GaugeBand = AmCharts.Class({
  construct: function () {
    this.cname = "GaugeBand";
  },
});
AmCharts.AmAngularGauge = AmCharts.Class({
  inherits: AmCharts.AmChart,
  construct: function (a) {
    this.cname = "AmAngularGauge";
    AmCharts.AmAngularGauge.base.construct.call(this, a);
    this.theme = a;
    this.type = "gauge";
    this.minRadius =
      this.marginRight =
      this.marginBottom =
      this.marginTop =
      this.marginLeft =
        10;
    this.faceColor = "#FAFAFA";
    this.faceAlpha = 0;
    this.faceBorderWidth = 1;
    this.faceBorderColor = "#555555";
    this.faceBorderAlpha = 0;
    this.arrows = [];
    this.axes = [];
    this.startDuration = 1;
    this.startEffect = "easeOutSine";
    this.adjustSize = !0;
    this.extraHeight = this.extraWidth = 0;
    AmCharts.applyTheme(this, a, this.cname);
  },
  addAxis: function (a) {
    this.axes.push(a);
  },
  formatString: function (a, b) {
    return (a = AmCharts.formatValue(
      a,
      b,
      ["value"],
      this.nf,
      "",
      this.usePrefixes,
      this.prefixesOfSmallNumbers,
      this.prefixesOfBigNumbers
    ));
  },
  initChart: function () {
    AmCharts.AmAngularGauge.base.initChart.call(this);
    var a;
    0 === this.axes.length &&
      ((a = new AmCharts.GaugeAxis(this.theme)), this.addAxis(a));
    var b;
    for (b = 0; b < this.axes.length; b++)
      (a = this.axes[b]),
        (a = AmCharts.processObject(a, AmCharts.GaugeAxis, this.theme)),
        a.id || (a.id = "axisAuto" + b + "_" + new Date().getTime()),
        (a.chart = this),
        (this.axes[b] = a);
    var d = this.arrows;
    for (b = 0; b < d.length; b++) {
      a = d[b];
      a = AmCharts.processObject(a, AmCharts.GaugeArrow, this.theme);
      a.id || (a.id = "arrowAuto" + b + "_" + new Date().getTime());
      a.chart = this;
      d[b] = a;
      var c = a.axis;
      AmCharts.isString(c) && (a.axis = AmCharts.getObjById(this.axes, c));
      a.axis || (a.axis = this.axes[0]);
      isNaN(a.value) && a.setValue(a.axis.startValue);
      isNaN(a.previousValue) && (a.previousValue = a.axis.startValue);
    }
    this.setLegendData(d);
    this.drawChart();
    this.totalFrames = (1e3 * this.startDuration) / AmCharts.updateRate;
  },
  drawChart: function () {
    AmCharts.AmAngularGauge.base.drawChart.call(this);
    var a = this.container,
      b = this.updateWidth();
    this.realWidth = b;
    var d = this.updateHeight();
    this.realHeight = d;
    var c = AmCharts.toCoordinate,
      f = c(this.marginLeft, b),
      l = c(this.marginRight, b),
      u = c(this.marginTop, d) + this.getTitleHeight(),
      h = c(this.marginBottom, d),
      g = c(this.radius, b, d),
      c = b - f - l,
      v = d - u - h + this.extraHeight;
    g || (g = Math.min(c, v) / 2);
    g < this.minRadius && (g = this.minRadius);
    this.radiusReal = g;
    this.centerX = (b - f - l) / 2 + f;
    this.centerY = (d - u - h) / 2 + u + this.extraHeight / 2;
    isNaN(this.gaugeX) || (this.centerX = this.gaugeX);
    isNaN(this.gaugeY) || (this.centerY = this.gaugeY);
    var b = this.faceAlpha,
      d = this.faceBorderAlpha,
      e;
    if (0 < b || 0 < d)
      (e = AmCharts.circle(
        a,
        g,
        this.faceColor,
        b,
        this.faceBorderWidth,
        this.faceBorderColor,
        d,
        !1
      )),
        e.translate(this.centerX, this.centerY),
        e.toBack(),
        (a = this.facePattern) && e.pattern(a);
    for (b = g = a = 0; b < this.axes.length; b++)
      (d = this.axes[b]),
        (f = d.radius),
        (d.radiusReal = AmCharts.toCoordinate(f, this.radiusReal)),
        d.draw(),
        (l = 1),
        -1 !== String(f).indexOf("%") &&
          (l = 1 + (100 - Number(f.substr(0, f.length - 1))) / 100),
        d.width * l > a && (a = d.width * l),
        d.height * l > g && (g = d.height * l);
    (b = this.legend) && b.invalidateSize();
    if (this.adjustSize && !this.chartCreated) {
      e &&
        ((e = e.getBBox()),
        e.width > a && (a = e.width),
        e.height > g && (g = e.height));
      e = 0;
      if (v > g || c > a) e = Math.min(v - g, c - a);
      0 < e &&
        ((this.extraHeight = v - g),
        (this.chartCreated = !0),
        this.validateNow());
    }
    this.dispDUpd();
    this.chartCreated = !0;
  },
  validateSize: function () {
    this.extraHeight = this.extraWidth = 0;
    this.chartCreated = !1;
    AmCharts.AmAngularGauge.base.validateSize.call(this);
  },
  addArrow: function (a) {
    this.arrows.push(a);
  },
  removeArrow: function (a) {
    AmCharts.removeFromArray(this.arrows, a);
    this.validateNow();
  },
  removeAxis: function (a) {
    AmCharts.removeFromArray(this.axes, a);
    this.validateNow();
  },
  drawArrow: function (a, b) {
    a.set && a.set.remove();
    var d = this.container;
    a.set = d.set();
    AmCharts.setCN(this, a.set, "gauge-arrow");
    AmCharts.setCN(this, a.set, "gauge-arrow-" + a.id);
    if (!a.hidden) {
      var c = a.axis,
        f = c.radiusReal,
        l = c.centerXReal,
        u = c.centerYReal,
        h = a.startWidth,
        g = a.endWidth,
        v = AmCharts.toCoordinate(a.innerRadius, c.radiusReal),
        e = AmCharts.toCoordinate(a.radius, c.radiusReal);
      c.inside || (e -= 15);
      var n = a.nailColor;
      n || (n = a.color);
      var F = a.nailColor;
      F || (F = a.color);
      n = AmCharts.circle(
        d,
        a.nailRadius,
        n,
        a.nailAlpha,
        a.nailBorderThickness,
        n,
        a.nailBorderAlpha
      );
      AmCharts.setCN(this, n, "gauge-arrow-nail");
      a.set.push(n);
      n.translate(l, u);
      isNaN(e) && (e = f - c.tickLength);
      var c = Math.sin((b / 180) * Math.PI),
        f = Math.cos((b / 180) * Math.PI),
        n = Math.sin(((b + 90) / 180) * Math.PI),
        D = Math.cos(((b + 90) / 180) * Math.PI),
        d = AmCharts.polygon(
          d,
          [
            l - (h / 2) * n + v * c,
            l + e * c - (g / 2) * n,
            l + e * c + (g / 2) * n,
            l + (h / 2) * n + v * c,
          ],
          [
            u + (h / 2) * D - v * f,
            u - e * f + (g / 2) * D,
            u - e * f - (g / 2) * D,
            u - (h / 2) * D - v * f,
          ],
          a.color,
          a.alpha,
          1,
          F,
          a.borderAlpha,
          void 0,
          !0
        );
      AmCharts.setCN(this, d, "gauge-arrow");
      a.set.push(d);
      this.graphsSet.push(a.set);
    }
  },
  setValue: function (a, b) {
    a.axis &&
      a.axis.value2angle &&
      (a.axis.value2angle(b), (a.frame = 0), (a.previousValue = a.value));
    a.value = b;
    var d = this.legend;
    d && d.updateValues();
  },
  handleLegendEvent: function (a) {
    var b = a.type;
    a = a.dataItem;
    if (!this.legend.data && a)
      switch (b) {
        case "hideItem":
          this.hideArrow(a);
          break;
        case "showItem":
          this.showArrow(a);
      }
  },
  hideArrow: function (a) {
    a.set.hide();
    a.hidden = !0;
  },
  showArrow: function (a) {
    a.set.show();
    a.hidden = !1;
  },
  updateAnimations: function () {
    AmCharts.AmAngularGauge.base.updateAnimations.call(this);
    for (var a = this.arrows.length, b, d = 0; d < a; d++) {
      b = this.arrows[d];
      var c;
      b.frame >= this.totalFrames
        ? (c = b.value)
        : (b.frame++,
          b.clockWiseOnly &&
            b.value < b.previousValue &&
            ((c = b.axis), (b.previousValue -= c.endValue - c.startValue)),
          (c = AmCharts.getEffect(this.startEffect)),
          (c = AmCharts[c](
            0,
            b.frame,
            b.previousValue,
            b.value - b.previousValue,
            this.totalFrames
          )),
          isNaN(c) && (c = b.value));
      c = b.axis.value2angle(c);
      b.drawnAngle != c && (this.drawArrow(b, c), (b.drawnAngle = c));
    }
  },
});
