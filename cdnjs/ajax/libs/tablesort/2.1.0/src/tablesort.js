;(function() {
    function Tablesort(el, options) {
        if (!el) throw new Error('Element not found');
        if (el.tagName !== 'TABLE') throw new Error('Element must be a table');
        this.init(el, options || {});
    }

    Tablesort.prototype = {

        init: function(el, options) {
            var that = this,
                firstRow;
            this.thead = false;
            this.options = options;

            if (el.rows && el.rows.length > 0) {
                if (el.tHead && el.tHead.rows.length > 0) {
                    firstRow = el.tHead.rows[el.tHead.rows.length - 1];
                    that.thead = true;
                } else {
                    firstRow = el.rows[0];
                }
            }

            if (!firstRow) return;

            var onClick = function() {
                if (that.current && that.current !== this) {
                    if (that.current.classList.contains(classSortUp)) {
                        that.current.classList.remove(classSortUp);
                    }
                    else if (that.current.classList.contains(classSortDown)) {
                        that.current.classList.remove(classSortDown);
                    }
                }

                that.current = this;
                that.sortTable(this);
            };

            var defaultSort;

            // Assume first row is the header and attach a click handler to each.
            for (var i = 0; i < firstRow.cells.length; i++) {
                var cell = firstRow.cells[i];
                if (!cell.classList.contains('no-sort')) {
                    cell.classList.add('sort-header');
                    cell.addEventListener('click', onClick, false);

                    if (cell.classList.contains('sort-default')) {
                        defaultSort = cell;
                    }
                }
            }

            if (defaultSort) {
                that.current = defaultSort;
                that.sortTable(defaultSort, true);
            }
        },

        getFirstDataRowIndex: function() {
            // If table does not have a <thead>, assume that first row is
            // a header and skip it.
            if (!this.thead) {
                return 1;
            } else {
                return 0;
            }
        },

        sortTable: function(header, update) {
            var that = this,
                column = header.cellIndex,
                sortFunction,
                t = getParent(header, 'table'),
                item = '',
                i = that.getFirstDataRowIndex();

            if (t.rows.length <= 1) return;

            while (item === '' && i < t.tBodies[0].rows.length) {
                item = getInnerText(t.tBodies[0].rows[i].cells[column]);
                item = item.trim();
                // Exclude cell values where commented out HTML exists
                if (item.substr(0, 4) === '<!--' || item.length === 0) {
                    item = '';
                }
                i++;
            }

            if (item === '') return;

            // Possible sortFunction scenarios
            var sortCaseInsensitive = function(a, b) {
                var aa = getInnerText(a.cells[that.col]).toLowerCase(),
                    bb = getInnerText(b.cells[that.col]).toLowerCase();

                if (aa === bb) return 0;
                if (aa < bb) return 1;

                return -1;
            };

            var sortNumber = function(a, b) {
                var aa = getInnerText(a.cells[that.col]),
                    bb = getInnerText(b.cells[that.col]);

                aa = cleanNumber(aa);
                bb = cleanNumber(bb);
                return compareNumber(bb, aa);
            };

            var sortDate = function(a, b) {
                var aa = getInnerText(a.cells[that.col]).toLowerCase(),
                    bb = getInnerText(b.cells[that.col]).toLowerCase();
                return parseDate(bb) - parseDate(aa);
            };

            var sortDotSep = function(a, b) {
                var aa = getInnerText(a.cells[that.col]).split('.'),
                    bb = getInnerText(b.cells[that.col]).split('.');

                for (var i = 0, len = aa.length; i < len; i++) {
                    var aai = parseInt(aa[i]),
                        bbi = parseInt(bb[i]);

                    if (aai == bbi) continue;
                    if (aai < bbi) return -1;
                    if (aai > bbi) return 1;
                }
                return 0;
            };

            // Sort dot separted numbers, e.g. ip addresses or version numbers
            if (/^(\d+\.)+\d+$/.test(item)) {
                sortFunction = sortDotSep;
            // Sort as number if a currency key exists or number
            } else if (item.match(/^-?[??\x24?????????]?\d+\s*([,\.]\d{0,2})/) || // prefixed currency
                item.match(/^-?\d+\s*([,\.]\d{0,2})?[??\x24?????????]/) || // suffixed currency
                item.match(/^-?(\d)*-?([,\.]){0,1}-?(\d)+([E,e][\-+][\d]+)?%?$/) // number
            ) {
                sortFunction = sortNumber;
            } else if (testDate(item)) {
                sortFunction = sortDate;
            } else {
                sortFunction = sortCaseInsensitive;
            }

            this.col = column;
            var newRows = [],
                noSorts = {},
                j,
                totalRows = 0;

            for (i = 0; i < t.tBodies.length; i++) {
                for (j = 0; j < t.tBodies[i].rows.length; j++) {
                    var tr = t.tBodies[i].rows[j];
                    if (tr.classList.contains('no-sort')) {
                        // keep no-sorts in separate list to be able to insert
                        // them back at their original position later
                        noSorts[totalRows] = tr;
                    } else {
                        // Save the index for stable sorting
                        newRows.push({
                            tr: tr,
                            index: totalRows
                        });
                    }
                    totalRows++;
                }
            }

            var sortUp   = that.options.descending ? classSortDown : classSortUp,
                sortDown = that.options.descending ? classSortUp : classSortDown;

            if (!update) {
                if (header.classList.contains(sortUp)) {
                    header.classList.remove(sortUp);
                    header.classList.add(sortDown);
                } else {
                    header.classList.remove(sortDown);
                    header.classList.add(sortUp);
                }
            } else if (!header.classList.contains(sortUp) && !header.classList.contains(sortDown)) {
                header.classList.add(sortUp);
            }

            // Make a stable sort function
            var stabilize = function(sort) {
                return function(a, b) {
                    var unstableResult = sort(a.tr, b.tr);
                    if (unstableResult === 0) {
                        return a.index - b.index;
                    }
                    return unstableResult;
                };
            };

            // Make an `anti-stable` sort function. If two elements are equal
            // under the original sort function, then there relative order is
            // reversed.
            var antiStabilize = function(sort) {
                return function(a, b) {
                    var unstableResult = sort(a.tr, b.tr);
                    if (unstableResult === 0) {
                        return b.index - a.index;
                    }
                    return unstableResult;
                };
            };

            // Before we append should we reverse the new array or not?
            // If we reverse, the sort needs to be `anti-stable` so that
            // the double negatives cancel out
            if (header.classList.contains(classSortDown)) {
                newRows.sort(antiStabilize(sortFunction));
                newRows.reverse();
            } else {
                newRows.sort(stabilize(sortFunction));
            }

            // append rows that already exist rather than creating new ones
            var noSortsSoFar = 0;
            for (i = 0; i < totalRows; i++) {
                var whatToInsert;
                if (noSorts[i]) {
                    // We have a no-sort row for this position, insert it here.
                    whatToInsert = noSorts[i];
                    noSortsSoFar++;
                } else {
                    whatToInsert = newRows[i - noSortsSoFar].tr;
                }
                // appendChild(x) moves x if already present somewhere else in the DOM
                t.tBodies[0].appendChild(whatToInsert);
            }
        },

        refresh: function() {
            if (this.current !== undefined) {
                this.sortTable(this.current, true);
            }
        }
    };

    var classSortUp   = 'sort-up',
        classSortDown = 'sort-down';

    var week       = /(Mon|Tue|Wed|Thu|Fri|Sat|Sun)\.?\,?\s*/i,
        commonDate = /\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/,
        month      = /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i;

    var testDate = function(date) {
            return (
                date.search(week) !== -1 ||
                date.search(commonDate) !== -1  ||
                date.search(month !== -1)
            ) !== -1 && !isNaN(parseDate(date));
        },

        parseDate = function(date) {
            date = date.replace(/\-/g, '/');
            date = date.replace(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2})/, '$1/$2/$3'); // format before getTime
            return new Date(date).getTime();
        },

        getParent = function(el, pTagName) {
            if (el === null) {
                return null;
            } else if (el.nodeType === 1 && el.tagName.toLowerCase() === pTagName.toLowerCase()) {
                return el;
            } else {
                return getParent(el.parentNode, pTagName);
            }
        },

        getInnerText = function(el) {
            var that = this;

            if (typeof el === 'string' || typeof el === 'undefined') return el;

            var str = el.getAttribute('data-sort') || '';

            if (str) {
                return str;
            } else if (el.textContent) {
                return el.textContent;
            } else if (el.innerText) {
                return el.innerText;
            }

            var cs = el.childNodes,
                l = cs.length;

            for (var i = 0; i < l; i++) {
                switch (cs[i].nodeType) {
                    case 1:
                        // ELEMENT_NODE
                        str += that.getInnerText(cs[i]);
                    break;
                    case 3:
                        // TEXT_NODE
                        str += cs[i].nodeValue;
                    break;
                }
            }

            return str;
        },

        compareNumber = function(a, b) {
            var aa = parseFloat(a),
                bb = parseFloat(b);

            a = isNaN(aa) ? 0 : aa;
            b = isNaN(bb) ? 0 : bb;
            return a - b;
        },

        cleanNumber = function(i) {
            return i.replace(/[^\-?0-9.]/g, '');
        };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = Tablesort;
    } else {
        window.Tablesort = Tablesort;
    }
})();
