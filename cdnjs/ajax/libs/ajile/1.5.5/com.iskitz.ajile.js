/**----------------------------------------------------------------------------+
| Product:  ajile [com.iskitz.ajile]
| @version  1.5.5
|+-----------------------------------------------------------------------------+
| @author   Michael A. I. Lee [iskitz.com]
|
| Created:  Tuesday,   November   4, 2003    [2003.11.04]
| Updated:  Friday,    February   1, 2013    [2013.02.01.09.36-08.00]
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
(function (AQ, Y, b) {
  var A0, B, d, a;
  if (typeof Ai != "undefined" && Ai() > 1) {
    return;
  }
  var BB = true,
    Ah = false,
    j = false,
    g = true,
    Aa = true,
    n = false,
    S = false;
  var AB = "Ajile",
    Au = "Powered by ",
    Al = "index",
    M = ".js",
    D = "<*>",
    A3 = "com.iskitz.ajile",
    k,
    r = [AB, "Import", "ImportAs", "Include", "Load", "Namespace"],
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
  var Av,
    Ab,
    BC = "__LOADED__",
    A1,
    x = "",
    AW;
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
  var i = /(cloakoff|cloak)/,
    N = /(debugoff|debug)/,
    Aq = /(legacyoff|legacy)/,
    p = /(mvcoff|mvc)/,
    AR = /(mvcshareoff|mvcshare)/,
    AU = /(overrideoff|override)/,
    I = /(refreshoff|refresh)/,
    K = /(.*\/)[^\/]+/,
    AI = /(.*)\.[^\.]+/,
    T = /(\/\.\/)|(\/[^\/]*\/\.\.\/)/,
    s = /:\/\x2f/;
  function Ai(BE) {
    if (typeof A == "undefined" || typeof AX == "undefined") {
      return 0;
    }
    if ((BE = BE || A())) {
      return 3;
    }
    Ab = new AC(v(A3));
    if (!n && (BE = BE || (AW = AZ(A3)))) {
      return 2;
    }
    Ab.version = AQ = AQ || Ab.version;
    c((AW = AW || {}).constructor);
    c(AJ);
    w();
    if (!A0) {
      Ab.fullName = A3;
      Ab.path = "../lib/ajile/";
      Ab.shortName = AB;
    }
    Af(AA);
    AP();
    Ac.add(A3, AB);
    Ap.add(A3, AB);
    AD(AB, A3, AW);
    A6();
    return 1;
  }
  function A5(BE) {
    if (BE && BE != A3) {
      AG(BE);
      return;
    }
    At(AA);
    z.clear();
    q.clear();
    C.clear();
    h.clear();
    Ac.clear();
    Ap.clear();
    AX.clear();
    o(false);
    AA();
    A1 = null;
    Aw(r.concat(L));
    y(A3);
  }
  function E(BG, BE) {
    if (BG == F) {
      return;
    }
    var BF = z.get(F);
    !BF && (BF = new AV()) && z.add(F, BF);
    BF.add(BG, BE);
  }
  function Af(BE, BH) {
    o();
    if (!BH || !Ax(BH)) {
      if (Ax(BE)) {
        BH = BE;
        BE = b;
      } else {
        return false;
      }
    } else {
      if (BE && !A8(BE)) {
        return false;
      }
    }
    if (BE == D && this == Y[AB]) {
      return false;
    }
    !BE && this != Y[AB] && (BE = D);
    var BG = BH;
    if (BE && (Ap.has(BE) || AZ(BE))) {
      setTimeout(function (BJ) {
        BG(BJ);
      }, 0);
      return true;
    }
    if (!BE) {
      if (Ap.getSize() > 0 || Ac.getSize() == 0) {
        for (var BI in Ap.getAll()) {
          setTimeout(function () {
            BG(BI);
          }, 0);
        }
      }
    }
    !BE && (BE = "");
    var BF = q.get(BE);
    !BF && (BF = new AV()) && q.add(BE, BF);
    BF.add(Math.random(), BG);
    BE && new f(BE).start();
    return true;
  }
  function Ae(BE) {
    if (BE == F) {
      return;
    }
    var BF = AX.get(BE);
    !BF && (BF = new AV()) && AX.add(BE, BF);
    BF.add(F);
  }
  function AA(BF) {
    for (var BL, BJ, BI, BH, BK, BE = Ao(), BG = BE.length; --BG >= 0; ) {
      if (!BE[BG]) {
        continue;
      }
      BL = BE[BG].title;
      if (!BL) {
        continue;
      }
      BJ = false;
      BK = !!BL && BL.indexOf(A3) == 0;
      BL && (BI = AZ(BL)) && (BH = As(BL)) && (BJ = BH.hasOption("cloak"));
      if (BI && (BK || (BH && BJ) || BB || !BE[BG].src)) {
        c(Ax(BI) ? BI : BI.constructor);
        Am(BE[BG]);
      }
    }
  }
  function Am(BF, BE) {
    if (d) {
      Am = function BG(BJ, BI) {
        if ((BI = BI || BJ.parentNode)) {
          if (BI.removeChild) {
            BI.removeChild(BJ);
          }
        }
      };
    } else {
      if (B) {
        Am = new Function(
          "element",
          "container",
          'if(container){  try { container.removeChild(element); }catch(e){}  return;}try { document.getElementsByTagName("head")[0].removeChild(element); }catch(e){try { document.body.removeChild(element);}catch(e){}}'
        );
      } else {
        Am = function BH() {};
      }
    }
    if (BF) {
      Am(BF, BE);
    }
  }
  function c(BE) {
    if (!BE || !BE.toString || BE === Function || BE === Object) {
      return false;
    }
    BE.toString = cloakObjectToggler;
    return true;
  }
  cloakObjectToggler = function () {};
  function AO(BF, BE) {
    return BF - BE;
  }
  function Q(BI) {
    var BF = !A8(BI) ? Ac.getAllArray() : [[BI, Ac.get(BI) || BI]];
    if (!BF) {
      return;
    }
    for (var BH, BE, BG = BF.length; --BG >= 0; ) {
      BI = BF[BG][0];
      BH = AZ(BI);
      if (!BH || !An(BI)) {
        continue;
      }
      W((BE = BF[BG][1]), BI, arguments);
      if (BE == "*") {
        BE = b;
      }
      AD(BE, BI, BH);
      t(BI);
    }
  }
  function AF(BE) {
    return (
      AB +
      ".GetPathFor(" +
      BE +
      ") is not supported. Namespace paths are protected."
    );
  }
  function A9(BE) {
    this.name = "DEPRECATED: " + A3 + ".NamespaceException";
    this.message = "DEPRECATED: Invalid _namespace name [" + BE + "]";
    this.toString = BF;
    function BF() {
      return "[ " + this.name + " ] :: " + this.message;
    }
  }
  function V(BE) {
    if (A8(BE)) {
      Ab.path = BE;
    }
  }
  function Aw(BF) {
    if (!B) {
      for (var BE = BF.length; --BE >= 0; Y[BF[BE]] = b) {}
    } else {
      (Aw = new Function(
        "SYS",
        "global",
        "  try     { for(var i=SYS.length; --i >= 0; delete global[SYS[i]]);      }  catch(e){ for(var j=SYS.length; --j >= 0; global[SYS[j]] = undefined); }"
      ))(BF, Y);
    }
  }
  function y(BI) {
    if (!BI) {
      return;
    }
    var BH = {},
      BF = BI.split("\x2e"),
      BG = Y[BF[0]];
    for (var BE = 1; typeof BF[BE] != "undefined"; BE++) {
      if (typeof BG[BF[BE]] == "undefined") {
        break;
      }
      BH[BF[BE - 1]] = [BE, true];
      BG = BG[BF[BE]];
      for (var BJ in BG) {
        if ("undefined" == typeof Object.prototype[BJ]) {
          if (BJ != BF[BE]) {
            BH[BF[BE - 1]][1] = false;
            break;
          }
        }
      }
    }
    for (BG in BH) {
      if ("undefined" == typeof Object.prototype[BG]) {
        if (BH[BG][1]) {
          AG(BF.slice(0, BH[BG][0] + 1).join("."));
        }
      }
    }
  }
  function AG(BG) {
    var BE;
    Ac.remove(BG);
    Ap.remove(BG);
    if (BG) {
      if (!A8(BG)) {
        if ((BG = As(BG))) {
          BG = BG.fullName;
          BE = BG.shortName;
        }
      }
      if (!BE && BG) {
        BE = BG.substring(BG.lastIndexOf("\x2e") + 1);
      }
      BG = AI.exec(BG);
      BG = BG ? BG[1] : b;
    }
    var BF = AZ(BG);
    if (BF && BE) {
      if (BE == "*" || typeof BF[BE] != "undefined") {
        if (BE != "*") {
          if (BF[BE] == Y[BE]) {
            Y[BE] = b;
          }
          delete BF[BE];
        } else {
          for (var BH in BF) {
            if ("undefined" == typeof Object.prototype[BH]) {
              delete BF[BH];
            }
          }
          y(BG);
        }
      }
    }
    AA(BG);
  }
  function AT(BI) {
    var BE = BI;
    var BJ = Ac.getAllArray();
    for (var BG, BH = 0, BF = BJ.length; BH < BF; ++BH) {
      if (Ap.has((BG = BJ[BH][0]))) {
        continue;
      }
      if ("*" != BJ[BH][1]) {
        BE = AI.exec(BG);
      }
      if (!(BE && BI == BE[1])) {
        continue;
      }
      Ap.add((F = BG));
      return;
    }
    F = Al;
  }
  function o(BG, BE) {
    var BF = (BE = BE || Y || this).onload;
    if (BF === P) {
      BG == b && (BG = true);
      !BG && (BE.onload = P(true));
      return;
    }
    if (BF && BF != P.onLoad) {
      P.onLoad = BF;
    }
    c((BE.onload = P));
  }
  function P(BF) {
    o = function () {};
    var BE = P.onLoad;
    delete P.onLoad;
    Q();
    AA();
    return BE && Ax(BE) && BE(BF);
  }
  function AL(BE) {
    if (!BE) {
      return window.document;
    }
    if (typeof BE.write == "undefined") {
      if (typeof BE.document != "undefined") {
        BE = BE.document;
      } else {
        if (typeof BE.parentNode != "undefined") {
          return AL(BE.parentNode);
        } else {
          return window.document;
        }
      }
    }
    return BE;
  }
  function BD(BE, BK) {
    if (!BK) {
      return b;
    }
    var BJ = BK.split("\x2e");
    var BF;
    for (var BI = BE == BK, BH = 0, BG = BJ.length; BH < BG; BH++) {
      if (isNaN(BJ[BH])) {
        continue;
      }
      BK = BJ.slice(0, BH).join("\x2e");
      BE = BI ? BK : BE || BJ.slice(BH - 1, BH)[0];
      BF = BJ.slice(BH).join("\x2e");
      break;
    }
    if (!BF) {
      return b;
    }
    return [BE, BK, BF];
  }
  function Ao(BF) {
    if (!(BF = AL(BF))) {
      return b;
    }
    var BE =
      typeof BF.scripts != "undefined" &&
      typeof BF.scripts.length != "undefined" &&
      BF.scripts.length > 0
        ? BF.scripts
        : typeof BF.getElementsByTagName != "undefined"
        ? BF.getElementsByTagName("script") || []
        : [];
    return BE;
  }
  function AH(BE) {
    if (BE) {
      if ((!A1 || d) && !B) {
        if ((A1 && a && BE != A1.ownerDocument) || !A1 || (!a && d)) {
          if (BE.lastChild && BE.lastChild.firstChild) {
            A1 = BE.lastChild.firstChild;
          }
        }
      } else {
        if (!A1 && B) {
          A1 = Av;
        }
      }
    }
    return A1;
  }
  function X(BG) {
    Aj(BG);
    if (!BG || !A8(BG)) {
      return [];
    }
    var BF = M ? BG.lastIndexOf(M) : BG.lastIndexOf("\x2e");
    if (BF < BG.length && BF >= 0) {
      var BH = BG.slice(BF, BF + M.length);
      var BE = BG.substring(0, BF);
      if (BE && isNaN(BE.charAt(0))) {
        BE = "";
      }
    }
    return [BE, BH];
  }
  function AZ(BI, BE) {
    if (!A8(BI)) {
      return b;
    }
    var BH = BE || Y;
    BI = BI.split("\x2e");
    for (var BG = 0, BF = BI.length; BG < BF; BG++) {
      if (typeof BH[BI[BG]] != "undefined") {
        BH = BH[BI[BG]];
      } else {
        return b;
      }
    }
    return BH;
  }
  function As(BG) {
    if (!BG) {
      return new AC(Ab);
    }
    var BE = A8(BG);
    for (var BF in h) {
      if ("undefined" == typeof Object.prototype[BF]) {
        if ((BE && BG == BF) || (!BE && BG == AZ(BF))) {
          return h[BF];
        }
      }
    }
    return b;
  }
  function v(BV, BL) {
    BV = BV || A3;
    if (BV == A3 && Ab && Ab.path) {
      return Ab;
    }
    var BN = h[BV];
    if (BN) {
      return BN;
    }
    var BX = AE(BV, BL);
    if ((BN = l(BV, BX))) {
      return (h[BV] = BN);
    }
    var BE = Ao();
    if (!(BE && BX)) {
      return b;
    }
    var BU;
    for (var BM = false, BP, BR, BT = 0, BS = BE.length; BT < BS; BT++) {
      BP = unescape(BE[BT].src);
      if (BP && BP.search(s) == -1) {
        BP = unescape(window.location.href);
        if (BP.charAt(BP.length - 1) != k) {
          if ((BR = K.exec(BP)) != null) {
            if (BR[1].length > BP.search(s) + 3) {
              BP = BR[1];
            }
          }
        }
        BP += unescape(BE[BT].src);
      }
      if (BP == b || BP == null) {
        continue;
      }
      while (T.test(BP)) {
        BP = BP.replace(T, "\x2f");
      }
      if (C.has(BP)) {
        continue;
      }
      C.add(BP);
      if (BM) {
        continue;
      }
      var BG;
      for (var BH in BX) {
        if (typeof Object.prototype[BH] != "undefined") {
          continue;
        }
        BG = BX[BH];
        var BW,
          BY,
          BJ = [];
        for (var BQ = BG.length; --BQ >= 0; ) {
          BW = BG[BQ];
          BY = BP.lastIndexOf(BW) + 1;
          if (BY <= 0 || BY == BJ[0]) {
            continue;
          }
          BJ[BJ.length] = BY;
          G("FOUND :: Path [ " + BP + " ]", arguments);
        }
        if (BJ.length == 0) {
          continue;
        }
        BJ.length > 2 && BJ.sort(AO);
        BY = BJ[BJ.length - 1];
        BL = BY == BP.lastIndexOf(BW) + 1 ? BH : b;
        BU = BP.substring(0, BY);
        BM = true;
        if (BV == A3 && BE[BT].title != A3) {
          BE[BT].title = A3;
        }
        var BF = BY + BW.length - 2;
        var BO = X(BP.substring(BF + 1));
        var BK = BO[1];
        var BI = BO[0] || (BV == A3 && AQ);
        break;
      }
    }
    if (!BU) {
      return b;
    }
    BN = new AC(BU, BL, BV, b, BI, BK);
    h[BV] = BN;
    return BN;
  }
  function l(BU, BV) {
    var BM = Number.MAX_VALUE;
    var BO;
    var BF = [];
    var BP;
    var BI = 0;
    BV = BV || AE(BU);
    var BK = [];
    var BS = C.getAll();
    BS: for (var BQ in BS) {
      if (typeof Object.prototype[BQ] != "undefined") {
        continue;
      }
      for (var BH in BV) {
        if (typeof Object.prototype[BH] != "undefined") {
          continue;
        }
        BK[BK.length] = BH;
        for (var BG = BV[BH], BT = BG.length; --BT >= 0; ) {
          if (0 < (BP = BQ.lastIndexOf(BG[BT]))) {
            BO = BQ.length - (BP + BG[BT].length);
            if (BO < BM) {
              BM = BO;
              BI = BF.length;
            }
            BF[BF.length] = BP + 1;
            var BE = BP + 1 + BG[BT].length - 2;
            var BR = X(BQ.substring(BE + 1));
            var BL = BR[1];
            var BJ = BR[0];
            G("FOUND :: Cached Path [ " + BQ + " ]", arguments);
            break BS;
          }
          if (BT == 0) {
            delete BK[--BK.length];
          }
        }
      }
    }
    if (!BF || BF.length == 0) {
      return b;
    }
    BQ = BQ.substring(0, BF[BI]);
    var BN = new AC(BQ, BK[BI], BU, b, BJ, BL);
    if (BN.path) {
      h[BU] = BN;
    }
    return BN;
  }
  function AE(BG, BI) {
    var BK = k || A2();
    var BE = BI == b ? H : [BI];
    var BH = {};
    for (var BJ, BF = BE.length; --BF >= 0; ) {
      BI = BE[BF];
      BJ = BK + BG.replace(/\x2e/g, BI);
      BH[BI] = [BJ + BI, BJ + M];
    }
    return BH;
  }
  function m() {
    return [
      BB ? "cloak" : "cloakoff",
      Ah ? "debug" : "debugoff",
      j ? "legacy" : "legacyoff",
      g ? "mvc" : "mvcoff",
      Aa ? "mvcshare" : "mvcshareoff",
      n ? "override" : "overrideoff",
      S ? "refresh" : "refreshoff",
    ].join(",");
  }
  function A2(BG) {
    if (!BG && k) {
      return k;
    }
    var BH = unescape(window.location.href);
    var BE = BH.lastIndexOf("\x5c") + 1;
    var BF = BH.lastIndexOf("\x2f") + 1;
    k = BE > BF ? "\x5c" : "\x2f";
    return k;
  }
  function Ak(BF, BL, BI, BK, BH, BJ, BE) {
    if (!Ac.add(BL, BF)) {
      return BJ;
    }
    E(BL, BF == "*" ? BL : BF);
    Ae(BL);
    if (BF == "*") {
      (BF = BC), G('...\t:: Import ("' + BL + '.*")', arguments);
    } else {
      if (BF == BL) {
        G('...\t:: Include ("' + BF + '")', arguments);
      } else {
        G('...\t:: ImportAs ("' + BF + '", "' + BL + '")', arguments);
      }
    }
    if (new f(BL).start()) {
      return BJ;
    }
    BI = AN(BF, BL, BI, BK, BH);
    var BG = Z(
      BI,
      AL(BE || Y || this),
      'ImportAs("' + BF + '", "' + BL + '");',
      false,
      BL
    );
    return BJ;
  }
  function AN(BE, BL, BH, BK, BF) {
    j && (BK = BK === false ? "\x2f" : "\x2e");
    !BK && (BK = Ab.notation);
    var BJ = BL + (BE == "*" ? ".*" : "");
    var BG = BJ;
    var BI;
    do {
      if ((BJ = AI.exec(BJ))) {
        BJ = BJ[1];
      } else {
        break;
      }
      if (BJ == BG) {
        break;
      }
      BG = BJ;
      BI = v(BJ, BK);
    } while (!BI);
    !A8(BH) && (BH = (BI && BI.path) || Ab.path || "");
    BH.charAt(BH.length - 1) != "\x2f" && (BH += "\x2f");
    BH += escape(BL.replace(/\x2e/g, BK));
    BF && (BH += "\x2e" + BF);
    BH += M;
    BI && BI.hasOption("refresh") && (BH = AM(BH));
    return BH;
  }
  function AD(BF, BK, BI, BE) {
    BE = BE || Y || this;
    if (!BI) {
      return BI;
    }
    if (BF != BC && Ay(BF, BK, BE)) {
      Ac.remove(BK);
      return BI;
    }
    if (!An(BK, BF)) {
      return b;
    }
    var BG = [],
      BJ = Ac.get(BK),
      BH = BF == BK || BJ == BK;
    if (BF && BF != BC && (!BJ || (BJ != "*" && BJ != BC))) {
      if (BH) {
        BG[0] = 'SUCCESS :: Include ("' + BK + '")';
      } else {
        (BE[BF] = BI),
          (BG[0] = 'SUCCESS :: ImportAs ("' + BF + '", "' + BK + '")');
      }
      Ac.remove(BK);
      Ap.add(BK, BF);
    } else {
      if (BJ == "*") {
        A7(BF, BK, BI, BE, BH, BG);
      } else {
        if (BJ != "*" && (BJ == BC || BF == BC)) {
          BG[0] =
            "SUCCESS :: " + (BH ? "Include" : "Import") + ' ("' + BK + '.*")';
          Ac.remove(BK);
          Ap.add(BK, "*");
        }
      }
    }
    BG.length > 0 && G(BG.join("\r\n"), arguments);
    BF != BK && AJ(BF);
    AJ(BK);
    return BI;
  }
  function A7(BF, BK, BI, BE, BH, BG) {
    BG[BG.length] = " ";
    if (!BH) {
      var BJ;
      for (var BL in BI) {
        if (typeof Object.prototype[BL] != "undefined") {
          continue;
        }
        BJ = BK + "." + BL;
        if (h[BJ] || Ay(BL, BJ, BE)) {
          continue;
        }
        BE[BL] = BI[BL];
        BG[BG.length] = 'SUCCESS :: ImportAs ("' + BL + '", "' + BJ + '")';
      }
    }
    Ac.remove(BK);
    if (BF != BC) {
      Ac.add(BK, BC);
    }
  }
  function Ay(BF, BH, BE) {
    BE = BE || Y || this;
    if (
      n ||
      (BH == BF && !AZ(BF)) ||
      typeof BE[BF] == "undefined" ||
      AZ(BH) == BE[BF]
    ) {
      return false;
    }
    var BG =
      "\nWARNING: There is a naming conflict, " +
      BF +
      " already exists.\nConsider using the override load-time option, " +
      AB +
      '.EnableOverride(),\nor ImportAs with an alias; for example:\n\n\tImportAs ("' +
      BF +
      '1", "' +
      BH +
      '");';
    if (BF == BH) {
      BG += "\n\nThe module is currently inaccessible.\n";
    } else {
      BG +=
        "\n\nThe module can currently be accessed using its fully-qualified name:\n\n\t" +
        BH +
        ".\n";
    }
    G(BG, arguments, Ah);
    return true;
  }
  function AK(BE) {
    return new Function("return /*@cc_on @if(@_jscript)" + BE + "@end @*/;")();
  }
  function U(BH, BF, BG, BE) {
    return u(b, BH, BF, BG, BE);
  }
  function u(BP, BI, BE, BN, BF) {
    o();
    if (!BI || BI == "*") {
      G('ERROR :: ImportAs ("' + BP + '", "' + BI + '")');
      return b;
    }
    var BO, BM;
    if (!A8(BP)) {
      BP = "";
    }
    if ((BO = BD(BP, BI))) {
      BI = BO[1];
      BP = BP != BC ? BO[0] : BC;
      BM = BO[2];
    } else {
      if (!BP) {
        BP = BI.substring(BI.lastIndexOf("\x2e") + 1);
      }
    }
    BF = BF || Y || this;
    if (BP == "*") {
      BI = AI.exec(BI)[1];
    } else {
      if (typeof BF[BP] != "undefined" && BP != BI) {
        for (var BQ = j ? r.concat(L) : r, BR = BQ.length; --BR >= 0; ) {
          if (BP != BQ[BR]) {
            continue;
          }
          G(
            'ERROR :: ImportAs ("' +
              BP +
              '", "' +
              BI +
              '")! ' +
              BP +
              " is restricted.",
            arguments
          );
          return BF[BP];
        }
      }
    }
    var BG = BF;
    var BL = "";
    for (var BH = BI.split("\x2e"), BK = 0, BJ = BH.length; BK < BJ; BK++) {
      if (typeof BG[BH[BK]] != "undefined") {
        BG = BG[BH[BK]];
        BL += BH[BK] + "\x2e";
      } else {
        break;
      }
    }
    if (BK >= BJ && BP != "*") {
      if (Ac.has(BI) || !Ap.has(BI)) {
        BG = AD(BP, BI, BG, BF);
        t(BI);
      }
      return BG;
    }
    if (Ac.has(BI)) {
      if (BP == "*" || BP == BC) {
        BP = BI;
      }
      E(BI, BP);
      Ae(BI);
      return b;
    }
    return Ak(BP, BI, BE, BN, BM, BG, BF);
  }
  function f(BI, BG, BE) {
    var BH,
      BM,
      BK = 0;
    function BJ(BN) {
      BE = BE || 500;
      BN.start = BF;
      BN.stop = BL;
      BH = setInterval(BL, (BG = BG || 60000));
      return BN;
    }
    function BF() {
      switch (true) {
        case ++BK >= BE:
          BL();
          return false;
        case !!AZ(BI) && An(BI):
          Q(BI);
          return true;
        default:
          BM = setTimeout(BF, 0);
          return false;
      }
    }
    function BL() {
      b != BM && clearTimeout(BM);
      b != BH && clearInterval(BH);
    }
    if (this.constructor != f) {
      if (!this.constructor || this.constructor.toString() != f.toString()) {
        return new f(BI, BG, BE);
      }
    }
    return BJ(this);
  }
  function A4(BH, BF, BG, BE) {
    BH && (BH = BH.split(".*").join(""));
    return u(BH, BH, BF, BG, BE);
  }
  function Ax(BE) {
    return (
      BE != b &&
      BE != null &&
      (typeof BE == "function" || Function == BE.constructor)
    );
  }
  function A() {
    if (typeof document == "undefined") {
      return false;
    }
    var BE = !!document.write && !!document.writeln;
    A0 = !!document.createElement;
    B =
      A0 &&
      !!document.createTextNode &&
      !!document.getElementsByTagName &&
      !!(Av = document.getElementsByTagName("head")[0]).appendChild &&
      !!Av.removeChild;
    d =
      B &&
      !!document.firstChild &&
      !!document.lastChild &&
      !!document.parentNode;
    a = d && !!document.ownerDocument;
    return !(BE || A0 || B || d || a);
  }
  function Ar(BH, BE) {
    var BG = BH == F;
    var BF = Ac.has(BH);
    if (BG || An(F) || BF) {
      return true;
    }
    Ac.add(BH, BE || BH);
    new f(BH).start();
    return false;
  }
  function A8(BE) {
    return (
      BE != null &&
      BE != b &&
      (typeof BE == "string" || BE.constructor == String)
    );
  }
  function An(BH, BE) {
    var BF = z.get(BH);
    BF && (BF = BF.getAll());
    for (var BG in BF) {
      if ("undefined" == typeof Object.prototype[BG]) {
        if (!AZ(BF[BG])) {
          return false;
        }
      }
    }
    return true;
  }
  function Z(BG, BE, BI, BK, BJ, BH, BL) {
    o();
    if (!(BE = AL(BE))) {
      G(
        "ERROR :: Container not found. Unable to load:\n\n[" + BG + "]",
        arguments
      );
      return false;
    }
    if (BG) {
      C.add(unescape(BG));
      if (S) {
        BG = AM(BG);
      }
    }
    if (!(BH || BL)) {
      BL = "JavaScript";
      BH = "text/javascript";
    }
    if (BK == b) {
      BK = false;
    }
    var BF;
    if (A0 && !e) {
      BF = BE.createElement("script");
    }
    if (!BF) {
      if (BI) {
        BI = "setTimeout('" + BI + "',0);";
      }
      R(BG, BE, BI, BK, BJ, BH, BL);
      return false;
    }
    true && (BF.async = !!BK);
    BK && (BF.defer = BK);
    BL && (BF.language = BL);
    BJ && (BF.title = BJ);
    BH && (BF.type = BH);
    if (BG) {
      G("...\t:: Load [ " + BG + " ]", arguments);
      if (AS || !(BA || O)) {
        BF.src = BG;
      }
      AH(BE).appendChild(BF);
      if (!AS || BA || O) {
        BF.src = BG;
      }
      G("DONE\t:: Load [ " + BG + " ]", arguments);
    }
    if (!BI) {
      return true;
    }
    if (BG) {
      Z(b, BE, BI, BK, BJ, BH, BL);
      return true;
    }
    if (typeof BF.canHaveChildren == "undefined" || BF.canHaveChildren) {
      BF.appendChild(BE.createTextNode(BI));
    } else {
      if (!BF.canHaveChildren) {
        BF.text = BI;
      }
    }
    AH(BE).appendChild(BF);
    return false;
  }
  function A6() {
    if (!(g || Aa)) {
      return;
    }
    if (Aa) {
      Z(Ab.path + Al + M, null, null, null, Al);
    }
    if (!g) {
      return;
    }
    var BF = unescape(window.location.pathname);
    var BE = BF.lastIndexOf(k);
    BF = BF.substring(++BE);
    BE = BF.lastIndexOf("\x2e");
    BE = BE == -1 ? 0 : BE;
    if ("" != (BF = BF.substring(0, BE))) {
      Al = BF;
    }
    Z(Al + M, null, null, null, Al);
  }
  function Aj(BF) {
    if (!BF || !A8(BF)) {
      return;
    }
    var BG = BF.lastIndexOf("?") + 1;
    BF = BF.substring(BG).toLowerCase();
    if (BF.length == 0) {
      return;
    }
    var BE;
    if ((BE = i.exec(BF))) {
      BB = BE[1] == "cloak";
    }
    if ((BE = N.exec(BF))) {
      Ah = BE[1] == "debug";
    }
    if ((BE = Aq.exec(BF))) {
      J(BE[1] == "legacy");
    }
    if ((BE = p.exec(BF))) {
      g = BE[1] == "mvc";
    }
    if ((BE = AR.exec(BF))) {
      Aa = BE[1] == "mvcshare";
    }
    if ((BE = AU.exec(BF))) {
      n = BE[1] == "override";
    }
    if ((BE = I.exec(BF))) {
      S = BE[1] == "refresh";
    }
  }
  function R(BE, BG, BH, BF, BM, BL, BK) {
    if (!(BG = AL(BG || window || this))) {
      return;
    }
    var BJ;
    if (BE) {
      G("...\t:: LoadSimple [ " + BE + " ]", arguments);
      if (BH) {
        BJ = BH;
        BH = b;
      }
    }
    var BI =
      "<script" +
      (BF ? ' defer="defer"' : "") +
      (BK ? ' language="' + BK + '"' : "") +
      (BM ? ' title="' + BM + '"' : "") +
      (BL ? ' type="' + BL + '"' : "") +
      (BE ? ' src="' + BE + '">' : ">") +
      (BH ? BH + ";" : "") +
      "</script>\n";
    BG.write(BI);
    if (BE) {
      G("DONE\t:: LoadSimple [ " + BE + " ]", arguments);
    }
    if (!(BH = BH || BJ)) {
      return;
    }
    if (BE) {
      R(b, BG, BH, BF, BM, BL, BK);
    }
  }
  function G(BI, BK, BH) {
    if (!Ah && !BH) {
      return;
    }
    var BG = /function\s*([^(]*)\s*\(/.exec(BK.callee) || [""],
      BL = BG.length > 1 ? BG[1] : BG[0];
    if (BI != b) {
      var BF = x;
      var BE = new Date();
      x =
        [BE.getFullYear(), BE.getMonth() + 1, BE.getDate()].join(".") +
        "," +
        [
          BE.getHours(),
          BE.getMinutes(),
          BE.getSeconds(),
          BE.getMilliseconds(),
        ].join(":") +
        "\t:: " +
        F +
        " :: " +
        BL +
        "\r\n" +
        BI +
        "\r\n\r\n";
      var BJ =
        x.indexOf("ERROR") >= 0
          ? "error"
          : x.indexOf("WARN") >= 0
          ? "warn"
          : "info";
      !G.is
        ? (G.is = {
            Firebug: typeof console != "undefined" && Ax(console.info),
            MochiKit: typeof MochiKit != "undefined" && Ax(MochiKit.log),
            YAHOO: typeof YAHOO != "undefined" && Ax(YAHOO.log),
          })
        : 0;
      G.is.Firebug && console[BJ](x);
      G.is.YAHOO && YAHOO.log(x, BJ);
      G.is.MochiKit &&
        (BJ == "info"
          ? MochiKit.log(x)
          : BJ == "error"
          ? MochiKit.logError(x)
          : BJ == "warn"
          ? MochiKit.logWarning(x)
          : 0);
      x += BF;
    }
    if (BH) {
      Ad();
    }
  }
  function W(BE, BH, BG) {
    var BF =
      BE == "*" || BE == BC
        ? 'Import   ("' + BH + '.*")'
        : BE == BH
        ? 'Include  ("' + BH + '")'
        : 'ImportAs ("' + BE + '", "' + BH + '")';
    G("CHECKING :: " + BF + "...", BG);
  }
  function Ag(BF, BM, BK, BE) {
    o();
    BF = BF || "\x3cdefault\x3e";
    G('Namespace ("' + BF + '")', arguments);
    var BL = BE || Y || this;
    if (BF == "\x3cdefault\x3e") {
      Ab.update(BM, BK);
      G(Ab, arguments);
      return BL;
    }
    AT(BF);
    var BG = BF.split("\x2e");
    for (var BJ = 0, BI = BG.length; BJ < BI; BJ++) {
      BL = typeof BL[BG[BJ]] != "undefined" ? BL[BG[BJ]] : (BL[BG[BJ]] = {});
    }
    var BH = h[BF];
    if (BH) {
      BH.update(BM, BK);
      G(BH, arguments);
      return BL;
    }
    if (!BM) {
      BH = v(BF, BK);
    }
    if (BM || !BH) {
      BH = new AC(BM, BK, BF);
    }
    if (BH && !h[BF]) {
      h[BF] = BH;
    }
    G(BH, arguments);
    return BL;
  }
  function AC(BO, BL, BF, BM, BI, BN, BP) {
    function BJ(BQ) {
      BK();
      BQ.hasOption = BH;
      BQ.toString = BE;
      BQ.update = BG;
      BQ.update(BO, BL, BF, BM, BI, BN, BP);
      return BQ;
    }
    function BK() {
      if (!(BO && BO.constructor == AC)) {
        return;
      }
      var BQ = BO;
      BN = BQ.extension;
      BF = BQ.fullName;
      BL = BQ.notation;
      BP = BQ.options;
      BO = BQ.path;
      BM = BQ.shortName;
      BI = BQ.version;
    }
    function BH(BQ) {
      BP = BP || this.options;
      if (!(BP && BQ && BP.indexOf(BQ) >= 0)) {
        return false;
      }
      var BR = new RegExp("(" + BQ + ")[,$]", "g").exec(BP);
      return !!BR && typeof BR[1] != "undefined" && BR[1] == BQ;
    }
    function BE() {
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
    function BG(BU, BT, BV, BQ, BR, BW, BS) {
      this.extension = BW || this.extension || M;
      this.fullName = BV || this.fullName || "";
      this.shortName = BQ || this.shortName || "";
      this.notation = A8(BT)
        ? BT
        : this.notation || (Ab && A8(Ab.notation) ? Ab.notation : "\x2e");
      this.options = A8(BS) ? BS : this.options || m();
      this.path = A8(BU) ? BU : this.path || (Ab && A8(Ab.path) ? Ab.path : "");
      this.uri = this.path + this.fullName.replace(/\x2e/g, this.notation);
      this.version = "" + (BR || this.version || "");
      if (!this.uri) {
        return;
      }
      this.uri += (this.version ? "\x2e" + this.version : "") + this.extension;
    }
    if (this.constructor != AC) {
      if (!this.constructor || this.constructor.toString() != AC.toString()) {
        return new AC(BO, BL, BF, BM, BI, BN, BP);
      }
    }
    return BJ(this);
  }
  function AJ(BH) {
    var BJ = [q.get(""), q.get(BH), q.get(D)];
    if (!BJ[0] && !BJ[1] && !BJ[2]) {
      return;
    }
    var BE = (BJ[0] && BJ[0].getSize() > 0) || (BJ[1] && BJ[1].getSize() > 0);
    if (Ah && BE) {
      G("NOTIFY :: Import Listeners for " + BH + "...", arguments);
    }
    for (var BG, BF = BJ.length; --BF >= 0; ) {
      if (!BJ[BF]) {
        continue;
      }
      BG = BJ[BF].getAll();
      for (var BI in BG) {
        if ("undefined" == typeof Object.prototype[BI]) {
          if (Ax(BG[BI])) {
            BG[BI](BH);
          }
        }
      }
    }
    if (Ah && BE) {
      G("NOTIFY :: Import Listeners for " + BH + "...DONE!", arguments);
    }
  }
  function AP() {
    Ag(A3);
    c((Y.Import = U));
    c((Y.ImportAs = u));
    c((Y.Include = A4));
    c((Y.Load = Z));
    c((Y.Namespace = Ag));
    c((AW.AddImportListener = Af));
    c((AW.EnableLegacy = J));
    c(
      (AW.GetVersion = function () {
        return AQ;
      })
    );
    AW.GetVersion.toString = AW.GetVersion.prototype.toString = AW.GetVersion;
    c((AW.RemoveImportListener = At));
    c((AW.SetOption = AY));
    c((AW.ShowLog = Ad));
    c((AW.Unload = A5));
    Az("Cloak");
    Az("Debug");
    Az("Override");
    Az("Refresh");
    J(j || false);
  }
  function Az(BE) {
    if (!BE || !A8(BE)) {
      return;
    }
    c(
      (AW["Enable" + BE] = function (BF) {
        AY(BE, BF);
      })
    );
  }
  function At(BE, BI) {
    o();
    if (!BI || !Ax(BI)) {
      if (Ax(BE)) {
        BI = BE;
        BE = b;
      } else {
        return false;
      }
    } else {
      if (BE && !A8(BE)) {
        return false;
      }
    }
    var BK = [q.get(""), q.get(BE), q.get(D)];
    if (!BK[0] && !BK[1] && !BK[2]) {
      return false;
    }
    var BH = false;
    for (var BG, BF = BK.length; --BF >= 0; ) {
      if (!BK[BF]) {
        continue;
      }
      BG = BK[BF].getAll();
      for (var BJ in BG) {
        if ("undefined" == typeof Object.prototype[BJ]) {
          if (BG[BJ] == BI) {
            BK[BF].remove(BJ);
            BH = true;
            break;
          }
        }
      }
    }
    return BH;
  }
  function w(BE) {
    if (!(B && (BE = document.createElement("meta")))) {
      return;
    }
    BE.httpEquiv = Au + AB + " " + AQ;
    Au = A3.split("\x2e").reverse().join("\x2e");
    BE.content = Au + " :: Smart scripts that play nice ";
    AH(window.document).appendChild(BE);
  }
  function J(BE) {
    if (BE == b) {
      BE = true;
    }
    j = BE;
    AW = AW || AZ(AB) || {};
    if (BE) {
      AW.DIR_NAMESPACE = AW.USE_PATH = "\x2f";
      AW.DOT_NAMESPACE = AW.USE_NAME = "\x2e";
      c((AW.CompleteImports = Q));
      c((AW.EnableDebugging = AW.EnableDebug));
      c((AW.GetPathFor = AF));
      c((Y.JSBasePath = Y.JSPath = AW.SetBasePath = V));
      c((Y.JSImport = U));
      c((Y.JSLoad = Z));
      c((Y.JSPackaging = AW));
      c((Y.JSPackage = Y.Package = Ag));
      c(
        (Y.JSPacked = function (BF) {
          Ab.notation = BF;
        })
      );
      c((Y.NamespaceException = Y.PackageException = A9));
    }
    if (BE || typeof Y["JSPackaging"] == "undefined") {
      return;
    }
    delete AW.DIR_NAMESPACE;
    delete AW.DOT_NAMESPACE;
    delete AW.CompleteImports;
    delete AW.EnableDebugging;
    delete AW.GetPathFor;
    delete AW.SetBasePath;
    delete AW.USE_NAME;
    delete AW.USE_PATH;
    Aw(L);
  }
  function AY(BE, BF) {
    o();
    if (!BE || !A8(BE)) {
      return;
    }
    BF = BF == b ? true : BF;
    BE = BE.toLowerCase();
    switch (BE) {
      case "cloak":
        BB = BF;
        break;
      case "debug":
        Ah = BF;
        break;
      case "legacy":
        J(BF);
        break;
      case "override":
        n = BF;
        break;
      case "refresh":
        S = BF;
        break;
      default:
        break;
    }
  }
  function AM(BE) {
    if (/ajile.refresh/g.test(BE)) {
      return BE;
    }
    return BE + (/\?/g.test(BE) ? "&" : "?") + "ajile.refresh=" + Math.random();
  }
  function Ad() {
    o();
    if (BA && !B) {
      return;
    }
    if (!Ah) {
      x =
        "\r\nTo enable debug logging, use <b>" +
        AB +
        ".EnableDebug()</b> from within any of your scripts or use " +
        AB +
        "'s debug load-time option as follows:<br><br><pre><code>&lt;script src=\"" +
        Ab.uri +
        '?<b>debug</b>" type="text/javascript"&gt;&lt;/script&gt;</code></pre>';
    }
    var BG =
      "<html><head><title>" +
      AB +
      "'s Debug Log " +
      (!Ah ? ":: DISABLED" : "") +
      '</title>\r\n<style type="text/css">*{background-color:#eee;color:#000;font-family:"Tahoma";font-size:12px;}</style>\r\n</head>\r\n<body>' +
      x.replace(/\r\n/g, "<br>") +
      "</body></html>";
    var BH = screen.width / 1.5;
    var BE = screen.height / 1.5;
    var BF = Ad.window
      ? Ad.window
      : (Ad.window = window.open(
          "",
          "__AJILELOG__",
          "width=" +
            BH +
            ",height=" +
            BE +
            ",addressbar=0,directories=0,location=0,menubar=0,scrollbars=1,statusbar=0,toolbar=0,resizable=1"
        ));
    if (!(BF && BF.document)) {
      return;
    }
    BF.document.open();
    BF.document.writeln(BG);
    BF.document.close();
  }
  function AV() {
    var BG = {},
      BO = 0;
    function BI(BP) {
      BP.add = BM;
      BP.clear = BK;
      BP.get = BF;
      BP.getAll = BJ;
      BP.getAllArray = BE;
      BP.getSize = BN;
      BP.has = BL;
      BP.remove = BH;
      return BP;
    }
    function BM(BP, BQ, BR) {
      if (BF(BP) && !BR) {
        return false;
      }
      BG[BP] = BQ;
      BO++;
      return true;
    }
    function BK() {
      for (var BP in BG) {
        if ("undefined" == typeof Object.prototype[BP]) {
          delete BG[BP];
        }
      }
      BO = 0;
    }
    function BF(BP) {
      return typeof Object.prototype[BP] != "undefined" ||
        typeof BG[BP] == "undefined"
        ? b
        : BG[BP];
    }
    function BJ() {
      return BG;
    }
    function BE() {
      var BQ = [];
      for (var BP in BG) {
        if ("undefined" == typeof Object.prototype[BP]) {
          BQ[BQ.length] = [BP, BG[BP]];
        }
      }
      return BQ;
    }
    function BN() {
      return BO;
    }
    function BL(BP) {
      return (
        typeof Object.prototype[BP] == "undefined" &&
        typeof BG[BP] != "undefined"
      );
    }
    function BH(BP) {
      if (!BL(BP)) {
        return false;
      }
      delete BG[BP];
      BO--;
      return true;
    }
    if (this.constructor != AV) {
      if (!this.constructor || this.constructor.toString() != AV.toString()) {
        return new AV();
      }
    }
    return BI(this);
  }
  function t(BG) {
    var BH = AX.get(BG);
    if (!BH) {
      return;
    }
    BH = BH.getAll();
    var BF;
    for (var BE in BH) {
      if ("undefined" == typeof Object.prototype[BE]) {
        if (Ac.has(BE) && (BF = AZ(BE))) {
          if (AD(Ac.get(BE), BE, BF)) {
            t(BE);
          }
        }
      }
    }
  }
  var F = A3,
    z = new AV(),
    q = new AV(),
    BA = AK("@_jscript_version"),
    e = typeof ScriptEngine != "undefined" && /InScript/.test(ScriptEngine()),
    O = /Opera/i.test(window.navigator.userAgent),
    AS = /WebKit/i.test(window.navigator.userAgent),
    C = new AV(),
    h = {
      clear: function () {
        for (var BE in this) {
          if ("undefined" == typeof Object.prototype[BE]) {
            delete this[BE];
          }
        }
      },
    },
    Ac = new AV(),
    Ap = new AV(),
    AX = new AV();
  Ai();
})("1.5.5", this);
