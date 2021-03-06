AmCharts.AmSerialChart = AmCharts.Class({
  inherits: AmCharts.AmRectangularChart,
  construct: function (a) {
    this.type = "serial";
    AmCharts.AmSerialChart.base.construct.call(this, a);
    this.cname = "AmSerialChart";
    this.theme = a;
    this.createEvents("changed");
    this.columnSpacing = 5;
    this.columnSpacing3D = 0;
    this.columnWidth = 0.8;
    this.updateScrollbar = !0;
    var b = new AmCharts.CategoryAxis(a);
    b.chart = this;
    this.categoryAxis = b;
    this.zoomOutOnDataUpdate = !0;
    this.mouseWheelZoomEnabled =
      this.mouseWheelScrollEnabled =
      this.rotate =
      this.skipZoom =
        !1;
    this.minSelectedTime = 0;
    AmCharts.applyTheme(this, a, this.cname);
  },
  initChart: function () {
    AmCharts.AmSerialChart.base.initChart.call(this);
    this.updateCategoryAxis(this.categoryAxis, this.rotate, "categoryAxis");
    this.dataChanged &&
      (this.updateData(),
      (this.dataChanged = !1),
      (this.dispatchDataUpdated = !0));
    var a = this.chartCursor;
    a && (a.updateData(), a.fullWidth && (a.fullRectSet = this.cursorLineSet));
    var a = this.countColumns(),
      b = this.graphs,
      c;
    for (c = 0; c < b.length; c++) b[c].columnCount = a;
    this.updateScrollbar = !0;
    this.drawChart();
    this.autoMargins &&
      !this.marginsUpdated &&
      ((this.marginsUpdated = !0), this.measureMargins());
    (this.mouseWheelScrollEnabled || this.mouseWheelZoomEnabled) &&
      this.addMouseWheel();
  },
  handleWheelReal: function (a, b) {
    if (!this.wheelBusy) {
      var c = this.categoryAxis,
        d = c.parseDates,
        c = c.minDuration(),
        e = 1;
      this.mouseWheelZoomEnabled ? b || (e = -1) : b && (e = -1);
      0 > a
        ? d
          ? this.endTime < this.lastTime &&
            this.zoomToDates(
              new Date(this.startTime + e * c),
              new Date(this.endTime + 1 * c)
            )
          : this.end < this.chartData.length - 1 &&
            this.zoomToIndexes(this.start + e, this.end + 1)
        : d
        ? this.startTime > this.firstTime &&
          this.zoomToDates(
            new Date(this.startTime - e * c),
            new Date(this.endTime - 1 * c)
          )
        : 0 < this.start && this.zoomToIndexes(this.start - e, this.end - 1);
    }
  },
  validateData: function (a) {
    this.marginsUpdated = !1;
    this.zoomOutOnDataUpdate &&
      !a &&
      (this.endTime = this.end = this.startTime = this.start = NaN);
    AmCharts.AmSerialChart.base.validateData.call(this);
  },
  drawChart: function () {
    AmCharts.AmSerialChart.base.drawChart.call(this);
    var a = this.chartData;
    if (AmCharts.ifArray(a)) {
      var b = this.chartScrollbar;
      b && b.draw();
      if (0 < this.realWidth && 0 < this.realHeight) {
        var a = a.length - 1,
          c,
          b = this.categoryAxis;
        if (b.parseDates && !b.equalSpacing) {
          if (((b = this.startTime), (c = this.endTime), isNaN(b) || isNaN(c)))
            (b = this.firstTime), (c = this.lastTime);
        } else if (((b = this.start), (c = this.end), isNaN(b) || isNaN(c)))
          (b = 0), (c = a);
        this.endTime = this.startTime = this.end = this.start = void 0;
        this.zoom(b, c);
      }
    } else this.cleanChart();
    this.dispDUpd();
    this.chartCreated = !0;
  },
  cleanChart: function () {
    AmCharts.callMethod("destroy", [
      this.valueAxes,
      this.graphs,
      this.categoryAxis,
      this.chartScrollbar,
      this.chartCursor,
    ]);
  },
  updateCategoryAxis: function (a, b, c) {
    a.chart = this;
    a.id = c;
    a.rotate = b;
    a.axisRenderer = AmCharts.RecAxis;
    a.guideFillRenderer = AmCharts.RecFill;
    a.axisItemRenderer = AmCharts.RecItem;
    a.setOrientation(!this.rotate);
    a.x = this.marginLeftReal;
    a.y = this.marginTopReal;
    a.dx = this.dx;
    a.dy = this.dy;
    a.width = this.plotAreaWidth - 1;
    a.height = this.plotAreaHeight - 1;
    a.viW = this.plotAreaWidth - 1;
    a.viH = this.plotAreaHeight - 1;
    a.viX = this.marginLeftReal;
    a.viY = this.marginTopReal;
    a.marginsChanged = !0;
  },
  updateValueAxes: function () {
    AmCharts.AmSerialChart.base.updateValueAxes.call(this);
    var a = this.valueAxes,
      b;
    for (b = 0; b < a.length; b++) {
      var c = a[b],
        d = this.rotate;
      c.rotate = d;
      c.setOrientation(d);
      d = this.categoryAxis;
      if (!d.startOnAxis || d.parseDates) c.expandMinMax = !0;
    }
  },
  updateData: function () {
    this.parseData();
    var a = this.graphs,
      b,
      c = this.chartData;
    for (b = 0; b < a.length; b++) a[b].data = c;
    0 < c.length &&
      ((this.firstTime = this.getStartTime(c[0].time)),
      (this.lastTime = this.getEndTime(c[c.length - 1].time)));
  },
  getStartTime: function (a) {
    var b = this.categoryAxis;
    return AmCharts.resetDateToMin(
      new Date(a),
      b.minPeriod,
      1,
      b.firstDayOfWeek
    ).getTime();
  },
  getEndTime: function (a) {
    var b = AmCharts.extractPeriod(this.categoryAxis.minPeriod);
    return (
      AmCharts.changeDate(new Date(a), b.period, b.count, !0).getTime() - 1
    );
  },
  updateMargins: function () {
    AmCharts.AmSerialChart.base.updateMargins.call(this);
    var a = this.chartScrollbar;
    a &&
      (this.getScrollbarPosition(a, this.rotate, this.categoryAxis.position),
      this.adjustMargins(a, this.rotate));
  },
  updateScrollbars: function () {
    AmCharts.AmSerialChart.base.updateScrollbars.call(this);
    this.updateChartScrollbar(this.chartScrollbar, this.rotate);
  },
  zoom: function (a, b) {
    var c = this.categoryAxis;
    c.parseDates && !c.equalSpacing
      ? this.timeZoom(a, b)
      : this.indexZoom(a, b);
    this.updateLegendValues();
  },
  timeZoom: function (a, b) {
    var c = this.maxSelectedTime;
    isNaN(c) ||
      (b != this.endTime &&
        b - a > c &&
        ((a = b - c), (this.updateScrollbar = !0)),
      a != this.startTime &&
        b - a > c &&
        ((b = a + c), (this.updateScrollbar = !0)));
    var d = this.minSelectedTime;
    if (0 < d && b - a < d) {
      var e = Math.round(a + (b - a) / 2),
        d = Math.round(d / 2);
      a = e - d;
      b = e + d;
    }
    var f = this.chartData,
      e = this.categoryAxis;
    if (AmCharts.ifArray(f) && (a != this.startTime || b != this.endTime)) {
      var l = e.minDuration(),
        d = this.firstTime,
        n = this.lastTime;
      a || ((a = d), isNaN(c) || (a = n - c));
      b || (b = n);
      a > n && (a = n);
      b < d && (b = d);
      a < d && (a = d);
      b > n && (b = n);
      b < a && (b = a + l);
      b - a < l / 5 && (b < n ? (b = a + l / 5) : (a = b - l / 5));
      this.startTime = a;
      this.endTime = b;
      c = f.length - 1;
      l = this.getClosestIndex(f, "time", a, !0, 0, c);
      f = this.getClosestIndex(f, "time", b, !1, l, c);
      e.timeZoom(a, b);
      e.zoom(l, f);
      this.start = AmCharts.fitToBounds(l, 0, c);
      this.end = AmCharts.fitToBounds(f, 0, c);
      this.zoomAxesAndGraphs();
      this.zoomScrollbar();
      a != d || b != n ? this.showZB(!0) : this.showZB(!1);
      this.updateColumnsDepth();
      this.dispatchTimeZoomEvent();
    }
  },
  indexZoom: function (a, b) {
    var c = this.maxSelectedSeries;
    isNaN(c) ||
      (b != this.end && b - a > c && ((a = b - c), (this.updateScrollbar = !0)),
      a != this.start &&
        b - a > c &&
        ((b = a + c), (this.updateScrollbar = !0)));
    if (a != this.start || b != this.end) {
      var d = this.chartData.length - 1;
      isNaN(a) && ((a = 0), isNaN(c) || (a = d - c));
      isNaN(b) && (b = d);
      b < a && (b = a);
      b > d && (b = d);
      a > d && (a = d - 1);
      0 > a && (a = 0);
      this.start = a;
      this.end = b;
      this.categoryAxis.zoom(a, b);
      this.zoomAxesAndGraphs();
      this.zoomScrollbar();
      0 !== a || b != this.chartData.length - 1
        ? this.showZB(!0)
        : this.showZB(!1);
      this.updateColumnsDepth();
      this.dispatchIndexZoomEvent();
    }
  },
  updateGraphs: function () {
    AmCharts.AmSerialChart.base.updateGraphs.call(this);
    var a = this.graphs,
      b;
    for (b = 0; b < a.length; b++) {
      var c = a[b];
      c.columnWidthReal = this.columnWidth;
      c.categoryAxis = this.categoryAxis;
      AmCharts.isString(c.fillToGraph) &&
        (c.fillToGraph = this.getGraphById(c.fillToGraph));
    }
  },
  updateColumnsDepth: function () {
    var a,
      b = this.graphs,
      c;
    AmCharts.remove(this.columnsSet);
    this.columnsArray = [];
    for (a = 0; a < b.length; a++) {
      c = b[a];
      var d = c.columnsArray;
      if (d) {
        var e;
        for (e = 0; e < d.length; e++) this.columnsArray.push(d[e]);
      }
    }
    this.columnsArray.sort(this.compareDepth);
    if (0 < this.columnsArray.length) {
      b = this.container.set();
      this.columnSet.push(b);
      for (a = 0; a < this.columnsArray.length; a++)
        b.push(this.columnsArray[a].column.set);
      c && b.translate(c.x, c.y);
      this.columnsSet = b;
    }
  },
  compareDepth: function (a, b) {
    return a.depth > b.depth ? 1 : -1;
  },
  zoomScrollbar: function () {
    var a = this.chartScrollbar,
      b = this.categoryAxis;
    a &&
      this.updateScrollbar &&
      (b.parseDates && !b.equalSpacing
        ? a.timeZoom(this.startTime, this.endTime)
        : a.zoom(this.start, this.end),
      (this.updateScrollbar = !0));
  },
  updateTrendLines: function () {
    var a = this.trendLines,
      b;
    for (b = 0; b < a.length; b++) {
      var c = a[b],
        c = AmCharts.processObject(c, AmCharts.TrendLine, this.theme);
      a[b] = c;
      c.chart = this;
      AmCharts.isString(c.valueAxis) &&
        (c.valueAxis = this.getValueAxisById(c.valueAxis));
      c.valueAxis || (c.valueAxis = this.valueAxes[0]);
      c.categoryAxis = this.categoryAxis;
    }
  },
  zoomAxesAndGraphs: function () {
    if (!this.scrollbarOnly) {
      var a = this.valueAxes,
        b;
      for (b = 0; b < a.length; b++) a[b].zoom(this.start, this.end);
      a = this.graphs;
      for (b = 0; b < a.length; b++) a[b].zoom(this.start, this.end);
      this.zoomTrendLines();
      (b = this.chartCursor) &&
        b.zoom(this.start, this.end, this.startTime, this.endTime);
    }
  },
  countColumns: function () {
    var a = 0,
      b = this.valueAxes.length,
      c = this.graphs.length,
      d,
      e,
      f = !1,
      l,
      n;
    for (n = 0; n < b; n++) {
      e = this.valueAxes[n];
      var k = e.stackType;
      if ("100%" == k || "regular" == k)
        for (f = !1, l = 0; l < c; l++)
          (d = this.graphs[l]),
            d.hidden ||
              d.valueAxis != e ||
              "column" != d.type ||
              (!f && d.stackable && (a++, (f = !0)),
              ((!d.stackable && d.clustered) || d.newStack) && a++,
              (d.columnIndex = a - 1),
              d.clustered || (d.columnIndex = 0));
      if ("none" == k || "3d" == k)
        for (l = 0; l < c; l++)
          (d = this.graphs[l]),
            !d.hidden &&
              d.valueAxis == e &&
              "column" == d.type &&
              d.clustered &&
              ((d.columnIndex = a), a++);
      if ("3d" == k) {
        for (n = 0; n < c; n++) (d = this.graphs[n]), (d.depthCount = a);
        a = 1;
      }
    }
    return a;
  },
  parseData: function () {
    AmCharts.AmSerialChart.base.parseData.call(this);
    this.parseSerialData();
  },
  getCategoryIndexByValue: function (a) {
    var b = this.chartData,
      c,
      d;
    for (d = 0; d < b.length; d++) b[d].category == a && (c = d);
    return c;
  },
  handleCursorChange: function (a) {
    this.updateLegendValues(a.index);
  },
  handleCursorZoom: function (a) {
    this.updateScrollbar = !0;
    this.zoom(a.start, a.end);
  },
  handleScrollbarZoom: function (a) {
    this.updateScrollbar = !1;
    this.zoom(a.start, a.end);
  },
  dispatchTimeZoomEvent: function () {
    if (
      this.prevStartTime != this.startTime ||
      this.prevEndTime != this.endTime
    ) {
      var a = { type: "zoomed" };
      a.startDate = new Date(this.startTime);
      a.endDate = new Date(this.endTime);
      a.startIndex = this.start;
      a.endIndex = this.end;
      this.startIndex = this.start;
      this.endIndex = this.end;
      this.startDate = a.startDate;
      this.endDate = a.endDate;
      this.prevStartTime = this.startTime;
      this.prevEndTime = this.endTime;
      var b = this.categoryAxis,
        c = AmCharts.extractPeriod(b.minPeriod).period,
        b = b.dateFormatsObject[c];
      a.startValue = AmCharts.formatDate(a.startDate, b);
      a.endValue = AmCharts.formatDate(a.endDate, b);
      a.chart = this;
      a.target = this;
      this.fire(a.type, a);
    }
  },
  dispatchIndexZoomEvent: function () {
    if (this.prevStartIndex != this.start || this.prevEndIndex != this.end) {
      this.startIndex = this.start;
      this.endIndex = this.end;
      var a = this.chartData;
      if (AmCharts.ifArray(a) && !isNaN(this.start) && !isNaN(this.end)) {
        var b = { chart: this, target: this, type: "zoomed" };
        b.startIndex = this.start;
        b.endIndex = this.end;
        b.startValue = a[this.start].category;
        b.endValue = a[this.end].category;
        this.categoryAxis.parseDates &&
          ((this.startTime = a[this.start].time),
          (this.endTime = a[this.end].time),
          (b.startDate = new Date(this.startTime)),
          (b.endDate = new Date(this.endTime)));
        this.prevStartIndex = this.start;
        this.prevEndIndex = this.end;
        this.fire(b.type, b);
      }
    }
  },
  updateLegendValues: function (a) {
    var b = this.graphs,
      c;
    for (c = 0; c < b.length; c++) {
      var d = b[c];
      isNaN(a)
        ? (d.currentDataItem = void 0)
        : (d.currentDataItem =
            this.chartData[a].axes[d.valueAxis.id].graphs[d.id]);
    }
    this.legend && this.legend.updateValues();
  },
  getClosestIndex: function (a, b, c, d, e, f) {
    0 > e && (e = 0);
    f > a.length - 1 && (f = a.length - 1);
    var l = e + Math.round((f - e) / 2),
      n = a[l][b];
    if (1 >= f - e) {
      if (d) return e;
      d = a[f][b];
      return Math.abs(a[e][b] - c) < Math.abs(d - c) ? e : f;
    }
    return c == n
      ? l
      : c < n
      ? this.getClosestIndex(a, b, c, d, e, l)
      : this.getClosestIndex(a, b, c, d, l, f);
  },
  zoomToIndexes: function (a, b) {
    this.updateScrollbar = !0;
    var c = this.chartData;
    if (c) {
      var d = c.length;
      0 < d &&
        (0 > a && (a = 0),
        b > d - 1 && (b = d - 1),
        (d = this.categoryAxis),
        d.parseDates && !d.equalSpacing
          ? this.zoom(c[a].time, this.getEndTime(c[b].time))
          : this.zoom(a, b));
    }
  },
  zoomToDates: function (a, b) {
    this.updateScrollbar = !0;
    var c = this.chartData;
    if (this.categoryAxis.equalSpacing) {
      var d = this.getClosestIndex(c, "time", a.getTime(), !0, 0, c.length);
      b = AmCharts.resetDateToMin(b, this.categoryAxis.minPeriod, 1);
      c = this.getClosestIndex(c, "time", b.getTime(), !1, 0, c.length);
      this.zoom(d, c);
    } else this.zoom(a.getTime(), b.getTime());
  },
  zoomToCategoryValues: function (a, b) {
    this.updateScrollbar = !0;
    this.zoom(this.getCategoryIndexByValue(a), this.getCategoryIndexByValue(b));
  },
  formatPeriodString: function (a, b) {
    if (b) {
      var c = ["value", "open", "low", "high", "close"],
        d = "value open low high close average sum count".split(" "),
        e = b.valueAxis,
        f = this.chartData,
        l = b.numberFormatter;
      l || (l = this.nf);
      for (var n = 0; n < c.length; n++) {
        for (
          var k = c[n],
            g = 0,
            h = 0,
            m,
            u,
            r,
            s,
            p,
            v = 0,
            q = 0,
            x,
            t,
            y,
            w,
            C,
            B = this.start;
          B <= this.end;
          B++
        ) {
          var z = f[B];
          if (z && (z = z.axes[e.id].graphs[b.id])) {
            if (z.values) {
              var A = z.values[k];
              if (!isNaN(A)) {
                isNaN(m) && (m = A);
                u = A;
                if (isNaN(r) || r > A) r = A;
                if (isNaN(s) || s < A) s = A;
                p = AmCharts.getDecimals(g);
                var D = AmCharts.getDecimals(A),
                  g = g + A,
                  g = AmCharts.roundTo(g, Math.max(p, D));
                h++;
                p = g / h;
              }
            }
            if (z.percents && ((z = z.percents[k]), !isNaN(z))) {
              isNaN(x) && (x = z);
              t = z;
              if (isNaN(y) || y > z) y = z;
              if (isNaN(w) || w < z) w = z;
              C = AmCharts.getDecimals(v);
              A = AmCharts.getDecimals(z);
              v += z;
              v = AmCharts.roundTo(v, Math.max(C, A));
              q++;
              C = v / q;
            }
          }
        }
        v = {
          open: x,
          close: t,
          high: w,
          low: y,
          average: C,
          sum: v,
          count: q,
        };
        a = AmCharts.formatValue(
          a,
          { open: m, close: u, high: s, low: r, average: p, sum: g, count: h },
          d,
          l,
          k + "\\.",
          this.usePrefixes,
          this.prefixesOfSmallNumbers,
          this.prefixesOfBigNumbers
        );
        a = AmCharts.formatValue(a, v, d, this.pf, "percents\\." + k + "\\.");
      }
    }
    return a;
  },
  formatString: function (a, b, c) {
    var d = b.graph;
    if (-1 != a.indexOf("[[category]]")) {
      var e = b.serialDataItem.category;
      if (this.categoryAxis.parseDates) {
        var f = this.balloonDateFormat,
          l = this.chartCursor;
        l && (f = l.categoryBalloonDateFormat);
        -1 != a.indexOf("[[category]]") &&
          ((f = AmCharts.formatDate(e, f)),
          -1 != f.indexOf("fff") && (f = AmCharts.formatMilliseconds(f, e)),
          (e = f));
      }
      a = a.replace(/\[\[category\]\]/g, String(e));
    }
    d = d.numberFormatter;
    d || (d = this.nf);
    e = b.graph.valueAxis;
    (f = e.duration) &&
      !isNaN(b.values.value) &&
      ((e = AmCharts.formatDuration(
        b.values.value,
        f,
        "",
        e.durationUnits,
        e.maxInterval,
        d
      )),
      (a = a.replace(RegExp("\\[\\[value\\]\\]", "g"), e)));
    e = "value open low high close total".split(" ");
    f = this.pf;
    a = AmCharts.formatValue(a, b.percents, e, f, "percents\\.");
    a = AmCharts.formatValue(
      a,
      b.values,
      e,
      d,
      "",
      this.usePrefixes,
      this.prefixesOfSmallNumbers,
      this.prefixesOfBigNumbers
    );
    a = AmCharts.formatValue(a, b.values, ["percents"], f);
    -1 != a.indexOf("[[") &&
      (a = AmCharts.formatDataContextValue(a, b.dataContext));
    return (a = AmCharts.AmSerialChart.base.formatString.call(this, a, b, c));
  },
  addChartScrollbar: function (a) {
    AmCharts.callMethod("destroy", [this.chartScrollbar]);
    a &&
      ((a.chart = this), this.listenTo(a, "zoomed", this.handleScrollbarZoom));
    this.rotate
      ? void 0 === a.width && (a.width = a.scrollbarHeight)
      : void 0 === a.height && (a.height = a.scrollbarHeight);
    this.chartScrollbar = a;
  },
  removeChartScrollbar: function () {
    AmCharts.callMethod("destroy", [this.chartScrollbar]);
    this.chartScrollbar = null;
  },
  handleReleaseOutside: function (a) {
    AmCharts.AmSerialChart.base.handleReleaseOutside.call(this, a);
    AmCharts.callMethod("handleReleaseOutside", [this.chartScrollbar]);
  },
});
AmCharts.Cuboid = AmCharts.Class({
  construct: function (a, b, c, d, e, f, l, n, k, g, h, m, u, r, s) {
    this.set = a.set();
    this.container = a;
    this.h = Math.round(c);
    this.w = Math.round(b);
    this.dx = d;
    this.dy = e;
    this.colors = f;
    this.alpha = l;
    this.bwidth = n;
    this.bcolor = k;
    this.balpha = g;
    this.colors = f;
    this.dashLength = r;
    this.pattern = s;
    u ? 0 > b && 0 === h && (h = 180) : 0 > c && 270 == h && (h = 90);
    this.gradientRotation = h;
    0 === d && 0 === e && (this.cornerRadius = m);
    this.draw();
  },
  draw: function () {
    var a = this.set;
    a.clear();
    var b = this.container,
      c = this.w,
      d = this.h,
      e = this.dx,
      f = this.dy,
      l = this.colors,
      n = this.alpha,
      k = this.bwidth,
      g = this.bcolor,
      h = this.balpha,
      m = this.gradientRotation,
      u = this.cornerRadius,
      r = this.dashLength,
      s = this.pattern,
      p = l,
      v = l;
    "object" == typeof l && ((p = l[0]), (v = l[l.length - 1]));
    var q,
      x,
      t,
      y,
      w,
      C,
      B,
      z,
      A,
      D = n;
    s && (n = 0);
    if (0 < e || 0 < f)
      (B = v),
        (v = AmCharts.adjustLuminosity(p, -0.2)),
        (v = AmCharts.adjustLuminosity(p, -0.2)),
        (q = AmCharts.polygon(
          b,
          [0, e, c + e, c, 0],
          [0, f, f, 0, 0],
          v,
          n,
          1,
          g,
          0,
          m
        )),
        0 < h && (A = AmCharts.line(b, [0, e, c + e], [0, f, f], g, h, k, r)),
        (x = AmCharts.polygon(
          b,
          [0, 0, c, c, 0],
          [0, d, d, 0, 0],
          v,
          n,
          1,
          g,
          0,
          m
        )),
        x.translate(e, f),
        0 < h && (t = AmCharts.line(b, [e, e], [f, f + d], g, h, k, r)),
        (y = AmCharts.polygon(
          b,
          [0, 0, e, e, 0],
          [0, d, d + f, f, 0],
          v,
          n,
          1,
          g,
          0,
          m
        )),
        (w = AmCharts.polygon(
          b,
          [c, c, c + e, c + e, c],
          [0, d, d + f, f, 0],
          v,
          n,
          1,
          g,
          0,
          m
        )),
        0 < h &&
          (C = AmCharts.line(
            b,
            [c, c + e, c + e, c],
            [0, f, d + f, d],
            g,
            h,
            k,
            r
          )),
        (v = AmCharts.adjustLuminosity(B, 0.2)),
        (B = AmCharts.polygon(
          b,
          [0, e, c + e, c, 0],
          [d, d + f, d + f, d, d],
          v,
          n,
          1,
          g,
          0,
          m
        )),
        0 < h &&
          (z = AmCharts.line(b, [0, e, c + e], [d, d + f, d + f], g, h, k, r));
    n = D;
    1 > Math.abs(d) && (d = 0);
    1 > Math.abs(c) && (c = 0);
    b =
      0 === d
        ? AmCharts.line(b, [0, c], [0, 0], g, h, k, r)
        : 0 === c
        ? AmCharts.line(b, [0, 0], [0, d], g, h, k, r)
        : 0 < u
        ? AmCharts.rect(b, c, d, l, n, k, g, h, u, m, r)
        : AmCharts.polygon(
            b,
            [0, 0, c, c, 0],
            [0, d, d, 0, 0],
            l,
            n,
            k,
            g,
            h,
            m,
            !1,
            r
          );
    d = 0 > d ? [q, A, x, t, y, w, C, B, z, b] : [B, z, x, t, y, w, q, A, C, b];
    for (q = 0; q < d.length; q++) (x = d[q]) && a.push(x);
    s && b.pattern(s);
  },
  width: function (a) {
    this.w = a;
    this.draw();
  },
  height: function (a) {
    this.h = a;
    this.draw();
  },
  animateHeight: function (a, b) {
    var c = this;
    c.easing = b;
    c.totalFrames = Math.round((1e3 * a) / AmCharts.updateRate);
    c.rh = c.h;
    c.frame = 0;
    c.height(1);
    setTimeout(function () {
      c.updateHeight.call(c);
    }, AmCharts.updateRate);
  },
  updateHeight: function () {
    var a = this;
    a.frame++;
    var b = a.totalFrames;
    a.frame <= b &&
      ((b = a.easing(0, a.frame, 1, a.rh - 1, b)),
      a.height(b),
      setTimeout(function () {
        a.updateHeight.call(a);
      }, AmCharts.updateRate));
  },
  animateWidth: function (a, b) {
    var c = this;
    c.easing = b;
    c.totalFrames = Math.round((1e3 * a) / AmCharts.updateRate);
    c.rw = c.w;
    c.frame = 0;
    c.width(1);
    setTimeout(function () {
      c.updateWidth.call(c);
    }, AmCharts.updateRate);
  },
  updateWidth: function () {
    var a = this;
    a.frame++;
    var b = a.totalFrames;
    a.frame <= b &&
      ((b = a.easing(0, a.frame, 1, a.rw - 1, b)),
      a.width(b),
      setTimeout(function () {
        a.updateWidth.call(a);
      }, AmCharts.updateRate));
  },
});
AmCharts.CategoryAxis = AmCharts.Class({
  inherits: AmCharts.AxisBase,
  construct: function (a) {
    this.cname = "CategoryAxis";
    AmCharts.CategoryAxis.base.construct.call(this, a);
    this.minPeriod = "DD";
    this.equalSpacing = this.parseDates = !1;
    this.position = "bottom";
    this.startOnAxis = !1;
    this.firstDayOfWeek = 1;
    this.gridPosition = "middle";
    this.markPeriodChange = this.boldPeriodBeginning = !0;
    this.safeDistance = 30;
    this.centerLabelOnFullPeriod = !0;
    this.periods = [
      { period: "ss", count: 1 },
      { period: "ss", count: 5 },
      { period: "ss", count: 10 },
      { period: "ss", count: 30 },
      { period: "mm", count: 1 },
      { period: "mm", count: 5 },
      { period: "mm", count: 10 },
      { period: "mm", count: 30 },
      { period: "hh", count: 1 },
      { period: "hh", count: 3 },
      { period: "hh", count: 6 },
      { period: "hh", count: 12 },
      { period: "DD", count: 1 },
      { period: "DD", count: 2 },
      { period: "DD", count: 3 },
      { period: "DD", count: 4 },
      { period: "DD", count: 5 },
      { period: "WW", count: 1 },
      { period: "MM", count: 1 },
      { period: "MM", count: 2 },
      { period: "MM", count: 3 },
      { period: "MM", count: 6 },
      { period: "YYYY", count: 1 },
      { period: "YYYY", count: 2 },
      { period: "YYYY", count: 5 },
      { period: "YYYY", count: 10 },
      { period: "YYYY", count: 50 },
      { period: "YYYY", count: 100 },
    ];
    this.dateFormats = [
      { period: "fff", format: "JJ:NN:SS" },
      { period: "ss", format: "JJ:NN:SS" },
      { period: "mm", format: "JJ:NN" },
      { period: "hh", format: "JJ:NN" },
      { period: "DD", format: "MMM DD" },
      { period: "WW", format: "MMM DD" },
      { period: "MM", format: "MMM" },
      { period: "YYYY", format: "YYYY" },
    ];
    this.nextPeriod = {};
    this.nextPeriod.fff = "ss";
    this.nextPeriod.ss = "mm";
    this.nextPeriod.mm = "hh";
    this.nextPeriod.hh = "DD";
    this.nextPeriod.DD = "MM";
    this.nextPeriod.MM = "YYYY";
    AmCharts.applyTheme(this, a, this.cname);
  },
  draw: function () {
    AmCharts.CategoryAxis.base.draw.call(this);
    this.generateDFObject();
    var a = this.chart.chartData;
    this.data = a;
    if (AmCharts.ifArray(a)) {
      var b,
        c = this.chart,
        d = this.start,
        e = this.labelFrequency,
        f = 0;
      b = this.end - d + 1;
      var l = this.gridCountR,
        n = this.showFirstLabel,
        k = this.showLastLabel,
        g,
        h = "",
        m = AmCharts.extractPeriod(this.minPeriod);
      g = AmCharts.getPeriodDuration(m.period, m.count);
      var u, r, s, p, v, q;
      u = this.rotate;
      var x = this.firstDayOfWeek,
        t = this.boldPeriodBeginning,
        a = AmCharts.resetDateToMin(
          new Date(a[a.length - 1].time + 1.05 * g),
          this.minPeriod,
          1,
          x
        ).getTime(),
        y;
      this.endTime > a && (this.endTime = a);
      q = this.minorGridEnabled;
      var w,
        a = this.gridAlpha,
        C;
      if (this.parseDates && !this.equalSpacing) {
        this.timeDifference = this.endTime - this.startTime;
        d = this.choosePeriod(0);
        e = d.period;
        u = d.count;
        r = AmCharts.getPeriodDuration(e, u);
        r < g && ((e = m.period), (u = m.count), (r = g));
        s = e;
        "WW" == s && (s = "DD");
        this.stepWidth = this.getStepWidth(this.timeDifference);
        var l = Math.ceil(this.timeDifference / r) + 5,
          B = (h = AmCharts.resetDateToMin(
            new Date(this.startTime - r),
            e,
            u,
            x
          ).getTime());
        s == e &&
          1 == u &&
          this.centerLabelOnFullPeriod &&
          (v = r * this.stepWidth);
        this.cellWidth = g * this.stepWidth;
        b = Math.round(h / r);
        d = -1;
        b / 2 == Math.round(b / 2) && ((d = -2), (h -= r));
        var z = c.firstTime,
          A = 0;
        q &&
          1 < u &&
          ((w = this.chooseMinorFrequency(u)),
          (C = AmCharts.getPeriodDuration(e, w)));
        if (0 < this.gridCountR)
          for (b = d; b <= l; b++) {
            m = z + r * (b + Math.floor((B - z) / r)) - A;
            "DD" == e && (m += 36e5);
            m = AmCharts.resetDateToMin(new Date(m), e, u, x).getTime();
            "MM" == e &&
              ((q = (m - h) / r),
              1.5 <= (m - h) / r &&
                ((m = m - (q - 1) * r + AmCharts.getPeriodDuration("DD", 3)),
                (m = AmCharts.resetDateToMin(new Date(m), e, 1).getTime()),
                (A += r)));
            g = (m - this.startTime) * this.stepWidth;
            q = !1;
            this.nextPeriod[s] &&
              (q = this.checkPeriodChange(this.nextPeriod[s], 1, m, h, s));
            y = !1;
            q && this.markPeriodChange
              ? ((q = this.dateFormatsObject[this.nextPeriod[s]]),
                this.twoLineMode &&
                  ((q = this.dateFormatsObject[s] + "\n" + q),
                  (q = AmCharts.fixBrakes(q))),
                (y = !0))
              : (q = this.dateFormatsObject[s]);
            t || (y = !1);
            h = AmCharts.formatDate(new Date(m), q);
            if ((b == d && !n) || (b == l && !k)) h = " ";
            this.labelFunction &&
              (h = this.labelFunction(
                h,
                new Date(m),
                this,
                e,
                u,
                p
              ).toString());
            this.boldLabels && (y = !0);
            p = new this.axisItemRenderer(this, g, h, !1, v, 0, !1, y);
            this.pushAxisItem(p);
            p = h = m;
            if (!isNaN(w))
              for (g = 1; g < u; g += w)
                (this.gridAlpha = this.minorGridAlpha),
                  (q = m + C * g),
                  (q = AmCharts.resetDateToMin(new Date(q), e, w, x).getTime()),
                  (q = new this.axisItemRenderer(
                    this,
                    (q - this.startTime) * this.stepWidth
                  )),
                  this.pushAxisItem(q);
            this.gridAlpha = a;
          }
      } else if (!this.parseDates) {
        if (
          ((this.cellWidth = this.getStepWidth(b)),
          b < l && (l = b),
          (f += this.start),
          (this.stepWidth = this.getStepWidth(b)),
          0 < l)
        )
          for (
            t = Math.floor(b / l),
              w = this.chooseMinorFrequency(t),
              g = f,
              g / 2 == Math.round(g / 2) && g--,
              0 > g && (g = 0),
              l = 0,
              this.end - g + 1 >= this.autoRotateCount &&
                (this.labelRotation = this.autoRotateAngle),
              b = g;
            b <= this.end + 2;
            b++
          ) {
            p = !1;
            0 <= b && b < this.data.length
              ? ((s = this.data[b]), (h = s.category), (p = s.forceShow))
              : (h = "");
            if (q && !isNaN(w))
              if (b / w == Math.round(b / w) || p)
                b / t == Math.round(b / t) ||
                  p ||
                  ((this.gridAlpha = this.minorGridAlpha), (h = void 0));
              else continue;
            else if (b / t != Math.round(b / t) && !p) continue;
            g = this.getCoordinate(b - f);
            p = 0;
            "start" == this.gridPosition &&
              ((g -= this.cellWidth / 2), (p = this.cellWidth / 2));
            x = !0;
            tickShift = p;
            "start" == this.tickPosition &&
              ((tickShift = 0), (x = !1), (p = 0));
            if ((b == d && !n) || (b == this.end && !k)) h = void 0;
            Math.round(l / e) != l / e && (h = void 0);
            l++;
            B = this.cellWidth;
            u && (B = NaN);
            this.labelFunction && s && (h = this.labelFunction(h, s, this));
            h = AmCharts.fixBrakes(h);
            y = !1;
            this.boldLabels && (y = !0);
            b > this.end && "start" == this.tickPosition && (h = " ");
            p = new this.axisItemRenderer(
              this,
              g,
              h,
              x,
              B,
              p,
              void 0,
              y,
              tickShift,
              !1,
              s.labelColor
            );
            p.serialDataItem = s;
            this.pushAxisItem(p);
            this.gridAlpha = a;
          }
      } else if (this.parseDates && this.equalSpacing) {
        f = this.start;
        this.startTime = this.data[this.start].time;
        this.endTime = this.data[this.end].time;
        this.timeDifference = this.endTime - this.startTime;
        d = this.choosePeriod(0);
        e = d.period;
        u = d.count;
        r = AmCharts.getPeriodDuration(e, u);
        r < g && ((e = m.period), (u = m.count), (r = g));
        s = e;
        "WW" == s && (s = "DD");
        this.stepWidth = this.getStepWidth(b);
        l = Math.ceil(this.timeDifference / r) + 1;
        h = AmCharts.resetDateToMin(
          new Date(this.startTime - r),
          e,
          u,
          x
        ).getTime();
        this.cellWidth = this.getStepWidth(b);
        b = Math.round(h / r);
        d = -1;
        b / 2 == Math.round(b / 2) && ((d = -2), (h -= r));
        g = this.start;
        g / 2 == Math.round(g / 2) && g--;
        0 > g && (g = 0);
        v = this.end + 2;
        v >= this.data.length && (v = this.data.length);
        C = !1;
        C = !n;
        this.previousPos = -1e3;
        20 < this.labelRotation && (this.safeDistance = 5);
        r = g;
        if (
          this.data[g].time !=
          AmCharts.resetDateToMin(
            new Date(this.data[g].time),
            e,
            u,
            x
          ).getTime()
        )
          for (x = 0, y = h, b = g; b < v; b++)
            (m = this.data[b].time),
              this.checkPeriodChange(e, u, m, y) &&
                (x++, 2 <= x && ((r = b), (b = v)), (y = m));
        q &&
          1 < u &&
          ((w = this.chooseMinorFrequency(u)),
          AmCharts.getPeriodDuration(e, w));
        if (0 < this.gridCountR)
          for (b = g; b < v; b++)
            if (
              ((m = this.data[b].time),
              this.checkPeriodChange(e, u, m, h) && b >= r)
            ) {
              g = this.getCoordinate(b - this.start);
              q = !1;
              this.nextPeriod[s] &&
                (q = this.checkPeriodChange(this.nextPeriod[s], 1, m, h, s));
              y = !1;
              q && this.markPeriodChange
                ? ((q = this.dateFormatsObject[this.nextPeriod[s]]), (y = !0))
                : (q = this.dateFormatsObject[s]);
              h = AmCharts.formatDate(new Date(m), q);
              if ((b == d && !n) || (b == l && !k)) h = " ";
              C
                ? (C = !1)
                : (t || (y = !1),
                  g - this.previousPos >
                    this.safeDistance *
                      Math.cos((this.labelRotation * Math.PI) / 180) &&
                    (this.labelFunction &&
                      (h = this.labelFunction(h, new Date(m), this, e, u, p)),
                    this.boldLabels && (y = !0),
                    (p = new this.axisItemRenderer(
                      this,
                      g,
                      h,
                      void 0,
                      void 0,
                      void 0,
                      void 0,
                      y
                    )),
                    (x = p.graphics()),
                    this.pushAxisItem(p),
                    (p = x.getBBox().width),
                    AmCharts.isModern || (p -= g),
                    (this.previousPos = g + p)));
              p = h = m;
            } else
              isNaN(w) ||
                (this.checkPeriodChange(e, w, m, B) &&
                  ((this.gridAlpha = this.minorGridAlpha),
                  (g = this.getCoordinate(b - this.start)),
                  (q = new this.axisItemRenderer(this, g)),
                  this.pushAxisItem(q),
                  (B = m)),
                (this.gridAlpha = a));
      }
      for (b = 0; b < this.data.length; b++)
        if ((n = this.data[b]))
          (k =
            this.parseDates && !this.equalSpacing
              ? Math.round(
                  (n.time - this.startTime) * this.stepWidth +
                    this.cellWidth / 2
                )
              : this.getCoordinate(b - f)),
            (n.x[this.id] = k);
      n = this.guides.length;
      for (b = 0; b < n; b++)
        (k = this.guides[b]),
          (t = t = t = a = d = NaN),
          (w = k.above),
          k.toCategory &&
            ((t = c.getCategoryIndexByValue(k.toCategory)),
            isNaN(t) ||
              ((d = this.getCoordinate(t - f)),
              k.expand && (d += this.cellWidth / 2),
              (p = new this.axisItemRenderer(this, d, "", !0, NaN, NaN, k)),
              this.pushAxisItem(p, w))),
          k.category &&
            ((t = c.getCategoryIndexByValue(k.category)),
            isNaN(t) ||
              ((a = this.getCoordinate(t - f)),
              k.expand && (a -= this.cellWidth / 2),
              (t = (d - a) / 2),
              (p = new this.axisItemRenderer(this, a, k.label, !0, NaN, t, k)),
              this.pushAxisItem(p, w))),
          k.toDate &&
            (k.toDate instanceof Date ||
              (k.toDate = AmCharts.stringToDate(k.toDate, c.dataDateFormat)),
            this.equalSpacing
              ? ((t = c.getClosestIndex(
                  this.data,
                  "time",
                  k.toDate.getTime(),
                  !1,
                  0,
                  this.data.length - 1
                )),
                isNaN(t) || (d = this.getCoordinate(t - f)))
              : (d = (k.toDate.getTime() - this.startTime) * this.stepWidth),
            (p = new this.axisItemRenderer(this, d, "", !0, NaN, NaN, k)),
            this.pushAxisItem(p, w)),
          k.date &&
            (k.date instanceof Date ||
              (k.date = AmCharts.stringToDate(k.date, c.dataDateFormat)),
            this.equalSpacing
              ? ((t = c.getClosestIndex(
                  this.data,
                  "time",
                  k.date.getTime(),
                  !1,
                  0,
                  this.data.length - 1
                )),
                isNaN(t) || (a = this.getCoordinate(t - f)))
              : (a = (k.date.getTime() - this.startTime) * this.stepWidth),
            (t = (d - a) / 2),
            (p =
              "H" == this.orientation
                ? new this.axisItemRenderer(this, a, k.label, !1, 2 * t, NaN, k)
                : new this.axisItemRenderer(this, a, k.label, !1, NaN, t, k)),
            this.pushAxisItem(p, w)),
          (0 < d || 0 < a) &&
            (d < this.width || a < this.width) &&
            ((d = new this.guideFillRenderer(this, a, d, k)),
            (a = d.graphics()),
            this.pushAxisItem(d, w),
            (k.graphics = a),
            (a.index = b),
            k.balloonText && this.addEventListeners(a, k));
    }
    this.axisCreated = !0;
    c = this.x;
    f = this.y;
    this.set.translate(c, f);
    this.labelsSet.translate(c, f);
    this.positionTitle();
    (c = this.axisLine.set) && c.toFront();
    c = this.getBBox().height;
    2 < c - this.previousHeight &&
      this.autoWrap &&
      !this.parseDates &&
      (this.axisCreated = this.chart.marginsUpdated = !1);
    this.previousHeight = c;
  },
  chooseMinorFrequency: function (a) {
    for (var b = 10; 0 < b; b--) if (a / b == Math.round(a / b)) return a / b;
  },
  choosePeriod: function (a) {
    var b = AmCharts.getPeriodDuration(
        this.periods[a].period,
        this.periods[a].count
      ),
      c = Math.ceil(this.timeDifference / b),
      d = this.periods;
    return this.timeDifference < b && 0 < a
      ? d[a - 1]
      : c <= this.gridCountR
      ? d[a]
      : a + 1 < d.length
      ? this.choosePeriod(a + 1)
      : d[a];
  },
  getStepWidth: function (a) {
    var b;
    this.startOnAxis
      ? ((b = this.axisWidth / (a - 1)), 1 == a && (b = this.axisWidth))
      : (b = this.axisWidth / a);
    return b;
  },
  getCoordinate: function (a) {
    a *= this.stepWidth;
    this.startOnAxis || (a += this.stepWidth / 2);
    return Math.round(a);
  },
  timeZoom: function (a, b) {
    this.startTime = a;
    this.endTime = b;
  },
  minDuration: function () {
    var a = AmCharts.extractPeriod(this.minPeriod);
    return AmCharts.getPeriodDuration(a.period, a.count);
  },
  checkPeriodChange: function (a, b, c, d, e) {
    c = new Date(c);
    var f = new Date(d),
      l = this.firstDayOfWeek;
    d = b;
    "DD" == a && (b = 1);
    c = AmCharts.resetDateToMin(c, a, b, l).getTime();
    b = AmCharts.resetDateToMin(f, a, b, l).getTime();
    return "DD" == a && "hh" != e && c - b <= AmCharts.getPeriodDuration(a, d)
      ? !1
      : c != b
      ? !0
      : !1;
  },
  generateDFObject: function () {
    this.dateFormatsObject = {};
    var a;
    for (a = 0; a < this.dateFormats.length; a++) {
      var b = this.dateFormats[a];
      this.dateFormatsObject[b.period] = b.format;
    }
  },
  xToIndex: function (a) {
    var b = this.data,
      c = this.chart,
      d = c.rotate,
      e = this.stepWidth;
    this.parseDates && !this.equalSpacing
      ? ((a = this.startTime + Math.round(a / e) - this.minDuration() / 2),
        (c = c.getClosestIndex(b, "time", a, !1, this.start, this.end + 1)))
      : (this.startOnAxis || (a -= e / 2),
        (c = this.start + Math.round(a / e)));
    var c = AmCharts.fitToBounds(c, 0, b.length - 1),
      f;
    b[c] && (f = b[c].x[this.id]);
    d ? f > this.height + 1 && c-- : f > this.width + 1 && c--;
    0 > f && c++;
    return (c = AmCharts.fitToBounds(c, 0, b.length - 1));
  },
  dateToCoordinate: function (a) {
    return this.parseDates && !this.equalSpacing
      ? (a.getTime() - this.startTime) * this.stepWidth
      : this.parseDates && this.equalSpacing
      ? ((a = this.chart.getClosestIndex(
          this.data,
          "time",
          a.getTime(),
          !1,
          0,
          this.data.length - 1
        )),
        this.getCoordinate(a - this.start))
      : NaN;
  },
  categoryToCoordinate: function (a) {
    return this.chart
      ? ((a = this.chart.getCategoryIndexByValue(a)),
        this.getCoordinate(a - this.start))
      : NaN;
  },
  coordinateToDate: function (a) {
    return this.equalSpacing
      ? ((a = this.xToIndex(a)), new Date(this.data[a].time))
      : new Date(this.startTime + a / this.stepWidth);
  },
});
