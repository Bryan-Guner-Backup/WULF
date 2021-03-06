/**----------------------------------------------------------------------------+
| Product:  ajile [com.iskitz.ajile]
| @version  1.6.1
|+-----------------------------------------------------------------------------+
| @author   Michael A. I. Lee [iskitz.com]
|
| Created:  Tuesday,   November   4, 2003    [2003.11.04]
| Updated:  Monday,    February   4, 2013    [2013.02.04.15.00-08.00]
|+-----------------------------------------------------------------------------+
|
| [ajile] - Advanced JavaScript Importing & Loading Extension is a JavaScript
|           module that adds namespacing and importing capabilities to the
|           JavaScript Language.
|
|           Visit http://ajile.net/ to start creating
|
|                  "Smart scripts that play nice!"
|
|           Copyright (c) 2003-2013 Michael A. I. Lee, iSkitz.com
|
|+-----------------------------------------------------------------------------+
|
| ***** BEGIN LICENSE BLOCK *****
| Version: MPL 1.1/GPL 2.0/LGPL 2.1
|
| The contents of this file are subject to the Mozilla Public License Version
| 1.1 (the "License"); you may not use this file except in compliance with
| the License. You may obtain a copy of the License at
| http://www.mozilla.org/MPL/
|
| Software distributed under the License is distributed on an "AS IS" basis,
| WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
| for the specific language governing rights and limitations under the
| License.
|
| The Original Code is ajile.
|
| The Initial Developer of the Original Code is Michael A. I. Lee
|
| Portions created by the Initial Developer are Copyright (C) 2003-2013
| the Initial Developer. All Rights Reserved.
|
| Contributor(s): Michael A. I. Lee [ http://ajile.net/ ]
|
| Alternatively, the contents of this file may be used under the terms of
| either the GNU General Public License Version 2 or later (the "GPL"), or
| the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
| in which case the provisions of the GPL or the LGPL are applicable instead
| of those above. If you wish to allow use of your version of this file only
| under the terms of either the GPL or the LGPL, and not to allow others to
| use your version of this file under the terms of the MPL, indicate your
| decision by deleting the provisions above and replace them with the notice
| and other provisions required by the GPL or the LGPL. If you do not delete
| the provisions above, a recipient may use your version of this file under
| the terms of any one of the MPL, the GPL or the LGPL.
|
| ***** END LICENSE BLOCK *****
*-----------------------------------------------------------------------------*/
(function (AT, a, d) {
  var A3, B, f, c;
  if (typeof Al != "undefined" && Al() > 1) {
    return;
  }
  var BE = true,
    Ak = false,
    l = false,
    i = true,
    Ad = true,
    p = false,
    U = false;
  var AE = "Ajile",
    Ax = "Powered by ",
    Ao = "index",
    O = ".js",
    E = "<*>",
    A6 = "com.iskitz.ajile",
    m,
    t = [AE, "Import", "ImportAs", "Include", "Load", "Namespace"],
    N = [
      "JSBasePath",
      "JSImport",
      "JSPackage",
      "JSPackaging",
      "JSPacked",
      "JSPath",
      "NamespaceException",
      "Package",
      "PackageException",
    ];
  var Ay,
    Ae,
    BF = "__LOADED__",
    A4,
    z = "",
    AZ;
  var I = [
    "*",
    "|",
    ":",
    '"',
    "<",
    ">",
    "?",
    "[",
    "{",
    "(",
    ")",
    "}",
    "]",
    "\x5c",
    "&",
    "@",
    "#",
    "\x24",
    "%",
    "!",
    ";",
    "'",
    "=",
    "+",
    "~",
    ",",
    "^",
    "_",
    " ",
    "`",
    "-",
    "\x2f",
    ".",
  ];
  var k = /(cloakoff|cloak)/,
    P = /(debugoff|debug)/,
    At = /(legacyoff|legacy)/,
    r = /(mvcoff|mvc)/,
    AU = /(mvcshareoff|mvcshare)/,
    AX = /(overrideoff|override)/,
    J = /(refreshoff|refresh)/,
    M = /(.*\/)[^\/]+/,
    AL = /(.*)\.[^\.]+/,
    V = /(\/\.\/)|(\/[^\/]*\/\.\.\/)/,
    u = /:\/\x2f/;
  function Al(BH) {
    if (typeof A == "undefined" || typeof Aa == "undefined") {
      return 0;
    }
    if ((BH = BH || A())) {
      return 3;
    }
    Ae = new AF(x(A6));
    if (!p && (BH = BH || (AZ = Ac(A6)))) {
      return 2;
    }
    Ae.version = AT = AT || Ae.version;
    e((AZ = AZ || {}).constructor);
    e(AM);
    y();
    if (!A3) {
      Ae.fullName = A6;
      Ae.path = "/use/";
      Ae.shortName = AE;
    }
    Ai(AC);
    AS();
    Af.add(A6, AE);
    As.add(A6, AE);
    AG(AE, A6, AZ);
    A9();
    return 1;
  }
  function A8(BH) {
    if (BH && BH != A6) {
      AJ(BH);
      return;
    }
    Aw(AC);
    AB.clear();
    s.clear();
    C.clear();
    j.clear();
    Af.clear();
    As.clear();
    Aa.clear();
    q(false);
    AC();
    A4 = null;
    Az(t.concat(N));
    AA(A6);
  }
  function F(BJ, BH) {
    if (BJ == G) {
      return;
    }
    var BI = AB.get(G);
    !BI && (BI = new AY()) && AB.add(G, BI);
    BI.add(BJ, BH);
  }
  function Ai(BH, BK) {
    q();
    var BM,
      BI = [];
    switch (true) {
      case !BK || !A0(BK):
        if (!A0(BH)) {
          return false;
        }
        BK = BH;
        BH = d;
        break;
      case !!BH && !BB(BH):
        if (!D(BH) || !A0(BK)) {
          return false;
        }
        BM = AD(BH, BK, BI);
        BH = d;
        break;
    }
    if (BH == E && this == a[AE]) {
      return false;
    }
    !BH && this != a[AE] && (BH = E);
    !BH && (BH = "");
    var BJ = s.get(BH);
    BK = { listen: BM || BK, notify: BI };
    !BJ && (BJ = new AY()) && s.add(BH, BJ);
    BJ.add(Math.random(), BK);
    BH && (As.has(BH) || Ac(BH)) && (BI[BI.length] = L(BK.listen, BH));
    if (!BH) {
      if (As.getSize() > 0 || Af.getSize() == 0) {
        for (var BL in As.getAll()) {
          "undefined" == typeof Object.prototype[BL] &&
            (BI[BI.length] = L(BK.listen, BL));
        }
      }
    }
    BH && new h(BH).start();
    return true;
  }
  function AD(BH, BK, BJ) {
    return function BI(BM) {
      for (var BN = 0, BL = BH.length; BN < BL; BN++) {
        if (!Ac(BH[BN])) {
          return false;
        }
      }
      BJ[BJ.length] = L(BK, BH);
    };
  }
  function Ah(BH) {
    if (BH == G) {
      return;
    }
    var BI = Aa.get(BH);
    !BI && (BI = new AY()) && Aa.add(BH, BI);
    BI.add(G);
  }
  function AC(BI) {
    for (var BO, BM, BL, BK, BN, BH = Ar(), BJ = BH.length; --BJ >= 0; ) {
      if (!BH[BJ]) {
        continue;
      }
      BO = BH[BJ].title;
      if (!BO) {
        continue;
      }
      BM = false;
      BN = !!BO && BO.indexOf(A6) == 0;
      BO && (BL = Ac(BO)) && (BK = Av(BO)) && (BM = BK.hasOption("cloak"));
      if (BL && (BN || (BK && BM) || BE || !BH[BJ].src)) {
        e(A0(BL) ? BL : BL.constructor);
        Ap(BH[BJ]);
      }
    }
  }
  function Ap(BI, BH) {
    if (f) {
      Ap = function BJ(BM, BL) {
        if ((BL = BL || BM.parentNode)) {
          if (BL.removeChild) {
            BL.removeChild(BM);
          }
        }
      };
    } else {
      if (B) {
        Ap = new Function(
          "element",
          "container",
          'if(container){  try { container.removeChild(element); }catch(e){}  return;}try { document.getElementsByTagName("head")[0].removeChild(element); }catch(e){try { document.body.removeChild(element);}catch(e){}}'
        );
      } else {
        Ap = function BK() {};
      }
    }
    if (BI) {
      Ap(BI, BH);
    }
  }
  function e(BH) {
    if (!BH || !BH.toString || BH === Function || BH === Object) {
      return false;
    }
    BH.toString = cloakObjectToggler;
    return true;
  }
  cloakObjectToggler = function () {};
  function AR(BI, BH) {
    return BI - BH;
  }
  function S(BL) {
    var BI = !BB(BL) ? Af.getAllArray() : [[BL, Af.get(BL) || BL]];
    if (!BI) {
      return;
    }
    for (var BK, BH, BJ = BI.length; --BJ >= 0; ) {
      BL = BI[BJ][0];
      BK = Ac(BL);
      if (!BK || !Aq(BL)) {
        continue;
      }
      Y((BH = BI[BJ][1]), BL, arguments);
      if (BH == "*") {
        BH = d;
      }
      AG(BH, BL, BK);
      v(BL);
    }
  }
  function AI(BH) {
    return (
      AE +
      ".GetPathFor(" +
      BH +
      ") is not supported. Namespace paths are protected."
    );
  }
  function BC(BH) {
    this.name = "DEPRECATED: " + A6 + ".NamespaceException";
    this.message = "DEPRECATED: Invalid _namespace name [" + BH + "]";
    this.toString = BI;
    function BI() {
      return "[ " + this.name + " ] :: " + this.message;
    }
  }
  function X(BH) {
    if (BB(BH)) {
      Ae.path = BH;
    }
  }
  function Az(BI) {
    if (!B) {
      for (var BH = BI.length; --BH >= 0; a[BI[BH]] = d) {}
    } else {
      (Az = new Function(
        "SYS",
        "global",
        "  try     { for(var i=SYS.length; --i >= 0; delete global[SYS[i]]);      }  catch(e){ for(var j=SYS.length; --j >= 0; global[SYS[j]] = undefined); }"
      ))(BI, a);
    }
  }
  function AA(BL) {
    if (!BL) {
      return;
    }
    var BK = {},
      BI = BL.split("\x2e"),
      BJ = a[BI[0]];
    for (var BH = 1; typeof BI[BH] != "undefined"; BH++) {
      if (typeof BJ[BI[BH]] == "undefined") {
        break;
      }
      BK[BI[BH - 1]] = [BH, true];
      BJ = BJ[BI[BH]];
      for (var BM in BJ) {
        if ("undefined" == typeof Object.prototype[BM]) {
          if (BM != BI[BH]) {
            BK[BI[BH - 1]][1] = false;
            break;
          }
        }
      }
    }
    for (BJ in BK) {
      if ("undefined" == typeof Object.prototype[BJ]) {
        if (BK[BJ][1]) {
          AJ(BI.slice(0, BK[BJ][0] + 1).join("."));
        }
      }
    }
  }
  function AJ(BJ) {
    var BH;
    Af.remove(BJ);
    As.remove(BJ);
    if (BJ) {
      if (!BB(BJ)) {
        if ((BJ = Av(BJ))) {
          BJ = BJ.fullName;
          BH = BJ.shortName;
        }
      }
      if (!BH && BJ) {
        BH = BJ.substring(BJ.lastIndexOf("\x2e") + 1);
      }
      BJ = AL.exec(BJ);
      BJ = BJ ? BJ[1] : d;
    }
    var BI = Ac(BJ);
    if (BI && BH) {
      if (BH == "*" || typeof BI[BH] != "undefined") {
        if (BH != "*") {
          if (BI[BH] == a[BH]) {
            a[BH] = d;
          }
          delete BI[BH];
        } else {
          for (var BK in BI) {
            if ("undefined" == typeof Object.prototype[BK]) {
              delete BI[BK];
            }
          }
          AA(BJ);
        }
      }
    }
    AC(BJ);
  }
  function AW(BL) {
    var BH = BL;
    var BM = Af.getAllArray();
    for (var BJ, BK = 0, BI = BM.length; BK < BI; ++BK) {
      if (As.has((BJ = BM[BK][0]))) {
        continue;
      }
      if ("*" != BM[BK][1]) {
        BH = AL.exec(BJ);
      }
      if (!(BH && BL == BH[1])) {
        continue;
      }
      As.add((G = BJ));
      return;
    }
    G = Ao;
  }
  function q(BJ, BH) {
    var BI = (BH = BH || a || this).onload;
    if (BI === R) {
      BJ == d && (BJ = true);
      !BJ && (BH.onload = R(true));
      return;
    }
    if (BI && BI != R.onLoad) {
      R.onLoad = BI;
    }
    e((BH.onload = R));
  }
  function R(BI) {
    q = function () {};
    var BH = R.onLoad;
    delete R.onLoad;
    S();
    AC();
    return BH && A0(BH) && BH(BI);
  }
  function AO(BH) {
    if (!BH) {
      return window.document;
    }
    if (typeof BH.write == "undefined") {
      if (typeof BH.document != "undefined") {
        BH = BH.document;
      } else {
        if (typeof BH.parentNode != "undefined") {
          return AO(BH.parentNode);
        } else {
          return window.document;
        }
      }
    }
    return BH;
  }
  function BG(BH, BN) {
    if (!BN) {
      return d;
    }
    var BM = BN.split("\x2e");
    var BI;
    for (var BL = BH == BN, BK = 0, BJ = BM.length; BK < BJ; BK++) {
      if (isNaN(BM[BK])) {
        continue;
      }
      BN = BM.slice(0, BK).join("\x2e");
      BH = BL ? BN : BH || BM.slice(BK - 1, BK)[0];
      BI = BM.slice(BK).join("\x2e");
      break;
    }
    if (!BI) {
      return d;
    }
    return [BH, BN, BI];
  }
  function L(BJ, BH) {
    return setTimeout(function BI() {
      BJ(BH);
    }, 0);
  }
  function Ar(BI) {
    if (!(BI = AO(BI))) {
      return d;
    }
    var BH =
      typeof BI.scripts != "undefined" &&
      typeof BI.scripts.length != "undefined" &&
      BI.scripts.length > 0
        ? BI.scripts
        : typeof BI.getElementsByTagName != "undefined"
        ? BI.getElementsByTagName("script") || []
        : [];
    return BH;
  }
  function AK(BH) {
    if (BH) {
      if ((!A4 || f) && !B) {
        if ((A4 && c && BH != A4.ownerDocument) || !A4 || (!c && f)) {
          if (BH.lastChild && BH.lastChild.firstChild) {
            A4 = BH.lastChild.firstChild;
          }
        }
      } else {
        if (!A4 && B) {
          A4 = Ay;
        }
      }
    }
    return A4;
  }
  function Z(BJ) {
    Am(BJ);
    if (!BJ || !BB(BJ)) {
      return [];
    }
    var BI = O ? BJ.lastIndexOf(O) : BJ.lastIndexOf("\x2e");
    if (BI < BJ.length && BI >= 0) {
      var BK = BJ.slice(BI, BI + O.length);
      var BH = BJ.substring(0, BI);
      if (BH && isNaN(BH.charAt(0))) {
        BH = "";
      }
    }
    return [BH, BK];
  }
  function Ac(BL, BH) {
    if (!BB(BL)) {
      return d;
    }
    var BK = BH || a;
    BL = BL.split("\x2e");
    for (var BJ = 0, BI = BL.length; BJ < BI; BJ++) {
      if (typeof BK[BL[BJ]] != "undefined") {
        BK = BK[BL[BJ]];
      } else {
        return d;
      }
    }
    return BK;
  }
  function Av(BJ) {
    if (!BJ) {
      return new AF(Ae);
    }
    var BH = BB(BJ);
    for (var BI in j) {
      if ("undefined" == typeof Object.prototype[BI]) {
        if ((BH && BJ == BI) || (!BH && BJ == Ac(BI))) {
          return j[BI];
        }
      }
    }
    return d;
  }
  function x(BY, BO) {
    BY = BY || A6;
    if (BY == A6 && Ae && Ae.path) {
      return Ae;
    }
    var BQ = j[BY];
    if (BQ) {
      return BQ;
    }
    var Ba = AH(BY, BO);
    if ((BQ = n(BY, Ba))) {
      return (j[BY] = BQ);
    }
    var BH = Ar();
    if (!(BH && Ba)) {
      return d;
    }
    var BX;
    for (var BP = false, BS, BU, BW = 0, BV = BH.length; BW < BV; BW++) {
      BS = unescape(BH[BW].src);
      if (BS && BS.search(u) == -1) {
        BS = unescape(window.location.href);
        if (BS.charAt(BS.length - 1) != m) {
          if ((BU = M.exec(BS)) != null) {
            if (BU[1].length > BS.search(u) + 3) {
              BS = BU[1];
            }
          }
        }
        BS += unescape(BH[BW].src);
      }
      if (BS == d || BS == null) {
        continue;
      }
      while (V.test(BS)) {
        BS = BS.replace(V, "\x2f");
      }
      if (C.has(BS)) {
        continue;
      }
      C.add(BS);
      if (BP) {
        continue;
      }
      var BJ;
      for (var BK in Ba) {
        if (typeof Object.prototype[BK] != "undefined") {
          continue;
        }
        BJ = Ba[BK];
        var BZ,
          Bb,
          BM = [];
        for (var BT = BJ.length; --BT >= 0; ) {
          BZ = BJ[BT];
          Bb = BS.lastIndexOf(BZ) + 1;
          if (Bb <= 0 || Bb == BM[0]) {
            continue;
          }
          BM[BM.length] = Bb;
          H("FOUND :: Path [ " + BS + " ]", arguments);
        }
        if (BM.length == 0) {
          continue;
        }
        BM.length > 2 && BM.sort(AR);
        Bb = BM[BM.length - 1];
        BO = Bb == BS.lastIndexOf(BZ) + 1 ? BK : d;
        BX = BS.substring(0, Bb);
        BP = true;
        if (BY == A6 && BH[BW].title != A6) {
          BH[BW].title = A6;
        }
        var BI = Bb + BZ.length - 2;
        var BR = Z(BS.substring(BI + 1));
        var BN = BR[1];
        var BL = BR[0] || (BY == A6 && AT);
        break;
      }
    }
    if (!BX) {
      return d;
    }
    BQ = new AF(BX, BO, BY, d, BL, BN);
    j[BY] = BQ;
    return BQ;
  }
  function n(BX, BY) {
    var BP = Number.MAX_VALUE;
    var BR;
    var BI = [];
    var BS;
    var BL = 0;
    BY = BY || AH(BX);
    var BN = [];
    var BV = C.getAll();
    BV: for (var BT in BV) {
      if (typeof Object.prototype[BT] != "undefined") {
        continue;
      }
      for (var BK in BY) {
        if (typeof Object.prototype[BK] != "undefined") {
          continue;
        }
        BN[BN.length] = BK;
        for (var BJ = BY[BK], BW = BJ.length; --BW >= 0; ) {
          if (0 < (BS = BT.lastIndexOf(BJ[BW]))) {
            BR = BT.length - (BS + BJ[BW].length);
            if (BR < BP) {
              BP = BR;
              BL = BI.length;
            }
            BI[BI.length] = BS + 1;
            var BH = BS + 1 + BJ[BW].length - 2;
            var BU = Z(BT.substring(BH + 1));
            var BO = BU[1];
            var BM = BU[0];
            H("FOUND :: Cached Path [ " + BT + " ]", arguments);
            break BV;
          }
          if (BW == 0) {
            delete BN[--BN.length];
          }
        }
      }
    }
    if (!BI || BI.length == 0) {
      return d;
    }
    BT = BT.substring(0, BI[BL]);
    var BQ = new AF(BT, BN[BL], BX, d, BM, BO);
    if (BQ.path) {
      j[BX] = BQ;
    }
    return BQ;
  }
  function AH(BJ, BL) {
    var BN = m || A5();
    var BH = BL == d ? I : [BL];
    var BK = {};
    for (var BM, BI = BH.length; --BI >= 0; ) {
      BL = BH[BI];
      BM = BN + BJ.replace(/\x2e/g, BL);
      BK[BL] = [BM + BL, BM + O];
    }
    return BK;
  }
  function o() {
    return [
      BE ? "cloak" : "cloakoff",
      Ak ? "debug" : "debugoff",
      l ? "legacy" : "legacyoff",
      i ? "mvc" : "mvcoff",
      Ad ? "mvcshare" : "mvcshareoff",
      p ? "override" : "overrideoff",
      U ? "refresh" : "refreshoff",
    ].join(",");
  }
  function A5(BJ) {
    if (!BJ && m) {
      return m;
    }
    var BK = unescape(window.location.href);
    var BH = BK.lastIndexOf("\x5c") + 1;
    var BI = BK.lastIndexOf("\x2f") + 1;
    m = BH > BI ? "\x5c" : "\x2f";
    return m;
  }
  function An(BI, BO, BL, BN, BK, BM, BH) {
    if (!Af.add(BO, BI)) {
      return BM;
    }
    F(BO, BI == "*" ? BO : BI);
    Ah(BO);
    if (BI == "*") {
      (BI = BF), H('...\t:: Import ("' + BO + '.*")', arguments);
    } else {
      if (BI == BO) {
        H('...\t:: Include ("' + BI + '")', arguments);
      } else {
        H('...\t:: ImportAs ("' + BI + '", "' + BO + '")', arguments);
      }
    }
    if (new h(BO).start()) {
      return BM;
    }
    BL = AQ(BI, BO, BL, BN, BK);
    var BJ = b(
      BL,
      AO(BH || a || this),
      'ImportAs("' + BI + '", "' + BO + '");',
      false,
      BO
    );
    return BM;
  }
  function AQ(BH, BO, BK, BN, BI) {
    l && (BN = BN === false ? "\x2f" : "\x2e");
    !BN && (BN = Ae.notation);
    var BM = BO + (BH == "*" ? ".*" : "");
    var BJ = BM;
    var BL;
    do {
      if ((BM = AL.exec(BM))) {
        BM = BM[1];
      } else {
        break;
      }
      if (BM == BJ) {
        break;
      }
      BJ = BM;
      BL = x(BM, BN);
    } while (!BL);
    !BB(BK) && (BK = (BL && BL.path) || Ae.path || "");
    BK.charAt(BK.length - 1) != "\x2f" && (BK += "\x2f");
    BK += escape(BO.replace(/\x2e/g, BN));
    BI && (BK += "\x2e" + BI);
    BK += O;
    BL && BL.hasOption("refresh") && (BK = AP(BK));
    return BK;
  }
  function AG(BI, BN, BL, BH) {
    BH = BH || a || this;
    if (!BL) {
      return BL;
    }
    if (BI != BF && A1(BI, BN, BH)) {
      Af.remove(BN);
      return BL;
    }
    if (!Aq(BN, BI)) {
      return d;
    }
    var BJ = [],
      BM = Af.get(BN),
      BK = BI == BN || BM == BN;
    if (BI && BI != BF && (!BM || (BM != "*" && BM != BF))) {
      if (BK) {
        BJ[0] = 'SUCCESS :: Include ("' + BN + '")';
      } else {
        (BH[BI] = BL),
          (BJ[0] = 'SUCCESS :: ImportAs ("' + BI + '", "' + BN + '")');
      }
      Af.remove(BN);
      As.add(BN, BI);
    } else {
      if (BM == "*") {
        BA(BI, BN, BL, BH, BK, BJ);
      } else {
        if (BM != "*" && (BM == BF || BI == BF)) {
          BJ[0] =
            "SUCCESS :: " + (BK ? "Include" : "Import") + ' ("' + BN + '.*")';
          Af.remove(BN);
          As.add(BN, "*");
        }
      }
    }
    BJ.length > 0 && H(BJ.join("\r\n"), arguments);
    BI != BN && AM(BI);
    AM(BN);
    return BL;
  }
  function BA(BI, BN, BL, BH, BK, BJ) {
    BJ[BJ.length] = " ";
    if (!BK) {
      var BM;
      for (var BO in BL) {
        if (typeof Object.prototype[BO] != "undefined") {
          continue;
        }
        BM = BN + "." + BO;
        if (j[BM] || A1(BO, BM, BH)) {
          continue;
        }
        BH[BO] = BL[BO];
        BJ[BJ.length] = 'SUCCESS :: ImportAs ("' + BO + '", "' + BM + '")';
      }
    }
    Af.remove(BN);
    if (BI != BF) {
      Af.add(BN, BF);
    }
  }
  function A1(BI, BK, BH) {
    BH = BH || a || this;
    if (
      p ||
      (BK == BI && !Ac(BI)) ||
      typeof BH[BI] == "undefined" ||
      Ac(BK) == BH[BI]
    ) {
      return false;
    }
    var BJ =
      "\nWARNING: There is a naming conflict, " +
      BI +
      " already exists.\nConsider using the override load-time option, " +
      AE +
      '.EnableOverride(),\nor ImportAs with an alias; for example:\n\n\tImportAs ("' +
      BI +
      '1", "' +
      BK +
      '");';
    if (BI == BK) {
      BJ += "\n\nThe module is currently inaccessible.\n";
    } else {
      BJ +=
        "\n\nThe module can currently be accessed using its fully-qualified name:\n\n\t" +
        BK +
        ".\n";
    }
    H(BJ, arguments, Ak);
    return true;
  }
  function AN(BH) {
    return new Function("return /*@cc_on @if(@_jscript)" + BH + "@end @*/;")();
  }
  function W(BK, BI, BJ, BH) {
    return w(d, BK, BI, BJ, BH);
  }
  function w(BS, BL, BH, BQ, BI) {
    q();
    if (!BL || BL == "*") {
      H('ERROR :: ImportAs ("' + BS + '", "' + BL + '")');
      return d;
    }
    var BR, BP;
    if (!BB(BS)) {
      BS = "";
    }
    if ((BR = BG(BS, BL))) {
      BL = BR[1];
      BS = BS != BF ? BR[0] : BF;
      BP = BR[2];
    } else {
      if (!BS) {
        BS = BL.substring(BL.lastIndexOf("\x2e") + 1);
      }
    }
    BI = BI || a || this;
    if (BS == "*") {
      BL = AL.exec(BL)[1];
    } else {
      if (typeof BI[BS] != "undefined" && BS != BL) {
        for (var BT = l ? t.concat(N) : t, BU = BT.length; --BU >= 0; ) {
          if (BS != BT[BU]) {
            continue;
          }
          H(
            'ERROR :: ImportAs ("' +
              BS +
              '", "' +
              BL +
              '")! ' +
              BS +
              " is restricted.",
            arguments
          );
          return BI[BS];
        }
      }
    }
    var BJ = BI;
    var BO = "";
    for (var BK = BL.split("\x2e"), BN = 0, BM = BK.length; BN < BM; BN++) {
      if (typeof BJ[BK[BN]] != "undefined") {
        BJ = BJ[BK[BN]];
        BO += BK[BN] + "\x2e";
      } else {
        break;
      }
    }
    if (BN >= BM && BS != "*") {
      if (Af.has(BL) || !As.has(BL)) {
        BJ = AG(BS, BL, BJ, BI);
        v(BL);
      }
      return BJ;
    }
    if (Af.has(BL)) {
      if (BS == "*" || BS == BF) {
        BS = BL;
      }
      F(BL, BS);
      Ah(BL);
      return d;
    }
    return An(BS, BL, BH, BQ, BP, BJ, BI);
  }
  function h(BL, BJ, BH) {
    var BK,
      BP,
      BN = 0;
    function BM(BQ) {
      BH = BH || 500;
      BQ.start = BI;
      BQ.stop = BO;
      BK = setInterval(BO, (BJ = BJ || 60000));
      return BQ;
    }
    function BI() {
      switch (true) {
        case ++BN >= BH:
          BO();
          return false;
        case !!Ac(BL) && Aq(BL):
          S(BL);
          return true;
        default:
          BP = setTimeout(BI, 0);
          return false;
      }
    }
    function BO() {
      d != BP && clearTimeout(BP);
      d != BK && clearInterval(BK);
    }
    if (this.constructor != h) {
      if (!this.constructor || this.constructor.toString() != h.toString()) {
        return new h(BL, BJ, BH);
      }
    }
    return BM(this);
  }
  function A7(BK, BI, BJ, BH) {
    BK && (BK = BK.split(".*").join(""));
    return w(BK, BK, BI, BJ, BH);
  }
  function D(BH) {
    if (!!Array.isArray) {
      D = Array.isArray;
      return D(BH);
    }
    return (
      BH &&
      (Array == BH.constructor || Array.toString() == BH.constructor.toString())
    );
  }
  function A0(BH) {
    return (
      BH != d &&
      BH != null &&
      (typeof BH == "function" || Function == BH.constructor)
    );
  }
  function A() {
    if (typeof document == "undefined") {
      return false;
    }
    var BH = !!document.write && !!document.writeln;
    A3 = !!document.createElement;
    B =
      A3 &&
      !!document.createTextNode &&
      !!document.getElementsByTagName &&
      !!(Ay = document.getElementsByTagName("head")[0]).appendChild &&
      !!Ay.removeChild;
    f =
      B &&
      !!document.firstChild &&
      !!document.lastChild &&
      !!document.parentNode;
    c = f && !!document.ownerDocument;
    return !(BH || A3 || B || f || c);
  }
  function Au(BK, BH) {
    var BJ = BK == G;
    var BI = Af.has(BK);
    if (BJ || Aq(G) || BI) {
      return true;
    }
    Af.add(BK, BH || BK);
    new h(BK).start();
    return false;
  }
  function BB(BH) {
    return (
      BH != null &&
      BH != d &&
      (typeof BH == "string" || BH.constructor == String)
    );
  }
  function Aq(BK, BH) {
    var BI = AB.get(BK);
    BI && (BI = BI.getAll());
    for (var BJ in BI) {
      if ("undefined" == typeof Object.prototype[BJ]) {
        if (!Ac(BI[BJ])) {
          return false;
        }
      }
    }
    return true;
  }
  function b(BJ, BH, BL, BN, BM, BK, BO) {
    q();
    if (!(BH = AO(BH))) {
      H(
        "ERROR :: Container not found. Unable to load:\n\n[" + BJ + "]",
        arguments
      );
      return false;
    }
    if (BJ) {
      C.add(unescape(BJ));
      if (U) {
        BJ = AP(BJ);
      }
    }
    if (!(BK || BO)) {
      BO = "JavaScript";
      BK = "text/javascript";
    }
    if (BN == d) {
      BN = false;
    }
    var BI;
    if (A3 && !g) {
      BI = BH.createElement("script");
    }
    if (!BI) {
      if (BL) {
        BL = "setTimeout('" + BL + "',0);";
      }
      T(BJ, BH, BL, BN, BM, BK, BO);
      return false;
    }
    true && (BI.async = !!BN);
    BN && (BI.defer = BN);
    BO && (BI.language = BO);
    BM && (BI.title = BM);
    BK && (BI.type = BK);
    if (BJ) {
      H("...\t:: Load [ " + BJ + " ]", arguments);
      if (AV || !(BD || Q)) {
        BI.src = BJ;
      }
      AK(BH).appendChild(BI);
      if (!AV || BD || Q) {
        BI.src = BJ;
      }
      H("DONE\t:: Load [ " + BJ + " ]", arguments);
    }
    if (!BL) {
      return true;
    }
    if (BJ) {
      b(d, BH, BL, BN, BM, BK, BO);
      return true;
    }
    if (typeof BI.canHaveChildren == "undefined" || BI.canHaveChildren) {
      BI.appendChild(BH.createTextNode(BL));
    } else {
      if (!BI.canHaveChildren) {
        BI.text = BL;
      }
    }
    AK(BH).appendChild(BI);
    return false;
  }
  function A9() {
    if (!(i || Ad)) {
      return;
    }
    if (Ad) {
      b(Ae.path + Ao + O, null, null, null, Ao);
    }
    if (!i) {
      return;
    }
    var BI = unescape(window.location.pathname);
    var BH = BI.lastIndexOf(m);
    BI = BI.substring(++BH);
    BH = BI.lastIndexOf("\x2e");
    BH = BH == -1 ? 0 : BH;
    if ("" != (BI = BI.substring(0, BH))) {
      Ao = BI;
    }
    b(Ao + O, null, null, null, Ao);
  }
  function Am(BI) {
    if (!BI || !BB(BI)) {
      return;
    }
    var BJ = BI.lastIndexOf("?") + 1;
    BI = BI.substring(BJ).toLowerCase();
    if (BI.length == 0) {
      return;
    }
    var BH;
    if ((BH = k.exec(BI))) {
      BE = BH[1] == "cloak";
    }
    if ((BH = P.exec(BI))) {
      Ak = BH[1] == "debug";
    }
    if ((BH = At.exec(BI))) {
      K(BH[1] == "legacy");
    }
    if ((BH = r.exec(BI))) {
      i = BH[1] == "mvc";
    }
    if ((BH = AU.exec(BI))) {
      Ad = BH[1] == "mvcshare";
    }
    if ((BH = AX.exec(BI))) {
      p = BH[1] == "override";
    }
    if ((BH = J.exec(BI))) {
      U = BH[1] == "refresh";
    }
  }
  function T(BH, BJ, BK, BI, BP, BO, BN) {
    if (!(BJ = AO(BJ || window || this))) {
      return;
    }
    var BM;
    if (BH) {
      H("...\t:: LoadSimple [ " + BH + " ]", arguments);
      if (BK) {
        BM = BK;
        BK = d;
      }
    }
    var BL =
      "<script" +
      (BI ? ' defer="defer"' : "") +
      (BN ? ' language="' + BN + '"' : "") +
      (BP ? ' title="' + BP + '"' : "") +
      (BO ? ' type="' + BO + '"' : "") +
      (BH ? ' src="' + BH + '">' : ">") +
      (BK ? BK + ";" : "") +
      "</script>\n";
    BJ.write(BL);
    if (BH) {
      H("DONE\t:: LoadSimple [ " + BH + " ]", arguments);
    }
    if (!(BK = BK || BM)) {
      return;
    }
    if (BH) {
      T(d, BJ, BK, BI, BP, BO, BN);
    }
  }
  function H(BL, BN, BK) {
    if (!Ak && !BK) {
      return;
    }
    var BJ = /function\s*([^(]*)\s*\(/.exec(BN.callee) || [""],
      BO = BJ.length > 1 ? BJ[1] : BJ[0];
    if (BL != d) {
      var BI = z;
      var BH = new Date();
      z =
        [BH.getFullYear(), BH.getMonth() + 1, BH.getDate()].join(".") +
        "," +
        [
          BH.getHours(),
          BH.getMinutes(),
          BH.getSeconds(),
          BH.getMilliseconds(),
        ].join(":") +
        "\t:: " +
        G +
        " :: " +
        BO +
        "\r\n" +
        BL +
        "\r\n\r\n";
      var BM =
        z.indexOf("ERROR") >= 0
          ? "error"
          : z.indexOf("WARN") >= 0
          ? "warn"
          : "info";
      !H.is
        ? (H.is = {
            Firebug: typeof console != "undefined" && A0(console.info),
            MochiKit: typeof MochiKit != "undefined" && A0(MochiKit.log),
            YAHOO: typeof YAHOO != "undefined" && A0(YAHOO.log),
          })
        : 0;
      H.is.Firebug && console[BM](z);
      H.is.YAHOO && YAHOO.log(z, BM);
      H.is.MochiKit &&
        (BM == "info"
          ? MochiKit.log(z)
          : BM == "error"
          ? MochiKit.logError(z)
          : BM == "warn"
          ? MochiKit.logWarning(z)
          : 0);
      z += BI;
    }
    if (BK) {
      Ag();
    }
  }
  function Y(BH, BK, BJ) {
    var BI =
      BH == "*" || BH == BF
        ? 'Import   ("' + BK + '.*")'
        : BH == BK
        ? 'Include  ("' + BK + '")'
        : 'ImportAs ("' + BH + '", "' + BK + '")';
    H("CHECKING :: " + BI + "...", BJ);
  }
  function Aj(BI, BP, BN, BH) {
    q();
    BI = BI || "\x3cdefault\x3e";
    H('Namespace ("' + BI + '")', arguments);
    var BO = BH || a || this;
    if (BI == "\x3cdefault\x3e") {
      Ae.update(BP, BN);
      H(Ae, arguments);
      return BO;
    }
    AW(BI);
    var BJ = BI.split("\x2e");
    for (var BM = 0, BL = BJ.length; BM < BL; BM++) {
      BO = typeof BO[BJ[BM]] != "undefined" ? BO[BJ[BM]] : (BO[BJ[BM]] = {});
    }
    var BK = j[BI];
    if (BK) {
      BK.update(BP, BN);
      H(BK, arguments);
      return BO;
    }
    if (!BP) {
      BK = x(BI, BN);
    }
    if (BP || !BK) {
      BK = new AF(BP, BN, BI);
    }
    if (BK && !j[BI]) {
      j[BI] = BK;
    }
    H(BK, arguments);
    return BO;
  }
  function AF(BR, BO, BI, BP, BL, BQ, BS) {
    function BM(BT) {
      BN();
      BT.hasOption = BK;
      BT.toString = BH;
      BT.update = BJ;
      BT.update(BR, BO, BI, BP, BL, BQ, BS);
      return BT;
    }
    function BN() {
      if (!(BR && BR.constructor == AF)) {
        return;
      }
      var BT = BR;
      BQ = BT.extension;
      BI = BT.fullName;
      BO = BT.notation;
      BS = BT.options;
      BR = BT.path;
      BP = BT.shortName;
      BL = BT.version;
    }
    function BK(BT) {
      BS = BS || this.options;
      if (!(BS && BT && BS.indexOf(BT) >= 0)) {
        return false;
      }
      var BU = new RegExp("(" + BT + ")[,$]", "g").exec(BS);
      return !!BU && typeof BU[1] != "undefined" && BU[1] == BT;
    }
    function BH() {
      return (
        "NamespaceInfo\r\n[ fullName: " +
        this.fullName +
        "\r\n, shortName: " +
        this.shortName +
        "\r\n, version: " +
        this.version +
        "\r\n, notation: " +
        this.notation +
        "\r\n, options: " +
        this.options +
        "\r\n, path: " +
        this.path +
        "\r\n, uri: " +
        this.uri +
        "\r\n]"
      );
    }
    function BJ(BX, BW, BY, BT, BU, BZ, BV) {
      this.extension = BZ || this.extension || O;
      this.fullName = BY || this.fullName || "";
      this.shortName = BT || this.shortName || "";
      this.notation = BB(BW)
        ? BW
        : this.notation || (Ae && BB(Ae.notation) ? Ae.notation : "\x2e");
      this.options = BB(BV) ? BV : this.options || o();
      this.path = BB(BX) ? BX : this.path || (Ae && BB(Ae.path) ? Ae.path : "");
      this.uri = this.path + this.fullName.replace(/\x2e/g, this.notation);
      this.version = "" + (BU || this.version || "");
      if (!this.uri) {
        return;
      }
      this.uri += (this.version ? "\x2e" + this.version : "") + this.extension;
    }
    if (this.constructor != AF) {
      if (!this.constructor || this.constructor.toString() != AF.toString()) {
        return new AF(BR, BO, BI, BP, BL, BQ, BS);
      }
    }
    return BM(this);
  }
  function AM(BL) {
    var BN = [s.get(""), s.get(BL), s.get(E)];
    if (!BN[0] && !BN[1] && !BN[2]) {
      return;
    }
    var BH = (BN[0] && BN[0].getSize() > 0) || (BN[1] && BN[1].getSize() > 0);
    Ak && BH && H("NOTIFY :: Import Listeners for " + BL + "...", arguments);
    for (var BK, BJ, BI = BN.length; --BI >= 0; ) {
      if (!BN[BI]) {
        continue;
      }
      BJ = BN[BI].getAll();
      for (var BM in BJ) {
        if ("undefined" == typeof Object.prototype[BM]) {
          if (!BJ[BM]) {
            continue;
          }
          BK = BJ[BM];
          A0(BK.listen) && (BK.notify[BK.notify.length] = L(BK.listen, BL));
        }
      }
    }
    Ak &&
      BH &&
      H("NOTIFY :: Import Listeners for " + BL + "...DONE!", arguments);
  }
  function AS() {
    Aj(A6);
    e((a.Import = W));
    e((a.ImportAs = w));
    e((a.Include = A7));
    e((a.Load = b));
    e((a.Namespace = Aj));
    e((AZ.AddImportListener = Ai));
    e((AZ.EnableLegacy = K));
    e(
      (AZ.GetVersion = function () {
        return AT;
      })
    );
    AZ.GetVersion.toString = AZ.GetVersion.prototype.toString = AZ.GetVersion;
    e((AZ.RemoveImportListener = Aw));
    e((AZ.SetOption = Ab));
    e((AZ.ShowLog = Ag));
    e((AZ.Unload = A8));
    A2("Cloak");
    A2("Debug");
    A2("Override");
    A2("Refresh");
    K(l || false);
  }
  function A2(BH) {
    if (!BH || !BB(BH)) {
      return;
    }
    e(
      (AZ["Enable" + BH] = function (BI) {
        Ab(BH, BI);
      })
    );
  }
  function Aw(BI, BM) {
    q();
    switch (true) {
      case !BM || !A0(BM):
        if (!A0(BI)) {
          return false;
        }
        BM = BI;
        BI = "";
        break;
      case !!BI && !BB(BI):
        if (!D(BI)) {
          return false;
        }
        BI = "";
        break;
    }
    var BK = [s.get(""), s.get(BI), s.get(E)];
    if (!BK[0] && !BK[1] && !BK[2]) {
      return false;
    }
    var BP = false;
    for (var BN, BQ, BR, BO = BK.length; --BO >= 0; ) {
      if (!BK[BO]) {
        continue;
      }
      BQ = BK[BO].getAll();
      for (var BJ in BQ) {
        if ("undefined" == typeof Object.prototype[BJ]) {
          if (!BQ[BJ] || BQ[BJ].listen != BM) {
            continue;
          }
          delete BQ[BJ].listen;
          BR = BQ[BJ].notify;
          for (var BL = 0, BH = BR.length; BL < BH; BL++) {
            clearTimeout(BR[BL]);
            BR[BL] = d;
            delete BR[BL];
          }
          delete BQ[BJ].notify;
          BK[BO].remove(BJ);
          BP = true;
          break;
        }
      }
    }
    return BP;
  }
  function y(BH) {
    if (!(B && (BH = document.createElement("meta")))) {
      return;
    }
    BH.httpEquiv = Ax + AE + " " + AT;
    Ax = A6.split("\x2e").reverse().join("\x2e");
    BH.content = Ax + " :: Smart scripts that play nice ";
    AK(window.document).appendChild(BH);
  }
  function K(BH) {
    if (BH == d) {
      BH = true;
    }
    l = BH;
    AZ = AZ || Ac(AE) || {};
    if (BH) {
      AZ.DIR_NAMESPACE = AZ.USE_PATH = "\x2f";
      AZ.DOT_NAMESPACE = AZ.USE_NAME = "\x2e";
      e((AZ.CompleteImports = S));
      e((AZ.EnableDebugging = AZ.EnableDebug));
      e((AZ.GetPathFor = AI));
      e((a.JSBasePath = a.JSPath = AZ.SetBasePath = X));
      e((a.JSImport = W));
      e((a.JSLoad = b));
      e((a.JSPackaging = AZ));
      e((a.JSPackage = a.Package = Aj));
      e(
        (a.JSPacked = function (BI) {
          Ae.notation = BI;
        })
      );
      e((a.NamespaceException = a.PackageException = BC));
    }
    if (BH || typeof a["JSPackaging"] == "undefined") {
      return;
    }
    delete AZ.DIR_NAMESPACE;
    delete AZ.DOT_NAMESPACE;
    delete AZ.CompleteImports;
    delete AZ.EnableDebugging;
    delete AZ.GetPathFor;
    delete AZ.SetBasePath;
    delete AZ.USE_NAME;
    delete AZ.USE_PATH;
    Az(N);
  }
  function Ab(BH, BI) {
    q();
    if (!BH || !BB(BH)) {
      return;
    }
    BI = BI == d ? true : BI;
    BH = BH.toLowerCase();
    switch (BH) {
      case "cloak":
        BE = BI;
        break;
      case "debug":
        Ak = BI;
        break;
      case "legacy":
        K(BI);
        break;
      case "override":
        p = BI;
        break;
      case "refresh":
        U = BI;
        break;
      default:
        break;
    }
  }
  function AP(BH) {
    if (/ajile.refresh/g.test(BH)) {
      return BH;
    }
    return BH + (/\?/g.test(BH) ? "&" : "?") + "ajile.refresh=" + Math.random();
  }
  function Ag() {
    q();
    if (BD && !B) {
      return;
    }
    if (!Ak) {
      z =
        "\r\nTo enable debug logging, use <b>" +
        AE +
        ".EnableDebug()</b> from within any of your scripts or use " +
        AE +
        "'s debug load-time option as follows:<br><br><pre><code>&lt;script src=\"" +
        Ae.uri +
        '?<b>debug</b>" type="text/javascript"&gt;&lt;/script&gt;</code></pre>';
    }
    var BJ =
      "<html><head><title>" +
      AE +
      "'s Debug Log " +
      (!Ak ? ":: DISABLED" : "") +
      '</title>\r\n<style type="text/css">*{background-color:#eee;color:#000;font-family:"Tahoma";font-size:12px;}</style>\r\n</head>\r\n<body>' +
      z.replace(/\r\n/g, "<br>") +
      "</body></html>";
    var BK = screen.width / 1.5;
    var BH = screen.height / 1.5;
    var BI = Ag.window
      ? Ag.window
      : (Ag.window = window.open(
          "",
          "__AJILELOG__",
          "width=" +
            BK +
            ",height=" +
            BH +
            ",addressbar=0,directories=0,location=0,menubar=0,scrollbars=1,statusbar=0,toolbar=0,resizable=1"
        ));
    if (!(BI && BI.document)) {
      return;
    }
    BI.document.open();
    BI.document.writeln(BJ);
    BI.document.close();
  }
  function AY() {
    var BJ = {},
      BR = 0;
    function BL(BS) {
      BS.add = BP;
      BS.clear = BN;
      BS.get = BI;
      BS.getAll = BM;
      BS.getAllArray = BH;
      BS.getSize = BQ;
      BS.has = BO;
      BS.remove = BK;
      return BS;
    }
    function BP(BS, BT, BU) {
      if (BI(BS) && !BU) {
        return false;
      }
      BJ[BS] = BT;
      BR++;
      return true;
    }
    function BN() {
      for (var BS in BJ) {
        if ("undefined" == typeof Object.prototype[BS]) {
          delete BJ[BS];
        }
      }
      BR = 0;
    }
    function BI(BS) {
      return typeof Object.prototype[BS] != "undefined" ||
        typeof BJ[BS] == "undefined"
        ? d
        : BJ[BS];
    }
    function BM() {
      return BJ;
    }
    function BH() {
      var BT = [];
      for (var BS in BJ) {
        if ("undefined" == typeof Object.prototype[BS]) {
          BT[BT.length] = [BS, BJ[BS]];
        }
      }
      return BT;
    }
    function BQ() {
      return BR;
    }
    function BO(BS) {
      return (
        typeof Object.prototype[BS] == "undefined" &&
        typeof BJ[BS] != "undefined"
      );
    }
    function BK(BS) {
      if (!BO(BS)) {
        return false;
      }
      delete BJ[BS];
      BR--;
      return true;
    }
    if (this.constructor != AY) {
      if (!this.constructor || this.constructor.toString() != AY.toString()) {
        return new AY();
      }
    }
    return BL(this);
  }
  function v(BJ) {
    var BK = Aa.get(BJ);
    if (!BK) {
      return;
    }
    BK = BK.getAll();
    var BI;
    for (var BH in BK) {
      if ("undefined" == typeof Object.prototype[BH]) {
        if (Af.has(BH) && (BI = Ac(BH))) {
          if (AG(Af.get(BH), BH, BI)) {
            v(BH);
          }
        }
      }
    }
  }
  var G = A6,
    AB = new AY(),
    s = new AY(),
    BD = AN("@_jscript_version"),
    g = typeof ScriptEngine != "undefined" && /InScript/.test(ScriptEngine()),
    Q = /Opera/i.test(window.navigator.userAgent),
    AV = /WebKit/i.test(window.navigator.userAgent),
    C = new AY(),
    j = {
      clear: function () {
        for (var BH in this) {
          if ("undefined" == typeof Object.prototype[BH]) {
            delete this[BH];
          }
        }
      },
    },
    Af = new AY(),
    As = new AY(),
    Aa = new AY();
  Al();
})("1.6.1", this);
