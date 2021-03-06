/**----------------------------------------------------------------------------+
| Product:  ajile [com.iskitz.ajile]
| @version  1.9.9
|+-----------------------------------------------------------------------------+
| @author   Michael A. I. Lee [iskitz.com]
|
| Created:  Tuesday,   November   4, 2003    [2003.11.04]
| Updated:  Thursday,  February  21, 2013    [2013.02.21.00.07-08.00]
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
(function (AV, b, e) {
  var A5, B, g, d;
  if (A()) {
    return;
  }
  var BH = true,
    Am = false,
    m = false,
    j = true,
    Af = true,
    q = false,
    U = false;
  var AG = "Ajile",
    Az = "Powered by ",
    Aq = "index",
    O = ".js",
    AA = "",
    F = "<*>",
    A8 = "com.iskitz.ajile",
    n,
    u = [AG, "Import", "ImportAs", "Include", "Load", "Namespace"],
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
  var A0,
    Ag,
    BI = "__LOADED__",
    A6,
    AB = "",
    Ab;
  var J = [
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
  var l = /(cloakoff|cloak)/,
    P = /(debugoff|debug)/,
    Av = /(legacyoff|legacy)/,
    s = /(mvcoff|mvc)/,
    AW = /(mvcshareoff|mvcshare)/,
    AZ = /(overrideoff|override)/,
    K = /(refreshoff|refresh)/,
    M = /(.*\/)[^\/]+/,
    AN = /(.*)\.[^\.]+/,
    V = /(\/\.\/)|(\/[^\/]*\/\.\.\/)/,
    v = /:\/\x2f/;
  function An() {
    Ab = Ae(A8);
    if (Ab && !q) {
      return;
    }
    !Ab && (Ab = {});
    Ag = new AH(y(A8));
    AV ? (Ag.version = AV) : (AV = Ag.version);
    f(AO);
    z();
    if (!A5) {
      Ag.fullName = A8;
      Ag.path = "/use/";
      Ag.shortName = AG;
    }
    Ak(F, AE);
    AU();
    Ah.add(A8, AG);
    Au.add(A8, AG);
    AI(AG, A8, Ab);
    BC();
  }
  function BA(BK) {
    if (BK && BK != A8) {
      AL(BK);
      return;
    }
    Ay(AE);
    AD.clear();
    t.clear();
    D.clear();
    k.clear();
    Ah.clear();
    Au.clear();
    Ac.clear();
    r(false);
    AE();
    A6 = null;
    A1(u.concat(N));
    AC(A8);
  }
  function G(BM, BK) {
    if (BM == H) {
      return;
    }
    var BL = AD.get(H);
    !BL && (BL = new Aa()) && AD.add(H, BL);
    BL.add(BM, BK);
  }
  function Ak(BK, BL, BR) {
    r();
    var BO = [];
    switch (true) {
      case !BL || !A2(BL):
        if (!A2(BK)) {
          return false;
        }
        BL = BK;
        BK = e;
        break;
      case !!BK && !BE(BK):
        if (!E(BK) || !A2(BL)) {
          return false;
        }
        BR = BL;
        BL = AF(BK, BL, BO);
        for (var BN = 0, BM = BK.length; BN < BM; BN++) {
          Ak(BK[BN], BL, BR);
        }
        return true;
    }
    if (BK == F && this == b[AG]) {
      return false;
    }
    !BK && (BK = "");
    var BS,
      BP = t.get(BK);
    BL = { notify: BL, notified: BO };
    BR && (BL.notifyOriginal = BR);
    !BP && (BP = new Aa()) && t.add(BK, BP);
    BP.add(Math.random(), BL);
    if (BK) {
      BS = Ae(BK);
      BS && BB(BK, BS, BL.notify, BO);
    } else {
      if (!BK && Au.getSize() > 0) {
        for (var BQ in Au.getAll()) {
          if ("undefined" == typeof Object.prototype[BQ]) {
            BS = Ae(BQ);
            BS && BB(BQ, BS, BL.notify, BO);
          }
        }
      }
    }
    BK && new i(BK).start();
    return true;
  }
  function AF(BM, BL, BN) {
    function BK(BT) {
      for (var BS, BO, BQ, BR = 0, BP = BM.length; BR < BP; BR++) {
        BQ = BM[BR];
        BS = Ae(BQ);
        if (!BS) {
          return false;
        }
        !BO && (BO = {});
        BO[BQ] = BS;
      }
      !BN.length && BB(BM, BO, BL, BN, BK);
    }
    return BK;
  }
  function Aj(BK) {
    if (BK == H) {
      return;
    }
    var BL = Ac.get(BK);
    !BL && (BL = new Aa()) && Ac.add(BK, BL);
    BL.add(H);
  }
  function AE(BL) {
    for (var BR, BP, BO, BN, BQ, BK = At(), BM = BK.length; --BM >= 0; ) {
      if (!BK[BM]) {
        continue;
      }
      BR = BK[BM].title;
      if (!BR) {
        continue;
      }
      BP = false;
      BQ = !!BR && BR.indexOf(A8) == 0;
      BR && (BO = Ae(BR)) && (BN = Ax(BR)) && (BP = BN.hasOption("cloak"));
      if (BO && (BQ || (BN && BP) || BH || !BK[BM].src)) {
        f(A2(BO) ? BO : BO.constructor);
        Ar(BK[BM]);
      }
    }
  }
  function Ar(BL, BK) {
    if (g) {
      Ar = function BM(BP, BO) {
        if ((BO = BO || BP.parentNode)) {
          if (BO.removeChild) {
            BO.removeChild(BP);
          }
        }
      };
    } else {
      if (B) {
        Ar = new Function(
          "element",
          "container",
          'if(container){  try { container.removeChild(element); }catch(e){}  return;}try { document.getElementsByTagName("head")[0].removeChild(element); }catch(e){try { document.body.removeChild(element);}catch(e){}}'
        );
      } else {
        Ar = function BN() {};
      }
    }
    if (BL) {
      Ar(BL, BK);
    }
  }
  function f(BK) {
    if (!BK || !BK.toString || BK === Function || BK === Object) {
      return false;
    }
    BK.toString = cloakObjectToggler;
    return true;
  }
  cloakObjectToggler = function () {
    return "cloaked";
  };
  function AT(BL, BK) {
    return BL - BK;
  }
  function S(BO) {
    var BL = !BE(BO) ? Ah.getAllArray() : [[BO, Ah.get(BO) || BO]];
    if (!BL) {
      return;
    }
    for (var BN, BK, BM = BL.length; --BM >= 0; ) {
      BO = BL[BM][0];
      BN = Ae(BO);
      if (!BN || !As(BO)) {
        continue;
      }
      Y((BK = BL[BM][1]), BO, arguments);
      if (BK == "*") {
        BK = e;
      }
      AI(BK, BO, BN);
      w(BO);
    }
  }
  function AK(BK) {
    return (
      AG +
      ".GetPathFor(" +
      BK +
      ") is not supported. Namespace paths are protected."
    );
  }
  function BF(BK) {
    this.name = "DEPRECATED: " + A8 + ".NamespaceException";
    this.message = "DEPRECATED: Invalid _namespace name [" + BK + "]";
    this.toString = BL;
    function BL() {
      return "[ " + this.name + " ] :: " + this.message;
    }
  }
  function X(BK) {
    if (BE(BK)) {
      Ag.path = BK;
    }
  }
  function A1(BL) {
    if (!B) {
      for (var BK = BL.length; --BK >= 0; b[BL[BK]] = e) {}
    } else {
      (A1 = new Function(
        "SYS",
        "global",
        "  try     { for(var i=SYS.length; --i >= 0; delete global[SYS[i]]);      }  catch(e){ for(var j=SYS.length; --j >= 0; global[SYS[j]] = undefined); }"
      ))(BL, b);
    }
  }
  function AC(BO) {
    if (!BO) {
      return;
    }
    var BN = {},
      BL = BO.split("\x2e"),
      BM = b[BL[0]];
    for (var BK = 1; typeof BL[BK] != "undefined"; BK++) {
      if (typeof BM[BL[BK]] == "undefined") {
        break;
      }
      BN[BL[BK - 1]] = [BK, true];
      BM = BM[BL[BK]];
      for (var BP in BM) {
        if ("undefined" == typeof Object.prototype[BP]) {
          if (BP != BL[BK]) {
            BN[BL[BK - 1]][1] = false;
            break;
          }
        }
      }
    }
    for (BM in BN) {
      if ("undefined" == typeof Object.prototype[BM]) {
        if (BN[BM][1]) {
          AL(BL.slice(0, BN[BM][0] + 1).join("."));
        }
      }
    }
  }
  function AL(BM) {
    var BK;
    Ah.remove(BM);
    Au.remove(BM);
    if (BM) {
      if (!BE(BM)) {
        if ((BM = Ax(BM))) {
          BM = BM.fullName;
          BK = BM.shortName;
        }
      }
      if (!BK && BM) {
        BK = BM.substring(BM.lastIndexOf("\x2e") + 1);
      }
      BM = AN.exec(BM);
      BM = BM ? BM[1] : e;
    }
    var BL = BM ? Ae(BM) : BK ? b : e;
    if (BL && BK) {
      if (BK == "*" || typeof BL[BK] != "undefined") {
        if (BK != "*") {
          if (BL[BK] == b[BK]) {
            b[BK] = e;
          }
          (BL != b || !BG) && delete BL[BK];
        } else {
          for (var BN in BL) {
            if ("undefined" == typeof Object.prototype[BN]) {
              delete BL[BN];
            }
          }
          AC(BM);
        }
      }
    }
    AE(BM || BK);
  }
  function AY(BO) {
    var BK = BO;
    var BP = Ah.getAllArray();
    for (var BM, BN = 0, BL = BP.length; BN < BL; ++BN) {
      if (Au.has((BM = BP[BN][0]))) {
        continue;
      }
      if ("*" != BP[BN][1]) {
        BK = AN.exec(BM);
      }
      if (!(BK && BO == BK[1])) {
        continue;
      }
      Au.add((H = BM));
      return;
    }
    H = Aq;
  }
  function r(BM, BK) {
    var BL = (BK = BK || b || this).onload;
    if (BL === R) {
      BM == e && (BM = true);
      !BM && (BK.onload = R(true));
      return;
    }
    if (BL && BL != R.onLoad) {
      R.onLoad = BL;
    }
    f((BK.onload = R));
  }
  function R(BL) {
    r = function () {};
    var BK = R.onLoad;
    delete R.onLoad;
    S();
    AE();
    return BK && A2(BK) && BK(BL);
  }
  function AQ(BK) {
    if (!BK) {
      return window.document;
    }
    if (typeof BK.write == "undefined") {
      if (typeof BK.document != "undefined") {
        BK = BK.document;
      } else {
        if (typeof BK.parentNode != "undefined") {
          return AQ(BK.parentNode);
        } else {
          return window.document;
        }
      }
    }
    return BK;
  }
  function BJ(BK, BQ) {
    if (!BQ) {
      return e;
    }
    var BP = BQ.split("\x2e");
    var BL;
    for (var BO = BK == BQ, BN = 0, BM = BP.length; BN < BM; BN++) {
      if (isNaN(BP[BN])) {
        continue;
      }
      BQ = BP.slice(0, BN).join("\x2e");
      BK = BO ? BQ : BK || BP.slice(BN - 1, BN)[0];
      BL = BP.slice(BN).join("\x2e");
      break;
    }
    if (!BL) {
      return e;
    }
    return [BK, BQ, BL];
  }
  function At(BL) {
    if (!(BL = AQ(BL))) {
      return e;
    }
    var BK =
      typeof BL.scripts != "undefined" &&
      typeof BL.scripts.length != "undefined" &&
      BL.scripts.length > 0
        ? BL.scripts
        : typeof BL.getElementsByTagName != "undefined"
        ? BL.getElementsByTagName("script") || []
        : [];
    return BK;
  }
  function AM(BK) {
    if (BK) {
      if ((!A6 || g) && !B) {
        if ((A6 && d && BK != A6.ownerDocument) || !A6 || (!d && g)) {
          if (BK.lastChild && BK.lastChild.firstChild) {
            A6 = BK.lastChild.firstChild;
          }
        }
      } else {
        if (!A6 && B) {
          A6 = A0;
        }
      }
    }
    return A6;
  }
  function a(BM) {
    Ao(BM);
    if (!BM || !BE(BM)) {
      return [];
    }
    var BL = O ? BM.lastIndexOf(O) : BM.lastIndexOf("\x2e");
    if (BL < BM.length && BL >= 0) {
      var BN = BM.slice(BL, BL + O.length);
      var BK = BM.substring(0, BL);
      if (BK && isNaN(BK.charAt(0))) {
        BK = "";
      }
    }
    return [BK, BN];
  }
  function Ae(BO, BK) {
    if (!BE(BO)) {
      return e;
    }
    var BN = BK || b;
    BO = BO.split("\x2e");
    for (var BM = 0, BL = BO.length; BM < BL; BM++) {
      if (typeof BN[BO[BM]] != "undefined") {
        BN = BN[BO[BM]];
      } else {
        return e;
      }
    }
    return BN;
  }
  function Ax(BM) {
    if (!BM) {
      return new AH(Ag);
    }
    var BK = BE(BM);
    for (var BL in k) {
      if ("undefined" == typeof Object.prototype[BL]) {
        if ((BK && BM == BL) || (!BK && BM == Ae(BL))) {
          return k[BL];
        }
      }
    }
    return e;
  }
  function y(Bb, BR) {
    Bb = Bb || A8;
    if (Bb == A8 && Ag && Ag.path) {
      return Ag;
    }
    var BT = k[Bb];
    if (BT) {
      return BT;
    }
    var Bd = AJ(Bb, BR);
    if ((BT = o(Bb, Bd))) {
      return (k[Bb] = BT);
    }
    var BK = At();
    if (!(BK && Bd)) {
      return e;
    }
    var Ba;
    for (var BS = false, BV, BX, BZ = 0, BY = BK.length; BZ < BY; BZ++) {
      BV = unescape(BK[BZ].src);
      if (BV && BV.search(v) == -1) {
        BV = unescape(window.location.href);
        if (BV.charAt(BV.length - 1) != n) {
          if ((BX = M.exec(BV)) != null) {
            if (BX[1].length > BV.search(v) + 3) {
              BV = BX[1];
            }
          }
        }
        BV += unescape(BK[BZ].src);
      }
      if (BV == e || BV == null) {
        continue;
      }
      while (V.test(BV)) {
        BV = BV.replace(V, "\x2f");
      }
      if (D.has(BV)) {
        continue;
      }
      D.add(BV);
      if (BS) {
        continue;
      }
      var BM;
      for (var BN in Bd) {
        if (typeof Object.prototype[BN] != "undefined") {
          continue;
        }
        BM = Bd[BN];
        var Bc,
          Be,
          BP = [];
        for (var BW = BM.length; --BW >= 0; ) {
          Bc = BM[BW];
          Be = BV.lastIndexOf(Bc) + 1;
          if (Be <= 0 || Be == BP[0]) {
            continue;
          }
          BP[BP.length] = Be;
          I("FOUND :: Path [ " + BV + " ]", arguments);
        }
        if (BP.length == 0) {
          continue;
        }
        BP.length > 2 && BP.sort(AT);
        Be = BP[BP.length - 1];
        BR = Be == BV.lastIndexOf(Bc) + 1 ? BN : e;
        Ba = BV.substring(0, Be);
        BS = true;
        if (Bb == A8 && BK[BZ].title != A8) {
          BK[BZ].title = A8;
        }
        var BL = Be + Bc.length - 2;
        var BU = a(BV.substring(BL + 1));
        var BQ = BU[1];
        var BO = BU[0] || (Bb == A8 && AV);
        break;
      }
    }
    if (!Ba) {
      return e;
    }
    BT = new AH(Ba, BR, Bb, e, BO, BQ);
    k[Bb] = BT;
    return BT;
  }
  function o(Ba, Bb) {
    var BS = Number.MAX_VALUE;
    var BU;
    var BL = [];
    var BV;
    var BO = 0;
    Bb = Bb || AJ(Ba);
    var BQ = [];
    var BY = D.getAll();
    BY: for (var BW in BY) {
      if (typeof Object.prototype[BW] != "undefined") {
        continue;
      }
      for (var BN in Bb) {
        if (typeof Object.prototype[BN] != "undefined") {
          continue;
        }
        BQ[BQ.length] = BN;
        for (var BM = Bb[BN], BZ = BM.length; --BZ >= 0; ) {
          if (0 < (BV = BW.lastIndexOf(BM[BZ]))) {
            BU = BW.length - (BV + BM[BZ].length);
            if (BU < BS) {
              BS = BU;
              BO = BL.length;
            }
            BL[BL.length] = BV + 1;
            var BK = BV + 1 + BM[BZ].length - 2;
            var BX = a(BW.substring(BK + 1));
            var BR = BX[1];
            var BP = BX[0];
            I("FOUND :: Cached Path [ " + BW + " ]", arguments);
            break BY;
          }
          if (BZ == 0) {
            delete BQ[--BQ.length];
          }
        }
      }
    }
    if (!BL || BL.length == 0) {
      return e;
    }
    BW = BW.substring(0, BL[BO]);
    var BT = new AH(BW, BQ[BO], Ba, e, BP, BR);
    if (BT.path) {
      k[Ba] = BT;
    }
    return BT;
  }
  function AJ(BM, BO) {
    var BQ = n || A7();
    var BK = BO == e ? J : [BO];
    var BN = {};
    for (var BP, BL = BK.length; --BL >= 0; ) {
      BO = BK[BL];
      BP = BQ + BM.replace(/\x2e/g, BO);
      BN[BO] = [BP + BO, BP + O];
    }
    return BN;
  }
  function p() {
    return [
      BH ? "cloak" : "cloakoff",
      Am ? "debug" : "debugoff",
      m ? "legacy" : "legacyoff",
      j ? "mvc" : "mvcoff",
      Af ? "mvcshare" : "mvcshareoff",
      q ? "override" : "overrideoff",
      U ? "refresh" : "refreshoff",
    ].join(",");
  }
  function A7(BM) {
    if (!BM && n) {
      return n;
    }
    var BN = unescape(window.location.href);
    var BK = BN.lastIndexOf("\x5c") + 1;
    var BL = BN.lastIndexOf("\x2f") + 1;
    n = BK > BL ? "\x5c" : "\x2f";
    return n;
  }
  function Ap(BL, BR, BO, BQ, BN, BP, BK) {
    if (!Ah.add(BR, BL)) {
      return BP;
    }
    G(BR, BL == "*" ? BR : BL);
    Aj(BR);
    if (BL == "*") {
      (BL = BI), I('...\t:: Import ("' + BR + '.*")', arguments);
    } else {
      if (BL == BR) {
        I('...\t:: Include ("' + BL + '")', arguments);
      } else {
        I('...\t:: ImportAs ("' + BL + '", "' + BR + '")', arguments);
      }
    }
    if (new i(BR).start()) {
      return BP;
    }
    BO = AS(BL, BR, BO, BQ, BN);
    var BM = c(
      BO,
      AQ(BK || b || this),
      'ImportAs("' + BL + '", "' + BR + '");',
      false,
      BR
    );
    return BP;
  }
  function AS(BK, BR, BN, BQ, BL) {
    m && (BQ = BQ === false ? "\x2f" : "\x2e");
    !BQ && (BQ = Ag.notation);
    var BP = BR + (BK == "*" ? ".*" : "");
    var BM = BP;
    var BO;
    do {
      if ((BP = AN.exec(BP))) {
        BP = BP[1];
      } else {
        break;
      }
      if (BP == BM) {
        break;
      }
      BM = BP;
      BO = y(BP, BQ);
    } while (!BO);
    !BE(BN) && (BN = (BO && BO.path) || Ag.path || "");
    BN.charAt(BN.length - 1) != "\x2f" && (BN += "\x2f");
    BN += escape(BR.replace(/\x2e/g, BQ));
    BL && (BN += "\x2e" + BL);
    BN += O;
    BO && BO.hasOption("refresh") && (BN = AR(BN));
    return BN;
  }
  function AI(BL, BQ, BO, BK) {
    if (!BO) {
      return BO;
    }
    !BK && (BK = b || this);
    if (BL != BI && A3(BL, BQ, BK)) {
      Ah.remove(BQ);
      return BO;
    }
    if (!As(BQ, BL)) {
      return e;
    }
    var BM = [],
      BP = Ah.get(BQ),
      BN = BL == BQ || BP == BQ;
    if (BL && BL != BI && (!BP || (BP != "*" && BP != BI))) {
      if (BN) {
        BM[0] = 'SUCCESS :: Include ("' + BQ + '")';
      } else {
        BK[BL] = BO;
        BM[0] = 'SUCCESS :: ImportAs ("' + BL + '", "' + BQ + '")';
      }
      Ah.remove(BQ);
      Au.add(BQ, BL);
    } else {
      if (BP == "*") {
        BD(BL, BQ, BO, BK, BN, BM);
      } else {
        if (BP != "*" && (BP == BI || BL == BI)) {
          BM[0] =
            "SUCCESS :: " + (BN ? "Include" : "Import") + ' ("' + BQ + '.*")';
          Ah.remove(BQ);
          Au.add(BQ, "*");
        }
      }
    }
    BM.length > 0 && I(BM.join("\r\n"), arguments);
    BL != BQ && AO(BL, BO);
    AO(BQ, BO);
    return BO;
  }
  function BD(BL, BQ, BO, BK, BN, BM) {
    BM[BM.length] = " ";
    if (!BN) {
      var BP;
      for (var BR in BO) {
        if (typeof Object.prototype[BR] != "undefined") {
          continue;
        }
        BP = BQ + "." + BR;
        if (k[BP] || A3(BR, BP, BK)) {
          continue;
        }
        BK[BR] = BO[BR];
        BM[BM.length] = 'SUCCESS :: ImportAs ("' + BR + '", "' + BP + '")';
      }
    }
    Ah.remove(BQ);
    if (BL != BI) {
      Ah.add(BQ, BI);
    }
  }
  function A3(BL, BN, BK) {
    BK = BK || b || this;
    if (
      q ||
      (BN == BL && !Ae(BL)) ||
      typeof BK[BL] == "undefined" ||
      Ae(BN) == BK[BL]
    ) {
      return false;
    }
    var BM =
      "\nWARNING: There is a naming conflict, " +
      BL +
      " already exists.\nConsider using the override load-time option, " +
      AG +
      '.EnableOverride(),\nor ImportAs with an alias; for example:\n\n\tImportAs ("' +
      BL +
      '1", "' +
      BN +
      '");';
    if (BL == BN) {
      BM += "\n\nThe module is currently inaccessible.\n";
    } else {
      BM +=
        "\n\nThe module can currently be accessed using its fully-qualified name:\n\n\t" +
        BN +
        ".\n";
    }
    I(BM, arguments, Am);
    return true;
  }
  function AP(BK) {
    return new Function("return /*@cc_on @if(@_jscript)" + BK + "@end @*/;")();
  }
  function W(BN, BL, BM, BK) {
    return x(e, BN, BL, BM, BK);
  }
  function x(BW, BP, BL, BU, BM) {
    r();
    if (!BP || BP == "*") {
      I('ERROR :: ImportAs ("' + BW + '", "' + BP + '")');
      return e;
    }
    var BV, BT;
    if (!BE(BW)) {
      BW = "";
    }
    if ((BV = BJ(BW, BP))) {
      BP = BV[1];
      BW = BW != BI ? BV[0] : BI;
      BT = BV[2];
    } else {
      if (!BW) {
        BW = BP.substring(BP.lastIndexOf("\x2e") + 1);
      }
    }
    !BM && (BM = b || this);
    if (BW == "*") {
      BP = AN.exec(BP)[1];
    } else {
      if (typeof BM[BW] != "undefined" && BW != BP) {
        for (var BX = m ? u.concat(N) : u, BY = BX.length; --BY >= 0; ) {
          if (BW != BX[BY]) {
            continue;
          }
          I(
            'ERROR :: ImportAs ("' +
              BW +
              '", "' +
              BP +
              '")! ' +
              BW +
              " is restricted.",
            arguments
          );
          return BM[BW];
        }
      }
    }
    var BN = BM;
    var BS = "";
    for (var BK, BO = BP.split("\x2e"), BR = 0, BQ = BO.length; BR < BQ; BR++) {
      BK = BO[BR];
      if (typeof BN[BK] == "undefined") {
        break;
      }
      BN = BN[BK];
      BS += BK + "\x2e";
    }
    if (BR >= BQ && BW != "*") {
      Au.remove(BP);
      BN = AI(BW, BP, BN, BM);
      w(BP);
      return BN;
    }
    if (Ah.has(BP)) {
      (BW == "*" || BW == BI) && (BW = BP);
      G(BP, BW);
      Aj(BP);
      return e;
    }
    return Ap(BW, BP, BL, BU, BT, BN, BM);
  }
  function i(BO, BM, BK) {
    var BN,
      BS,
      BQ = 0;
    function BP(BT) {
      BK = BK || 500;
      BT.start = BL;
      BT.stop = BR;
      BN = setInterval(BR, (BM = BM || 60000));
      return BT;
    }
    function BL() {
      switch (true) {
        case ++BQ >= BK:
          BR();
          return false;
        case !!Ae(BO) && As(BO):
          S(BO);
          BR();
          return true;
        default:
          BS = setTimeout(BL, 0);
          return false;
      }
    }
    function BR() {
      e != BS && clearTimeout(BS);
      e != BN && clearInterval(BN);
    }
    if (this.constructor != i) {
      if (!this.constructor || this.constructor.toString() != i.toString()) {
        return new i(BO, BM, BK);
      }
    }
    return BP(this);
  }
  function A9(BN, BL, BM, BK) {
    BN && (BN = BN.split(".*").join(""));
    return x(BN, BN, BL, BM, BK);
  }
  function E(BK) {
    if (!!Array.isArray) {
      E = Array.isArray;
      return E(BK);
    }
    return (
      BK &&
      (Array == BK.constructor || Array.toString() == BK.constructor.toString())
    );
  }
  function A2(BK) {
    return BK != e && (typeof BK == "function" || Function == BK.constructor);
  }
  function A() {
    if (typeof document == "undefined") {
      return false;
    }
    var BK = !!document.write && !!document.writeln;
    A5 = !!document.createElement;
    B =
      A5 &&
      !!document.createTextNode &&
      !!document.getElementsByTagName &&
      !!(A0 = document.getElementsByTagName("head")[0]).appendChild &&
      !!A0.removeChild;
    g =
      B &&
      !!document.firstChild &&
      !!document.lastChild &&
      !!document.parentNode;
    d = g && !!document.ownerDocument;
    return !(BK || A5 || B || g || d);
  }
  function Aw(BN, BK) {
    var BM = BN == H;
    var BL = Ah.has(BN);
    if (BM || As(H) || BL) {
      return true;
    }
    Ah.add(BN, BK || BN);
    new i(BN).start();
    return false;
  }
  function BE(BK) {
    return BK != e && (typeof BK == "string" || String == BK.constructor);
  }
  function As(BN, BK) {
    var BL = AD.get(BN);
    BL && (BL = BL.getAll());
    for (var BM in BL) {
      if ("undefined" == typeof Object.prototype[BM]) {
        if (!Ae(BL[BM])) {
          return false;
        }
      }
    }
    return true;
  }
  function C(BK) {
    if (!BK || "function" != typeof BK.notify) {
      return;
    }
    this.error = e;
    this.name = BK.name || AA;
    this.item = BK.item;
    this.notify = BK.notify;
  }
  C.prototype.toString = C.prototype.valueOf = function Z() {
    return String(this.name);
  };
  function c(BM, BK, BO, BQ, BP, BN, BR) {
    r();
    if (!(BK = AQ(BK))) {
      I(
        "ERROR :: Container not found. Unable to load:\n\n[" + BM + "]",
        arguments
      );
      return false;
    }
    if (BM) {
      D.add(unescape(BM));
      if (U) {
        BM = AR(BM);
      }
    }
    if (!(BN || BR)) {
      BR = "JavaScript";
      BN = "text/javascript";
    }
    if (BQ == e) {
      BQ = false;
    }
    var BL;
    if (A5 && !h) {
      BL = BK.createElement("script");
    }
    if (!BL) {
      if (BO) {
        BO = "setTimeout('" + BO + "',0);";
      }
      T(BM, BK, BO, BQ, BP, BN, BR);
      return false;
    }
    true && (BL.async = !!BQ);
    BQ && (BL.defer = BQ);
    BR && (BL.language = BR);
    BP && (BL.title = BP);
    BN && (BL.type = BN);
    if (BM) {
      I("...\t:: Load [ " + BM + " ]", arguments);
      if (AX || !(BG || Q)) {
        BL.src = BM;
      }
      AM(BK).appendChild(BL);
      if (!AX || BG || Q) {
        BL.src = BM;
      }
      I("DONE\t:: Load [ " + BM + " ]", arguments);
    }
    if (!BO) {
      return true;
    }
    if (BM) {
      c(e, BK, BO, BQ, BP, BN, BR);
      return true;
    }
    if (typeof BL.canHaveChildren == "undefined" || BL.canHaveChildren) {
      BL.appendChild(BK.createTextNode(BO));
    } else {
      if (!BL.canHaveChildren) {
        BL.text = BO;
      }
    }
    AM(BK).appendChild(BL);
    return false;
  }
  function BC() {
    if (!(j || Af)) {
      return;
    }
    if (Af) {
      c(Ag.path + Aq + O, null, null, null, Aq);
    }
    if (!j) {
      return;
    }
    var BL = unescape(window.location.pathname);
    var BK = BL.lastIndexOf(n);
    BL = BL.substring(++BK);
    BK = BL.lastIndexOf("\x2e");
    BK = BK == -1 ? 0 : BK;
    if ("" != (BL = BL.substring(0, BK))) {
      Aq = BL;
    }
    c(Aq + O, null, null, null, Aq);
  }
  function Ao(BL) {
    if (!BL || !BE(BL)) {
      return;
    }
    var BM = BL.lastIndexOf("?") + 1;
    BL = BL.substring(BM).toLowerCase();
    if (BL.length == 0) {
      return;
    }
    var BK;
    if ((BK = l.exec(BL))) {
      BH = BK[1] == "cloak";
    }
    if ((BK = P.exec(BL))) {
      Am = BK[1] == "debug";
    }
    if ((BK = Av.exec(BL))) {
      L(BK[1] == "legacy");
    }
    if ((BK = s.exec(BL))) {
      j = BK[1] == "mvc";
    }
    if ((BK = AW.exec(BL))) {
      Af = BK[1] == "mvcshare";
    }
    if ((BK = AZ.exec(BL))) {
      q = BK[1] == "override";
    }
    if ((BK = K.exec(BL))) {
      U = BK[1] == "refresh";
    }
  }
  function T(BK, BM, BN, BL, BS, BR, BQ) {
    if (!(BM = AQ(BM || window || this))) {
      return;
    }
    var BP;
    if (BK) {
      I("...\t:: LoadSimple [ " + BK + " ]", arguments);
      if (BN) {
        BP = BN;
        BN = e;
      }
    }
    var BO =
      "<script" +
      (BL ? ' defer="defer"' : "") +
      (BQ ? ' language="' + BQ + '"' : "") +
      (BS ? ' title="' + BS + '"' : "") +
      (BR ? ' type="' + BR + '"' : "") +
      (BK ? ' src="' + BK + '">' : ">") +
      (BN ? BN + ";" : "") +
      "</script>\n";
    BM.write(BO);
    if (BK) {
      I("DONE\t:: LoadSimple [ " + BK + " ]", arguments);
    }
    if (!(BN = BN || BP)) {
      return;
    }
    if (BK) {
      T(e, BM, BN, BL, BS, BR, BQ);
    }
  }
  function I(BO, BQ, BN) {
    if (!Am && !BN) {
      return;
    }
    var BM = /function\s*([^(]*)\s*\(/.exec(BQ.callee) || [""],
      BR = BM.length > 1 ? BM[1] : BM[0];
    if (BO != e) {
      var BL = AB;
      var BK = new Date();
      AB =
        [BK.getFullYear(), BK.getMonth() + 1, BK.getDate()].join(".") +
        "," +
        [
          BK.getHours(),
          BK.getMinutes(),
          BK.getSeconds(),
          BK.getMilliseconds(),
        ].join(":") +
        "\t:: " +
        H +
        " :: " +
        BR +
        "\r\n" +
        BO +
        "\r\n\r\n";
      var BP =
        AB.indexOf("ERROR") >= 0
          ? "error"
          : AB.indexOf("WARN") >= 0
          ? "warn"
          : "info";
      !I.is
        ? (I.is = {
            Firebug: typeof console != "undefined" && A2(console.info),
            MochiKit: typeof MochiKit != "undefined" && A2(MochiKit.log),
            YAHOO: typeof YAHOO != "undefined" && A2(YAHOO.log),
          })
        : 0;
      I.is.Firebug && console[BP](AB);
      I.is.YAHOO && YAHOO.log(AB, BP);
      I.is.MochiKit &&
        (BP == "info"
          ? MochiKit.log(AB)
          : BP == "error"
          ? MochiKit.logError(AB)
          : BP == "warn"
          ? MochiKit.logWarning(AB)
          : 0);
      AB += BL;
    }
    if (BN) {
      Ai();
    }
  }
  function Y(BK, BN, BM) {
    var BL =
      BK == "*" || BK == BI
        ? 'Import   ("' + BN + '.*")'
        : BK == BN
        ? 'Include  ("' + BN + '")'
        : 'ImportAs ("' + BK + '", "' + BN + '")';
    I("CHECKING :: " + BL + "...", BM);
  }
  function Al(BL, BS, BQ, BK) {
    r();
    BL = BL || "\x3cdefault\x3e";
    I('Namespace ("' + BL + '")', arguments);
    var BR = BK || b || this;
    if (BL == "\x3cdefault\x3e") {
      Ag.update(BS, BQ);
      I(Ag, arguments);
      return BR;
    }
    AY(BL);
    var BM = BL.split("\x2e");
    for (var BP = 0, BO = BM.length; BP < BO; BP++) {
      BR = typeof BR[BM[BP]] != "undefined" ? BR[BM[BP]] : (BR[BM[BP]] = {});
    }
    var BN = k[BL];
    if (BN) {
      BN.update(BS, BQ);
      I(BN, arguments);
      return BR;
    }
    if (!BS) {
      BN = y(BL, BQ);
    }
    if (BS || !BN) {
      BN = new AH(BS, BQ, BL);
    }
    if (BN && !k[BL]) {
      k[BL] = BN;
    }
    I(BN, arguments);
    return BR;
  }
  function AH(BU, BR, BL, BS, BO, BT, BV) {
    function BP(BW) {
      BQ();
      BW.hasOption = BN;
      BW.toString = BK;
      BW.update = BM;
      BW.update(BU, BR, BL, BS, BO, BT, BV);
      return BW;
    }
    function BQ() {
      if (!(BU && BU.constructor == AH)) {
        return;
      }
      var BW = BU;
      BT = BW.extension;
      BL = BW.fullName;
      BR = BW.notation;
      BV = BW.options;
      BU = BW.path;
      BS = BW.shortName;
      BO = BW.version;
    }
    function BN(BW) {
      BV = BV || this.options;
      if (!(BV && BW && BV.indexOf(BW) >= 0)) {
        return false;
      }
      var BX = new RegExp("(" + BW + ")[,$]", "g").exec(BV);
      return !!BX && typeof BX[1] != "undefined" && BX[1] == BW;
    }
    function BK() {
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
    function BM(Ba, BZ, Bb, BW, BX, Bc, BY) {
      this.extension = Bc || this.extension || O;
      this.fullName = Bb || this.fullName || "";
      this.shortName = BW || this.shortName || "";
      this.notation = BE(BZ)
        ? BZ
        : this.notation || (Ag && BE(Ag.notation) ? Ag.notation : "\x2e");
      this.options = BE(BY) ? BY : this.options || p();
      this.path = BE(Ba) ? Ba : this.path || (Ag && BE(Ag.path) ? Ag.path : "");
      this.uri = this.path + this.fullName.replace(/\x2e/g, this.notation);
      this.version = "" + (BX || this.version || "");
      if (!this.uri) {
        return;
      }
      this.uri += (this.version ? "\x2e" + this.version : "") + this.extension;
    }
    if (this.constructor != AH) {
      if (!this.constructor || this.constructor.toString() != AH.toString()) {
        return new AH(BU, BR, BL, BS, BO, BT, BV);
      }
    }
    return BP(this);
  }
  function BB(BL, BO, BN, BP, BK) {
    function BM() {
      if (BP && !BP.length) {
        return;
      }
      var BR = BK || BN;
      BN(new C({ name: BL, item: BO, notify: BR }));
    }
    var BQ = setTimeout(BM, 0);
    BP && (BP[BP.length] = BQ);
  }
  function AO(BP, BN) {
    var BR = [t.get(""), t.get(BP), t.get(F)];
    if (!BR[0] && !BR[1] && !BR[2]) {
      return;
    }
    var BK = !!(BR[0] && BR[0].getSize()) || !!(BR[1] && BR[1].getSize());
    Am && BK && I("NOTIFY :: Import Listeners for " + BP + "...", arguments);
    for (var BO, BM, BL = BR.length; --BL >= 0; ) {
      if (!BR[BL]) {
        continue;
      }
      BM = BR[BL].getAll();
      for (var BQ in BM) {
        if ("undefined" == typeof Object.prototype[BQ]) {
          if (!BM[BQ]) {
            continue;
          }
          BO = BM[BQ];
          A2(BO.notify) && BB(BP, BN, BO.notify, BO.notified);
        }
      }
    }
    Am &&
      BK &&
      I("NOTIFY :: Import Listeners for " + BP + "...DONE!", arguments);
  }
  function AU() {
    Al(A8);
    f((b.Import = W));
    f((b.ImportAs = x));
    f((b.Include = A9));
    f((b.Load = c));
    f((b.Namespace = Al));
    f((Ab.AddImportListener = Ak));
    f((Ab.EnableLegacy = L));
    f(
      (Ab.GetVersion = function () {
        return AV;
      })
    );
    Ab.GetVersion.toString = Ab.GetVersion.prototype.toString = Ab.GetVersion;
    f((Ab.RemoveImportListener = Ay));
    f((Ab.SetOption = Ad));
    f((Ab.ShowLog = Ai));
    f((Ab.Unload = BA));
    A4("Cloak");
    A4("Debug");
    A4("Override");
    A4("Refresh");
    L(m || false);
  }
  function A4(BK) {
    if (!BK || !BE(BK)) {
      return;
    }
    f(
      (Ab["Enable" + BK] = function (BL) {
        Ad(BK, BL);
      })
    );
  }
  function Ay(BL, BP) {
    r();
    var BT = false;
    switch (true) {
      case !BP || !A2(BP):
        if (!A2(BL)) {
          return false;
        }
        BP = BL;
        BL = AA;
        break;
      case !!BL && !BE(BL):
        if ("object" == typeof BL && BL.name != e) {
          BP = BL.notify;
          BL = BL.name;
          break;
        }
        if (!E(BL)) {
          return false;
        }
        BT = true;
        for (var BQ = 0, BR = BL.length; BQ < BR; BQ++) {
          BT = BT && Ay(BL[BQ], BP);
        }
        return BT;
    }
    var BN = [t.get(AA), t.get(BL), t.get(F)];
    if (!BN[0] && !BN[1] && !BN[2]) {
      return false;
    }
    for (var BW = BP, BV, BS = BN.length; --BS >= 0; ) {
      if (!BN[BS]) {
        continue;
      }
      BV = BN[BS].getAll();
      for (var BM in BV) {
        if ("undefined" == typeof Object.prototype[BM]) {
          BP = BV[BM];
          if (!BP || (BW != BP.notify && BW != BP.notifyOriginal)) {
            continue;
          }
          delete BP.notify;
          delete BP.notifyOriginal;
          for (var BU = BP.notified, BO = 0, BK = BU.length; BO < BK; BO++) {
            clearTimeout(BU[BO]);
            BU[BO] = e;
            delete BU[BO];
          }
          BU.length = 0;
          delete BP.notified;
          BN[BS].remove(BM);
          BT = true;
          break;
        }
      }
    }
    return BT;
  }
  function z(BK) {
    if (!(B && (BK = document.createElement("meta")))) {
      return;
    }
    BK.httpEquiv = Az + AG + " " + AV;
    Az = A8.split("\x2e").reverse().join("\x2e");
    BK.content = Az + " :: Smart scripts that play nice ";
    AM(window.document).appendChild(BK);
  }
  function L(BK) {
    if (BK == e) {
      BK = true;
    }
    m = BK;
    Ab = Ab || Ae(AG) || {};
    if (BK) {
      Ab.DIR_NAMESPACE = Ab.USE_PATH = "\x2f";
      Ab.DOT_NAMESPACE = Ab.USE_NAME = "\x2e";
      f((Ab.CompleteImports = S));
      f((Ab.EnableDebugging = Ab.EnableDebug));
      f((Ab.GetPathFor = AK));
      f((b.JSBasePath = b.JSPath = Ab.SetBasePath = X));
      f((b.JSImport = W));
      f((b.JSLoad = c));
      f((b.JSPackaging = Ab));
      f((b.JSPackage = b.Package = Al));
      f(
        (b.JSPacked = function (BL) {
          Ag.notation = BL;
        })
      );
      f((b.NamespaceException = b.PackageException = BF));
    }
    if (BK || typeof b["JSPackaging"] == "undefined") {
      return;
    }
    delete Ab.DIR_NAMESPACE;
    delete Ab.DOT_NAMESPACE;
    delete Ab.CompleteImports;
    delete Ab.EnableDebugging;
    delete Ab.GetPathFor;
    delete Ab.SetBasePath;
    delete Ab.USE_NAME;
    delete Ab.USE_PATH;
    A1(N);
  }
  function Ad(BK, BL) {
    r();
    if (!BK || !BE(BK)) {
      return;
    }
    BL = BL == e ? true : BL;
    BK = BK.toLowerCase();
    switch (BK) {
      case "cloak":
        BH = BL;
        break;
      case "debug":
        Am = BL;
        break;
      case "legacy":
        L(BL);
        break;
      case "override":
        q = BL;
        break;
      case "refresh":
        U = BL;
        break;
      default:
        break;
    }
  }
  function AR(BK) {
    if (/ajile.refresh/g.test(BK)) {
      return BK;
    }
    return BK + (/\?/g.test(BK) ? "&" : "?") + "ajile.refresh=" + Math.random();
  }
  function Ai() {
    r();
    if (BG && !B) {
      return;
    }
    if (!Am) {
      AB =
        "\r\nTo enable debug logging, use <b>" +
        AG +
        ".EnableDebug()</b> from within any of your scripts or use " +
        AG +
        "'s debug load-time option as follows:<br><br><pre><code>&lt;script src=\"" +
        Ag.uri +
        '?<b>debug</b>" type="text/javascript"&gt;&lt;/script&gt;</code></pre>';
    }
    var BM =
      "<html><head><title>" +
      AG +
      "'s Debug Log " +
      (!Am ? ":: DISABLED" : "") +
      '</title>\r\n<style type="text/css">*{background-color:#eee;color:#000;font-family:"Tahoma";font-size:12px;}</style>\r\n</head>\r\n<body>' +
      AB.replace(/\r\n/g, "<br>") +
      "</body></html>";
    var BN = screen.width / 1.5;
    var BK = screen.height / 1.5;
    var BL = Ai.window
      ? Ai.window
      : (Ai.window = window.open(
          "",
          "__AJILELOG__",
          "width=" +
            BN +
            ",height=" +
            BK +
            ",addressbar=0,directories=0,location=0,menubar=0,scrollbars=1,statusbar=0,toolbar=0,resizable=1"
        ));
    if (!(BL && BL.document)) {
      return;
    }
    BL.document.open();
    BL.document.writeln(BM);
    BL.document.close();
  }
  function Aa() {
    var BM = {},
      BU = 0;
    function BO(BV) {
      BV.add = BS;
      BV.clear = BQ;
      BV.get = BL;
      BV.getAll = BP;
      BV.getAllArray = BK;
      BV.getSize = BT;
      BV.has = BR;
      BV.remove = BN;
      return BV;
    }
    function BS(BV, BW, BX) {
      if (BL(BV) && !BX) {
        return false;
      }
      BM[BV] = BW;
      BU++;
      return true;
    }
    function BQ() {
      for (var BV in BM) {
        if ("undefined" == typeof Object.prototype[BV]) {
          delete BM[BV];
        }
      }
      BU = 0;
    }
    function BL(BV) {
      return typeof Object.prototype[BV] != "undefined" ||
        typeof BM[BV] == "undefined"
        ? e
        : BM[BV];
    }
    function BP() {
      return BM;
    }
    function BK() {
      var BW = [];
      for (var BV in BM) {
        if ("undefined" == typeof Object.prototype[BV]) {
          BW[BW.length] = [BV, BM[BV]];
        }
      }
      return BW;
    }
    function BT() {
      return BU;
    }
    function BR(BV) {
      return (
        typeof Object.prototype[BV] == "undefined" &&
        typeof BM[BV] != "undefined"
      );
    }
    function BN(BV) {
      if (!BR(BV)) {
        return false;
      }
      delete BM[BV];
      BU--;
      return true;
    }
    if (this.constructor != Aa) {
      if (!this.constructor || this.constructor.toString() != Aa.toString()) {
        return new Aa();
      }
    }
    return BO(this);
  }
  function w(BM) {
    var BN = Ac.get(BM);
    if (!BN) {
      return;
    }
    BN = BN.getAll();
    var BL;
    for (var BK in BN) {
      if ("undefined" == typeof Object.prototype[BK]) {
        if (Ah.has(BK) && (BL = Ae(BK))) {
          if (AI(Ah.get(BK), BK, BL)) {
            w(BK);
          }
        }
      }
    }
  }
  var H = A8,
    AD = new Aa(),
    t = new Aa(),
    BG = AP("@_jscript_version"),
    h = typeof ScriptEngine != "undefined" && /InScript/.test(ScriptEngine()),
    Q = /Opera/i.test(window.navigator.userAgent),
    AX = /WebKit/i.test(window.navigator.userAgent),
    D = new Aa(),
    k = {
      clear: function () {
        for (var BK in this) {
          if ("undefined" == typeof Object.prototype[BK]) {
            delete this[BK];
          }
        }
      },
    },
    Ah = new Aa(),
    Au = new Aa(),
    Ac = new Aa();
  An();
})("1.9.9", this);
