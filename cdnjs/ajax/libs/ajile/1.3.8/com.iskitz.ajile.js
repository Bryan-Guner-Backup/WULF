/**----------------------------------------------------------------------------+
| Product:  ajile [com.iskitz.ajile]
| @version  1.3.8
|+-----------------------------------------------------------------------------+
| @author   Michael A. I. Lee [iskitz.com]
|
| Created:  Tuesday,   November   4, 2003    [2003.11.04]
| Updated:  Sunday,    January   27, 2013    [2013.01.27.00.58.00-08.00]
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
(function (AP, a) {
  var Az, B, c, Z;
  if (typeof Ah != "undefined" && Ah() > 1) {
    return;
  }
  var BA = true,
    Ag = false,
    i = false,
    f = true,
    AZ = true,
    m = false,
    S = false;
  var AA = "Ajile",
    At = "Powered by ",
    Ak = "index",
    M = ".js",
    D = "<*>",
    A1 = "com.iskitz.ajile",
    j,
    q = [AA, "Import", "ImportAs", "Include", "Load", "Namespace"],
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
  var Au,
    Aa,
    BB = "__LOADED__",
    A0,
    w = "",
    AV;
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
  var h = /(cloakoff|cloak)/,
    N = /(debugoff|debug)/,
    Ap = /(legacyoff|legacy)/,
    o = /(mvcoff|mvc)/,
    AQ = /(mvcshareoff|mvcshare)/,
    AT = /(overrideoff|override)/,
    I = /(refreshoff|refresh)/,
    K = /(.*\/)[^\/]+/,
    AH = /(.*)\.[^\.]+/,
    T = /(\/\.\/)|(\/[^\/]*\/\.\.\/)/,
    r = /:\/\x2f/;
  function Ah(BD) {
    if (typeof A == "undefined" || typeof AW == "undefined") {
      return 0;
    }
    if ((BD = BD || A())) {
      return 3;
    }
    Aa = new AB(u(A1));
    if (!m && (BD = BD || (AV = AY(A1)))) {
      return 2;
    }
    Aa.version = AP = AP || Aa.version;
    b((AV = AV || {}).constructor);
    b(AI);
    v();
    if (!Az) {
      Aa.fullName = A1;
      Aa.path = "../lib/ajile/";
      Aa.shortName = AA;
    }
    AO();
    Ab.add(A1, AA);
    Ao.add(A1, AA);
    AC(AA, A1, AV);
    A5();
    z(A1);
    n();
    return 1;
  }
  function A4(BD) {
    if (BD && BD != A1) {
      AF(BD);
      return;
    }
    y.clear();
    p.clear();
    C.clear();
    g.clear();
    Ab.clear();
    Ao.clear();
    AW.clear();
    n(false);
    z();
    A0 = null;
    Av(q.concat(L));
    x(A1);
  }
  function E(BF, BD) {
    if (BF == F) {
      return;
    }
    var BE = y.get(F);
    !BE && (BE = new AU()) && y.add(F, BE);
    BE.add(BF, BD);
  }
  function Ae(BE, BI) {
    n();
    if (!BI || !Aw(BI)) {
      if (Aw(BE)) {
        BI = BE;
        BE = a;
      } else {
        return false;
      }
    } else {
      if (BE && !A7(BE)) {
        return false;
      }
    }
    if (BE == D && this == window[AA]) {
      return false;
    }
    !BE && this != window[AA] && (BE = D);
    var BH = BI;
    if (BE && (Ao.has(BE) || AY(BE))) {
      window.setTimeout(function BF(BK) {
        BH(BK);
      }, 0);
      return true;
    }
    if (!BE) {
      if (Ao.getSize() > 0 || Ab.getSize() == 0) {
        for (var BJ in Ao.getAll()) {
          window.setTimeout(function BD() {
            BH(BJ);
          }, 0);
        }
      }
    }
    !BE && (BE = "");
    var BG = p.get(BE);
    !BG && (BG = new AU()) && p.add(BE, BG);
    BG.add(Math.random(), BH);
    BE && new e(BE).start();
    return true;
  }
  function Ad(BD) {
    if (BD == F) {
      return;
    }
    var BE = AW.get(BD);
    !BE && (BE = new AU()) && AW.add(BD, BE);
    BE.add(F);
  }
  function z(BE, BF) {
    if (BE && !A7(BE)) {
      return;
    }
    BE = BE || "";
    var BI = AY(BE);
    if (BI) {
      b(Aw(BI) ? BI : BI.constructor);
    }
    if (!B) {
      return;
    }
    var BL = Ar(BE);
    var BH = BL && BL.hasOption("cloak");
    for (var BG, BD, BM, BK = An(), BJ = BK.length; --BJ >= 0; ) {
      if (!BK[BJ]) {
        continue;
      }
      if ((BG = BK[BJ].title) && BE && BG != BE) {
        continue;
      }
      BD = BK[BJ].src;
      BM = (BD && BD.indexOf(A1) >= 0) || (BG && BG.indexOf(A1) == 0);
      if (BM || (!BD && BG) || BH || BA) {
        Al(BK[BJ], BF);
      }
    }
  }
  function Al(BE, BD) {
    if (c) {
      Al = function BF(BI, BH) {
        if ((BH = BH || BI.parentNode)) {
          if (BH.removeChild) {
            BH.removeChild(BI);
          }
        }
      };
    } else {
      if (B) {
        Al = new Function(
          "element",
          "container",
          'if(container){  try { container.removeChild(element); }catch(e){}  return;}try { document.getElementsByTagName("head")[0].removeChild(element); }catch(e){try { document.body.removeChild(element);}catch(e){}}'
        );
      } else {
        Al = function BG() {};
      }
    }
    if (BE) {
      Al(BE, BD);
    }
  }
  function b(BF) {
    if (!BF || typeof BF.toString == "undefined") {
      return;
    }
    var BD = /(function\s*.*\s*\(.*\))/.exec(BF.toString()) || [""],
      BE = BD.length > 1 ? BD[1] : BD[0];
    if (typeof BF.prototype == "undefined") {
      return;
    }
    BF.prototype.constructor.toString = function (BG) {
      return Ag && !BA ? BE : BF.prototype.toString();
    };
  }
  function AN(BE, BD) {
    return BE - BD;
  }
  function Q(BH) {
    var BE = !A7(BH) ? Ab.getAllArray() : [[BH, Ab.get(BH) || BH]];
    if (!BE) {
      return;
    }
    for (var BG, BD, BF = BE.length; --BF >= 0; ) {
      BH = BE[BF][0];
      BG = AY(BH);
      if (!BG || !Am(BH)) {
        continue;
      }
      W((BD = BE[BF][1]), BH, arguments);
      if (BD == "*") {
        BD = a;
      }
      AC(BD, BH, BG);
      s(BH);
    }
  }
  function AE(BD) {
    return (
      AA +
      ".GetPathFor(" +
      BD +
      ") is not supported. Namespace paths are protected."
    );
  }
  function A8(BD) {
    this.name = "DEPRECATED: " + A1 + ".NamespaceException";
    this.message = "DEPRECATED: Invalid _namespace name [" + BD + "]";
    this.toString = BE;
    function BE() {
      return "[ " + this.name + " ] :: " + this.message;
    }
  }
  function V(BD) {
    if (A7(BD)) {
      Aa.path = BD;
    }
  }
  function Av(BE) {
    if (!B) {
      for (var BD = BE.length; --BD >= 0; window[BE[BD]] = a) {}
    } else {
      (Av = new Function(
        "SYS",
        "  try     { for(var i=SYS.length; --i >= 0; delete window[SYS[i]]);      }  catch(e){ for(var j=SYS.length; --j >= 0; window[SYS[j]] = undefined); }"
      ))(BE);
    }
  }
  function x(BH) {
    if (!BH) {
      return;
    }
    var BG = {},
      BE = BH.split("\x2e"),
      BF = window[BE[0]];
    for (var BD = 1; typeof BE[BD] != "undefined"; BD++) {
      if (typeof BF[BE[BD]] == "undefined") {
        break;
      }
      BG[BE[BD - 1]] = [BD, true];
      BF = BF[BE[BD]];
      for (var BI in BF) {
        if ("undefined" == typeof Object.prototype[BI]) {
          if (BI != BE[BD]) {
            BG[BE[BD - 1]][1] = false;
            break;
          }
        }
      }
    }
    for (BF in BG) {
      if ("undefined" == typeof Object.prototype[BF]) {
        if (BG[BF][1]) {
          AF(BE.slice(0, BG[BF][0] + 1).join("."));
        }
      }
    }
  }
  function AF(BF) {
    var BD;
    Ab.remove(BF);
    Ao.remove(BF);
    if (BF) {
      if (!A7(BF)) {
        if ((BF = Ar(BF))) {
          BF = BF.fullName;
          BD = BF.shortName;
        }
      }
      if (!BD && BF) {
        BD = BF.substring(BF.lastIndexOf("\x2e") + 1);
      }
      BF = AH.exec(BF);
      BF = BF ? BF[1] : a;
    }
    var BE = AY(BF);
    if (BE && BD) {
      if (BD == "*" || typeof BE[BD] != "undefined") {
        if (BD != "*") {
          if (BE[BD] == window[BD]) {
            window[BD] = a;
          }
          delete BE[BD];
        } else {
          for (var BG in BE) {
            if ("undefined" == typeof Object.prototype[BG]) {
              delete BE[BG];
            }
          }
          x(BF);
        }
      }
    }
    z(BF);
  }
  function AS(BH) {
    var BD = BH;
    var BI = Ab.getAllArray();
    for (var BF, BG = 0, BE = BI.length; BG < BE; ++BG) {
      if (Ao.has((BF = BI[BG][0]))) {
        continue;
      }
      if ("*" != BI[BG][1]) {
        BD = AH.exec(BF);
      }
      if (!(BD && BH == BD[1])) {
        continue;
      }
      Ao.add((F = BF));
      return;
    }
    F = Ak;
  }
  function n(BD, BF) {
    BF = BF != a ? BF : !(BD == false);
    var BE = (BD = BD || window || this).onload;
    if (Aw(BE) && P === BE) {
      if (!BF) {
        BD.onload = BE(true);
      }
      return;
    }
    if (BE != P.onLoad) {
      P.onLoad = BE;
    }
    b((BD.onload = P));
  }
  function P(BE) {
    var BD = P.onLoad;
    if (!BD || BE == true) {
      return BD || null;
    }
    Ae(z);
    Q();
    z();
    if (Aw(BD)) {
      BD(BE);
    }
    n = function () {};
    return BD;
  }
  function AK(BD) {
    if (!BD) {
      return window.document;
    }
    if (typeof BD.write == "undefined") {
      if (typeof BD.document != "undefined") {
        BD = BD.document;
      } else {
        if (typeof BD.parentNode != "undefined") {
          return AK(BD.parentNode);
        } else {
          return window.document;
        }
      }
    }
    return BD;
  }
  function BC(BD, BJ) {
    if (!BJ) {
      return a;
    }
    var BI = BJ.split("\x2e");
    var BE;
    for (var BH = BD == BJ, BG = 0, BF = BI.length; BG < BF; BG++) {
      if (isNaN(BI[BG])) {
        continue;
      }
      BJ = BI.slice(0, BG).join("\x2e");
      BD = BH ? BJ : BD || BI.slice(BG - 1, BG)[0];
      BE = BI.slice(BG).join("\x2e");
      break;
    }
    if (!BE) {
      return a;
    }
    return [BD, BJ, BE];
  }
  function An(BE) {
    if (!(BE = AK(BE))) {
      return a;
    }
    var BD =
      typeof BE.scripts != "undefined" &&
      typeof BE.scripts.length != "undefined" &&
      BE.scripts.length > 0
        ? BE.scripts
        : typeof BE.getElementsByTagName != "undefined"
        ? BE.getElementsByTagName("script") || []
        : [];
    return BD;
  }
  function AG(BD) {
    if (BD) {
      if ((!A0 || c) && !B) {
        if ((A0 && Z && BD != A0.ownerDocument) || !A0 || (!Z && c)) {
          if (BD.lastChild && BD.lastChild.firstChild) {
            A0 = BD.lastChild.firstChild;
          }
        }
      } else {
        if (!A0 && B) {
          A0 = Au;
        }
      }
    }
    return A0;
  }
  function X(BF) {
    Ai(BF);
    if (!BF || !A7(BF)) {
      return [];
    }
    var BE = M ? BF.lastIndexOf(M) : BF.lastIndexOf("\x2e");
    if (BE < BF.length && BE >= 0) {
      var BG = BF.slice(BE, BE + M.length);
      var BD = BF.substring(0, BE);
      if (BD && isNaN(BD.charAt(0))) {
        BD = "";
      }
    }
    return [BD, BG];
  }
  function AY(BH, BD) {
    if (!A7(BH)) {
      return a;
    }
    var BG = BD || window;
    BH = BH.split("\x2e");
    for (var BF = 0, BE = BH.length; BF < BE; BF++) {
      if (typeof BG[BH[BF]] != "undefined") {
        BG = BG[BH[BF]];
      } else {
        return a;
      }
    }
    return BG;
  }
  function Ar(BF) {
    if (!BF) {
      return new AB(Aa);
    }
    var BD = A7(BF);
    for (var BE in g) {
      if ("undefined" == typeof Object.prototype[BE]) {
        if ((BD && BF == BE) || (!BD && BF == AY(BE))) {
          return g[BE];
        }
      }
    }
    return a;
  }
  function u(BU, BK) {
    BU = BU || A1;
    if (BU == A1 && Aa && Aa.path) {
      return Aa;
    }
    var BM = g[BU];
    if (BM) {
      return BM;
    }
    var BW = AD(BU, BK);
    if ((BM = k(BU, BW))) {
      return (g[BU] = BM);
    }
    var BD = An();
    if (!(BD && BW)) {
      return a;
    }
    var BT;
    for (var BL = false, BO, BQ, BS = 0, BR = BD.length; BS < BR; BS++) {
      BO = unescape(BD[BS].src);
      if (BO && BO.search(r) == -1) {
        BO = unescape(window.location.href);
        if (BO.charAt(BO.length - 1) != j) {
          if ((BQ = K.exec(BO)) != null) {
            if (BQ[1].length > BO.search(r) + 3) {
              BO = BQ[1];
            }
          }
        }
        BO += unescape(BD[BS].src);
      }
      if (BO == a || BO == null) {
        continue;
      }
      while (T.test(BO)) {
        BO = BO.replace(T, "\x2f");
      }
      if (C.has(BO)) {
        continue;
      }
      C.add(BO);
      if (BL) {
        continue;
      }
      var BF;
      for (var BG in BW) {
        if (typeof Object.prototype[BG] != "undefined") {
          continue;
        }
        BF = BW[BG];
        var BV,
          BX,
          BI = [];
        for (var BP = BF.length; --BP >= 0; ) {
          BV = BF[BP];
          BX = BO.lastIndexOf(BV) + 1;
          if (BX <= 0 || BX == BI[0]) {
            continue;
          }
          BI[BI.length] = BX;
          G("FOUND :: Path [ " + BO + " ]", arguments);
        }
        if (BI.length == 0) {
          continue;
        }
        BI.length > 2 && BI.sort(AN);
        BX = BI[BI.length - 1];
        BK = BX == BO.lastIndexOf(BV) + 1 ? BG : a;
        BT = BO.substring(0, BX);
        BL = true;
        if (BU == A1 && BD[BS].title != A1) {
          BD[BS].title = A1;
        }
        var BE = BX + BV.length - 2;
        var BN = X(BO.substring(BE + 1));
        var BJ = BN[1];
        var BH = BN[0] || (BU == A1 && AP);
        break;
      }
    }
    if (!BT) {
      return a;
    }
    BM = new AB(BT, BK, BU, a, BH, BJ);
    g[BU] = BM;
    return BM;
  }
  function k(BT, BU) {
    var BL = Number.MAX_VALUE;
    var BN;
    var BE = [];
    var BO;
    var BH = 0;
    BU = BU || AD(BT);
    var BJ = [];
    var BR = C.getAll();
    BR: for (var BP in BR) {
      if (typeof Object.prototype[BP] != "undefined") {
        continue;
      }
      for (var BG in BU) {
        if (typeof Object.prototype[BG] != "undefined") {
          continue;
        }
        BJ[BJ.length] = BG;
        for (var BF = BU[BG], BS = BF.length; --BS >= 0; ) {
          if (0 < (BO = BP.lastIndexOf(BF[BS]))) {
            BN = BP.length - (BO + BF[BS].length);
            if (BN < BL) {
              BL = BN;
              BH = BE.length;
            }
            BE[BE.length] = BO + 1;
            var BD = BO + 1 + BF[BS].length - 2;
            var BQ = X(BP.substring(BD + 1));
            var BK = BQ[1];
            var BI = BQ[0];
            G("FOUND :: Cached Path [ " + BP + " ]", arguments);
            break BR;
          }
          if (BS == 0) {
            delete BJ[--BJ.length];
          }
        }
      }
    }
    if (!BE || BE.length == 0) {
      return a;
    }
    BP = BP.substring(0, BE[BH]);
    var BM = new AB(BP, BJ[BH], BT, a, BI, BK);
    if (BM.path) {
      g[BT] = BM;
    }
    return BM;
  }
  function AD(BF, BH) {
    var BJ = j || A2();
    var BD = BH == a ? H : [BH];
    var BG = {};
    for (var BI, BE = BD.length; --BE >= 0; ) {
      BH = BD[BE];
      BI = BJ + BF.replace(/\x2e/g, BH);
      BG[BH] = [BI + BH, BI + M];
    }
    return BG;
  }
  function l() {
    return [
      BA ? "cloak" : "cloakoff",
      Ag ? "debug" : "debugoff",
      i ? "legacy" : "legacyoff",
      f ? "mvc" : "mvcoff",
      AZ ? "mvcshare" : "mvcshareoff",
      m ? "override" : "overrideoff",
      S ? "refresh" : "refreshoff",
    ].join(",");
  }
  function A2(BF) {
    if (!BF && j) {
      return j;
    }
    var BG = unescape(window.location.href);
    var BD = BG.lastIndexOf("\x5c") + 1;
    var BE = BG.lastIndexOf("\x2f") + 1;
    j = BD > BE ? "\x5c" : "\x2f";
    return j;
  }
  function Aj(BE, BK, BH, BJ, BG, BI, BD) {
    if (!Ab.add(BK, BE)) {
      return BI;
    }
    E(BK, BE == "*" ? BK : BE);
    Ad(BK);
    if (BE == "*") {
      (BE = BB), G('...\t:: Import ("' + BK + '.*")', arguments);
    } else {
      if (BE == BK) {
        G('...\t:: Include ("' + BE + '")', arguments);
      } else {
        G('...\t:: ImportAs ("' + BE + '", "' + BK + '")', arguments);
      }
    }
    if (new e(BK).start()) {
      return BI;
    }
    BH = AM(BE, BK, BH, BJ, BG);
    var BF = Y(
      BH,
      AK(BD || window || this),
      'ImportAs("' + BE + '", "' + BK + '");',
      false,
      BK
    );
    return BI;
  }
  function AM(BD, BK, BG, BJ, BE) {
    i && (BJ = BJ === false ? "\x2f" : "\x2e");
    !BJ && (BJ = Aa.notation);
    var BI = BK + (BD == "*" ? ".*" : "");
    var BF = BI;
    var BH;
    do {
      if ((BI = AH.exec(BI))) {
        BI = BI[1];
      } else {
        break;
      }
      if (BI == BF) {
        break;
      }
      BF = BI;
      BH = u(BI, BJ);
    } while (!BH);
    !A7(BG) && (BG = (BH && BH.path) || Aa.path || "");
    BG.charAt(BG.length - 1) != "\x2f" && (BG += "\x2f");
    BG += escape(BK.replace(/\x2e/g, BJ));
    BE && (BG += "\x2e" + BE);
    BG += M;
    BH && BH.hasOption("refresh") && (BG = AL(BG));
    return BG;
  }
  function AC(BE, BJ, BH, BD) {
    BD = BD || window || this;
    if (!BH) {
      return BH;
    }
    if (BE != BB && Ax(BE, BJ, BD)) {
      Ab.remove(BJ);
      return BH;
    }
    if (!Am(BJ, BE)) {
      return a;
    }
    var BF = [],
      BI = Ab.get(BJ),
      BG = BE == BJ || BI == BJ;
    if (BE && BE != BB && (!BI || (BI != "*" && BI != BB))) {
      if (BG) {
        BF[0] = 'SUCCESS :: Include ("' + BJ + '")';
      } else {
        (BD[BE] = BH),
          (BF[0] = 'SUCCESS :: ImportAs ("' + BE + '", "' + BJ + '")');
      }
      Ab.remove(BJ);
      Ao.add(BJ, BE);
    } else {
      if (BI == "*") {
        A6(BE, BJ, BH, BD, BG, BF);
      } else {
        if (BI != "*" && (BI == BB || BE == BB)) {
          BF[0] =
            "SUCCESS :: " + (BG ? "Include" : "Import") + ' ("' + BJ + '.*")';
          Ab.remove(BJ);
          Ao.add(BJ, "*");
        }
      }
    }
    BF.length > 0 && G(BF.join("\r\n"), arguments);
    BE != BJ && (p.has("") || p.has(BE)) && AI(BE);
    (p.has("") || p.has(BJ)) && AI(BJ);
    return BH;
  }
  function A6(BE, BJ, BH, BD, BG, BF) {
    BF[BF.length] = " ";
    if (!BG) {
      var BI;
      for (var BK in BH) {
        if (typeof Object.prototype[BK] != "undefined") {
          continue;
        }
        BI = BJ + "." + BK;
        if (g[BI] || Ax(BK, BI, BD)) {
          continue;
        }
        BD[BK] = BH[BK];
        BF[BF.length] = 'SUCCESS :: ImportAs ("' + BK + '", "' + BI + '")';
      }
    }
    Ab.remove(BJ);
    if (BE != BB) {
      Ab.add(BJ, BB);
    }
  }
  function Ax(BE, BG, BD) {
    BD = BD || window || this;
    if (
      m ||
      (BG == BE && !AY(BE)) ||
      typeof BD[BE] == "undefined" ||
      AY(BG) == BD[BE]
    ) {
      return false;
    }
    var BF =
      "\nWARNING: There is a naming conflict, " +
      BE +
      " already exists.\nConsider using the override load-time option, " +
      AA +
      '.EnableOverride(),\nor ImportAs with an alias; for example:\n\n\tImportAs ("' +
      BE +
      '1", "' +
      BG +
      '");';
    if (BE == BG) {
      BF += "\n\nThe module is currently inaccessible.\n";
    } else {
      BF +=
        "\n\nThe module can currently be accessed using its fully-qualified name:\n\n\t" +
        BG +
        ".\n";
    }
    G(BF, arguments, Ag);
    return true;
  }
  function AJ(BD) {
    return new Function("return /*@cc_on @if(@_jscript)" + BD + "@end @*/;")();
  }
  function U(BG, BE, BF, BD) {
    return t(a, BG, BE, BF, BD);
  }
  function t(BO, BH, BD, BM, BE) {
    n();
    if (!BH || BH == "*") {
      G('ERROR :: ImportAs ("' + BO + '", "' + BH + '")');
      return a;
    }
    var BN, BL;
    if (!A7(BO)) {
      BO = "";
    }
    if ((BN = BC(BO, BH))) {
      BH = BN[1];
      BO = BO != BB ? BN[0] : BB;
      BL = BN[2];
    } else {
      if (!BO) {
        BO = BH.substring(BH.lastIndexOf("\x2e") + 1);
      }
    }
    BE = BE || window || this;
    if (BO == "*") {
      BH = AH.exec(BH)[1];
    } else {
      if (typeof BE[BO] != "undefined" && BO != BH) {
        for (var BP = i ? q.concat(L) : q, BQ = BP.length; --BQ >= 0; ) {
          if (BO != BP[BQ]) {
            continue;
          }
          G(
            'ERROR :: ImportAs ("' +
              BO +
              '", "' +
              BH +
              '")! ' +
              BO +
              " is restricted.",
            arguments
          );
          return BE[BO];
        }
      }
    }
    var BF = BE;
    var BK = "";
    for (var BG = BH.split("\x2e"), BJ = 0, BI = BG.length; BJ < BI; BJ++) {
      if (typeof BF[BG[BJ]] != "undefined") {
        BF = BF[BG[BJ]];
        BK += BG[BJ] + "\x2e";
      } else {
        break;
      }
    }
    if (BJ >= BI && BO != "*") {
      if (Ab.has(BH) || !Ao.has(BH)) {
        BF = AC(BO, BH, BF, BE);
        s(BH);
      }
      return BF;
    }
    if (Ab.has(BH)) {
      if (BO == "*" || BO == BB) {
        BO = BH;
      }
      E(BH, BO);
      Ad(BH);
      return a;
    }
    return Aj(BO, BH, BD, BM, BL, BF, BE);
  }
  function e(BH, BF, BD) {
    var BG,
      BL,
      BJ = 0;
    function BI(BM) {
      BD = BD || 500;
      BM.start = BE;
      BM.stop = BK;
      BG = window.setInterval(BK, (BF = BF || 60000));
      return BM;
    }
    function BE() {
      switch (true) {
        case ++BJ >= BD:
          BK();
          return false;
        case !!AY(BH) && Am(BH):
          Q(BH);
          return true;
        default:
          BL = window.setTimeout(BE, 0);
          return false;
      }
    }
    function BK() {
      a != BL && window.clearTimeout(BL);
      a != BG && window.clearInterval(BG);
    }
    if (this.constructor != e) {
      if (!this.constructor || this.constructor.toString() != e.toString()) {
        return new e(BH, BF, BD);
      }
    }
    return BI(this);
  }
  function A3(BG, BE, BF, BD) {
    BG && (BG = BG.split(".*").join(""));
    return t(BG, BG, BE, BF, BD);
  }
  function Aw(BD) {
    return (
      BD != a &&
      BD != null &&
      (typeof BD == "function" || Function == BD.constructor)
    );
  }
  function A() {
    if (typeof document == "undefined") {
      return false;
    }
    var BD = !!document.write && !!document.writeln;
    Az = !!document.createElement;
    B =
      Az &&
      !!document.createTextNode &&
      !!document.getElementsByTagName &&
      !!(Au = document.getElementsByTagName("head")[0]).appendChild &&
      !!Au.removeChild;
    c =
      B &&
      !!document.firstChild &&
      !!document.lastChild &&
      !!document.parentNode;
    Z = c && !!document.ownerDocument;
    return !(BD || Az || B || c || Z);
  }
  function Aq(BG, BD) {
    var BF = BG == F;
    var BE = Ab.has(BG);
    if (BF || Am(F) || BE) {
      return true;
    }
    Ab.add(BG, BD || BG);
    new e(BG).start();
    return false;
  }
  function A7(BD) {
    return (
      BD != null &&
      BD != a &&
      (typeof BD == "string" || BD.constructor == String)
    );
  }
  function Am(BG, BD) {
    var BE = y.get(BG);
    BE && (BE = BE.getAll());
    for (var BF in BE) {
      if ("undefined" == typeof Object.prototype[BF]) {
        if (!AY(BE[BF])) {
          return false;
        }
      }
    }
    return true;
  }
  function Y(BF, BD, BH, BJ, BI, BG, BK) {
    n();
    if (!(BD = AK(BD))) {
      G(
        "ERROR :: Container not found. Unable to load:\n\n[" + BF + "]",
        arguments
      );
      return false;
    }
    if (BF) {
      C.add(unescape(BF));
      if (S) {
        BF = AL(BF);
      }
    }
    if (!(BG || BK)) {
      BK = "JavaScript";
      BG = "text/javascript";
    }
    if (BJ == a) {
      BJ = false;
    }
    var BE;
    if (Az && !d) {
      BE = BD.createElement("script");
    }
    if (!BE) {
      if (BH) {
        BH = "window.setTimeout('" + BH + "',0);";
      }
      R(BF, BD, BH, BJ, BI, BG, BK);
      return false;
    }
    if (BJ) {
      BE.defer = BJ;
    }
    if (BK) {
      BE.language = BK;
    }
    if (BI) {
      BE.title = BI;
    }
    if (BG) {
      BE.type = BG;
    }
    if (BF) {
      G("...\t:: Load [ " + BF + " ]", arguments);
      if (AR || !(A9 || O)) {
        BE.src = BF;
      }
      AG(BD).appendChild(BE);
      if (!AR || A9 || O) {
        BE.src = BF;
      }
      G("DONE\t:: Load [ " + BF + " ]", arguments);
    }
    if (!BH) {
      return true;
    }
    if (BF) {
      Y(a, BD, BH, BJ, BI, BG, BK);
      return true;
    }
    if (typeof BE.canHaveChildren == "undefined" || BE.canHaveChildren) {
      BE.appendChild(BD.createTextNode(BH));
    } else {
      if (!BE.canHaveChildren) {
        BE.text = BH;
      }
    }
    AG(BD).appendChild(BE);
    return false;
  }
  function A5() {
    if (!(f || AZ)) {
      return;
    }
    if (AZ) {
      Y(Aa.path + Ak + M, null, null, null, Ak);
    }
    if (!f) {
      return;
    }
    var BE = unescape(window.location.pathname);
    var BD = BE.lastIndexOf(j);
    BE = BE.substring(++BD);
    BD = BE.lastIndexOf("\x2e");
    BD = BD == -1 ? 0 : BD;
    if ("" != (BE = BE.substring(0, BD))) {
      Ak = BE;
    }
    Y(Ak + M, null, null, null, Ak);
  }
  function Ai(BE) {
    if (!BE || !A7(BE)) {
      return;
    }
    var BF = BE.lastIndexOf("?") + 1;
    BE = BE.substring(BF).toLowerCase();
    if (BE.length == 0) {
      return;
    }
    var BD;
    if ((BD = h.exec(BE))) {
      BA = BD[1] == "cloak";
    }
    if ((BD = N.exec(BE))) {
      Ag = BD[1] == "debug";
    }
    if ((BD = Ap.exec(BE))) {
      J(BD[1] == "legacy");
    }
    if ((BD = o.exec(BE))) {
      f = BD[1] == "mvc";
    }
    if ((BD = AQ.exec(BE))) {
      AZ = BD[1] == "mvcshare";
    }
    if ((BD = AT.exec(BE))) {
      m = BD[1] == "override";
    }
    if ((BD = I.exec(BE))) {
      S = BD[1] == "refresh";
    }
  }
  function R(BD, BF, BG, BE, BL, BK, BJ) {
    if (!(BF = AK(BF || window || this))) {
      return;
    }
    var BI;
    if (BD) {
      G("...\t:: LoadSimple [ " + BD + " ]", arguments);
      if (BG) {
        BI = BG;
        BG = a;
      }
    }
    var BH =
      "<script" +
      (BE ? ' defer="defer"' : "") +
      (BJ ? ' language="' + BJ + '"' : "") +
      (BL ? ' title="' + BL + '"' : "") +
      (BK ? ' type="' + BK + '"' : "") +
      (BD ? ' src="' + BD + '">' : ">") +
      (BG ? BG + ";" : "") +
      "</script>\n";
    BF.write(BH);
    if (BD) {
      G("DONE\t:: LoadSimple [ " + BD + " ]", arguments);
    }
    if (!(BG = BG || BI)) {
      return;
    }
    if (BD) {
      R(a, BF, BG, BE, BL, BK, BJ);
    }
  }
  function G(BH, BJ, BG) {
    if (!Ag && !BG) {
      return;
    }
    var BF = /function\s*([^(]*)\s*\(/.exec(BJ.callee) || [""],
      BK = BF.length > 1 ? BF[1] : BF[0];
    if (BH != a) {
      var BE = w;
      var BD = new Date();
      w =
        [BD.getFullYear(), BD.getMonth() + 1, BD.getDate()].join(".") +
        "," +
        [
          BD.getHours(),
          BD.getMinutes(),
          BD.getSeconds(),
          BD.getMilliseconds(),
        ].join(":") +
        "\t:: " +
        F +
        " :: " +
        BK +
        "\r\n" +
        BH +
        "\r\n\r\n";
      var BI =
        w.indexOf("ERROR") >= 0
          ? "error"
          : w.indexOf("WARN") >= 0
          ? "warn"
          : "info";
      !G.is
        ? (G.is = {
            Firebug: typeof console != "undefined" && Aw(console.info),
            MochiKit: typeof MochiKit != "undefined" && Aw(MochiKit.log),
            YAHOO: typeof YAHOO != "undefined" && Aw(YAHOO.log),
          })
        : 0;
      G.is.Firebug && console[BI](w);
      G.is.YAHOO && YAHOO.log(w, BI);
      G.is.MochiKit &&
        (BI == "info"
          ? MochiKit.log(w)
          : BI == "error"
          ? MochiKit.logError(w)
          : BI == "warn"
          ? MochiKit.logWarning(w)
          : 0);
      w += BE;
    }
    if (BG) {
      Ac();
    }
  }
  function W(BD, BG, BF) {
    var BE =
      BD == "*" || BD == BB
        ? 'Import   ("' + BG + '.*")'
        : BD == BG
        ? 'Include  ("' + BG + '")'
        : 'ImportAs ("' + BD + '", "' + BG + '")';
    G("CHECKING :: " + BE + "...", BF);
  }
  function Af(BE, BL, BJ, BD) {
    n();
    BE = BE || "\x3cdefault\x3e";
    G('Namespace ("' + BE + '")', arguments);
    var BK = BD || window || this;
    if (BE == "\x3cdefault\x3e") {
      Aa.update(BL, BJ);
      G(Aa, arguments);
      return BK;
    }
    AS(BE);
    var BF = BE.split("\x2e");
    for (var BI = 0, BH = BF.length; BI < BH; BI++) {
      BK = typeof BK[BF[BI]] != "undefined" ? BK[BF[BI]] : (BK[BF[BI]] = {});
    }
    var BG = g[BE];
    if (BG) {
      BG.update(BL, BJ);
      G(BG, arguments);
      return BK;
    }
    if (!BL) {
      BG = u(BE, BJ);
    }
    if (BL || !BG) {
      BG = new AB(BL, BJ, BE);
    }
    if (BG && !g[BE]) {
      g[BE] = BG;
    }
    G(BG, arguments);
    return BK;
  }
  function AB(BN, BK, BE, BL, BH, BM, BO) {
    function BI(BP) {
      BJ();
      BP.hasOption = BG;
      BP.toString = BD;
      BP.update = BF;
      BP.update(BN, BK, BE, BL, BH, BM, BO);
      return BP;
    }
    function BJ() {
      if (!(BN && BN.constructor == AB)) {
        return;
      }
      var BP = BN;
      BM = BP.extension;
      BE = BP.fullName;
      BK = BP.notation;
      BO = BP.options;
      BN = BP.path;
      BL = BP.shortName;
      BH = BP.version;
    }
    function BG(BP) {
      BO = BO || this.options;
      if (!(BO && BP && BO.indexOf(BP) >= 0)) {
        return false;
      }
      var BQ = new RegExp(BP, "g").exec(BO);
      return BQ && typeof BQ[1] != "undefined" && BQ[1] == BP;
    }
    function BD() {
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
    function BF(BT, BS, BU, BP, BQ, BV, BR) {
      this.extension = BV || this.extension || M;
      this.fullName = BU || this.fullName || "";
      this.shortName = BP || this.shortName || "";
      this.notation = A7(BS)
        ? BS
        : this.notation || (Aa && A7(Aa.notation) ? Aa.notation : "\x2e");
      this.options = A7(BR) ? BR : this.options || l();
      this.path = A7(BT) ? BT : this.path || (Aa && A7(Aa.path) ? Aa.path : "");
      this.uri = this.path + this.fullName.replace(/\x2e/g, this.notation);
      this.version = "" + (BQ || this.version || "");
      if (!this.uri) {
        return;
      }
      this.uri += (this.version ? "\x2e" + this.version : "") + this.extension;
    }
    if (this.constructor != AB) {
      if (!this.constructor || this.constructor.toString() != AB.toString()) {
        return new AB(BN, BK, BE, BL, BH, BM, BO);
      }
    }
    return BI(this);
  }
  function AI(BG) {
    var BI = [p.get(""), p.get(BG), p.get(D)];
    if (!BI[0] && !BI[1] && !BI[2]) {
      return;
    }
    var BD = (BI[0] && BI[0].getSize() > 0) || (BI[1] && BI[1].getSize() > 0);
    if (Ag && BD) {
      G("NOTIFY :: Import Listeners for " + BG + "...", arguments);
    }
    for (var BF, BE = BI.length; --BE >= 0; ) {
      if (!BI[BE]) {
        continue;
      }
      BF = BI[BE].getAll();
      for (var BH in BF) {
        if ("undefined" == typeof Object.prototype[BH]) {
          if (Aw(BF[BH])) {
            BF[BH](BG);
          }
        }
      }
    }
    if (Ag && BD) {
      G("NOTIFY :: Import Listeners for " + BG + "...DONE!", arguments);
    }
  }
  function AO() {
    Af(A1);
    b((window.Import = U));
    b((window.ImportAs = t));
    b((window.Include = A3));
    b((window.Load = Y));
    b((window.Namespace = Af));
    b((AV.AddImportListener = Ae));
    b((AV.EnableLegacy = J));
    b(
      (AV.GetVersion = function () {
        return AP;
      })
    );
    AV.GetVersion.toString = AV.GetVersion.prototype.toString = AV.GetVersion;
    b((AV.RemoveImportListener = As));
    b((AV.SetOption = AX));
    b((AV.ShowLog = Ac));
    b((AV.Unload = A4));
    Ay("Cloak");
    Ay("Debug");
    Ay("Override");
    Ay("Refresh");
    J(i || false);
  }
  function Ay(BD) {
    if (!BD || !A7(BD)) {
      return;
    }
    b(
      (AV["Enable" + BD] = function (BE) {
        AX(BD, BE);
      })
    );
  }
  function As(BD, BH) {
    n();
    if (!BH || !Aw(BH)) {
      if (Aw(BD)) {
        BH = BD;
        BD = a;
      } else {
        return false;
      }
    } else {
      if (BD && !A7(BD)) {
        return false;
      }
    }
    var BJ = [p.get(""), p.get(BD), p.get(D)];
    if (!BJ[0] && !BJ[1] && !BJ[2]) {
      return false;
    }
    var BG = false;
    for (var BF, BE = BJ.length; --BE >= 0; ) {
      if (!BJ[BE]) {
        continue;
      }
      BF = BJ[BE].getAll();
      for (var BI in BF) {
        if ("undefined" == typeof Object.prototype[BI]) {
          if (BF[BI] == BH) {
            BJ[BE].remove(BI);
            BG = true;
            break;
          }
        }
      }
    }
    return BG;
  }
  function v(BD) {
    if (!(B && (BD = document.createElement("meta")))) {
      return;
    }
    BD.httpEquiv = At + AA + " " + AP;
    At = A1.split("\x2e").reverse().join("\x2e");
    BD.content = At + " :: Smart scripts that play nice ";
    AG(window.document).appendChild(BD);
  }
  function J(BD) {
    if (BD == a) {
      BD = true;
    }
    i = BD;
    AV = AV || AY(AA) || {};
    if (BD) {
      AV.DIR_NAMESPACE = AV.USE_PATH = "\x2f";
      AV.DOT_NAMESPACE = AV.USE_NAME = "\x2e";
      b((AV.CompleteImports = Q));
      b((AV.EnableDebugging = AV.EnableDebug));
      b((AV.GetPathFor = AE));
      b((window.JSBasePath = window.JSPath = AV.SetBasePath = V));
      b((window.JSImport = U));
      b((window.JSLoad = Y));
      b((window.JSPackaging = AV));
      b((window.JSPackage = window.Package = Af));
      b(
        (window.JSPacked = function (BE) {
          Aa.notation = BE;
        })
      );
      b((window.NamespaceException = window.PackageException = A8));
    }
    if (BD || typeof window["JSPackaging"] == "undefined") {
      return;
    }
    delete AV.DIR_NAMESPACE;
    delete AV.DOT_NAMESPACE;
    delete AV.CompleteImports;
    delete AV.EnableDebugging;
    delete AV.GetPathFor;
    delete AV.SetBasePath;
    delete AV.USE_NAME;
    delete AV.USE_PATH;
    Av(L);
  }
  function AX(BD, BE) {
    n();
    if (!BD || !A7(BD)) {
      return;
    }
    BE = BE == a ? true : BE;
    BD = BD.toLowerCase();
    switch (BD) {
      case "cloak":
        BA = BE;
        break;
      case "debug":
        Ag = BE;
        break;
      case "legacy":
        J(BE);
        break;
      case "override":
        m = BE;
        break;
      case "refresh":
        S = BE;
        break;
      default:
        break;
    }
  }
  function AL(BD) {
    if (/ajile.refresh/g.test(BD)) {
      return BD;
    }
    return BD + (/\?/g.test(BD) ? "&" : "?") + "ajile.refresh=" + Math.random();
  }
  function Ac() {
    n();
    if (A9 && !B) {
      return;
    }
    if (!Ag) {
      w =
        "\r\nTo enable debug logging, use <b>" +
        AA +
        ".EnableDebug()</b> from within any of your scripts or use " +
        AA +
        "'s debug load-time option as follows:<br><br><pre><code>&lt;script src=\"" +
        Aa.uri +
        '?<b>debug</b>" type="text/javascript"&gt;&lt;/script&gt;</code></pre>';
    }
    var BF =
      "<html><head><title>" +
      AA +
      "'s Debug Log " +
      (!Ag ? ":: DISABLED" : "") +
      '</title>\r\n<style type="text/css">*{background-color:#eee;color:#000;font-family:"Tahoma";font-size:12px;}</style>\r\n</head>\r\n<body>' +
      w.replace(/\r\n/g, "<br>") +
      "</body></html>";
    var BG = screen.width / 1.5;
    var BD = screen.height / 1.5;
    var BE = Ac.window
      ? Ac.window
      : (Ac.window = window.open(
          "",
          "__AJILELOG__",
          "width=" +
            BG +
            ",height=" +
            BD +
            ",addressbar=0,directories=0,location=0,menubar=0,scrollbars=1,statusbar=0,toolbar=0,resizable=1"
        ));
    if (!(BE && BE.document)) {
      return;
    }
    BE.document.open();
    BE.document.writeln(BF);
    BE.document.close();
  }
  function AU() {
    var BF = {},
      BN = 0;
    function BH(BO) {
      BO.add = BL;
      BO.clear = BJ;
      BO.get = BE;
      BO.getAll = BI;
      BO.getAllArray = BD;
      BO.getSize = BM;
      BO.has = BK;
      BO.remove = BG;
      return BO;
    }
    function BL(BO, BP, BQ) {
      if (BE(BO) && !BQ) {
        return false;
      }
      BF[BO] = BP;
      BN++;
      return true;
    }
    function BJ() {
      for (var BO in BF) {
        if ("undefined" == typeof Object.prototype[BO]) {
          delete BF[BO];
        }
      }
      BN = 0;
    }
    function BE(BO) {
      return typeof Object.prototype[BO] != "undefined" ||
        typeof BF[BO] == "undefined"
        ? a
        : BF[BO];
    }
    function BI() {
      return BF;
    }
    function BD() {
      var BP = [];
      for (var BO in BF) {
        if ("undefined" == typeof Object.prototype[BO]) {
          BP[BP.length] = [BO, BF[BO]];
        }
      }
      return BP;
    }
    function BM() {
      return BN;
    }
    function BK(BO) {
      return (
        typeof Object.prototype[BO] == "undefined" &&
        typeof BF[BO] != "undefined"
      );
    }
    function BG(BO) {
      if (!BK(BO)) {
        return false;
      }
      delete BF[BO];
      BN--;
      return true;
    }
    if (this.constructor != AU) {
      if (!this.constructor || this.constructor.toString() != AU.toString()) {
        return new AU();
      }
    }
    return BH(this);
  }
  function s(BF) {
    var BG = AW.get(BF);
    if (!BG) {
      return;
    }
    BG = BG.getAll();
    var BE;
    for (var BD in BG) {
      if ("undefined" == typeof Object.prototype[BD]) {
        if (Ab.has(BD) && (BE = AY(BD))) {
          if (AC(Ab.get(BD), BD, BE)) {
            s(BD);
          }
        }
      }
    }
  }
  var F = A1,
    y = new AU(),
    p = new AU(),
    A9 = AJ("@_jscript_version"),
    d = typeof ScriptEngine != "undefined" && /InScript/.test(ScriptEngine()),
    O = /Opera/i.test(window.navigator.userAgent),
    AR = /WebKit/i.test(window.navigator.userAgent),
    C = new AU(),
    g = {
      clear: function () {
        for (var BD in this) {
          if ("undefined" == typeof Object.prototype[BD]) {
            delete this[BD];
          }
        }
      },
    },
    Ab = new AU(),
    Ao = new AU(),
    AW = new AU();
  Ah();
})("1.3.8");
