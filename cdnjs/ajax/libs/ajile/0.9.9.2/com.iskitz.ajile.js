/**----------------------------------------------------------------------------+
| Product:  Ajile [com.iskitz.ajile]
| @version  0.9.9.2
|+-----------------------------------------------------------------------------+
| @author   Michael A. I. Lee [ http://ajile.iskitz.com/ ]
|
| Created:  Tuesday,   November   4, 2003    [2003.11.04]
| Modified: Friday,    October    5, 2007    [2007.10.05 -  7:30:14 AM EDT]
|+-----------------------------------------------------------------------------+
|
| [Ajile] - Advanced JavaScript Importing & Loading Extension is a JavaScript
|           module that adds namespacing and importing capabilities to the
|           JavaScript Language.
|
|           Visit http://ajile.iskitz.com/ to start creating
|
|                  "Smart scripts that play nice!"
|
|           Copyright (c) 2003-2007 Michael A. I. Lee, iSkitz.com
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
| The Original Code is Ajile.
|
| The Initial Developer of the Original Code is Michael A. I. Lee
|
| Portions created by the Initial Developer are Copyright (C) 2003-2007
| the Initial Developer. All Rights Reserved.
|
| Contributor(s): Michael A. I. Lee [ http://ajile.iskitz.com/ ]
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
new (function () {
  var At, B, a, Y;
  var A4 = true,
    Ab = false,
    f = false,
    c = true,
    AU = true,
    j = false,
    R = false;
  var x = "Ajile",
    An = "Powered by ",
    Af = "index",
    M = ".js",
    D = "<*>",
    Av = "com.iskitz.ajile",
    g = null,
    n = [x, "Import", "ImportAs", "Include", "Load", "Namespace"],
    L = [
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
  var Ao,
    AV,
    A5 = "__LOADED__",
    Au,
    t = "",
    AQ;
  var H = [
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
    "\\",
    "&",
    "@",
    "#",
    "$",
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
    "/",
    ".",
  ];
  var e = /(cloakoff|cloak)/,
    N = /(debugoff|debug)/,
    Ak = /(legacyoff|legacy)/,
    l = /(mvcoff|mvc)/,
    AL = /(mvcshareoff|mvcshare)/,
    AO = /(overrideoff|override)/,
    I = /(refreshoff|refresh)/,
    K = /(.*\/)[^\/]+/,
    AE = /(.*)\.[^\.]+/,
    S = /(\/\.\/)|(\/[^\/]*\/\.\.\/)/,
    o = /:\/\x2f/;
  function Ac(A7) {
    if (A()) {
      return;
    }
    Z((AQ = A7));
    s();
    AV = new y(r(Av));
    F = Av;
    if (!At) {
      (AV.fullName = Av), (AV.path = "../lib/"), (AV.shortName = x);
    }
    AK(AQ);
    AW.add(Av, x);
    Aj.add(Av, x);
    z(x, Av, AQ);
    Az();
    w(Av);
    k();
  }
  function Ay(A7) {
    if (A7 && A7 != Av) {
      AC(A7);
      return;
    }
    v.clear();
    m.clear();
    C.clear();
    d.clear();
    AW.clear();
    Aj.clear();
    AR.clear();
    k(false);
    J(false);
    w();
    Au = null;
    Ap(n.concat(L));
    u(Av);
  }
  function E(A9, A7) {
    if (A9 == F) {
      return;
    }
    var A8 = v.get(F);
    if (!A8) {
      v.add(F, (A8 = new AP()));
    }
    A8.add(A9, A7);
  }
  function AZ(A7, BA) {
    k();
    if (!BA || !Aq(BA)) {
      if (Aq(A7)) {
        BA = A7;
        A7 = null;
      } else {
        return false;
      }
    } else {
      if (A7 && !A1(A7)) {
        return false;
      }
    }
    if (A7 == D && this == window[x]) {
      return false;
    }
    if (!A7 && this != window[x]) {
      A7 = D;
    }
    var A9 = BA;
    if (A7 && (Aj.has(A7) || AT(A7))) {
      return window.setTimeout(function () {
        A9(A7);
      }, 62.25);
    }
    if (!A7) {
      if (Aj.getSize() > 0 || AW.getSize() == 0) {
        for (var BB in Aj.getAll()) {
          window.setTimeout(function () {
            A9(BB);
          }, 62.25);
        }
      }
    }
    var A8 = m.get((A7 = A7 || ""));
    if (!A8) {
      m.add(A7, (A8 = new AP()));
    }
    A8.add(Math.random(), A9);
    return true;
  }
  function AY(A7) {
    if (A7 == F) {
      return;
    }
    var A8 = AR.get(A7);
    if (!A8) {
      AR.add(A7, (A8 = new AP()));
    }
    A8.add(F);
  }
  function w(A8, A9) {
    if (A8 && !A1(A8)) {
      return;
    }
    A8 = A8 || "";
    var BC = AT(A8);
    if (BC) {
      Z(Aq(BC) ? BC : BC.constructor);
    }
    if (!B) {
      return;
    }
    var BF = Al(A8);
    var BB = BF && BF.hasOption("cloak");
    for (var BA, A7, BG, BE = Ai(), BD = BE.length; --BD >= 0; ) {
      if (!BE[BD]) {
        continue;
      }
      if ((BA = BE[BD].title) && A8 && BA != A8) {
        continue;
      }
      A7 = BE[BD].src;
      BG = (A7 && A7.indexOf(Av) >= 0) || (BA && BA.indexOf(Av) == 0);
      if (BG || (!A7 && BA) || BB || A4) {
        Ag(BE[BD], A9);
      }
    }
  }
  function Ag(A8, A7) {
    if (a) {
      Ag = function A9(BC, BB) {
        if ((BB = BB || BC.parentNode)) {
          if (BB.removeChild) {
            BB.removeChild(BC);
          }
        }
      };
    } else {
      if (B) {
        Ag = new Function(
          "element",
          "container",
          'if(container){  try { container.removeChild(element); }catch(e){}  return;}try { document.getElementsByTagName("head")[0].removeChild(element); }catch(e){try { document.body.removeChild(element);}catch(e){}}'
        );
      } else {
        Ag = function BA() {};
      }
    }
    if (A8) {
      Ag(A8, A7);
    }
  }
  function Z(A9) {
    if (!A9 || typeof A9.toString == "undefined") {
      return;
    }
    var A7 = /(function\s*.*\s*\(.*\))/.exec(A9.toString()) || [""],
      A8 = A7.length > 1 ? A7[1] : A7[0];
    if (typeof A9.prototype == "undefined") {
      return;
    }
    A9.prototype.constructor.toString = function (BA) {
      return Ab && !A4 ? A8 : A9.prototype.toString();
    };
  }
  function AJ(A8, A7) {
    return A8 - A7;
  }
  function P(BB) {
    var BA, A8;
    if (!(A1(BB) && AW.has(BB))) {
      A8 = AW.getAllArray();
    } else {
      if (AT(BB)) {
        A8 = [[BB, AW.get(BB)]];
      }
    }
    if (!A8) {
      return;
    }
    for (var A7, A9 = A8.length; --A9 >= 0; ) {
      BB = A8[A9][0];
      if (!(AW.has(BB) && (BA = AT(BB)))) {
        continue;
      }
      V((A7 = A8[A9][1]), BB, arguments);
      if (A7 == "*") {
        A7 = null;
      }
      z(A7, BB, BA);
      p(BB);
    }
  }
  function AB(A7) {
    return (
      x +
      ".GetPathFor(" +
      A7 +
      ") is not supported. Namespace paths are protected."
    );
  }
  function A2(A7) {
    this.name = "DEPRECATED: " + Av + ".NamespaceException";
    this.message = "DEPRECATED: Invalid _namespace name [" + A7 + "]";
    this.toString = A8;
    function A8() {
      return "[ " + this.name + " ] :: " + this.message;
    }
  }
  function U(A7) {
    if (A1(A7)) {
      AV.path = A7;
    }
  }
  function Ap(A8) {
    if (!B) {
      for (var A7 = A8.length; --A7 >= 0; window[A8[A7]] = null) {}
    } else {
      (Ap = new Function(
        "SYS",
        "  try     { for(var i=SYS.length; --i >= 0; delete window[SYS[i]]); }  catch(e){ for(var j=SYS.length; --j >= 0; window[SYS[j]] = null); }"
      ))(A8);
    }
  }
  function u(BB) {
    if (!BB) {
      return;
    }
    var BA = {},
      A8 = BB.split("."),
      A9 = window[A8[0]];
    for (var A7 = 1; typeof A8[A7] != "undefined"; A7++) {
      if (typeof A9[A8[A7]] == "undefined") {
        break;
      }
      BA[A8[A7 - 1]] = [A7, true];
      A9 = A9[A8[A7]];
      for (var BC in A9) {
        if ("undefined" == typeof Object.prototype[BC]) {
          if (BC != A8[A7]) {
            BA[A8[A7 - 1]][1] = false;
            break;
          }
        }
      }
    }
    for (A9 in BA) {
      if ("undefined" == typeof Object.prototype[A9]) {
        if (BA[A9][1]) {
          AC(A8.slice(0, BA[A9][0] + 1).join("."));
        }
      }
    }
  }
  function AC(A9) {
    var A7;
    if (A9) {
      if (!A1(A9)) {
        if ((A9 = Al(A9))) {
          A9 = A9.fullName;
          A7 = A9.shortName;
        }
      }
      if (!A7 && A9) {
        A7 = A9.substring(A9.lastIndexOf(".") + 1);
      }
      A9 = AE.exec(A9);
      A9 = A9 ? A9[1] : null;
    }
    var A8 = AT(A9);
    if (A8 && A7) {
      if (A7 == "*" || typeof A8[A7] != "undefined") {
        if (A7 != "*") {
          if (A8[A7] == window[A7]) {
            window[A7] = null;
          }
          delete A8[A7];
        } else {
          for (var BA in A8) {
            if ("undefined" == typeof Object.prototype[BA]) {
              delete A8[BA];
            }
          }
          u(A9);
        }
      }
    }
    w(A9);
  }
  function AN(BB) {
    var A7 = BB;
    var BC = AW.getAllArray();
    for (var A9, BA = 0, A8 = BC.length; BA < A8; ++BA) {
      if (Aj.has((A9 = BC[BA][0]))) {
        continue;
      }
      if ("*" != BC[BA][1]) {
        A7 = AE.exec(A9);
      }
      if (!(A7 && BB == A7[1])) {
        continue;
      }
      Aj.add((F = A9));
      return;
    }
    F = Af;
  }
  function k(A8, BA) {
    BA = typeof BA != "undefined" ? BA : !(A8 == false);
    var A7 = (A8 = A8 || window || this).onload;
    function A9(BB) {
      if (BB == true) {
        return A7 || null;
      }
      AZ(w);
      P();
      w();
      if (Aq(A7) && A9.toString() != A7.toString()) {
        A7(BB);
      }
      return A7;
    }
    if (Aq(A7) && A9.toString() == A7.toString()) {
      if (!BA) {
        A8.onload = A7(true);
      }
      return;
    }
    A8.onload = A9;
  }
  function AG(A7) {
    if (!A7) {
      return window.document;
    }
    if (typeof A7.write == "undefined") {
      if (typeof A7.document != "undefined") {
        A7 = A7.document;
      } else {
        if (typeof A7.parentNode != "undefined") {
          return AG(A7.parentNode);
        } else {
          return window.document;
        }
      }
    }
    return A7;
  }
  function A6(A7, BD) {
    if (!BD) {
      return null;
    }
    var BC = BD.split(".");
    var A8;
    for (var BB = A7 == BD, BA = 0, A9 = BC.length; BA < A9; BA++) {
      if (isNaN(BC[BA])) {
        continue;
      }
      BD = BC.slice(0, BA).join(".");
      A7 = BB ? BD : A7 || BC.slice(BA - 1, BA)[0];
      A8 = BC.slice(BA).join(".");
      break;
    }
    if (!A8) {
      return null;
    }
    return [A7, BD, A8];
  }
  function Ai(A8) {
    if (!(A8 = AG(A8))) {
      return null;
    }
    var A7 =
      typeof A8.scripts != "undefined" &&
      typeof A8.scripts.length != "undefined" &&
      A8.scripts.length > 0
        ? A8.scripts
        : typeof A8.getElementsByTagName != "undefined"
        ? A8.getElementsByTagName("script") || []
        : [];
    return A7;
  }
  function AD(A7) {
    if (A7) {
      if ((!Au || a) && !B) {
        if ((Au && Y && A7 != Au.ownerDocument) || !Au || (!Y && a)) {
          if (A7.lastChild && A7.lastChild.firstChild) {
            Au = A7.lastChild.firstChild;
          }
        }
      } else {
        if (!Au && B) {
          Au = Ao;
        }
      }
    }
    return Au;
  }
  function W(A9) {
    Ad(A9);
    if (!A9 || !A1(A9)) {
      return [];
    }
    var A8 = M ? A9.lastIndexOf(M) : A9.lastIndexOf(".");
    if (A8 < A9.length && A8 >= 0) {
      var BA = A9.slice(A8, A8 + M.length);
      var A7 = A9.substring(0, A8);
      if (A7 && isNaN(A7.charAt(0))) {
        A7 = "";
      }
    }
    return [A7, BA];
  }
  function AT(BB, A7) {
    if (!A1(BB)) {
      return null;
    }
    var BA = A7 || window;
    BB = BB.split(".");
    for (var A9 = 0, A8 = BB.length; A9 < A8; A9++) {
      if (typeof BA[BB[A9]] != "undefined") {
        BA = BA[BB[A9]];
      } else {
        return null;
      }
    }
    return BA;
  }
  function Al(A9) {
    if (!A9) {
      return new y(AV);
    }
    var A7 = A1(A9);
    for (var A8 in d) {
      if ("undefined" == typeof Object.prototype[A8]) {
        if ((A7 && A9 == A8) || (!A7 && A9 == AT(A8))) {
          return d[A8];
        }
      }
    }
    return null;
  }
  function r(BO, BE) {
    BO = BO || Av;
    if (BO == Av && AV && AV.path) {
      return AV;
    }
    var BG = d[BO];
    if (BG) {
      return BG;
    }
    var BQ = AA(BO, BE);
    if ((BG = h(BO, BQ))) {
      return (d[BO] = BG);
    }
    var A7 = Ai();
    if (!(A7 && BQ)) {
      return null;
    }
    var BN;
    for (var BF = false, BI, BK, BM = 0, BL = A7.length; BM < BL; BM++) {
      BI = unescape(A7[BM].src);
      if (BI && BI.search(o) == -1) {
        BI = unescape(window.location.href);
        if (BI.charAt(BI.length - 1) != g) {
          if ((BK = K.exec(BI)) != null) {
            if (BK[1].length > BI.search(o) + 3) {
              BI = BK[1];
            }
          }
        }
        BI += unescape(A7[BM].src);
      }
      if (typeof BI == "undefined" || BI == null) {
        continue;
      }
      while (S.test(BI)) {
        BI = BI.replace(S, "/");
      }
      if (C.has(BI)) {
        continue;
      }
      C.add(BI);
      if (BF) {
        continue;
      }
      var A9;
      for (var BA in BQ) {
        if (typeof Object.prototype[BA] != "undefined") {
          continue;
        }
        A9 = BQ[BA];
        var BP,
          BR,
          BC = [];
        for (var BJ = A9.length; --BJ >= 0; ) {
          BP = A9[BJ];
          BR = BI.lastIndexOf(BP) + 1;
          if (BR <= 0 || BR == BC[0]) {
            continue;
          }
          BC[BC.length] = BR;
          G("FOUND :: Path [ " + BI + " ]", arguments);
        }
        if (BC.length == 0) {
          continue;
        }
        BC.sort(AJ);
        BR = BC[BC.length - 1];
        BE = BR == BI.lastIndexOf(BP) + 1 ? BA : null;
        BN = BI.substring(0, BR);
        BF = true;
        if (BO == Av && A7[BM].title != Av) {
          A7[BM].title = Av;
        }
        var A8 = BR + BP.length - 2;
        var BH = W(BI.substring(A8 + 1));
        var BD = BH[1];
        var BB = BH[0];
        break;
      }
    }
    if (!BN) {
      return null;
    }
    BG = new y(BN, BE, BO, null, BB, BD);
    d[BO] = BG;
    return BG;
  }
  function h(BN, BO) {
    var BF = Number.MAX_VALUE;
    var BH;
    var A8 = [];
    var BI;
    var BB = 0;
    BO = BO || AA(BN);
    var BD = [];
    var BL = C.getAll();
    BL: for (var BJ in BL) {
      if (typeof Object.prototype[BJ] != "undefined") {
        continue;
      }
      for (var BA in BO) {
        if (typeof Object.prototype[BA] != "undefined") {
          continue;
        }
        BD[BD.length] = BA;
        for (var A9 = BO[BA], BM = A9.length; --BM >= 0; ) {
          if (0 < (BI = BJ.lastIndexOf(A9[BM]))) {
            BH = BJ.length - (BI + A9[BM].length);
            if (BH < BF) {
              BF = BH;
              BB = A8.length;
            }
            A8[A8.length] = BI + 1;
            var A7 = BI + 1 + A9[BM].length - 2;
            var BK = W(BJ.substring(A7 + 1));
            var BE = BK[1];
            var BC = BK[0];
            G("FOUND :: Cached Path [ " + BJ + " ]", arguments);
            break BL;
          }
          if (BM == 0) {
            delete BD[--BD.length];
          }
        }
      }
    }
    if (!A8 || A8.length == 0) {
      return null;
    }
    BJ = BJ.substring(0, A8[BB]);
    var BG = new y(BJ, BD[BB], BN, null, BC, BE);
    if (BG.path) {
      d[BN] = BG;
    }
    return BG;
  }
  function AA(A9, BB) {
    var BC = g || Aw();
    var A7 = typeof BB == "undefined" ? H : [BB];
    var BA = {};
    for (var A8 = A7.length; --A8 >= 0; ) {
      BB = A7[A8];
      BA[BB] = [];
      BA[BB][2] = BC + A9.replace(/\x2e/g, BB);
      BA[BB][0] = BA[BB][2] + BB;
      BA[BB][1] = BA[BB][2] + BC;
      BA[BB][2] = BA[BB][2] + ".";
    }
    return BA;
  }
  function i() {
    return [
      A4 ? "cloak" : "cloakoff",
      Ab ? "debug" : "debugoff",
      f ? "legacy" : "legacyoff",
      c ? "mvc" : "mvcoff",
      AU ? "mvcshare" : "mvcshareoff",
      j ? "override" : "overrideoff",
      R ? "refresh" : "refreshoff",
    ].join(",");
  }
  function Aw(A9) {
    if (!A9 && g) {
      return g;
    }
    var BA = unescape(window.location.href);
    var A7 = BA.lastIndexOf("\\") + 1;
    var A8 = BA.lastIndexOf("/") + 1;
    g = A7 > A8 ? "\\" : "/";
    return g;
  }
  function Ae(A8, BE, BB, BD, BA, BC, A7) {
    if (!AW.add(BE, A8)) {
      return BC;
    }
    E(BE, A8 == "*" ? BE : A8);
    AY(BE);
    if (A8 == "*") {
      (A8 = A5), G('...\t:: Import ("' + BE + '.*")', arguments);
    } else {
      if (A8 == BE) {
        G('...\t:: Include ("' + A8 + '")', arguments);
      } else {
        G('...\t:: ImportAs ("' + A8 + '", "' + BE + '")', arguments);
      }
    }
    BB = AI(A8, BE, BB, BD, BA);
    var A9 = X(
      BB,
      AG(A7 || window || this),
      'ImportAs("' + A8 + '", "' + BE + '");',
      false,
      BE
    );
    if (A9) {
      new b(BE).start();
    }
    return BC;
  }
  function AI(A7, BE, BA, BD, A8) {
    var BC = BE + (A7 == "*" ? ".*" : "");
    var A9 = BC;
    var BB;
    do {
      if ((BC = AE.exec(BC))) {
        BC = BC[1];
      } else {
        break;
      }
      if (BC == A9) {
        break;
      }
      A9 = BC;
      BB = r(BC);
    } while (!BB);
    if (!A1(BA)) {
      BA =
        typeof BB != "undefined" && BB != null && typeof BB.path != "undefined"
          ? BB.path
          : AV.path || "";
    }
    if (BA.lastIndexOf("/") != BA.length - 1) {
      BA += "/";
    }
    if (f) {
      if (BD == false) {
        BD = "/";
      } else {
        if (BD == true) {
          BD = ".";
        }
      }
    }
    if (BD == null || typeof BD == "undefined") {
      BD = BB
        ? typeof BB.notation == "undefined"
          ? AV.notation
          : BB.notation
        : AV.notation;
    }
    BA += escape(BE.replace(/\x2e/g, BD));
    if (A8) {
      BA += "." + A8;
    }
    BA += M;
    if (BB && BB.hasOption("refresh")) {
      BA = AH(BA);
    }
    return BA;
  }
  function z(A8, BD, BB, A7) {
    A7 = A7 || window || this;
    if (!BB) {
      return BB;
    }
    if (A8 != A5 && Ar(A8, BD, A7)) {
      AW.remove(BD);
      return BB;
    }
    if (!Ah(BD, A8)) {
      return null;
    }
    var A9 = [];
    var BC = AW.get(BD);
    var BA = A8 == BD || BC == BD;
    if (A8 && A8 != A5 && (!BC || (BC != "*" && BC != A5))) {
      if (BA) {
        A9[0] = 'SUCCESS :: Include ("' + BD + '")';
      } else {
        (A7[A8] = BB),
          (A9[0] = 'SUCCESS :: ImportAs ("' + A8 + '", "' + BD + '")');
      }
      AW.remove(BD);
      Aj.add(BD, A8);
    } else {
      if (BC == "*") {
        A0(A8, BD, BB, A7, BA, A9);
      } else {
        if (BC != "*" && (BC == A5 || A8 == A5)) {
          A9[0] =
            "SUCCESS :: " + (BA ? "Include" : "Import") + ' ("' + BD + '.*")';
          AW.remove(BD);
          Aj.add(BD, "*");
        }
      }
    }
    if (A9.length > 0) {
      G(A9.join("\r\n"), arguments);
    }
    AF(BD);
    return BB;
  }
  function A0(A8, BD, BB, A7, BA, A9) {
    A9[A9.length] = " ";
    if (!BA) {
      var BC;
      for (var BE in BB) {
        if (typeof Object.prototype[BE] != "undefined") {
          continue;
        }
        BC = BD + "." + BE;
        if (d[BC] || Ar(BE, BC, A7)) {
          continue;
        }
        A7[BE] = BB[BE];
        A9[A9.length] = 'SUCCESS :: ImportAs ("' + BE + '", "' + BC + '")';
      }
    }
    AW.remove(BD);
    if (A8 != A5) {
      AW.add(BD, A5);
    }
  }
  function Ar(A8, BA, A7) {
    A7 = A7 || window || this;
    if (
      j ||
      (BA == A8 && !AT(A8)) ||
      typeof A7[A8] == "undefined" ||
      AT(BA) == A7[A8]
    ) {
      return false;
    }
    var A9 =
      "\nWARNING: There is a naming conflict, " +
      A8 +
      " already exists.\nConsider using the override load-time option, " +
      x +
      '.EnableOverride(),\nor ImportAs with an alias; for example:\n\n\tImportAs ("' +
      A8 +
      '1", "' +
      BA +
      '");';
    if (A8 == BA) {
      A9 += "\n\nThe module is currently inaccessible.\n";
    } else {
      A9 +=
        "\n\nThe module can currently be accessed using its fully-qualified name:\n\n\t" +
        BA +
        ".\n";
    }
    G(A9, arguments, Ab);
    return true;
  }
  function T(BA, A8, A9, A7) {
    return q(null, BA, A8, A9, A7);
  }
  function q(BI, BB, A7, BG, A8) {
    k();
    if (!BB || BB == "*") {
      G('ERROR :: ImportAs ("' + BI + '", "' + BB + '")');
      return null;
    }
    var BH, BF;
    if (!A1(BI)) {
      BI = "";
    }
    if ((BH = A6(BI, BB))) {
      BB = BH[1];
      BI = BI != A5 ? BH[0] : A5;
      BF = BH[2];
    } else {
      if (!BI) {
        BI = BB.substring(BB.lastIndexOf(".") + 1);
      }
    }
    A8 = A8 || window || this;
    if (BI == "*") {
      BB = AE.exec(BB)[1];
    } else {
      if (typeof A8[BI] != "undefined" && BI != BB) {
        for (var BJ = f ? n.concat(L) : n, BK = BJ.length; --BK >= 0; ) {
          if (BI != BJ[BK]) {
            continue;
          }
          G(
            'ERROR :: ImportAs ("' +
              BI +
              '", "' +
              BB +
              '")! ' +
              BI +
              " is restricted.",
            arguments
          );
          return A8[BI];
        }
      }
    }
    var A9 = A8;
    var BE = "";
    for (var BA = BB.split("."), BD = 0, BC = BA.length; BD < BC; BD++) {
      if (typeof A9[BA[BD]] != "undefined") {
        A9 = A9[BA[BD]];
        BE += BA[BD] + ".";
      } else {
        break;
      }
    }
    if (BD >= BC && BI != "*") {
      if (AW.has(BB) || !Aj.has(BB)) {
        A9 = z(BI, BB, A9, A8);
        p(BB);
      }
      return A9;
    }
    if (AW.has(BB)) {
      if (BI == "*" || BI == A5) {
        BI = BB;
      }
      E(BB, BI);
      AY(BB);
      return null;
    }
    return Ae(BI, BB, A7, BG, BF, A9, A8);
  }
  function b(BB, A9, A7) {
    var BA,
      BF,
      BD = 0;
    function BC(BG) {
      A7 = A7 || 500;
      BG.start = A8;
      BG.stop = BE;
      BA = window.setInterval(BE, (A9 = A9 || 60000));
      return BG;
    }
    function A8() {
      if (BD >= A7) {
        BE();
        return;
      }
      if (AT(BB)) {
        P();
      } else {
        BF = window.setTimeout(A8, 0);
      }
    }
    function BE() {
      if (typeof BF != "undefined") {
        window.clearTimeout(BF);
      }
      if (typeof BA != "undefined") {
        window.clearInterval(BA);
      }
    }
    if (this.constructor != b) {
      if (!this.constructor || this.constructor.toString() != b.toString()) {
        return new b(BB, A9, A7);
      }
    }
    return BC(this);
  }
  function Ax(BA, A8, A9, A7) {
    if (BA) {
      BA = BA.split(".*").join("");
    }
    return q(BA, BA, A8, A9, A7);
  }
  function Aq(A7) {
    return (
      typeof A7 != "undefined" &&
      A7 != null &&
      (typeof A7 == "function" || Function == A7.constructor)
    );
  }
  function A() {
    if (typeof document == "undefined") {
      return false;
    }
    var A7 =
      "undefined" != typeof document.write &&
      "undefined" != typeof document.writeln;
    At = A7 && "undefined" != typeof document.createElement;
    B =
      At &&
      "undefined" != typeof document.createTextNode &&
      "undefined" != typeof document.getElementsByTagName &&
      "undefined" !=
        typeof (Ao = document.getElementsByTagName("head")[0]).appendChild &&
      "undefined" != typeof Ao.removeChild;
    a =
      B &&
      "undefined" != typeof document.firstChild &&
      "undefined" != typeof document.lastChild &&
      "undefined" != typeof document.parentNode;
    Y = a && "undefined" != typeof document.ownerDocument;
    return !(A7 || At || B || a || Y);
  }
  function A1(A7) {
    return (
      A7 != null &&
      typeof A7 != "undefined" &&
      (typeof A7 == "string" || A7.constructor == String)
    );
  }
  function Ah(BD, A7) {
    var BA = BD == F;
    var A8 = AW.has(BD);
    var A9 = v.get(BD);
    function BB() {
      if (BA || Ah(F) || A8) {
        return true;
      }
      AW.add(BD, A7);
      new b(BD).start();
      return false;
    }
    if (!A9 || !(A9 = A9.getAll())) {
      return BB();
    }
    for (var BC in A9) {
      if ("undefined" == typeof Object.prototype[BC]) {
        if (!AT(A9[BC])) {
          return false;
        }
      }
    }
    return BB();
  }
  function X(A9, A7, BB, BD, BC, BA, BE) {
    k();
    if (!(A7 = AG(A7))) {
      G(
        "ERROR :: Container not found. Unable to load:\n\n[" + A9 + "]",
        arguments
      );
      return false;
    }
    if (A9) {
      C.add(unescape(A9));
      if (R) {
        A9 = AH(A9);
      }
    }
    if (!(BA || BE)) {
      BE = "JavaScript";
      BA = "text/javascript";
    }
    if (typeof BD == "undefined") {
      BD = false;
    }
    var A8;
    if (At) {
      A8 = A7.createElement("script");
    }
    if (!A8) {
      if (BB) {
        BB = "window.setTimeout('" + BB + "',0);";
      }
      Q(A9, A7, BB, BD, BC, BA, BE);
      return false;
    }
    if (BD) {
      A8.defer = BD;
    }
    if (BE) {
      A8.language = BE;
    }
    if (BC) {
      A8.title = BC;
    }
    if (BA) {
      A8.type = BA;
    }
    if (A9) {
      G("...\t:: Load [ " + A9 + " ]", arguments);
      if (AM || !O) {
        A8.src = A9;
      }
      AD(A7).appendChild(A8);
      if (A3 || O) {
        A8.src = A9;
      }
      G("DONE\t:: Load [ " + A9 + " ]", arguments);
    }
    if (!BB) {
      return true;
    }
    if (A9) {
      X(null, A7, BB, BD, BC, BA, BE);
      return true;
    }
    if (typeof A8.canHaveChildren == "undefined" || A8.canHaveChildren) {
      A8.appendChild(A7.createTextNode(BB));
    } else {
      if (!A8.canHaveChildren) {
        A8.text = BB;
      }
    }
    AD(A7).appendChild(A8);
    return false;
  }
  function Az() {
    if (!(c || AU)) {
      return;
    }
    if (AU) {
      X(AV.path + Af + M, null, null, null, Af);
    }
    if (!c) {
      return;
    }
    var A8 = unescape(window.location.pathname);
    var A7 = A8.lastIndexOf(g);
    A8 = A8.substring(++A7);
    A7 = A8.lastIndexOf(".");
    A7 = A7 == -1 ? 0 : A7;
    if ("" != (A8 = A8.substring(0, A7))) {
      Af = A8;
    }
    X(Af + M, null, null, null, Af);
  }
  function Ad(A8) {
    if (!A8 || !A1(A8)) {
      return;
    }
    var A9 = A8.lastIndexOf("?") + 1;
    A8 = A8.substring(A9).toLowerCase();
    if (A8.length == 0) {
      return;
    }
    var A7;
    if ((A7 = e.exec(A8))) {
      A4 = A7[1] == "cloak";
    }
    if ((A7 = N.exec(A8))) {
      Ab = A7[1] == "debug";
    }
    if ((A7 = Ak.exec(A8))) {
      J(A7[1] == "legacy");
    }
    if ((A7 = l.exec(A8))) {
      c = A7[1] == "mvc";
    }
    if ((A7 = AL.exec(A8))) {
      AU = A7[1] == "mvcshare";
    }
    if ((A7 = AO.exec(A8))) {
      j = A7[1] == "override";
    }
    if ((A7 = I.exec(A8))) {
      R = A7[1] == "refresh";
    }
  }
  function Q(A7, A9, BA, A8, BF, BE, BD) {
    if (!(A9 = AG(A9))) {
      return;
    }
    var BC;
    if (A7) {
      G("...\t:: LoadSimple [ " + A7 + " ]", arguments);
      if (BA) {
        BC = BA;
        BA = null;
      }
    }
    var BB =
      "<script" +
      (A8 ? ' defer="defer"' : "") +
      (BD ? ' language="' + BD + '"' : "") +
      (BF ? ' title="' + BF + '"' : "") +
      (BE ? ' type="' + BE + '"' : "") +
      (A7 ? ' src="' + A7 + '">' : ">") +
      (BA ? BA + ";" : "") +
      "</script>\n";
    A9.write(BB);
    if (A7) {
      G("DONE\t:: LoadSimple [ " + A7 + " ]", arguments);
    }
    if (!(BA = BA || BC)) {
      return;
    }
    if (A7) {
      Q(null, A9, BA, A8, BF, BE, BD);
    }
  }
  function G(BB, BC, BA) {
    if (!Ab && !BA) {
      return;
    }
    var A9 = /function\s*(.*)\s*\(/.exec(BC.callee) || [""],
      BD = A9.length > 1 ? A9[1] : A9[0];
    if (typeof BB != "undefined") {
      var A8 = t;
      var A7 = new Date();
      t =
        [A7.getFullYear(), A7.getMonth() + 1, A7.getDate()].join(".") +
        "," +
        [
          A7.getHours(),
          A7.getMinutes(),
          A7.getSeconds(),
          A7.getMilliseconds(),
        ].join(":") +
        "\t:: " +
        F +
        " :: " +
        BD +
        "\r\n" +
        BB +
        "\r\n\r\n";
      if ("undefined" != typeof console && Aq(console.info)) {
        console.info(t);
      }
      if ("undefined" != typeof YAHOO && Aq(YAHOO.log)) {
        YAHOO.log(t);
      }
      if ("undefined" != typeof MochiKit && Aq(MochiKit.log)) {
        MochiKit.log(t);
      }
      t += A8;
    }
    if (BA) {
      AX();
    }
  }
  function V(A7, BA, A9) {
    var A8 =
      A7 == "*" || A7 == A5
        ? 'Import   ("' + BA + '.*")'
        : A7 == BA
        ? 'Include  ("' + BA + '")'
        : 'ImportAs ("' + A7 + '", "' + BA + '")';
    G("CHECKING :: " + A8 + "...", A9);
  }
  function Aa(A8, BF, BD, A7) {
    k();
    A8 = A8 || "<default>";
    G('Namespace ("' + A8 + '")', arguments);
    var BE = A7 || window || this;
    if (A8 == "<default>") {
      AV.update(BF, BD);
      G(AV, arguments);
      return BE;
    }
    AN(A8);
    var A9 = A8.split(".");
    for (var BC = 0, BB = A9.length; BC < BB; BC++) {
      if (typeof BE[A9[BC]] != "undefined") {
        BE = BE[A9[BC]];
      } else {
        BE = BE[A9[BC]] = {};
      }
    }
    var BA = d[A8];
    if (BA) {
      BA.update(BF, BD);
      G(BA, arguments);
      return BE;
    }
    if (!BF) {
      BA = r(A8, BD);
    }
    if (BF || !BA) {
      BA = new y(BF, BD, A8);
    }
    if (BA && !d[A8]) {
      d[A8] = BA;
    }
    G(BA, arguments);
    return BE;
  }
  function y(BH, BE, A8, BF, BB, BG, BI) {
    function BC(BJ) {
      BD();
      BJ.hasOption = BA;
      BJ.toString = A7;
      BJ.update = A9;
      BJ.update(BH, BE, A8, BF, BB, BG, BI);
      return BJ;
    }
    function BD() {
      if (!(BH && BH.constructor == y)) {
        return;
      }
      var BJ = BH;
      BG = BJ.extension;
      A8 = BJ.fullName;
      BE = BJ.notation;
      BI = BJ.options;
      BH = BJ.path;
      BF = BJ.shortName;
      BB = BJ.version;
    }
    function BA(BJ) {
      BI = BI || this.options;
      if (!(BI && BJ && BI.indexOf(BJ) >= 0)) {
        return false;
      }
      var BK = new RegExp(BJ, "g").exec(BI);
      return BK && typeof BK[1] != "undefined" && BK[1] == BJ;
    }
    function A7() {
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
    function A9(BN, BM, BO, BJ, BK, BP, BL) {
      this.extension = BP || this.extension || M;
      this.fullName = BO || this.fullName || "";
      this.shortName = BJ || this.shortName || "";
      this.notation = A1(BM)
        ? BM
        : this.notation || (AV && A1(AV.notation) ? AV.notation : ".");
      this.options = A1(BL) ? BL : this.options || i();
      this.path = A1(BN) ? BN : this.path || (AV && A1(AV.path) ? AV.path : "");
      this.uri = this.path + this.fullName.replace(/\x2e/g, this.notation);
      this.version = "" + (BK || this.version || "");
      if (!this.uri) {
        return;
      }
      this.uri += (this.version ? "." + this.version : "") + this.extension;
    }
    if (this.constructor != y) {
      if (!this.constructor || this.constructor.toString() != y.toString()) {
        return new y(BH, BE, A8, BF, BB, BG, BI);
      }
    }
    return BC(this);
  }
  function AF(BA) {
    var BC = [m.get(""), m.get(BA), m.get(D)];
    if (!BC[0] && !BC[1] && !BC[2]) {
      return;
    }
    var A7 = (BC[0] && BC[0].getSize() > 0) || (BC[1] && BC[1].getSize() > 0);
    if (Ab && A7) {
      G("NOTIFY :: Import Listeners for " + BA + "...", arguments);
    }
    for (var A9, A8 = BC.length; --A8 >= 0; ) {
      if (!BC[A8]) {
        continue;
      }
      A9 = BC[A8].getAll();
      for (var BB in A9) {
        if ("undefined" == typeof Object.prototype[BB]) {
          A9[BB](BA);
        }
      }
    }
    if (Ab && A7) {
      G("NOTIFY :: Import Listeners for " + BA + "...DONE!", arguments);
    }
  }
  function AK(A7) {
    Aa(Av);
    Z((window.Import = T));
    Z((window.ImportAs = q));
    Z((window.Include = Ax));
    Z((window.Load = X));
    Z((window.Namespace = Aa));
    Z((A7.AddImportListener = AZ));
    Z((A7.EnableLegacy = J));
    Z(
      (A7.GetVersion = function () {
        return AV.version;
      })
    );
    Z((A7.RemoveImportListener = Am));
    Z((A7.SetOption = AS));
    Z((A7.ShowLog = AX));
    Z((A7.Unload = Ay));
    As(A7, "Cloak");
    As(A7, "Debug");
    As(A7, "Override");
    As(A7, "Refresh");
    J(f || false);
  }
  function As(A8, A7) {
    if (!A7 || !A1(A7)) {
      return;
    }
    Z(
      (A8["Enable" + A7] = function (A9) {
        AS(A7, A9);
      })
    );
  }
  function Am(A7, BB) {
    k();
    if (!BB || !Aq(BB)) {
      if (Aq(A7)) {
        BB = A7;
        A7 = null;
      } else {
        return false;
      }
    } else {
      if (A7 && !A1(A7)) {
        return false;
      }
    }
    var BD = [m.get(""), m.get(A7), m.get(D)];
    if (!BD[0] && !BD[1] && !BD[2]) {
      return false;
    }
    var BA = false;
    for (var A9, A8 = BD.length; --A8 >= 0; ) {
      if (!BD[A8]) {
        continue;
      }
      A9 = BD[A8].getAll();
      for (var BC in A9) {
        if ("undefined" == typeof Object.prototype[BC]) {
          if (A9[BC] == BB) {
            BD[A8].remove(BC);
            BA = true;
            break;
          }
        }
      }
    }
    return BA;
  }
  function s(A7) {
    if (!(B && (A7 = document.createElement("meta")))) {
      return;
    }
    A7.httpEquiv = An + x;
    An = Av.split(".").reverse().join(".");
    A7.content = An + " :: Smart scripts that play nice ";
    AD(window.document).appendChild(A7);
  }
  function J(A7) {
    if (typeof A7 == "undefined") {
      A7 = true;
    }
    f = A7;
    AQ = AQ || AT(x);
    if (A7) {
      AQ.DIR_NAMESPACE = AQ.USE_PATH = "/";
      AQ.DOT_NAMESPACE = AQ.USE_NAME = ".";
      Z((AQ.CompleteImports = P));
      Z((AQ.EnableDebugging = AQ.EnableDebug));
      Z((AQ.GetPathFor = AB));
      Z((window.JSBasePath = window.JSPath = AQ.SetBasePath = U));
      Z((window.JSImport = T));
      Z((window.JSLoad = X));
      Z((window.JSPackaging = AQ));
      Z((window.JSPackage = window.Package = Aa));
      Z(
        (window.JSPacked = function (A8) {
          AV.notation = A8;
        })
      );
      Z((window.NamespaceException = window.PackageException = A2));
    }
    if (A7 || typeof window["JSPackaging"] == "undefined") {
      return;
    }
    delete AQ.DIR_NAMESPACE;
    delete AQ.DOT_NAMESPACE;
    delete AQ.CompleteImports;
    delete AQ.EnableDebugging;
    delete AQ.GetPathFor;
    delete AQ.SetBasePath;
    delete AQ.USE_NAME;
    delete AQ.USE_PATH;
    Ap(L);
  }
  function AS(A7, A8) {
    k();
    if (!A7 || !A1(A7)) {
      return;
    }
    A8 = typeof A8 == "undefined" ? true : A8;
    A7 = A7.toLowerCase();
    switch (A7) {
      case "cloak":
        A4 = A8;
        break;
      case "debug":
        Ab = A8;
        break;
      case "legacy":
        J(A8);
        break;
      case "override":
        j = A8;
        break;
      case "refresh":
        R = A8;
        break;
      default:
        break;
    }
  }
  function AH(A7) {
    if (/ajile.refresh/g.test(A7)) {
      return A7;
    }
    return A7 + (/\?/g.test(A7) ? "&" : "?") + "ajile.refresh=" + Math.random();
  }
  function AX() {
    k();
    if (!Ab) {
      t =
        "\r\nTo enable debug logging, use <b>" +
        x +
        ".EnableDebug()</b> from within any of your scripts or use " +
        x +
        "'s debug load-time option as follows:<br><br><pre><code>&lt;script src=\"" +
        AV.uri +
        '?<b>debug</b>" type="text/javascript"&gt;&lt;/script&gt;</code></pre>';
    }
    var A9 =
      "<html><head><title>" +
      x +
      "'s Debug Log " +
      (!Ab ? ":: DISABLED" : "") +
      '</title>\r\n<style type="text/css">*{background-color:#eee;color:#000;font-family:"Tahoma";font-size:12px;}</style>\r\n</head>\r\n<body>' +
      t.replace(/\r\n/g, "<br>") +
      "</body></html>";
    var BA = screen.width / 1.5;
    var A7 = screen.height / 1.5;
    var A8 = window.open(
      "",
      "__AJILELOG__",
      "width=" +
        BA +
        ",height=" +
        A7 +
        ",addressbar=0,directories=0,location=0,menubar=0,scrollbars=1,statusbar=0,toolbar=0,resizable=1"
    );
    if (!A8) {
      return;
    }
    A8.document.writeln(A9);
    A8.document.close();
  }
  function AP() {
    var A9 = {},
      BH = 0;
    function BB(BI) {
      BI.add = BF;
      BI.clear = BD;
      BI.get = A8;
      BI.getAll = BC;
      BI.getAllArray = A7;
      BI.getSize = BG;
      BI.has = BE;
      BI.remove = BA;
      return BI;
    }
    function BF(BI, BJ) {
      if (A8(BI)) {
        return false;
      }
      A9[BI] = BJ;
      BH++;
      return true;
    }
    function BD() {
      for (var BI in A9) {
        if ("undefined" == typeof Object.prototype[BI]) {
          delete A9[BI];
        }
      }
      BH = 0;
    }
    function A8(BI) {
      if ("undefined" == typeof Object.prototype[BI]) {
        if ("undefined" == typeof A9[BI]) {
          return null;
        } else {
          return A9[BI];
        }
      } else {
        return null;
      }
    }
    function BC() {
      return A9;
    }
    function A7() {
      var BJ = [];
      for (var BI in A9) {
        if ("undefined" == typeof Object.prototype[BI]) {
          BJ[BJ.length] = [BI, A9[BI]];
        }
      }
      return BJ;
    }
    function BG() {
      return BH;
    }
    function BE(BI) {
      return (
        typeof Object.prototype[BI] == "undefined" &&
        typeof A9[BI] != "undefined"
      );
    }
    function BA(BI) {
      if (!BE(BI)) {
        return false;
      }
      delete A9[BI];
      BH--;
      return true;
    }
    if (this.constructor != AP) {
      if (!this.constructor || this.constructor.toString() != AP.toString()) {
        return new AP();
      }
    }
    return BB(this);
  }
  function p(A9) {
    var BA = AR.get(A9);
    if (!BA) {
      return;
    }
    BA = BA.getAll();
    var A8;
    for (var A7 in BA) {
      if ("undefined" == typeof Object.prototype[A7]) {
        if (AW.has(A7) && (A8 = AT(A7))) {
          if (z(AW.get(A7), A7, A8)) {
            p(A7);
          }
        }
      }
    }
  }
  var F = Av,
    v = new AP(),
    m = new AP(),
    A3 = /MSIE/i.test(window.navigator.userAgent),
    O = /Opera/i.test(window.navigator.userAgent),
    AM = /WebKit/i.test(window.navigator.userAgent),
    C = AP(),
    d = {
      clear: function () {
        for (var A7 in this) {
          if ("undefined" == typeof Object.prototype[A7]) {
            delete this[A7];
          }
        }
      },
    },
    AW = new AP(),
    Aj = new AP(),
    AR = new AP();
  Ac(this);
})();
