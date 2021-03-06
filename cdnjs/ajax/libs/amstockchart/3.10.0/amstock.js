AmCharts.AmStockChart = AmCharts.Class({
  construct: function (a) {
    this.type = "stock";
    this.cname = "AmStockChart";
    this.version = "3.10.0";
    this.theme = a;
    this.createEvents(
      "zoomed",
      "rollOverStockEvent",
      "rollOutStockEvent",
      "clickStockEvent",
      "panelRemoved",
      "dataUpdated",
      "init",
      "rendered",
      "drawn"
    );
    this.colors =
      "#FF6600 #FCD202 #B0DE09 #0D8ECF #2A0CD0 #CD0D74 #CC0000 #00CC00 #0000CC #DDDDDD #999999 #333333 #990000".split(
        " "
      );
    this.firstDayOfWeek = 1;
    this.glueToTheEnd = !1;
    this.dataSetCounter = -1;
    this.zoomOutOnDataSetChange = !1;
    this.panels = [];
    this.dataSets = [];
    this.chartCursors = [];
    this.comparedDataSets = [];
    this.categoryAxesSettings = new AmCharts.CategoryAxesSettings(a);
    this.valueAxesSettings = new AmCharts.ValueAxesSettings(a);
    this.panelsSettings = new AmCharts.PanelsSettings(a);
    this.chartScrollbarSettings = new AmCharts.ChartScrollbarSettings(a);
    this.chartCursorSettings = new AmCharts.ChartCursorSettings(a);
    this.stockEventsSettings = new AmCharts.StockEventsSettings(a);
    this.legendSettings = new AmCharts.LegendSettings(a);
    this.balloon = new AmCharts.AmBalloon(a);
    this.previousEndDate = new Date(0);
    this.previousStartDate = new Date(0);
    this.dataSetCount = this.graphCount = 0;
    this.chartCreated = !1;
    this.extendToFullPeriod = !0;
    AmCharts.applyTheme(this, a, this.cname);
  },
  write: function (a) {
    var b = this.theme;
    AmCharts.applyLang(this.language);
    var c = this.exportConfig;
    c &&
      AmCharts.AmExport &&
      !this.AmExport &&
      (this.AmExport = new AmCharts.AmExport(this, c));
    this.amExport &&
      AmCharts.AmExport &&
      (this.AmExport = AmCharts.extend(
        this.amExport,
        new AmCharts.AmExport(this),
        !0
      ));
    this.AmExport && this.AmExport.init();
    this.chartRendered = !1;
    a = "object" != typeof a ? document.getElementById(a) : a;
    this.zoomOutOnDataSetChange && (this.endDate = this.startDate = void 0);
    this.categoryAxesSettings = AmCharts.processObject(
      this.categoryAxesSettings,
      AmCharts.CategoryAxesSettings,
      b
    );
    this.valueAxesSettings = AmCharts.processObject(
      this.valueAxesSettings,
      AmCharts.ValueAxesSettings,
      b
    );
    this.chartCursorSettings = AmCharts.processObject(
      this.chartCursorSettings,
      AmCharts.ChartCursorSettings,
      b
    );
    this.chartScrollbarSettings = AmCharts.processObject(
      this.chartScrollbarSettings,
      AmCharts.ChartScrollbarSettings,
      b
    );
    this.legendSettings = AmCharts.processObject(
      this.legendSettings,
      AmCharts.LegendSettings,
      b
    );
    this.panelsSettings = AmCharts.processObject(
      this.panelsSettings,
      AmCharts.PanelsSettings,
      b
    );
    this.stockEventsSettings = AmCharts.processObject(
      this.stockEventsSettings,
      AmCharts.StockEventsSettings,
      b
    );
    this.dataSetSelector &&
      (this.dataSetSelector = AmCharts.processObject(
        this.dataSetSelector,
        AmCharts.DataSetSelector,
        b
      ));
    this.periodSelector &&
      (this.periodSelector = AmCharts.processObject(
        this.periodSelector,
        AmCharts.PeriodSelector,
        b
      ));
    a.innerHTML = "";
    this.div = a;
    this.measure();
    this.createLayout();
    this.updateDataSets();
    this.addDataSetSelector();
    this.addPeriodSelector();
    this.addPanels();
    this.updatePanels();
    this.addChartScrollbar();
    this.updateData();
    this.skipDefault || this.setDefaultPeriod();
  },
  setDefaultPeriod: function (a) {
    var b = this.periodSelector;
    b && ((this.animationPlayed = !1), b.setDefaultPeriod(a));
  },
  validateSize: function () {
    var a,
      b = this.panels;
    this.measurePanels();
    for (a = 0; a < b.length; a++) (panel = b[a]), panel.invalidateSize();
  },
  updateDataSets: function () {
    var a = this.mainDataSet,
      b = this.dataSets,
      c;
    for (c = 0; c < b.length; c++) {
      var d = b[c],
        d = AmCharts.processObject(d, AmCharts.DataSet);
      b[c] = d;
      d.id || (this.dataSetCount++, (d.id = "ds" + this.dataSetCount));
      void 0 === d.color &&
        (d.color =
          this.colors.length - 1 > c ? this.colors[c] : AmCharts.randomColor());
    }
    !a && AmCharts.ifArray(b) && (this.mainDataSet = this.dataSets[0]);
  },
  updateEvents: function (a) {
    AmCharts.ifArray(a.stockEvents) &&
      AmCharts.parseEvents(
        a,
        this.panels,
        this.stockEventsSettings,
        this.firstDayOfWeek,
        this,
        this.dataDateFormat
      );
  },
  getLastDate: function (a) {
    var b = this.dataDateFormat;
    a =
      a instanceof Date
        ? new Date(
            a.getFullYear(),
            a.getMonth(),
            a.getDate(),
            a.getHours(),
            a.getMinutes(),
            a.getSeconds(),
            a.getMilliseconds()
          )
        : b
        ? AmCharts.stringToDate(a, b)
        : new Date(a);
    return new Date(
      AmCharts.changeDate(
        a,
        this.categoryAxesSettings.minPeriod,
        1,
        !0
      ).getTime() - 1
    );
  },
  getFirstDate: function (a) {
    var b = this.dataDateFormat;
    a =
      a instanceof Date
        ? new Date(
            a.getFullYear(),
            a.getMonth(),
            a.getDate(),
            a.getHours(),
            a.getMinutes(),
            a.getSeconds(),
            a.getMilliseconds()
          )
        : b
        ? AmCharts.stringToDate(a, b)
        : new Date(a);
    return new Date(
      AmCharts.resetDateToMin(
        a,
        this.categoryAxesSettings.minPeriod,
        1,
        this.firstDayOfWeek
      )
    );
  },
  updateData: function () {
    var a = this.mainDataSet;
    if (a) {
      var b = this.categoryAxesSettings;
      -1 == AmCharts.getItemIndex(b.minPeriod, b.groupToPeriods) &&
        b.groupToPeriods.unshift(b.minPeriod);
      var c = a.dataProvider;
      if (AmCharts.ifArray(c)) {
        var d = a.categoryField;
        this.firstDate = this.getFirstDate(c[0][d]);
        this.lastDate = this.getLastDate(c[c.length - 1][d]);
        this.periodSelector &&
          this.periodSelector.setRanges(this.firstDate, this.lastDate);
        a.dataParsed ||
          (AmCharts.parseStockData(
            a,
            b.minPeriod,
            b.groupToPeriods,
            this.firstDayOfWeek,
            this.dataDateFormat
          ),
          (a.dataParsed = !0));
        this.updateComparingData();
        this.updateEvents(a);
      } else this.lastDate = this.firstDate = void 0;
      this.glueToTheEnd &&
        this.startDate &&
        this.endDate &&
        this.lastDate &&
        (AmCharts.getPeriodDuration(b.minPeriod),
        (this.startDate = new Date(
          this.startDate.getTime() +
            (this.lastDate.getTime() - this.endDate.getTime())
        )),
        (this.endDate = this.lastDate),
        (this.updateScrollbar = !0));
      this.updatePanelsWithNewData();
    }
    a = { type: "dataUpdated", chart: this };
    this.fire(a.type, a);
  },
  updateComparingData: function () {
    var a = this.comparedDataSets,
      b = this.categoryAxesSettings,
      c;
    for (c = 0; c < a.length; c++) {
      var d = a[c];
      d.dataParsed ||
        (AmCharts.parseStockData(
          d,
          b.minPeriod,
          b.groupToPeriods,
          this.firstDayOfWeek,
          this.dataDateFormat
        ),
        (d.dataParsed = !0));
      this.updateEvents(d);
    }
  },
  createLayout: function () {
    var a = this.div,
      b,
      c,
      d = document.createElement("div");
    d.style.position = "relative";
    this.containerDiv = d;
    a.appendChild(d);
    if ((a = this.periodSelector)) b = a.position;
    if ((a = this.dataSetSelector)) c = a.position;
    if ("left" == b || "left" == c)
      (a = document.createElement("div")),
        (a.style.cssFloat = "left"),
        (a.style.styleFloat = "left"),
        (a.style.width = "0px"),
        (a.style.position = "absolute"),
        d.appendChild(a),
        (this.leftContainer = a);
    if ("right" == b || "right" == c)
      (b = document.createElement("div")),
        (b.style.cssFloat = "right"),
        (b.style.styleFloat = "right"),
        (b.style.width = "0px"),
        d.appendChild(b),
        (this.rightContainer = b);
    b = document.createElement("div");
    d.appendChild(b);
    this.centerContainer = b;
    d = document.createElement("div");
    b.appendChild(d);
    this.panelsContainer = d;
  },
  addPanels: function () {
    this.measurePanels();
    for (var a = this.panels, b = 0; b < a.length; b++) {
      var c = a[b],
        c = AmCharts.processObject(c, AmCharts.StockPanel, this.theme);
      a[b] = c;
      this.addStockPanel(c, b);
    }
    this.panelsAdded = !0;
  },
  measurePanels: function () {
    this.measure();
    var a = this.chartScrollbarSettings,
      b = this.divRealHeight,
      c = this.panelsSettings.panelSpacing;
    a.enabled && (b -= a.height);
    (a = this.periodSelector) &&
      !a.vertical &&
      ((a = a.offsetHeight), (b -= a + c));
    (a = this.dataSetSelector) &&
      !a.vertical &&
      ((a = a.offsetHeight), (b -= a + c));
    a = this.panels;
    this.panelsContainer.style.height = b + "px";
    this.chartCursors = [];
    var d = 0,
      e,
      h;
    for (e = 0; e < a.length; e++) {
      h = a[e];
      var f = h.percentHeight;
      isNaN(f) && ((f = 100 / a.length), (h.percentHeight = f));
      d += f;
    }
    this.panelsHeight = Math.max(b - c * (a.length - 1), 0);
    for (e = 0; e < a.length; e++)
      (h = a[e]),
        (h.percentHeight = (h.percentHeight / d) * 100),
        h.panelBox &&
          (h.panelBox.style.height =
            Math.round((h.percentHeight * this.panelsHeight) / 100) + "px");
  },
  addStockPanel: function (a, b) {
    var c = this.panelsSettings,
      d = document.createElement("div");
    d.className = "amChartsPanel";
    0 < b &&
      !this.panels[b - 1].showCategoryAxis &&
      (d.style.marginTop = c.panelSpacing + "px");
    a.panelBox = d;
    a.stockChart = this;
    a.id || (a.id = "stockPanel" + b);
    a.pathToImages = this.pathToImages;
    d.style.height =
      Math.round((a.percentHeight * this.panelsHeight) / 100) + "px";
    d.style.width = "100%";
    this.panelsContainer.appendChild(d);
    0 < c.backgroundAlpha && (d.style.backgroundColor = c.backgroundColor);
    if ((d = a.stockLegend))
      (d.container = void 0),
        (d.title = a.title),
        (d.marginLeft = c.marginLeft),
        (d.marginRight = c.marginRight),
        (d.verticalGap = 3),
        (d.position = "top"),
        AmCharts.copyProperties(this.legendSettings, d),
        a.addLegend(d, d.divId);
    a.zoomOutText = "";
    a.removeChartCursor();
    this.addCursor(a);
  },
  enableCursors: function (a) {
    var b = this.chartCursors,
      c;
    for (c = 0; c < b.length; c++) b[c].enabled = a;
  },
  updatePanels: function () {
    var a = this.panels,
      b;
    for (b = 0; b < a.length; b++) this.updatePanel(a[b]);
    this.mainDataSet && this.updateGraphs();
    this.currentPeriod = void 0;
  },
  updatePanel: function (a) {
    a.seriesIdField = "amCategoryIdField";
    a.dataProvider = [];
    a.chartData = [];
    a.graphs = [];
    var b = a.categoryAxis,
      c = this.categoryAxesSettings;
    AmCharts.copyProperties(this.panelsSettings, a);
    AmCharts.copyProperties(c, b);
    b.parseDates = !0;
    a.zoomOutOnDataUpdate = !1;
    a.mouseWheelScrollEnabled = this.mouseWheelScrollEnabled;
    a.dataDateFormat = this.dataDateFormat;
    a.language = this.language;
    a.showCategoryAxis
      ? "top" == b.position
        ? (a.marginTop = c.axisHeight)
        : (a.marginBottom = c.axisHeight)
      : ((a.categoryAxis.labelsEnabled = !1),
        a.chartCursor && (a.chartCursor.categoryBalloonEnabled = !1));
    var c = a.valueAxes,
      d = c.length,
      e;
    0 === d && ((e = new AmCharts.ValueAxis(this.theme)), a.addValueAxis(e));
    b = new AmCharts.AmBalloon(this.theme);
    AmCharts.copyProperties(this.balloon, b);
    a.balloon = b;
    c = a.valueAxes;
    d = c.length;
    for (b = 0; b < d; b++)
      (e = c[b]), AmCharts.copyProperties(this.valueAxesSettings, e);
    a.listenersAdded = !1;
    a.write(a.panelBox);
  },
  zoom: function (a, b) {
    this.zoomChart(a, b);
  },
  zoomOut: function () {
    this.zoomChart(this.firstDate, this.lastDate);
  },
  updatePanelsWithNewData: function () {
    var a = this.mainDataSet,
      b = this.scrollbarChart;
    if (a) {
      var c = this.panels;
      this.currentPeriod = void 0;
      var d;
      for (d = 0; d < c.length; d++) {
        var e = c[d];
        e.categoryField = a.categoryField;
        0 === a.dataProvider.length && (e.dataProvider = []);
        e.scrollbarChart = b;
      }
      b &&
        ((c = this.categoryAxesSettings),
        (d = c.minPeriod),
        (b.categoryField = a.categoryField),
        0 < a.dataProvider.length
          ? ((e = this.chartScrollbarSettings.usePeriod),
            (b.dataProvider = e
              ? a.agregatedDataProviders[e]
              : a.agregatedDataProviders[d]))
          : (b.dataProvider = []),
        (e = b.categoryAxis),
        (e.minPeriod = d),
        (e.firstDayOfWeek = this.firstDayOfWeek),
        (e.equalSpacing = c.equalSpacing),
        (e.axisAlpha = 0),
        (e.markPeriodChange = c.markPeriodChange),
        (b.bbsetr = !0),
        b.validateData(),
        (c = this.panelsSettings),
        (b.maxSelectedTime = c.maxSelectedTime),
        (b.minSelectedTime = c.minSelectedTime));
      0 < a.dataProvider.length && this.zoomChart(this.startDate, this.endDate);
    }
    this.panelDataInvalidated = !1;
  },
  addChartScrollbar: function () {
    var a = this.chartScrollbarSettings,
      b = this.scrollbarChart;
    b && (b.clear(), b.destroy());
    if (a.enabled) {
      var c = this.panelsSettings,
        d = this.categoryAxesSettings,
        b = new AmCharts.AmSerialChart(this.theme);
      b.pathToImages = this.pathToImages;
      b.autoMargins = !1;
      this.scrollbarChart = b;
      b.id = "scrollbarChart";
      b.scrollbarOnly = !0;
      b.zoomOutText = "";
      b.panEventsEnabled = this.panelsSettings.panEventsEnabled;
      b.marginLeft = c.marginLeft;
      b.marginRight = c.marginRight;
      b.marginTop = 0;
      b.marginBottom = 0;
      var c = d.dateFormats,
        e = b.categoryAxis;
      e.boldPeriodBeginning = d.boldPeriodBeginning;
      c && (e.dateFormats = d.dateFormats);
      e.labelsEnabled = !1;
      e.parseDates = !0;
      d = a.graph;
      if (AmCharts.isString(d)) {
        c = this.panels;
        for (e = 0; e < c.length; e++) {
          var h = AmCharts.getObjById(c[e].stockGraphs, a.graph);
          h && (d = h);
        }
        a.graph = d;
      }
      var f;
      d &&
        ((f = new AmCharts.AmGraph(this.theme)),
        (f.valueField = d.valueField),
        (f.periodValue = d.periodValue),
        (f.type = d.type),
        (f.connect = d.connect),
        (f.minDistance = a.minDistance),
        b.addGraph(f));
      d = new AmCharts.ChartScrollbar(this.theme);
      b.addChartScrollbar(d);
      AmCharts.copyProperties(a, d);
      d.scrollbarHeight = a.height;
      d.graph = f;
      this.listenTo(d, "zoomed", this.handleScrollbarZoom);
      f = document.createElement("div");
      f.style.height = a.height + "px";
      d = this.periodSelectorContainer;
      c = this.periodSelector;
      e = this.centerContainer;
      "bottom" == a.position
        ? c
          ? "bottom" == c.position
            ? e.insertBefore(f, d)
            : e.appendChild(f)
          : e.appendChild(f)
        : c
        ? "top" == c.position
          ? e.insertBefore(f, d.nextSibling)
          : e.insertBefore(f, e.firstChild)
        : e.insertBefore(f, e.firstChild);
      b.write(f);
    }
  },
  handleScrollbarZoom: function (a) {
    if (this.skipScrollbarEvent) this.skipScrollbarEvent = !1;
    else {
      var b = a.endDate,
        c = {};
      c.startDate = a.startDate;
      c.endDate = b;
      this.updateScrollbar = !1;
      this.handleZoom(c);
    }
  },
  addPeriodSelector: function () {
    var a = this.periodSelector;
    if (a) {
      var b = this.categoryAxesSettings.minPeriod;
      a.minDuration = AmCharts.getPeriodDuration(b);
      a.minPeriod = b;
      a.chart = this;
      var c = this.dataSetSelector,
        d,
        b = this.dssContainer;
      c && (d = c.position);
      var c = this.panelsSettings.panelSpacing,
        e = document.createElement("div");
      this.periodSelectorContainer = e;
      var h = this.leftContainer,
        f = this.rightContainer,
        g = this.centerContainer,
        k = this.panelsContainer,
        p = a.width + 2 * c + "px";
      switch (a.position) {
        case "left":
          h.style.width = a.width + "px";
          h.appendChild(e);
          g.style.paddingLeft = p;
          break;
        case "right":
          g.style.marginRight = p;
          f.appendChild(e);
          f.style.width = a.width + "px";
          break;
        case "top":
          k.style.clear = "both";
          g.insertBefore(e, k);
          e.style.paddingBottom = c + "px";
          e.style.overflow = "hidden";
          break;
        case "bottom":
          (e.style.marginTop = c + "px"),
            "bottom" == d ? g.insertBefore(e, b) : g.appendChild(e);
      }
      this.listenTo(a, "changed", this.handlePeriodSelectorZoom);
      a.write(e);
    }
  },
  addDataSetSelector: function () {
    var a = this.dataSetSelector;
    if (a) {
      a.chart = this;
      a.dataProvider = this.dataSets;
      var b = a.position,
        c = this.panelsSettings.panelSpacing,
        d = document.createElement("div");
      this.dssContainer = d;
      var e = this.leftContainer,
        h = this.rightContainer,
        f = this.centerContainer,
        g = this.panelsContainer,
        c = a.width + 2 * c + "px";
      switch (b) {
        case "left":
          e.style.width = a.width + "px";
          e.appendChild(d);
          f.style.paddingLeft = c;
          break;
        case "right":
          f.style.marginRight = c;
          h.appendChild(d);
          h.style.width = a.width + "px";
          break;
        case "top":
          g.style.clear = "both";
          f.insertBefore(d, g);
          d.style.overflow = "hidden";
          break;
        case "bottom":
          f.appendChild(d);
      }
      a.write(d);
    }
  },
  handlePeriodSelectorZoom: function (a) {
    var b = this.scrollbarChart;
    b && (b.updateScrollbar = !0);
    a.predefinedPeriod
      ? ((this.predefinedStart = a.startDate), (this.predefinedEnd = a.endDate))
      : (this.predefinedEnd = this.predefinedStart = null);
    this.zoomChart(a.startDate, a.endDate);
  },
  addCursor: function (a) {
    var b = this.chartCursorSettings;
    if (b.enabled) {
      var c = new AmCharts.ChartCursor(this.theme);
      AmCharts.copyProperties(b, c);
      a.removeChartCursor();
      a.addChartCursor(c);
      this.listenTo(c, "changed", this.handleCursorChange);
      this.listenTo(c, "onHideCursor", this.hideChartCursor);
      this.listenTo(c, "zoomed", this.handleCursorZoom);
      this.chartCursors.push(c);
    }
  },
  hideChartCursor: function () {
    var a = this.chartCursors,
      b;
    for (b = 0; b < a.length; b++) {
      var c = a[b];
      c.hideCursor(!1);
      (c = c.chart) && c.updateLegendValues();
    }
  },
  handleCursorZoom: function (a) {
    var b = this.scrollbarChart;
    b && (b.updateScrollbar = !0);
    var b = {},
      c;
    if (this.categoryAxesSettings.equalSpacing) {
      var d = this.mainDataSet.categoryField,
        e = this.mainDataSet.agregatedDataProviders[this.currentPeriod];
      c = new Date(e[a.start][d]);
      a = new Date(e[a.end][d]);
    } else (c = new Date(a.start)), (a = new Date(a.end));
    b.startDate = c;
    b.endDate = a;
    this.handleZoom(b);
  },
  handleZoom: function (a) {
    this.zoomChart(a.startDate, a.endDate);
  },
  zoomChart: function (a, b) {
    var c = new Date(a),
      d = this,
      e = d.firstDate,
      h = d.lastDate,
      f = d.currentPeriod,
      g = d.categoryAxesSettings,
      k = g.minPeriod,
      p = d.panelsSettings,
      n = d.periodSelector,
      u = d.panels,
      t = d.comparedGraphs,
      y = d.scrollbarChart,
      w = d.firstDayOfWeek;
    if (e && h) {
      a || (a = e);
      b || (b = h);
      if (f) {
        var l = AmCharts.extractPeriod(f);
        a.getTime() == b.getTime() &&
          l != k &&
          ((b = AmCharts.changeDate(b, l.period, l.count)),
          b.setTime(b.getTime() - 1));
      }
      a.getTime() < e.getTime() && (a = e);
      a.getTime() > h.getTime() && (a = h);
      b.getTime() < e.getTime() && (b = e);
      b.getTime() > h.getTime() && (b = h);
      l = AmCharts.getItemIndex(k, g.groupToPeriods);
      g = f;
      f = d.choosePeriod(l, a, b);
      d.currentPeriod = f;
      var l = AmCharts.extractPeriod(f),
        x = AmCharts.getPeriodDuration(l.period, l.count);
      AmCharts.getPeriodDuration(k);
      1 > b.getTime() - a.getTime() && (a = new Date(b.getTime() - 1));
      k = AmCharts.newDate(a);
      d.extendToFullPeriod &&
        (k.getTime() - e.getTime() < 0.1 * x &&
          (k = AmCharts.resetDateToMin(a, l.period, l.count, w)),
        h.getTime() - b.getTime() < 0.1 * x &&
          ((b = AmCharts.resetDateToMin(h, l.period, l.count, w)),
          (b = AmCharts.changeDate(b, l.period, l.count, !0))));
      for (e = 0; e < u.length; e++)
        (h = u[e]), h.chartCursor && h.chartCursor.panning && (k = c);
      for (e = 0; e < u.length; e++) {
        h = u[e];
        if (f != g) {
          for (c = 0; c < t.length; c++)
            (x = t[c].graph),
              (x.dataProvider = x.dataSet.agregatedDataProviders[f]);
          c = h.categoryAxis;
          c.firstDayOfWeek = w;
          c.minPeriod = f;
          h.dataProvider = d.mainDataSet.agregatedDataProviders[f];
          if ((c = h.chartCursor))
            (c.categoryBalloonDateFormat =
              d.chartCursorSettings.categoryBalloonDateFormat(l.period)),
              h.showCategoryAxis || (c.categoryBalloonEnabled = !1);
          h.startTime = k.getTime();
          h.endTime = b.getTime();
          h.validateData(!0);
        }
        c = !1;
        h.chartCursor && h.chartCursor.panning && (c = !0);
        c ||
          ((h.startTime = void 0), (h.endTime = void 0), h.zoomToDates(k, b));
        0 < p.startDuration && d.animationPlayed && !c
          ? ((h.startDuration = 0), h.animateAgain())
          : 0 < p.startDuration && !c && h.animateAgain();
      }
      d.animationPlayed = !0;
      AmCharts.extractPeriod(f);
      p = new Date(b);
      y &&
        d.updateScrollbar &&
        (y.zoomToDates(a, p),
        (d.skipScrollbarEvent = !0),
        setTimeout(function () {
          d.resetSkip.call(d);
        }, 100));
      d.updateScrollbar = !0;
      d.startDate = a;
      d.endDate = b;
      n && n.zoom(a, b);
      if (
        a.getTime() != d.previousStartDate.getTime() ||
        b.getTime() != d.previousEndDate.getTime()
      )
        (n = { type: "zoomed" }),
          (n.startDate = a),
          (n.endDate = b),
          (n.chart = d),
          (n.period = f),
          d.fire(n.type, n),
          (d.previousStartDate = new Date(a)),
          (d.previousEndDate = new Date(b));
    }
    d.eventsHidden && d.showHideEvents(!1);
    d.chartCreated || ((f = "init"), d.fire(f, { type: f, chart: d }));
    d.chartRendered ||
      ((f = "rendered"),
      d.fire(f, { type: f, chart: d }),
      (d.chartRendered = !0));
    f = "drawn";
    d.fire(f, { type: f, chart: d });
    d.chartCreated = !0;
    d.animationPlayed = !0;
  },
  resetSkip: function () {
    this.skipScrollbarEvent = !1;
  },
  updateGraphs: function () {
    this.getSelections();
    if (0 < this.dataSets.length) {
      var a = this.panels;
      this.comparedGraphs = [];
      var b;
      for (b = 0; b < a.length; b++) {
        var c = a[b],
          d = c.valueAxes,
          e;
        for (e = 0; e < d.length; e++) {
          var h = d[e];
          h.prevLog && (h.logarithmic = h.prevLog);
          h.recalculateToPercents =
            "always" == c.recalculateToPercents ? !0 : !1;
        }
        d = this.mainDataSet;
        e = this.comparedDataSets;
        h = c.stockGraphs;
        c.graphs = [];
        var f;
        for (f = 0; f < h.length; f++) {
          var g = h[f],
            g = AmCharts.processObject(g, AmCharts.StockGraph, this.theme);
          h[f] = g;
          if (!g.title || g.resetTitleOnDataSetChange)
            (g.title = d.title), (g.resetTitleOnDataSetChange = !0);
          g.useDataSetColors &&
            ((g.lineColor = d.color),
            (g.fillColors = void 0),
            (g.bulletColor = void 0));
          c.addGraph(g);
          var k = !1;
          "always" == c.recalculateToPercents && (k = !0);
          var p = c.stockLegend,
            n,
            u,
            t,
            y;
          p &&
            ((p = AmCharts.processObject(p, AmCharts.StockLegend, this.theme)),
            (c.stockLegend = p),
            (n = p.valueTextComparing),
            (u = p.valueTextRegular),
            (t = p.periodValueTextComparing),
            (y = p.periodValueTextRegular));
          if (g.comparable) {
            var w = e.length;
            0 < w &&
              g.valueAxis.logarithmic &&
              "never" != c.recalculateToPercents &&
              ((g.valueAxis.logarithmic = !1), (g.valueAxis.prevLog = !0));
            0 < w &&
              "whenComparing" == c.recalculateToPercents &&
              (g.valueAxis.recalculateToPercents = !0);
            p &&
              g.valueAxis &&
              !0 === g.valueAxis.recalculateToPercents &&
              (k = !0);
            var l;
            for (l = 0; l < w; l++) {
              var x = e[l],
                q = g.comparedGraphs[x.id];
              q ||
                ((q = new AmCharts.AmGraph(this.theme)),
                (q.id = "comparedGraph" + l + "_" + f + x.id));
              q.periodValue = g.periodValue;
              q.dataSet = x;
              q.behindColumns = g.behindColumns;
              g.comparedGraphs[x.id] = q;
              q.seriesIdField = "amCategoryIdField";
              q.connect = g.connect;
              var m = g.compareField;
              m || (m = g.valueField);
              var D = !1,
                A = x.fieldMappings,
                z;
              for (z = 0; z < A.length; z++) A[z].toField == m && (D = !0);
              if (D) {
                q.valueField = m;
                q.title = x.title;
                q.lineColor = x.color;
                g.compareGraphType && (q.type = g.compareGraphType);
                m = g.compareGraphLineThickness;
                isNaN(m) || (q.lineThickness = m);
                m = g.compareGraphDashLength;
                isNaN(m) || (q.dashLength = m);
                m = g.compareGraphLineAlpha;
                isNaN(m) || (q.lineAlpha = m);
                m = g.compareGraphCornerRadiusTop;
                isNaN(m) || (q.cornerRadiusTop = m);
                m = g.compareGraphCornerRadiusBottom;
                isNaN(m) || (q.cornerRadiusBottom = m);
                m = g.compareGraphBalloonColor;
                isNaN(m) || (q.balloonColor = m);
                m = g.compareGraphBulletColor;
                isNaN(m) || (q.bulletColor = m);
                if ((m = g.compareGraphFillColors)) q.fillColors = m;
                if ((m = g.compareGraphNegativeFillColors))
                  q.negativeFillColors = m;
                if ((m = g.compareGraphFillAlphas)) q.fillAlphas = m;
                if ((m = g.compareGraphNegativeFillAlphas))
                  q.negativeFillAlphas = m;
                if ((m = g.compareGraphBullet)) q.bullet = m;
                if ((m = g.compareGraphNumberFormatter)) q.numberFormatter = m;
                m = g.compareGraphPrecision;
                isNaN(m) || (q.precision = m);
                if ((m = g.compareGraphBalloonText)) q.balloonText = m;
                m = g.compareGraphBulletSize;
                isNaN(m) || (q.bulletSize = m);
                m = g.compareGraphBulletAlpha;
                isNaN(m) || (q.bulletAlpha = m);
                m = g.compareGraphBulletBorderAlpha;
                isNaN(m) || (q.bulletBorderAlpha = m);
                if ((m = g.compareGraphBulletBorderColor))
                  q.bulletBorderColor = m;
                m = g.compareGraphBulletBorderThickness;
                isNaN(m) || (q.bulletBorderThickness = m);
                q.visibleInLegend = g.compareGraphVisibleInLegend;
                q.balloonFunction = g.compareGraphBalloonFunction;
                q.hideBulletsCount = g.hideBulletsCount;
                q.valueAxis = g.valueAxis;
                p &&
                  (k && n
                    ? ((q.legendValueText = n), (q.legendPeriodValueText = t))
                    : (u && (q.legendValueText = u),
                      y && (q.legendPeriodValueText = y)));
                c.showComparedOnTop ? c.graphs.push(q) : c.graphs.unshift(q);
                this.comparedGraphs.push({ graph: q, dataSet: x });
              }
            }
          }
          p &&
            (k && n
              ? ((g.legendValueText = n), (g.legendPeriodValueText = t))
              : (u && (g.legendValueText = u),
                y && (g.legendPeriodValueText = y)));
        }
      }
    }
  },
  choosePeriod: function (a, b, c) {
    var d = this.categoryAxesSettings,
      e = d.groupToPeriods,
      h = e[a],
      e = e[a + 1],
      f = AmCharts.extractPeriod(h),
      f = AmCharts.getPeriodDuration(f.period, f.count),
      g = b.getTime(),
      k = c.getTime(),
      d = d.maxSeries;
    return (k - g) / f > d && 0 < d && e ? this.choosePeriod(a + 1, b, c) : h;
  },
  handleCursorChange: function (a) {
    var b = a.target,
      c = a.position,
      d = a.zooming;
    a = a.index;
    var e = this.chartCursors,
      h;
    for (h = 0; h < e.length; h++) {
      var f = e[h];
      f != b &&
        c &&
        (f.isZooming(d),
        (f.previousMousePosition = NaN),
        (f.forceShow = !0),
        f.setPosition(c, !1, a));
    }
  },
  getSelections: function () {
    var a = [],
      b = this.dataSets,
      c;
    for (c = 0; c < b.length; c++) {
      var d = b[c];
      d.compared && a.push(d);
    }
    this.comparedDataSets = a;
    b = this.panels;
    for (c = 0; c < b.length; c++)
      (d = b[c]),
        "never" != d.recalculateToPercents && 0 < a.length
          ? d.hideDrawingIcons(!0)
          : d.drawingIconsEnabled && d.hideDrawingIcons(!1);
  },
  addPanel: function (a) {
    this.panels.push(a);
    AmCharts.removeChart(a);
    AmCharts.addChart(a);
  },
  addPanelAt: function (a, b) {
    this.panels.splice(b, 0, a);
    AmCharts.removeChart(a);
    AmCharts.addChart(a);
  },
  removePanel: function (a) {
    var b = this.panels,
      c;
    for (c = b.length - 1; 0 <= c; c--)
      if (b[c] == a) {
        var d = { type: "panelRemoved", panel: a, chart: this };
        this.fire(d.type, d);
        b.splice(c, 1);
        a.destroy();
        a.clear();
      }
  },
  validateData: function () {
    this.resetDataParsed();
    this.updateDataSets();
    this.mainDataSet.compared = !1;
    this.updateGraphs();
    this.updateData();
    var a = this.dataSetSelector;
    a && a.write(a.div);
  },
  resetDataParsed: function () {
    var a = this.dataSets,
      b;
    for (b = 0; b < a.length; b++) a[b].dataParsed = !1;
  },
  validateNow: function () {
    this.skipDefault = !0;
    this.chartRendered = !1;
    this.clear(!0);
    this.write(this.div);
  },
  hideStockEvents: function () {
    this.showHideEvents(!1);
    this.eventsHidden = !0;
  },
  showStockEvents: function () {
    this.showHideEvents(!0);
    this.eventsHidden = !1;
  },
  showHideEvents: function (a) {
    var b = this.panels,
      c;
    for (c = 0; c < b.length; c++) {
      var d = b[c].graphs,
        e;
      for (e = 0; e < d.length; e++) {
        var h = d[e];
        !0 === a ? h.showBullets() : h.hideBullets();
      }
    }
  },
  invalidateSize: function () {
    var a = this;
    clearTimeout(a.validateTO);
    var b = setTimeout(function () {
      a.validateNow();
    }, 5);
    a.validateTO = b;
  },
  measure: function () {
    var a = this.div,
      b = a.offsetWidth,
      c = a.offsetHeight;
    a.clientHeight && ((b = a.clientWidth), (c = a.clientHeight));
    this.divRealWidth = b;
    this.divRealHeight = c;
  },
  clear: function (a) {
    var b = this.panels,
      c;
    if (b)
      for (c = 0; c < b.length; c++) {
        var d = b[c];
        a || (d.cleanChart(), d.destroy());
        d.clear(a);
      }
    (b = this.scrollbarChart) && b.clear();
    if ((b = this.div)) b.innerHTML = "";
    a || ((this.div = null), AmCharts.deleteObject(this));
  },
});
AmCharts.StockEvent = AmCharts.Class({ construct: function () {} });
AmCharts.DataSet = AmCharts.Class({
  construct: function () {
    this.cname = "DataSet";
    this.fieldMappings = [];
    this.dataProvider = [];
    this.agregatedDataProviders = [];
    this.stockEvents = [];
    this.compared = !1;
    this.showInCompare = this.showInSelect = !0;
  },
});
AmCharts.PeriodSelector = AmCharts.Class({
  construct: function (a) {
    this.cname = "PeriodSelector";
    this.theme = a;
    this.createEvents("changed");
    this.inputFieldsEnabled = !0;
    this.position = "bottom";
    this.width = 180;
    this.fromText = "From: ";
    this.toText = "to: ";
    this.periodsText = "Zoom: ";
    this.periods = [];
    this.inputFieldWidth = 100;
    this.dateFormat = "DD-MM-YYYY";
    this.hideOutOfScopePeriods = !0;
    AmCharts.applyTheme(this, a, this.cname);
  },
  zoom: function (a, b) {
    this.inputFieldsEnabled &&
      ((this.startDateField.value = AmCharts.formatDate(a, this.dateFormat)),
      (this.endDateField.value = AmCharts.formatDate(b, this.dateFormat)));
    this.markButtonAsSelected();
  },
  write: function (a) {
    var b = this;
    a.className = "amChartsPeriodSelector";
    var c = b.width,
      d = b.position;
    b.width = void 0;
    b.position = void 0;
    AmCharts.applyStyles(a.style, b);
    b.width = c;
    b.position = d;
    b.div = a;
    a.innerHTML = "";
    c = b.theme;
    d = b.position;
    d = "top" == d || "bottom" == d ? !1 : !0;
    b.vertical = d;
    var e = 0,
      h = 0;
    if (b.inputFieldsEnabled) {
      var f = document.createElement("div");
      a.appendChild(f);
      var g = document.createTextNode(AmCharts.lang.fromText || b.fromText);
      f.appendChild(g);
      d
        ? AmCharts.addBr(f)
        : ((f.style.styleFloat = "left"), (f.style.display = "inline"));
      var k = document.createElement("input");
      k.className = "amChartsInputField";
      c && AmCharts.applyStyles(k.style, c.PeriodInputField);
      k.style.textAlign = "center";
      k.onblur = function (a) {
        b.handleCalChange(a);
      };
      AmCharts.isNN &&
        k.addEventListener(
          "keypress",
          function (a) {
            b.handleCalendarChange.call(b, a);
          },
          !0
        );
      AmCharts.isIE &&
        k.attachEvent("onkeypress", function (a) {
          b.handleCalendarChange.call(b, a);
        });
      f.appendChild(k);
      b.startDateField = k;
      if (d) (g = b.width - 6 + "px"), AmCharts.addBr(f);
      else {
        var g = b.inputFieldWidth + "px",
          p = document.createTextNode(" ");
        f.appendChild(p);
      }
      k.style.width = g;
      k = document.createTextNode(AmCharts.lang.toText || b.toText);
      f.appendChild(k);
      d && AmCharts.addBr(f);
      k = document.createElement("input");
      k.className = "amChartsInputField";
      c && AmCharts.applyStyles(k.style, c.PeriodInputField);
      k.style.textAlign = "center";
      k.onblur = function () {
        b.handleCalChange();
      };
      AmCharts.isNN &&
        k.addEventListener(
          "keypress",
          function (a) {
            b.handleCalendarChange.call(b, a);
          },
          !0
        );
      AmCharts.isIE &&
        k.attachEvent("onkeypress", function (a) {
          b.handleCalendarChange.call(b, a);
        });
      f.appendChild(k);
      b.endDateField = k;
      d ? AmCharts.addBr(f) : (e = k.offsetHeight + 2);
      g && (k.style.width = g);
    }
    f = b.periods;
    if (AmCharts.ifArray(f)) {
      g = document.createElement("div");
      d ||
        ((g.style.cssFloat = "right"),
        (g.style.styleFloat = "right"),
        (g.style.display = "inline"));
      a.appendChild(g);
      d && AmCharts.addBr(g);
      a = document.createTextNode(AmCharts.lang.periodsText || b.periodsText);
      g.appendChild(a);
      b.periodContainer = g;
      var n;
      for (a = 0; a < f.length; a++)
        (k = f[a]),
          (n = document.createElement("input")),
          (n.type = "button"),
          (n.value = k.label),
          (n.period = k.period),
          (n.count = k.count),
          (n.periodObj = k),
          (n.className = "amChartsButton"),
          c && AmCharts.applyStyles(n.style, c.PeriodButton),
          d && (n.style.width = b.width - 1 + "px"),
          (n.style.boxSizing = "border-box"),
          g.appendChild(n),
          b.addEventListeners(n),
          (k.button = n);
      !d && n && (h = n.offsetHeight);
      b.offsetHeight = Math.max(e, h);
    }
  },
  addEventListeners: function (a) {
    var b = this;
    AmCharts.isNN &&
      a.addEventListener(
        "click",
        function (a) {
          b.handlePeriodChange.call(b, a);
        },
        !0
      );
    AmCharts.isIE &&
      a.attachEvent("onclick", function (a) {
        b.handlePeriodChange.call(b, a);
      });
  },
  getPeriodDates: function () {
    var a = this.periods,
      b;
    for (b = 0; b < a.length; b++) this.selectPeriodButton(a[b], !0);
  },
  handleCalendarChange: function (a) {
    13 == a.keyCode && this.handleCalChange(a);
  },
  handleCalChange: function (a) {
    var b = this.dateFormat,
      c = AmCharts.stringToDate(this.startDateField.value, b),
      b = this.chart.getLastDate(
        AmCharts.stringToDate(this.endDateField.value, b)
      );
    try {
      this.startDateField.blur(), this.endDateField.blur();
    } catch (d) {}
    if (c && b) {
      var e = { type: "changed" };
      e.startDate = c;
      e.endDate = b;
      e.chart = this.chart;
      e.event = a;
      this.fire(e.type, e);
    }
  },
  handlePeriodChange: function (a) {
    this.selectPeriodButton(
      (a.srcElement ? a.srcElement : a.target).periodObj,
      !1,
      a
    );
  },
  setRanges: function (a, b) {
    this.firstDate = a;
    this.lastDate = b;
    this.getPeriodDates();
  },
  selectPeriodButton: function (a, b, c) {
    var d = a.button,
      e = d.count,
      h = d.period,
      f,
      g,
      k = this.firstDate,
      p = this.lastDate,
      n,
      u = this.theme;
    k &&
      p &&
      ("MAX" == h
        ? ((f = k), (g = p))
        : "YTD" == h
        ? ((f = new Date()),
          f.setMonth(0, 1),
          f.setHours(0, 0, 0, 0),
          0 === e && f.setDate(f.getDate() - 1),
          (g = this.lastDate))
        : "YYYY" == h || "MM" == h
        ? this.selectFromStart
          ? ((f = k), (g = new Date(k)), g.setMonth(g.getMonth() + e))
          : ((f = new Date(p)),
            AmCharts.changeDate(f, h, e, !1),
            f.setDate(f.getDate() - 1),
            (g = p))
        : ((n = AmCharts.getPeriodDuration(h, e)),
          this.selectFromStart
            ? ((f = k), (g = new Date(k.getTime() + n - 1)))
            : ((f = new Date(p.getTime() - n + 1)), (g = p))),
      (a.startTime = f.getTime()),
      this.hideOutOfScopePeriods &&
        (b && a.startTime < k.getTime()
          ? (d.style.display = "none")
          : (d.style.display = "inline")),
      f.getTime() > p.getTime() &&
        ((n = AmCharts.getPeriodDuration("DD", 1)),
        (f = new Date(p.getTime() - n))),
      f.getTime() < k.getTime() && (f = k),
      "YTD" == h && (a.startTime = f.getTime()),
      (a.endTime = g.getTime()),
      b ||
        ((this.skipMark = !0),
        this.unselectButtons(),
        (d.className = "amChartsButtonSelected"),
        u && AmCharts.applyStyles(d.style, u.PeriodButtonSelected),
        (a = { type: "changed" }),
        (a.startDate = f),
        (a.endDate = g),
        (a.predefinedPeriod = h),
        (a.chart = this.chart),
        (a.count = e),
        (a.event = c),
        this.fire(a.type, a)));
  },
  markButtonAsSelected: function () {
    if (!this.skipMark) {
      var a = this.chart,
        b = this.periods,
        c = a.startDate.getTime(),
        a = a.endDate.getTime(),
        d = this.theme;
      this.unselectButtons();
      var e;
      for (e = b.length - 1; 0 <= e; e--) {
        var h = b[e],
          f = h.button;
        h.startTime &&
          h.endTime &&
          c == h.startTime &&
          a == h.endTime &&
          (this.unselectButtons(),
          (f.className = "amChartsButtonSelected"),
          d && AmCharts.applyStyles(f.style, d.PeriodButtonSelected));
      }
    }
    this.skipMark = !1;
  },
  unselectButtons: function () {
    var a = this.periods,
      b,
      c = this.theme;
    for (b = a.length - 1; 0 <= b; b--) {
      var d = a[b].button;
      d.className = "amChartsButton";
      c && AmCharts.applyStyles(d.style, c.PeriodButton);
    }
  },
  setDefaultPeriod: function () {
    var a = this.periods,
      b;
    for (b = 0; b < a.length; b++) {
      var c = a[b];
      c.selected && this.selectPeriodButton(c);
    }
  },
});
AmCharts.StockGraph = AmCharts.Class({
  inherits: AmCharts.AmGraph,
  construct: function (a) {
    AmCharts.StockGraph.base.construct.call(this, a);
    this.cname = "StockGraph";
    this.useDataSetColors = !0;
    this.periodValue = "Close";
    this.compareGraphType = "line";
    this.compareGraphVisibleInLegend = !0;
    this.comparable = this.resetTitleOnDataSetChange = !1;
    this.comparedGraphs = {};
    this.showEventsOnComparedGraphs = !1;
    AmCharts.applyTheme(this, a, this.cname);
  },
});
AmCharts.StockPanel = AmCharts.Class({
  inherits: AmCharts.AmSerialChart,
  construct: function (a) {
    AmCharts.StockPanel.base.construct.call(this, a);
    this.cname = "StockPanel";
    this.theme = a;
    this.showCategoryAxis = this.showComparedOnTop = !0;
    this.recalculateToPercents = "whenComparing";
    this.panelHeaderPaddingBottom =
      this.panelHeaderPaddingLeft =
      this.panelHeaderPaddingRight =
      this.panelHeaderPaddingTop =
        0;
    this.trendLineAlpha = 1;
    this.trendLineColor = "#00CC00";
    this.trendLineColorHover = "#CC0000";
    this.trendLineThickness = 2;
    this.trendLineDashLength = 0;
    this.stockGraphs = [];
    this.drawingIconsEnabled = !1;
    this.iconSize = 18;
    this.autoMargins =
      this.allowTurningOff =
      this.eraseAll =
      this.erasingEnabled =
      this.drawingEnabled =
        !1;
    AmCharts.applyTheme(this, a, this.cname);
  },
  initChart: function (a) {
    AmCharts.StockPanel.base.initChart.call(this, a);
    this.drawingIconsEnabled && this.createDrawIcons();
    (a = this.chartCursor) && this.listenTo(a, "draw", this.handleDraw);
  },
  addStockGraph: function (a) {
    this.stockGraphs.push(a);
    return a;
  },
  handleCursorZoom: function (a) {},
  removeStockGraph: function (a) {
    var b = this.stockGraphs,
      c;
    for (c = b.length - 1; 0 <= c; c--) b[c] == a && b.splice(c, 1);
  },
  createDrawIcons: function () {
    var a = this,
      b = a.iconSize,
      c = a.container,
      d = a.pathToImages,
      e = a.realWidth - 2 * b - 1 - a.marginRight,
      h = AmCharts.rect(c, b, b, "#000", 0.005),
      f = AmCharts.rect(c, b, b, "#000", 0.005);
    f.translate(b + 1, 0);
    var g = c.image(d + "pencilIcon.gif", 0, 0, b, b);
    a.pencilButton = g;
    f.setAttr("cursor", "pointer");
    h.setAttr("cursor", "pointer");
    h.mouseup(function () {
      a.handlePencilClick();
    });
    var k = c.image(d + "pencilIconH.gif", 0, 0, b, b);
    a.pencilButtonPushed = k;
    a.drawingEnabled || k.hide();
    var p = c.image(d + "eraserIcon.gif", b + 1, 0, b, b);
    a.eraserButton = p;
    f.mouseup(function () {
      a.handleEraserClick();
    });
    h.touchend &&
      (h.touchend(function () {
        a.handlePencilClick();
      }),
      f.touchend(function () {
        a.handleEraserClick();
      }));
    b = c.image(d + "eraserIconH.gif", b + 1, 0, b, b);
    a.eraserButtonPushed = b;
    a.erasingEnabled || b.hide();
    c = c.set([g, k, p, b, h, f]);
    c.translate(e, 1);
    this.hideIcons && c.hide();
  },
  handlePencilClick: function () {
    var a = !this.drawingEnabled;
    this.disableDrawing(!a);
    this.erasingEnabled = !1;
    var b = this.eraserButtonPushed;
    b && b.hide();
    b = this.pencilButtonPushed;
    a ? b && b.show() : (b && b.hide(), this.setMouseCursor("auto"));
  },
  disableDrawing: function (a) {
    this.drawingEnabled = !a;
    var b = this.chartCursor;
    this.stockChart.enableCursors(a);
    b && b.enableDrawing(!a);
  },
  handleEraserClick: function () {
    this.disableDrawing(!0);
    var a = this.pencilButtonPushed;
    a && a.hide();
    a = this.eraserButtonPushed;
    if (this.eraseAll) {
      var a = this.trendLines,
        b;
      for (b = a.length - 1; 0 <= b; b--) {
        var c = a[b];
        c.isProtected || this.removeTrendLine(c);
      }
      this.validateNow();
    } else
      (this.erasingEnabled = b = !this.erasingEnabled)
        ? (a && a.show(),
          this.setTrendColorHover(this.trendLineColorHover),
          this.setMouseCursor("auto"))
        : (a && a.hide(), this.setTrendColorHover());
  },
  setTrendColorHover: function (a) {
    var b = this.trendLines,
      c;
    for (c = b.length - 1; 0 <= c; c--) {
      var d = b[c];
      d.isProtected || (d.rollOverColor = a);
    }
  },
  handleDraw: function (a) {
    var b = this.drawOnAxis;
    AmCharts.isString(b) && (b = this.getValueAxisById(b));
    b || (b = this.valueAxes[0]);
    this.drawOnAxis = b;
    var c = this.categoryAxis,
      d = a.initialX,
      e = a.finalX,
      h = a.initialY;
    a = a.finalY;
    var f = new AmCharts.TrendLine(this.theme);
    f.initialDate = c.coordinateToDate(d);
    f.finalDate = c.coordinateToDate(e);
    f.initialValue = b.coordinateToValue(h);
    f.finalValue = b.coordinateToValue(a);
    f.lineAlpha = this.trendLineAlpha;
    f.lineColor = this.trendLineColor;
    f.lineThickness = this.trendLineThickness;
    f.dashLength = this.trendLineDashLength;
    f.valueAxis = b;
    f.categoryAxis = c;
    this.addTrendLine(f);
    this.listenTo(f, "click", this.handleTrendClick);
    this.validateNow();
  },
  hideDrawingIcons: function (a) {
    (this.hideIcons = a) && this.disableDrawing(a);
  },
  handleTrendClick: function (a) {
    this.erasingEnabled &&
      ((a = a.trendLine),
      this.eraseAll || a.isProtected || this.removeTrendLine(a),
      this.validateNow());
  },
  handleWheelReal: function (a, b) {
    var c = this.scrollbarChart;
    if (!this.wheelBusy && c) {
      var d = 1;
      b && (d = -1);
      var c = c.chartScrollbar,
        e = this.categoryAxis.minDuration();
      0 > a
        ? ((d = this.startTime + d * e), (e = this.endTime + 1 * e))
        : ((d = this.startTime - d * e), (e = this.endTime - 1 * e));
      d < this.firstTime && (d = this.firstTime);
      e > this.lastTime && (e = this.lastTime);
      d < e && c.timeZoom(d, e, !0);
    }
  },
});
AmCharts.CategoryAxesSettings = AmCharts.Class({
  construct: function (a) {
    this.cname = "CategoryAxesSettings";
    this.minPeriod = "DD";
    this.equalSpacing = !1;
    this.axisHeight = 28;
    this.tickLength = this.axisAlpha = 0;
    this.gridCount = 10;
    this.maxSeries = 150;
    this.groupToPeriods = "ss 10ss 30ss mm 10mm 30mm hh DD WW MM YYYY".split(
      " "
    );
    this.markPeriodChange = this.autoGridCount = !0;
    AmCharts.applyTheme(this, a, this.cname);
  },
});
AmCharts.ChartCursorSettings = AmCharts.Class({
  construct: function (a) {
    this.cname = "ChartCursorSettings";
    this.enabled = !0;
    this.bulletsEnabled = this.valueBalloonsEnabled = !1;
    this.categoryBalloonDateFormats = [
      { period: "YYYY", format: "YYYY" },
      { period: "MM", format: "MMM, YYYY" },
      { period: "WW", format: "MMM DD, YYYY" },
      { period: "DD", format: "MMM DD, YYYY" },
      { period: "hh", format: "JJ:NN" },
      { period: "mm", format: "JJ:NN" },
      { period: "ss", format: "JJ:NN:SS" },
      { period: "fff", format: "JJ:NN:SS" },
    ];
    AmCharts.applyTheme(this, a, this.cname);
  },
  categoryBalloonDateFormat: function (a) {
    var b = this.categoryBalloonDateFormats,
      c,
      d;
    for (d = 0; d < b.length; d++) b[d].period == a && (c = b[d].format);
    return c;
  },
});
AmCharts.ChartScrollbarSettings = AmCharts.Class({
  construct: function (a) {
    this.cname = "ChartScrollbarSettings";
    this.height = 40;
    this.enabled = !0;
    this.color = "#FFFFFF";
    this.updateOnReleaseOnly = this.autoGridCount = !0;
    this.hideResizeGrips = !1;
    this.position = "bottom";
    this.minDistance = 1;
    AmCharts.applyTheme(this, a, this.cname);
  },
});
AmCharts.LegendSettings = AmCharts.Class({
  construct: function (a) {
    this.cname = "LegendSettings";
    this.marginBottom = this.marginTop = 0;
    this.usePositiveNegativeOnPercentsOnly = !0;
    this.positiveValueColor = "#00CC00";
    this.negativeValueColor = "#CC0000";
    this.autoMargins = this.equalWidths = this.textClickEnabled = !1;
    AmCharts.applyTheme(this, a, this.cname);
  },
});
AmCharts.PanelsSettings = AmCharts.Class({
  construct: function (a) {
    this.cname = "PanelsSettings";
    this.marginBottom = this.marginTop = this.marginRight = this.marginLeft = 0;
    this.backgroundColor = "#FFFFFF";
    this.backgroundAlpha = 0;
    this.panelSpacing = 8;
    this.panEventsEnabled = !0;
    this.creditsPosition = "top-right";
    AmCharts.applyTheme(this, a, this.cname);
  },
});
AmCharts.StockEventsSettings = AmCharts.Class({
  construct: function (a) {
    this.cname = "StockEventsSettings";
    this.type = "sign";
    this.backgroundAlpha = 1;
    this.backgroundColor = "#DADADA";
    this.borderAlpha = 1;
    this.borderColor = "#888888";
    this.balloonColor = this.rollOverColor = "#CC0000";
    AmCharts.applyTheme(this, a, this.cname);
  },
});
AmCharts.ValueAxesSettings = AmCharts.Class({
  construct: function (a) {
    this.cname = "ValueAxesSettings";
    this.tickLength = 0;
    this.showFirstLabel = this.autoGridCount = this.inside = !0;
    this.showLastLabel = !1;
    this.axisAlpha = 0;
    AmCharts.applyTheme(this, a, this.cname);
  },
});
AmCharts.getItemIndex = function (a, b) {
  var c = -1,
    d;
  for (d = 0; d < b.length; d++) a == b[d] && (c = d);
  return c;
};
AmCharts.addBr = function (a) {
  a.appendChild(document.createElement("br"));
};
AmCharts.applyStyles = function (a, b) {
  if (b && a)
    for (var c in a) {
      var d = c,
        e = b[d];
      if (void 0 !== e)
        try {
          a[d] = e;
        } catch (h) {}
    }
};
AmCharts.parseStockData = function (a, b, c, d, e) {
  new Date().getTime();
  var h = {},
    f = a.dataProvider,
    g = a.categoryField;
  if (g) {
    var k = AmCharts.getItemIndex(b, c),
      p = c.length,
      n,
      u = f.length,
      t,
      y = {};
    for (n = k; n < p; n++) (t = c[n]), (h[t] = []);
    var w = {},
      l = a.fieldMappings,
      x = l.length;
    for (n = 0; n < u; n++) {
      var q = f[n],
        m = q[g],
        m =
          m instanceof Date
            ? AmCharts.newDate(m, b)
            : e
            ? AmCharts.stringToDate(m, e)
            : new Date(m),
        D = m.getTime(),
        A = {};
      for (t = 0; t < x; t++) A[l[t].toField] = q[l[t].fromField];
      var z;
      for (z = k; z < p; z++) {
        t = c[z];
        var s = AmCharts.extractPeriod(t),
          B = s.period,
          E = s.count,
          v,
          r;
        if (z == k || D >= y[t] || !y[t]) {
          w[t] = {};
          w[t].amCategoryIdField = String(
            AmCharts.resetDateToMin(m, B, E, d).getTime()
          );
          var C;
          for (C = 0; C < x; C++)
            (s = l[C].toField),
              (v = w[t]),
              (r = Number(A[s])),
              (v[s + "Count"] = 0),
              (v[s + "Sum"] = 0),
              isNaN(r) ||
                ((v[s + "Open"] = r),
                (v[s + "Sum"] = r),
                (v[s + "High"] = r),
                (v[s + "Low"] = r),
                (v[s + "Close"] = r),
                (v[s + "Count"] = 1),
                (v[s + "Average"] = r));
          v.dataContext = q;
          h[t].push(w[t]);
          z > k &&
            ((s = AmCharts.newDate(m, b)),
            (s = AmCharts.changeDate(s, B, E, !0)),
            (s = AmCharts.resetDateToMin(s, B, E, d)),
            (y[t] = s.getTime()));
          if (z == k) for (var F in q) q.hasOwnProperty(F) && (w[t][F] = q[F]);
          w[t][g] = AmCharts.newDate(m, b);
        } else
          for (B = 0; B < x; B++)
            (s = l[B].toField),
              (v = w[t]),
              n == u - 1 && (v[g] = AmCharts.newDate(m, b)),
              (r = Number(A[s])),
              isNaN(r) ||
                (isNaN(v[s + "Low"]) && (v[s + "Low"] = r),
                r < v[s + "Low"] && (v[s + "Low"] = r),
                isNaN(v[s + "High"]) && (v[s + "High"] = r),
                r > v[s + "High"] && (v[s + "High"] = r),
                (v[s + "Close"] = r),
                (E = AmCharts.getDecimals(v[s + "Sum"])),
                (C = AmCharts.getDecimals(r)),
                (v[s + "Sum"] += r),
                (v[s + "Sum"] = AmCharts.roundTo(v[s + "Sum"], Math.max(E, C))),
                v[s + "Count"]++,
                (v[s + "Average"] = v[s + "Sum"] / v[s + "Count"]));
      }
    }
  }
  a.agregatedDataProviders = h;
};
AmCharts.parseEvents = function (a, b, c, d, e, h) {
  var f = a.stockEvents,
    g = a.agregatedDataProviders,
    k = b.length,
    p,
    n,
    u,
    t,
    y,
    w,
    l,
    x;
  for (p = 0; p < k; p++) {
    w = b[p];
    y = w.graphs;
    u = y.length;
    var q;
    for (n = 0; n < u; n++)
      (t = y[n]),
        (t.customBulletField = "amCustomBullet" + t.id + "_" + w.id),
        (t.bulletConfigField = "amCustomBulletConfig" + t.id + "_" + w.id);
    for (var m = 0; m < f.length; m++)
      if (
        ((l = f[m]),
        (q = l.graph),
        AmCharts.isString(q) && (q = AmCharts.getObjById(y, q)))
      )
        l.graph = q;
  }
  for (var D in g)
    if (g.hasOwnProperty(D)) {
      q = g[D];
      var A = AmCharts.extractPeriod(D),
        z = q.length,
        s;
      for (s = 0; s < z; s++) {
        var B = q[s];
        p = B[a.categoryField];
        x = p instanceof Date;
        h && !x && (p = AmCharts.stringToDate(p, h));
        var E = p.getTime();
        y = A.period;
        var m = A.count,
          v;
        v =
          "fff" == y
            ? p.getTime() + 1
            : AmCharts.resetDateToMin(
                AmCharts.changeDate(new Date(p), A.period, A.count),
                y,
                m,
                d
              ).getTime();
        for (p = 0; p < k; p++)
          for (w = b[p], y = w.graphs, u = y.length, n = 0; n < u; n++) {
            t = y[n];
            var r = {};
            r.eventDispatcher = e;
            r.eventObjects = [];
            r.letters = [];
            r.descriptions = [];
            r.shapes = [];
            r.backgroundColors = [];
            r.backgroundAlphas = [];
            r.borderColors = [];
            r.borderAlphas = [];
            r.colors = [];
            r.rollOverColors = [];
            r.showOnAxis = [];
            r.values = [];
            r.showAts = [];
            for (m = 0; m < f.length; m++) {
              l = f[m];
              x = l.date instanceof Date;
              h && !x && (l.date = AmCharts.stringToDate(l.date, h));
              x = l.date.getTime();
              var C = !1;
              l.graph &&
                (l.graph.showEventsOnComparedGraphs &&
                  l.graph.comparedGraphs[a.id] &&
                  (C = !0),
                (t == l.graph || C) &&
                  x >= E &&
                  x < v &&
                  (r.eventObjects.push(l),
                  r.letters.push(l.text),
                  r.descriptions.push(l.description),
                  l.type ? r.shapes.push(l.type) : r.shapes.push(c.type),
                  void 0 !== l.backgroundColor
                    ? r.backgroundColors.push(l.backgroundColor)
                    : r.backgroundColors.push(c.backgroundColor),
                  isNaN(l.backgroundAlpha)
                    ? r.backgroundAlphas.push(c.backgroundAlpha)
                    : r.backgroundAlphas.push(l.backgroundAlpha),
                  isNaN(l.borderAlpha)
                    ? r.borderAlphas.push(c.borderAlpha)
                    : r.borderAlphas.push(l.borderAlpha),
                  void 0 !== l.borderColor
                    ? r.borderColors.push(l.borderColor)
                    : r.borderColors.push(c.borderColor),
                  void 0 !== l.rollOverColor
                    ? r.rollOverColors.push(l.rollOverColor)
                    : r.rollOverColors.push(c.rollOverColor),
                  void 0 !== l.showAt
                    ? r.showAts.push(l.showAt)
                    : r.showAts.push(c.showAt),
                  r.colors.push(l.color),
                  r.values.push(l.value),
                  !l.panel && l.graph && (l.panel = l.graph.chart),
                  r.showOnAxis.push(l.showOnAxis),
                  (r.date = new Date(l.date))));
              0 < r.shapes.length &&
                ((l = "amCustomBullet" + t.id + "_" + w.id),
                (x = "amCustomBulletConfig" + t.id + "_" + w.id),
                (B[l] = AmCharts.StackedBullet),
                (B[x] = r));
            }
          }
      }
    }
};
AmCharts.StockLegend = AmCharts.Class({
  inherits: AmCharts.AmLegend,
  construct: function (a) {
    AmCharts.StockLegend.base.construct.call(this, a);
    this.cname = "StockLegend";
    this.valueTextComparing = "[[percents.value]]%";
    this.valueTextRegular = "[[value]]";
    AmCharts.applyTheme(this, a, this.cname);
  },
  drawLegend: function () {
    var a = this;
    AmCharts.StockLegend.base.drawLegend.call(a);
    var b = a.chart;
    if (b.allowTurningOff) {
      var c = a.container,
        d = c.image(b.pathToImages + "xIcon.gif", b.realWidth - 17, 3, 17, 17),
        b = c.image(b.pathToImages + "xIconH.gif", b.realWidth - 17, 3, 17, 17);
      b.hide();
      a.xButtonHover = b;
      d.mouseup(function () {
        a.handleXClick();
      }).mouseover(function () {
        a.handleXOver();
      });
      b.mouseup(function () {
        a.handleXClick();
      }).mouseout(function () {
        a.handleXOut();
      });
    }
  },
  handleXOver: function () {
    this.xButtonHover.show();
  },
  handleXOut: function () {
    this.xButtonHover.hide();
  },
  handleXClick: function () {
    var a = this.chart,
      b = a.stockChart;
    b.removePanel(a);
    b.validateNow();
  },
});
AmCharts.DataSetSelector = AmCharts.Class({
  construct: function (a) {
    this.cname = "DataSetSelector";
    this.theme = a;
    this.createEvents(
      "dataSetSelected",
      "dataSetCompared",
      "dataSetUncompared"
    );
    this.position = "left";
    this.selectText = "Select:";
    this.comboBoxSelectText = "Select...";
    this.compareText = "Compare to:";
    this.width = 180;
    this.dataProvider = [];
    this.listHeight = 150;
    this.listCheckBoxSize = 14;
    this.rollOverBackgroundColor = "#b2e1ff";
    this.selectedBackgroundColor = "#7fceff";
    AmCharts.applyTheme(this, a, this.cname);
  },
  write: function (a) {
    var b = this,
      c,
      d = b.theme;
    a.className = "amChartsDataSetSelector";
    var e = b.width;
    c = b.position;
    b.width = void 0;
    b.position = void 0;
    AmCharts.applyStyles(a.style, b);
    b.div = a;
    b.width = e;
    b.position = c;
    a.innerHTML = "";
    var e = b.position,
      h;
    h = "top" == e || "bottom" == e ? !1 : !0;
    b.vertical = h;
    var f;
    h && (f = b.width + "px");
    var e = b.dataProvider,
      g,
      k;
    if (1 < b.countDataSets("showInSelect")) {
      c = document.createTextNode(AmCharts.lang.selectText || b.selectText);
      a.appendChild(c);
      h && AmCharts.addBr(a);
      var p = document.createElement("select");
      f && (p.style.width = f);
      b.selectCB = p;
      d && AmCharts.applyStyles(p.style, d.DataSetSelect);
      a.appendChild(p);
      AmCharts.isNN &&
        p.addEventListener(
          "change",
          function (a) {
            b.handleDataSetChange.call(b, a);
          },
          !0
        );
      AmCharts.isIE &&
        p.attachEvent("onchange", function (a) {
          b.handleDataSetChange.call(b, a);
        });
      for (c = 0; c < e.length; c++)
        if (((g = e[c]), !0 === g.showInSelect)) {
          k = document.createElement("option");
          k.text = g.title;
          k.value = c;
          g == b.chart.mainDataSet && (k.selected = !0);
          try {
            p.add(k, null);
          } catch (n) {
            p.add(k);
          }
        }
      b.offsetHeight = p.offsetHeight;
    }
    if (0 < b.countDataSets("showInCompare") && 1 < e.length)
      if (
        (h
          ? (AmCharts.addBr(a), AmCharts.addBr(a))
          : ((c = document.createTextNode(" ")), a.appendChild(c)),
        (c = document.createTextNode(
          AmCharts.lang.compareText || b.compareText
        )),
        a.appendChild(c),
        (k = b.listCheckBoxSize),
        h)
      ) {
        AmCharts.addBr(a);
        f = document.createElement("div");
        a.appendChild(f);
        f.className = "amChartsCompareList";
        d && AmCharts.applyStyles(f.style, d.DataSetCompareList);
        f.style.overflow = "auto";
        f.style.overflowX = "hidden";
        f.style.width = b.width - 2 + "px";
        f.style.maxHeight = b.listHeight + "px";
        for (c = 0; c < e.length; c++)
          (g = e[c]),
            !0 === g.showInCompare &&
              g != b.chart.mainDataSet &&
              ((d = document.createElement("div")),
              (d.style.padding = "4px"),
              (d.style.position = "relative"),
              (d.name = "amCBContainer"),
              (d.dataSet = g),
              (d.style.height = k + "px"),
              g.compared &&
                (d.style.backgroundColor = b.selectedBackgroundColor),
              f.appendChild(d),
              (h = document.createElement("div")),
              (h.style.width = k + "px"),
              (h.style.height = k + "px"),
              (h.style.position = "absolute"),
              (h.style.backgroundColor = g.color),
              d.appendChild(h),
              (h = document.createElement("div")),
              (h.style.width = "100%"),
              (h.style.position = "absolute"),
              (h.style.left = k + 10 + "px"),
              d.appendChild(h),
              (g = document.createTextNode(g.title)),
              (h.style.whiteSpace = "nowrap"),
              (h.style.cursor = "default"),
              h.appendChild(g),
              b.addEventListeners(d));
        AmCharts.addBr(a);
        AmCharts.addBr(a);
      } else {
        d = document.createElement("select");
        b.compareCB = d;
        f && (d.style.width = f);
        a.appendChild(d);
        AmCharts.isNN &&
          d.addEventListener(
            "change",
            function (a) {
              b.handleCBSelect.call(b, a);
            },
            !0
          );
        AmCharts.isIE &&
          d.attachEvent("onchange", function (a) {
            b.handleCBSelect.call(b, a);
          });
        k = document.createElement("option");
        k.text = AmCharts.lang.comboBoxSelectText || b.comboBoxSelectText;
        try {
          d.add(k, null);
        } catch (u) {
          d.add(k);
        }
        for (c = 0; c < e.length; c++)
          if (
            ((g = e[c]), !0 === g.showInCompare && g != b.chart.mainDataSet)
          ) {
            k = document.createElement("option");
            k.text = g.title;
            k.value = c;
            g.compared && (k.selected = !0);
            try {
              d.add(k, null);
            } catch (t) {
              d.add(k);
            }
          }
        b.offsetHeight = d.offsetHeight;
      }
  },
  addEventListeners: function (a) {
    var b = this;
    AmCharts.isNN &&
      (a.addEventListener(
        "mouseover",
        function (a) {
          b.handleRollOver.call(b, a);
        },
        !0
      ),
      a.addEventListener(
        "mouseout",
        function (a) {
          b.handleRollOut.call(b, a);
        },
        !0
      ),
      a.addEventListener(
        "click",
        function (a) {
          b.handleClick.call(b, a);
        },
        !0
      ));
    AmCharts.isIE &&
      (a.attachEvent("onmouseout", function (a) {
        b.handleRollOut.call(b, a);
      }),
      a.attachEvent("onmouseover", function (a) {
        b.handleRollOver.call(b, a);
      }),
      a.attachEvent("onclick", function (a) {
        b.handleClick.call(b, a);
      }));
  },
  handleDataSetChange: function () {
    var a = this.selectCB,
      a = this.dataProvider[a.options[a.selectedIndex].value],
      b = this.chart;
    b.mainDataSet = a;
    b.zoomOutOnDataSetChange && ((b.startDate = void 0), (b.endDate = void 0));
    b.validateData();
    a = { type: "dataSetSelected", dataSet: a, chart: this.chart };
    this.fire(a.type, a);
  },
  handleRollOver: function (a) {
    a = this.getRealDiv(a);
    a.dataSet.compared ||
      (a.style.backgroundColor = this.rollOverBackgroundColor);
  },
  handleRollOut: function (a) {
    a = this.getRealDiv(a);
    a.dataSet.compared ||
      (a.style.removeProperty && a.style.removeProperty("background-color"),
      a.style.removeAttribute && a.style.removeAttribute("backgroundColor"));
  },
  handleCBSelect: function (a) {
    var b = this.compareCB,
      c = this.dataProvider,
      d,
      e;
    for (d = 0; d < c.length; d++)
      (e = c[d]),
        e.compared && (a = { type: "dataSetUncompared", dataSet: e }),
        (e.compared = !1);
    c = b.selectedIndex;
    0 < c &&
      ((e = this.dataProvider[b.options[c].value]),
      e.compared || (a = { type: "dataSetCompared", dataSet: e }),
      (e.compared = !0));
    b = this.chart;
    b.validateData();
    a.chart = b;
    this.fire(a.type, a);
  },
  handleClick: function (a) {
    a = this.getRealDiv(a).dataSet;
    !0 === a.compared
      ? ((a.compared = !1), (a = { type: "dataSetUncompared", dataSet: a }))
      : ((a.compared = !0), (a = { type: "dataSetCompared", dataSet: a }));
    var b = this.chart;
    b.validateData();
    a.chart = b;
    this.fire(a.type, a);
  },
  getRealDiv: function (a) {
    a || (a = window.event);
    a = a.currentTarget ? a.currentTarget : a.srcElement;
    "amCBContainer" == a.parentNode.name && (a = a.parentNode);
    return a;
  },
  countDataSets: function (a) {
    var b = this.dataProvider,
      c = 0,
      d;
    for (d = 0; d < b.length; d++) !0 === b[d][a] && c++;
    return c;
  },
});
AmCharts.StackedBullet = AmCharts.Class({
  construct: function () {
    this.fontSize = 11;
    this.stackDown = !1;
    this.mastHeight = 8;
    this.shapes = [];
    this.backgroundColors = [];
    this.backgroundAlphas = [];
    this.borderAlphas = [];
    this.borderColors = [];
    this.colors = [];
    this.rollOverColors = [];
    this.showOnAxiss = [];
    this.values = [];
    this.showAts = [];
    this.textColor = "#000000";
    this.nextY = 0;
    this.size = 16;
  },
  parseConfig: function () {
    var a = this.bulletConfig;
    this.eventObjects = a.eventObjects;
    this.letters = a.letters;
    this.shapes = a.shapes;
    this.backgroundColors = a.backgroundColors;
    this.backgroundAlphas = a.backgroundAlphas;
    this.borderColors = a.borderColors;
    this.borderAlphas = a.borderAlphas;
    this.colors = a.colors;
    this.rollOverColors = a.rollOverColors;
    this.date = a.date;
    this.showOnAxiss = a.showOnAxis;
    this.axisCoordinate = a.minCoord;
    this.showAts = a.showAts;
    this.values = a.values;
  },
  write: function (a) {
    this.parseConfig();
    this.container = a;
    this.bullets = [];
    if (this.graph) {
      var b = this.graph.fontSize;
      b && (this.fontSize = b);
    }
    b = this.letters.length;
    (this.mastHeight + 2 * (this.fontSize / 2 + 2)) * b > this.availableSpace &&
      (this.stackDown = !0);
    this.set = a.set();
    a = 0;
    var c;
    for (c = 0; c < b; c++)
      (this.shape = this.shapes[c]),
        (this.backgroundColor = this.backgroundColors[c]),
        (this.backgroundAlpha = this.backgroundAlphas[c]),
        (this.borderAlpha = this.borderAlphas[c]),
        (this.borderColor = this.borderColors[c]),
        (this.rollOverColor = this.rollOverColors[c]),
        (this.showOnAxis = this.showOnAxiss[c]),
        (this.color = this.colors[c]),
        (this.value = this.values[c]),
        (this.showAt = this.showAts[c]),
        this.addLetter(this.letters[c], a, c),
        this.showOnAxis || a++;
  },
  addLetter: function (a, b, c) {
    var d = this.container;
    b = d.set();
    var e = -1,
      h = this.stackDown,
      f = this.graph.valueAxis;
    this.showOnAxis && (this.stackDown = f.reversed ? !0 : !1);
    this.stackDown && (e = 1);
    var g = 0,
      k = 0,
      p = 0,
      n,
      u = this.fontSize,
      t = this.mastHeight,
      y = this.shape,
      w = this.textColor;
    void 0 !== this.color && (w = this.color);
    void 0 === a && (a = "");
    a = AmCharts.text(d, a, w, this.chart.fontFamily, this.fontSize);
    a.node.style.pointerEvents = "none";
    d = a.getBBox();
    this.labelWidth = w = d.width;
    this.labelHeight = d.height;
    var l,
      d = 0;
    switch (y) {
      case "sign":
        l = this.drawSign(b);
        g = t + 4 + u / 2;
        d = t + u + 4;
        1 == e && (g -= 4);
        break;
      case "flag":
        l = this.drawFlag(b);
        k = w / 2 + 3;
        g = t + 4 + u / 2;
        d = t + u + 4;
        1 == e && (g -= 4);
        break;
      case "pin":
        l = this.drawPin(b);
        g = 6 + u / 2;
        d = u + 8;
        break;
      case "triangleUp":
        l = this.drawTriangleUp(b);
        g = -u - 1;
        d = u + 4;
        e = -1;
        break;
      case "triangleDown":
        l = this.drawTriangleDown(b);
        g = u + 1;
        d = u + 4;
        e = -1;
        break;
      case "triangleLeft":
        l = this.drawTriangleLeft(b);
        k = u;
        d = u + 4;
        e = -1;
        break;
      case "triangleRight":
        l = this.drawTriangleRight(b);
        k = -u;
        e = -1;
        d = u + 4;
        break;
      case "arrowUp":
        l = this.drawArrowUp(b);
        a.hide();
        break;
      case "arrowDown":
        l = this.drawArrowDown(b);
        a.hide();
        d = u + 4;
        break;
      case "text":
        e = -1;
        l = this.drawTextBackground(b, a);
        g = this.labelHeight + 3;
        d = u + 10;
        break;
      case "round":
        l = this.drawCircle(b);
    }
    this.bullets[c] = l;
    this.showOnAxis
      ? ((n = isNaN(this.nextAxisY) ? this.axisCoordinate : this.nextY),
        (p = g * e),
        (this.nextAxisY = n + e * d))
      : this.value
      ? ((n = this.value),
        f.recalculateToPercents && (n = (n / f.recBaseValue) * 100 - 100),
        (n = f.getCoordinate(n) - this.bulletY),
        (p = g * e))
      : this.showAt
      ? ((l = this.graphDataItem.values),
        f.recalculateToPercents && (l = this.graphDataItem.percents),
        l &&
          ((n = f.getCoordinate(l[this.showAt]) - this.bulletY), (p = g * e)))
      : ((n = this.nextY), (p = g * e));
    a.translate(k, p);
    b.push(a);
    b.translate(0, n);
    this.addEventListeners(b, c);
    this.nextY = n + e * d;
    this.stackDown = h;
  },
  addEventListeners: function (a, b) {
    var c = this;
    a.click(function () {
      c.handleClick(b);
    })
      .mouseover(function () {
        c.handleMouseOver(b);
      })
      .touchend(function () {
        c.handleMouseOver(b, !0);
      })
      .mouseout(function () {
        c.handleMouseOut(b);
      });
  },
  drawPin: function (a) {
    var b = -1;
    this.stackDown && (b = 1);
    var c = this.fontSize + 4;
    return this.drawRealPolygon(
      a,
      [0, c / 2, c / 2, -c / 2, -c / 2, 0],
      [0, (b * c) / 4, b * (c + c / 4), b * (c + c / 4), (b * c) / 4, 0]
    );
  },
  drawSign: function (a) {
    var b = -1;
    this.stackDown && (b = 1);
    var c = this.mastHeight * b,
      d = this.fontSize / 2 + 2,
      e = AmCharts.line(
        this.container,
        [0, 0],
        [0, c],
        this.borderColor,
        this.borderAlpha,
        1
      ),
      h = AmCharts.circle(
        this.container,
        d,
        this.backgroundColor,
        this.backgroundAlpha,
        1,
        this.borderColor,
        this.borderAlpha
      );
    h.translate(0, c + d * b);
    a.push(e);
    a.push(h);
    this.set.push(a);
    return h;
  },
  drawFlag: function (a) {
    var b = -1;
    this.stackDown && (b = 1);
    var c = this.fontSize + 4,
      d = this.labelWidth + 6,
      e = this.mastHeight,
      b = 1 == b ? b * e : b * e - c,
      e = AmCharts.line(
        this.container,
        [0, 0],
        [0, b],
        this.borderColor,
        this.borderAlpha,
        1
      ),
      c = AmCharts.polygon(
        this.container,
        [0, d, d, 0],
        [0, 0, c, c],
        this.backgroundColor,
        this.backgroundAlpha,
        1,
        this.borderColor,
        this.borderAlpha
      );
    c.translate(0, b);
    a.push(e);
    a.push(c);
    this.set.push(a);
    return c;
  },
  drawTriangleUp: function (a) {
    var b = this.fontSize + 7;
    return this.drawRealPolygon(a, [0, b / 2, -b / 2, 0], [0, b, b, 0]);
  },
  drawArrowUp: function (a) {
    var b = this.size,
      c = b / 2,
      d = b / 4;
    return this.drawRealPolygon(
      a,
      [0, c, d, d, -d, -d, -c, 0],
      [0, c, c, b, b, c, c, 0]
    );
  },
  drawArrowDown: function (a) {
    var b = this.size,
      c = b / 2,
      d = b / 4;
    return this.drawRealPolygon(
      a,
      [0, c, d, d, -d, -d, -c, 0],
      [0, -c, -c, -b, -b, -c, -c, 0]
    );
  },
  drawTriangleDown: function (a) {
    var b = this.fontSize + 7;
    return this.drawRealPolygon(a, [0, b / 2, -b / 2, 0], [0, -b, -b, 0]);
  },
  drawTriangleLeft: function (a) {
    var b = this.fontSize + 7;
    return this.drawRealPolygon(a, [0, b, b, 0], [0, -b / 2, b / 2]);
  },
  drawTriangleRight: function (a) {
    var b = this.fontSize + 7;
    return this.drawRealPolygon(a, [0, -b, -b, 0], [0, -b / 2, b / 2, 0]);
  },
  drawRealPolygon: function (a, b, c) {
    b = AmCharts.polygon(
      this.container,
      b,
      c,
      this.backgroundColor,
      this.backgroundAlpha,
      1,
      this.borderColor,
      this.borderAlpha
    );
    a.push(b);
    this.set.push(a);
    return b;
  },
  drawCircle: function (a) {
    shape = AmCharts.circle(
      this.container,
      this.fontSize / 2,
      this.backgroundColor,
      this.backgroundAlpha,
      1,
      this.borderColor,
      this.borderAlpha
    );
    a.push(shape);
    this.set.push(a);
    return shape;
  },
  drawTextBackground: function (a, b) {
    var c = b.getBBox(),
      d = -c.width / 2 - 5,
      e = c.width / 2 + 5,
      c = -c.height - 12;
    return this.drawRealPolygon(
      a,
      [d, -5, 0, 5, e, e, d, d],
      [-5, -5, 0, -5, -5, c, c, -5]
    );
  },
  handleMouseOver: function (a, b) {
    b || this.bullets[a].attr({ fill: this.rollOverColors[a] });
    var c = this.eventObjects[a],
      d = {
        type: "rollOverStockEvent",
        eventObject: c,
        graph: this.graph,
        date: this.date,
      },
      e = this.bulletConfig.eventDispatcher;
    d.chart = e;
    e.fire(d.type, d);
    c.url && this.bullets[a].setAttr("cursor", "pointer");
    this.chart.showBalloon(
      AmCharts.fixNewLines(c.description),
      e.stockEventsSettings.balloonColor,
      !0
    );
  },
  handleClick: function (a) {
    a = this.eventObjects[a];
    var b = {
        type: "clickStockEvent",
        eventObject: a,
        graph: this.graph,
        date: this.date,
      },
      c = this.bulletConfig.eventDispatcher;
    b.chart = c;
    c.fire(b.type, b);
    b = a.urlTarget;
    b || (b = c.stockEventsSettings.urlTarget);
    AmCharts.getURL(a.url, b);
  },
  handleMouseOut: function (a) {
    this.bullets[a].attr({ fill: this.backgroundColors[a] });
    a = {
      type: "rollOutStockEvent",
      eventObject: this.eventObjects[a],
      graph: this.graph,
      date: this.date,
    };
    var b = this.bulletConfig.eventDispatcher;
    a.chart = b;
    b.fire(a.type, a);
  },
});
