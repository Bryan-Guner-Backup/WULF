/**----------------------------------------------------------------------------+
| Product:  Ajile [com.iskitz.ajile]
| @version  1.1.5
|+-----------------------------------------------------------------------------+
| @author   Michael A. I. Lee [ http://ajile.iskitz.com/ ]
|
| Created:  Tuesday,   November   4, 2003    [2003.11.04]
| Modified: Friday,    December  21, 2007    [2007.12.21 - 03:28:36 AM EDT]
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
|           Copyright (c) 2003-2008 Michael A. I. Lee, iSkitz.com
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
| Portions created by the Initial Developer are Copyright (C) 2003-2008
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
(function (AN) {
  var Aw, B, a, Y;
  if (typeof Af != "undefined" && Af() > 1) {
    return;
  }
  var A7 = true,
    Ae = false,
    g = false,
    d = true,
    AX = true,
    k = false,
    R = false;
  var y = "Ajile",
    Aq = "Powered by ",
    Ai = "index",
    M = ".js",
    D = "<*>",
    Ay = "com.iskitz.ajile",
    h,
    o = [y, "Import", "ImportAs", "Include", "Load", "Namespace"],
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
  var Ar,
    AY,
    A8 = "__LOADED__",
    Ax,
    u = "",
    AT;
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
  var f = /(cloakoff|cloak)/,
    N = /(debugoff|debug)/,
    An = /(legacyoff|legacy)/,
    m = /(mvcoff|mvc)/,
    AO = /(mvcshareoff|mvcshare)/,
    AR = /(overrideoff|override)/,
    I = /(refreshoff|refresh)/,
    K = /(.*\/)[^\/]+/,
    AF = /(.*)\.[^\.]+/,
    S = /(\/\.\/)|(\/[^\/]*\/\.\.\/)/,
    p = /:\/\x2f/;
  function Af(BA) {
    undefined = void 0;
    if (typeof A == "undefined" || typeof AU == "undefined") {
      return 0;
    }
    if ((BA = BA || A())) {
      return 3;
    }
    AY = new z(s(Ay));
    if (!k && (BA = BA || (AT = AW(Ay)))) {
      return 2;
    }
    AY.version = AN = AN || AY.version;
    Z((AT = AT || {}).constructor);
    t();
    if (!Aw) {
      AY.fullName = Ay;
      AY.path = "../lib/";
      AY.shortName = y;
    }
    AM();
    AZ.add(Ay, y);
    Am.add(Ay, y);
    AA(y, Ay, AT);
    A2();
    x(Ay);
    l();
    return 1;
  }
  function A1(BA) {
    if (BA && BA != Ay) {
      AD(BA);
      return;
    }
    w.clear();
    n.clear();
    C.clear();
    e.clear();
    AZ.clear();
    Am.clear();
    AU.clear();
    l(false);
    x();
    Ax = null;
    As(o.concat(L));
    v(Ay);
  }
  function E(BC, BA) {
    if (BC == F) {
      return;
    }
    var BB = w.get(F);
    if (!BB) {
      w.add(F, (BB = new AS()));
    }
    BB.add(BC, BA);
  }
  function Ac(BA, BD) {
    l();
    if (!BD || !At(BD)) {
      if (At(BA)) {
        BD = BA;
        BA = undefined;
      } else {
        return false;
      }
    } else {
      if (BA && !A4(BA)) {
        return false;
      }
    }
    if (BA == D && this == window[y]) {
      return false;
    }
    if (!BA && this != window[y]) {
      BA = D;
    }
    var BC = BD;
    if (BA && (Am.has(BA) || AW(BA))) {
      return window.setTimeout(function () {
        BC(BA);
      }, 62.25);
    }
    if (!BA) {
      if (Am.getSize() > 0 || AZ.getSize() == 0) {
        for (var BE in Am.getAll()) {
          window.setTimeout(function () {
            BC(BE);
          }, 62.25);
        }
      }
    }
    var BB = n.get((BA = BA || ""));
    if (!BB) {
      n.add(BA, (BB = new AS()));
    }
    BB.add(Math.random(), BC);
    return true;
  }
  function Ab(BA) {
    if (BA == F) {
      return;
    }
    var BB = AU.get(BA);
    if (!BB) {
      AU.add(BA, (BB = new AS()));
    }
    BB.add(F);
  }
  function x(BB, BC) {
    if (BB && !A4(BB)) {
      return;
    }
    BB = BB || "";
    var BF = AW(BB);
    if (BF) {
      Z(At(BF) ? BF : BF.constructor);
    }
    if (!B) {
      return;
    }
    var BI = Ao(BB);
    var BE = BI && BI.hasOption("cloak");
    for (var BD, BA, BJ, BH = Al(), BG = BH.length; --BG >= 0; ) {
      if (!BH[BG]) {
        continue;
      }
      if ((BD = BH[BG].title) && BB && BD != BB) {
        continue;
      }
      BA = BH[BG].src;
      BJ = (BA && BA.indexOf(Ay) >= 0) || (BD && BD.indexOf(Ay) == 0);
      if (BJ || (!BA && BD) || BE || A7) {
        Aj(BH[BG], BC);
      }
    }
  }
  function Aj(BB, BA) {
    if (a) {
      Aj = function BC(BF, BE) {
        if ((BE = BE || BF.parentNode)) {
          if (BE.removeChild) {
            BE.removeChild(BF);
          }
        }
      };
    } else {
      if (B) {
        Aj = new Function(
          "element",
          "container",
          'if(container){  try { container.removeChild(element); }catch(e){}  return;}try { document.getElementsByTagName("head")[0].removeChild(element); }catch(e){try { document.body.removeChild(element);}catch(e){}}'
        );
      } else {
        Aj = function BD() {};
      }
    }
    if (BB) {
      Aj(BB, BA);
    }
  }
  function Z(BC) {
    if (!BC || typeof BC.toString == "undefined") {
      return;
    }
    var BA = /(function\s*.*\s*\(.*\))/.exec(BC.toString()) || [""],
      BB = BA.length > 1 ? BA[1] : BA[0];
    if (typeof BC.prototype == "undefined") {
      return;
    }
    BC.prototype.constructor.toString = function (BD) {
      return Ae && !A7 ? BB : BC.prototype.toString();
    };
  }
  function AL(BB, BA) {
    return BB - BA;
  }
  function P(BE) {
    var BD, BB;
    if (!(A4(BE) && AZ.has(BE))) {
      BB = AZ.getAllArray();
    } else {
      if (AW(BE)) {
        BB = [[BE, AZ.get(BE)]];
      }
    }
    if (!BB) {
      return;
    }
    for (var BA, BC = BB.length; --BC >= 0; ) {
      BE = BB[BC][0];
      if (!(AZ.has(BE) && (BD = AW(BE)))) {
        continue;
      }
      V((BA = BB[BC][1]), BE, arguments);
      if (BA == "*") {
        BA = undefined;
      }
      AA(BA, BE, BD);
      q(BE);
    }
  }
  function AC(BA) {
    return (
      y +
      ".GetPathFor(" +
      BA +
      ") is not supported. Namespace paths are protected."
    );
  }
  function A5(BA) {
    this.name = "DEPRECATED: " + Ay + ".NamespaceException";
    this.message = "DEPRECATED: Invalid _namespace name [" + BA + "]";
    this.toString = BB;
    function BB() {
      return "[ " + this.name + " ] :: " + this.message;
    }
  }
  function U(BA) {
    if (A4(BA)) {
      AY.path = BA;
    }
  }
  function As(BB) {
    if (!B) {
      for (var BA = BB.length; --BA >= 0; window[BB[BA]] = undefined) {}
    } else {
      (As = new Function(
        "SYS",
        "  try     { for(var i=SYS.length; --i >= 0; delete window[SYS[i]]);      }  catch(e){ for(var j=SYS.length; --j >= 0; window[SYS[j]] = undefined); }"
      ))(BB);
    }
  }
  function v(BE) {
    if (!BE) {
      return;
    }
    var BD = {},
      BB = BE.split("."),
      BC = window[BB[0]];
    for (var BA = 1; typeof BB[BA] != "undefined"; BA++) {
      if (typeof BC[BB[BA]] == "undefined") {
        break;
      }
      BD[BB[BA - 1]] = [BA, true];
      BC = BC[BB[BA]];
      for (var BF in BC) {
        if ("undefined" == typeof Object.prototype[BF]) {
          if (BF != BB[BA]) {
            BD[BB[BA - 1]][1] = false;
            break;
          }
        }
      }
    }
    for (BC in BD) {
      if ("undefined" == typeof Object.prototype[BC]) {
        if (BD[BC][1]) {
          AD(BB.slice(0, BD[BC][0] + 1).join("."));
        }
      }
    }
  }
  function AD(BC) {
    var BA;
    if (BC) {
      if (!A4(BC)) {
        if ((BC = Ao(BC))) {
          BC = BC.fullName;
          BA = BC.shortName;
        }
      }
      if (!BA && BC) {
        BA = BC.substring(BC.lastIndexOf(".") + 1);
      }
      BC = AF.exec(BC);
      BC = BC ? BC[1] : undefined;
    }
    var BB = AW(BC);
    if (BB && BA) {
      if (BA == "*" || typeof BB[BA] != "undefined") {
        if (BA != "*") {
          if (BB[BA] == window[BA]) {
            window[BA] = undefined;
          }
          delete BB[BA];
        } else {
          for (var BD in BB) {
            if ("undefined" == typeof Object.prototype[BD]) {
              delete BB[BD];
            }
          }
          v(BC);
        }
      }
    }
    x(BC);
  }
  function AQ(BE) {
    var BA = BE;
    var BF = AZ.getAllArray();
    for (var BC, BD = 0, BB = BF.length; BD < BB; ++BD) {
      if (Am.has((BC = BF[BD][0]))) {
        continue;
      }
      if ("*" != BF[BD][1]) {
        BA = AF.exec(BC);
      }
      if (!(BA && BE == BA[1])) {
        continue;
      }
      Am.add((F = BC));
      return;
    }
    F = Ai;
  }
  function l(BB, BD) {
    BD = BD != undefined ? BD : !(BB == false);
    var BA = (BB = BB || window || this).onload;
    function BC(BE) {
      if (BE == true) {
        return BA || null;
      }
      Ac(x);
      P();
      x();
      if (At(BA) && BC.toString() != BA.toString()) {
        BA(BE);
      }
      return BA;
    }
    if (At(BA) && BC.toString() == BA.toString()) {
      if (!BD) {
        BB.onload = BA(true);
      }
      return;
    }
    BB.onload = BC;
  }
  function AI(BA) {
    if (!BA) {
      return window.document;
    }
    if (typeof BA.write == "undefined") {
      if (typeof BA.document != "undefined") {
        BA = BA.document;
      } else {
        if (typeof BA.parentNode != "undefined") {
          return AI(BA.parentNode);
        } else {
          return window.document;
        }
      }
    }
    return BA;
  }
  function A9(BA, BG) {
    if (!BG) {
      return undefined;
    }
    var BF = BG.split(".");
    var BB;
    for (var BE = BA == BG, BD = 0, BC = BF.length; BD < BC; BD++) {
      if (isNaN(BF[BD])) {
        continue;
      }
      BG = BF.slice(0, BD).join(".");
      BA = BE ? BG : BA || BF.slice(BD - 1, BD)[0];
      BB = BF.slice(BD).join(".");
      break;
    }
    if (!BB) {
      return undefined;
    }
    return [BA, BG, BB];
  }
  function Al(BB) {
    if (!(BB = AI(BB))) {
      return undefined;
    }
    var BA =
      typeof BB.scripts != "undefined" &&
      typeof BB.scripts.length != "undefined" &&
      BB.scripts.length > 0
        ? BB.scripts
        : typeof BB.getElementsByTagName != "undefined"
        ? BB.getElementsByTagName("script") || []
        : [];
    return BA;
  }
  function AE(BA) {
    if (BA) {
      if ((!Ax || a) && !B) {
        if ((Ax && Y && BA != Ax.ownerDocument) || !Ax || (!Y && a)) {
          if (BA.lastChild && BA.lastChild.firstChild) {
            Ax = BA.lastChild.firstChild;
          }
        }
      } else {
        if (!Ax && B) {
          Ax = Ar;
        }
      }
    }
    return Ax;
  }
  function W(BC) {
    Ag(BC);
    if (!BC || !A4(BC)) {
      return [];
    }
    var BB = M ? BC.lastIndexOf(M) : BC.lastIndexOf(".");
    if (BB < BC.length && BB >= 0) {
      var BD = BC.slice(BB, BB + M.length);
      var BA = BC.substring(0, BB);
      if (BA && isNaN(BA.charAt(0))) {
        BA = "";
      }
    }
    return [BA, BD];
  }
  function AW(BE, BA) {
    if (!A4(BE)) {
      return undefined;
    }
    var BD = BA || window;
    BE = BE.split(".");
    for (var BC = 0, BB = BE.length; BC < BB; BC++) {
      if (typeof BD[BE[BC]] != "undefined") {
        BD = BD[BE[BC]];
      } else {
        return undefined;
      }
    }
    return BD;
  }
  function Ao(BC) {
    if (!BC) {
      return new z(AY);
    }
    var BA = A4(BC);
    for (var BB in e) {
      if ("undefined" == typeof Object.prototype[BB]) {
        if ((BA && BC == BB) || (!BA && BC == AW(BB))) {
          return e[BB];
        }
      }
    }
    return undefined;
  }
  function s(BR, BH) {
    BR = BR || Ay;
    if (BR == Ay && AY && AY.path) {
      return AY;
    }
    var BJ = e[BR];
    if (BJ) {
      return BJ;
    }
    var BT = AB(BR, BH);
    if ((BJ = i(BR, BT))) {
      return (e[BR] = BJ);
    }
    var BA = Al();
    if (!(BA && BT)) {
      return undefined;
    }
    var BQ;
    for (var BI = false, BL, BN, BP = 0, BO = BA.length; BP < BO; BP++) {
      BL = unescape(BA[BP].src);
      if (BL && BL.search(p) == -1) {
        BL = unescape(window.location.href);
        if (BL.charAt(BL.length - 1) != h) {
          if ((BN = K.exec(BL)) != null) {
            if (BN[1].length > BL.search(p) + 3) {
              BL = BN[1];
            }
          }
        }
        BL += unescape(BA[BP].src);
      }
      if (BL == undefined || BL == null) {
        continue;
      }
      while (S.test(BL)) {
        BL = BL.replace(S, "/");
      }
      if (C.has(BL)) {
        continue;
      }
      C.add(BL);
      if (BI) {
        continue;
      }
      var BC;
      for (var BD in BT) {
        if (typeof Object.prototype[BD] != "undefined") {
          continue;
        }
        BC = BT[BD];
        var BS,
          BU,
          BF = [];
        for (var BM = BC.length; --BM >= 0; ) {
          BS = BC[BM];
          BU = BL.lastIndexOf(BS) + 1;
          if (BU <= 0 || BU == BF[0]) {
            continue;
          }
          BF[BF.length] = BU;
          G("FOUND :: Path [ " + BL + " ]", arguments);
        }
        if (BF.length == 0) {
          continue;
        }
        BF.sort(AL);
        BU = BF[BF.length - 1];
        BH = BU == BL.lastIndexOf(BS) + 1 ? BD : undefined;
        BQ = BL.substring(0, BU);
        BI = true;
        if (BR == Ay && BA[BP].title != Ay) {
          BA[BP].title = Ay;
        }
        var BB = BU + BS.length - 2;
        var BK = W(BL.substring(BB + 1));
        var BG = BK[1];
        var BE = BK[0] || (BR == Ay && AN);
        break;
      }
    }
    if (!BQ) {
      return undefined;
    }
    BJ = new z(BQ, BH, BR, undefined, BE, BG);
    e[BR] = BJ;
    return BJ;
  }
  function i(BQ, BR) {
    var BI = Number.MAX_VALUE;
    var BK;
    var BB = [];
    var BL;
    var BE = 0;
    BR = BR || AB(BQ);
    var BG = [];
    var BO = C.getAll();
    BO: for (var BM in BO) {
      if (typeof Object.prototype[BM] != "undefined") {
        continue;
      }
      for (var BD in BR) {
        if (typeof Object.prototype[BD] != "undefined") {
          continue;
        }
        BG[BG.length] = BD;
        for (var BC = BR[BD], BP = BC.length; --BP >= 0; ) {
          if (0 < (BL = BM.lastIndexOf(BC[BP]))) {
            BK = BM.length - (BL + BC[BP].length);
            if (BK < BI) {
              BI = BK;
              BE = BB.length;
            }
            BB[BB.length] = BL + 1;
            var BA = BL + 1 + BC[BP].length - 2;
            var BN = W(BM.substring(BA + 1));
            var BH = BN[1];
            var BF = BN[0];
            G("FOUND :: Cached Path [ " + BM + " ]", arguments);
            break BO;
          }
          if (BP == 0) {
            delete BG[--BG.length];
          }
        }
      }
    }
    if (!BB || BB.length == 0) {
      return undefined;
    }
    BM = BM.substring(0, BB[BE]);
    var BJ = new z(BM, BG[BE], BQ, undefined, BF, BH);
    if (BJ.path) {
      e[BQ] = BJ;
    }
    return BJ;
  }
  function AB(BC, BE) {
    var BF = h || Az();
    var BA = BE == undefined ? H : [BE];
    var BD = {};
    for (var BB = BA.length; --BB >= 0; ) {
      BE = BA[BB];
      BD[BE] = [];
      BD[BE][2] = BF + BC.replace(/\x2e/g, BE);
      BD[BE][0] = BD[BE][2] + BE;
      BD[BE][1] = BD[BE][2] + BF;
      BD[BE][2] = BD[BE][2] + ".";
    }
    return BD;
  }
  function j() {
    return [
      A7 ? "cloak" : "cloakoff",
      Ae ? "debug" : "debugoff",
      g ? "legacy" : "legacyoff",
      d ? "mvc" : "mvcoff",
      AX ? "mvcshare" : "mvcshareoff",
      k ? "override" : "overrideoff",
      R ? "refresh" : "refreshoff",
    ].join(",");
  }
  function Az(BC) {
    if (!BC && h) {
      return h;
    }
    var BD = unescape(window.location.href);
    var BA = BD.lastIndexOf("\\") + 1;
    var BB = BD.lastIndexOf("/") + 1;
    h = BA > BB ? "\\" : "/";
    return h;
  }
  function Ah(BB, BH, BE, BG, BD, BF, BA) {
    if (!AZ.add(BH, BB)) {
      return BF;
    }
    E(BH, BB == "*" ? BH : BB);
    Ab(BH);
    if (BB == "*") {
      (BB = A8), G('...\t:: Import ("' + BH + '.*")', arguments);
    } else {
      if (BB == BH) {
        G('...\t:: Include ("' + BB + '")', arguments);
      } else {
        G('...\t:: ImportAs ("' + BB + '", "' + BH + '")', arguments);
      }
    }
    BE = AK(BB, BH, BE, BG, BD);
    var BC = X(
      BE,
      AI(BA || window || this),
      'ImportAs("' + BB + '", "' + BH + '");',
      false,
      BH
    );
    if (BC) {
      new c(BH).start();
    }
    return BF;
  }
  function AK(BA, BH, BD, BG, BB) {
    var BF = BH + (BA == "*" ? ".*" : "");
    var BC = BF;
    var BE;
    do {
      if ((BF = AF.exec(BF))) {
        BF = BF[1];
      } else {
        break;
      }
      if (BF == BC) {
        break;
      }
      BC = BF;
      BE = s(BF);
    } while (!BE);
    if (!A4(BD)) {
      BD =
        BE != undefined && BE != null && typeof BE.path != "undefined"
          ? BE.path
          : AY.path || "";
    }
    if (BD.lastIndexOf("/") != BD.length - 1) {
      BD += "/";
    }
    if (g) {
      if (BG == false) {
        BG = "/";
      } else {
        if (BG == true) {
          BG = ".";
        }
      }
    }
    if (BG == null || undefined == BG) {
      BG = BE
        ? "undefined" == typeof BE.notation
          ? AY.notation
          : BE.notation
        : AY.notation;
    }
    BD += escape(BH.replace(/\x2e/g, BG));
    if (BB) {
      BD += "." + BB;
    }
    BD += M;
    if (BE && BE.hasOption("refresh")) {
      BD = AJ(BD);
    }
    return BD;
  }
  function AA(BB, BG, BE, BA) {
    BA = BA || window || this;
    if (!BE) {
      return BE;
    }
    if (BB != A8 && Au(BB, BG, BA)) {
      AZ.remove(BG);
      return BE;
    }
    if (!Ak(BG, BB)) {
      return undefined;
    }
    var BC = [],
      BF = AZ.get(BG),
      BD = BB == BG || BF == BG;
    if (BB && BB != A8 && (!BF || (BF != "*" && BF != A8))) {
      if (BD) {
        BC[0] = 'SUCCESS :: Include ("' + BG + '")';
      } else {
        (BA[BB] = BE),
          (BC[0] = 'SUCCESS :: ImportAs ("' + BB + '", "' + BG + '")');
      }
      AZ.remove(BG);
      Am.add(BG, BB);
    } else {
      if (BF == "*") {
        A3(BB, BG, BE, BA, BD, BC);
      } else {
        if (BF != "*" && (BF == A8 || BB == A8)) {
          BC[0] =
            "SUCCESS :: " + (BD ? "Include" : "Import") + ' ("' + BG + '.*")';
          AZ.remove(BG);
          Am.add(BG, "*");
        }
      }
    }
    if (BC.length > 0) {
      G(BC.join("\r\n"), arguments);
    }
    AG(BG);
    return BE;
  }
  function A3(BB, BG, BE, BA, BD, BC) {
    BC[BC.length] = " ";
    if (!BD) {
      var BF;
      for (var BH in BE) {
        if (typeof Object.prototype[BH] != "undefined") {
          continue;
        }
        BF = BG + "." + BH;
        if (e[BF] || Au(BH, BF, BA)) {
          continue;
        }
        BA[BH] = BE[BH];
        BC[BC.length] = 'SUCCESS :: ImportAs ("' + BH + '", "' + BF + '")';
      }
    }
    AZ.remove(BG);
    if (BB != A8) {
      AZ.add(BG, A8);
    }
  }
  function Au(BB, BD, BA) {
    BA = BA || window || this;
    if (
      k ||
      (BD == BB && !AW(BB)) ||
      typeof BA[BB] == "undefined" ||
      AW(BD) == BA[BB]
    ) {
      return false;
    }
    var BC =
      "\nWARNING: There is a naming conflict, " +
      BB +
      " already exists.\nConsider using the override load-time option, " +
      y +
      '.EnableOverride(),\nor ImportAs with an alias; for example:\n\n\tImportAs ("' +
      BB +
      '1", "' +
      BD +
      '");';
    if (BB == BD) {
      BC += "\n\nThe module is currently inaccessible.\n";
    } else {
      BC +=
        "\n\nThe module can currently be accessed using its fully-qualified name:\n\n\t" +
        BD +
        ".\n";
    }
    G(BC, arguments, Ae);
    return true;
  }
  function AH(BA) {
    return new Function("return /*@cc_on @if(@_jscript)" + BA + "@end @*/;")();
  }
  function T(BD, BB, BC, BA) {
    return r(undefined, BD, BB, BC, BA);
  }
  function r(BL, BE, BA, BJ, BB) {
    l();
    if (!BE || BE == "*") {
      G('ERROR :: ImportAs ("' + BL + '", "' + BE + '")');
      return undefined;
    }
    var BK, BI;
    if (!A4(BL)) {
      BL = "";
    }
    if ((BK = A9(BL, BE))) {
      BE = BK[1];
      BL = BL != A8 ? BK[0] : A8;
      BI = BK[2];
    } else {
      if (!BL) {
        BL = BE.substring(BE.lastIndexOf(".") + 1);
      }
    }
    BB = BB || window || this;
    if (BL == "*") {
      BE = AF.exec(BE)[1];
    } else {
      if (typeof BB[BL] != "undefined" && BL != BE) {
        for (var BM = g ? o.concat(L) : o, BN = BM.length; --BN >= 0; ) {
          if (BL != BM[BN]) {
            continue;
          }
          G(
            'ERROR :: ImportAs ("' +
              BL +
              '", "' +
              BE +
              '")! ' +
              BL +
              " is restricted.",
            arguments
          );
          return BB[BL];
        }
      }
    }
    var BC = BB;
    var BH = "";
    for (var BD = BE.split("."), BG = 0, BF = BD.length; BG < BF; BG++) {
      if (typeof BC[BD[BG]] != "undefined") {
        BC = BC[BD[BG]];
        BH += BD[BG] + ".";
      } else {
        break;
      }
    }
    if (BG >= BF && BL != "*") {
      if (AZ.has(BE) || !Am.has(BE)) {
        BC = AA(BL, BE, BC, BB);
        q(BE);
      }
      return BC;
    }
    if (AZ.has(BE)) {
      if (BL == "*" || BL == A8) {
        BL = BE;
      }
      E(BE, BL);
      Ab(BE);
      return undefined;
    }
    return Ah(BL, BE, BA, BJ, BI, BC, BB);
  }
  function c(BE, BC, BA) {
    var BD,
      BI,
      BG = 0;
    function BF(BJ) {
      BA = BA || 500;
      BJ.start = BB;
      BJ.stop = BH;
      BD = window.setInterval(BH, (BC = BC || 60000));
      return BJ;
    }
    function BB() {
      if (BG >= BA) {
        BH();
        return;
      }
      if (AW(BE)) {
        P();
      } else {
        BI = window.setTimeout(BB, 0);
      }
    }
    function BH() {
      if (undefined != BI) {
        window.clearTimeout(BI);
      }
      if (undefined != BD) {
        window.clearInterval(BD);
      }
    }
    if (this.constructor != c) {
      if (!this.constructor || this.constructor.toString() != c.toString()) {
        return new c(BE, BC, BA);
      }
    }
    return BF(this);
  }
  function A0(BD, BB, BC, BA) {
    if (BD) {
      BD = BD.split(".*").join("");
    }
    return r(BD, BD, BB, BC, BA);
  }
  function At(BA) {
    return (
      BA != undefined &&
      BA != null &&
      (typeof BA == "function" || Function == BA.constructor)
    );
  }
  function A() {
    if (typeof document == "undefined") {
      return false;
    }
    var BA =
      "undefined" != typeof document.write &&
      "undefined" != typeof document.writeln;
    Aw = BA && "undefined" != typeof document.createElement;
    B =
      Aw &&
      "undefined" != typeof document.createTextNode &&
      "undefined" != typeof document.getElementsByTagName &&
      "undefined" !=
        typeof (Ar = document.getElementsByTagName("head")[0]).appendChild &&
      "undefined" != typeof Ar.removeChild;
    a =
      B &&
      "undefined" != typeof document.firstChild &&
      "undefined" != typeof document.lastChild &&
      "undefined" != typeof document.parentNode;
    Y = a && "undefined" != typeof document.ownerDocument;
    return !(BA || Aw || B || a || Y);
  }
  function A4(BA) {
    return (
      BA != null &&
      BA != undefined &&
      (typeof BA == "string" || BA.constructor == String)
    );
  }
  function Ak(BG, BA) {
    var BD = BG == F;
    var BB = AZ.has(BG);
    var BC = w.get(BG);
    function BE() {
      if (BD || Ak(F) || BB) {
        return true;
      }
      AZ.add(BG, BA);
      new c(BG).start();
      return false;
    }
    if (!BC || !(BC = BC.getAll())) {
      return BE();
    }
    for (var BF in BC) {
      if ("undefined" == typeof Object.prototype[BF]) {
        if (!AW(BC[BF])) {
          return false;
        }
      }
    }
    return BE();
  }
  function X(BC, BA, BE, BG, BF, BD, BH) {
    l();
    if (!(BA = AI(BA))) {
      G(
        "ERROR :: Container not found. Unable to load:\n\n[" + BC + "]",
        arguments
      );
      return false;
    }
    if (BC) {
      C.add(unescape(BC));
      if (R) {
        BC = AJ(BC);
      }
    }
    if (!(BD || BH)) {
      BH = "JavaScript";
      BD = "text/javascript";
    }
    if (BG == undefined) {
      BG = false;
    }
    var BB;
    if (Aw && !b) {
      BB = BA.createElement("script");
    }
    if (!BB) {
      if (BE) {
        BE = "window.setTimeout('" + BE + "',0);";
      }
      Q(BC, BA, BE, BG, BF, BD, BH);
      return false;
    }
    if (BG) {
      BB.defer = BG;
    }
    if (BH) {
      BB.language = BH;
    }
    if (BF) {
      BB.title = BF;
    }
    if (BD) {
      BB.type = BD;
    }
    if (BC) {
      G("...\t:: Load [ " + BC + " ]", arguments);
      if (AP || !(A6 || O)) {
        BB.src = BC;
      }
      AE(BA).appendChild(BB);
      if (!AP || A6 || O) {
        BB.src = BC;
      }
      G("DONE\t:: Load [ " + BC + " ]", arguments);
    }
    if (!BE) {
      return true;
    }
    if (BC) {
      X(undefined, BA, BE, BG, BF, BD, BH);
      return true;
    }
    if (typeof BB.canHaveChildren == "undefined" || BB.canHaveChildren) {
      BB.appendChild(BA.createTextNode(BE));
    } else {
      if (!BB.canHaveChildren) {
        BB.text = BE;
      }
    }
    AE(BA).appendChild(BB);
    return false;
  }
  function A2() {
    if (!(d || AX)) {
      return;
    }
    if (AX) {
      X(AY.path + Ai + M, null, null, null, Ai);
    }
    if (!d) {
      return;
    }
    var BB = unescape(window.location.pathname);
    var BA = BB.lastIndexOf(h);
    BB = BB.substring(++BA);
    BA = BB.lastIndexOf(".");
    BA = BA == -1 ? 0 : BA;
    if ("" != (BB = BB.substring(0, BA))) {
      Ai = BB;
    }
    X(Ai + M, null, null, null, Ai);
  }
  function Ag(BB) {
    if (!BB || !A4(BB)) {
      return;
    }
    var BC = BB.lastIndexOf("?") + 1;
    BB = BB.substring(BC).toLowerCase();
    if (BB.length == 0) {
      return;
    }
    var BA;
    if ((BA = f.exec(BB))) {
      A7 = BA[1] == "cloak";
    }
    if ((BA = N.exec(BB))) {
      Ae = BA[1] == "debug";
    }
    if ((BA = An.exec(BB))) {
      J(BA[1] == "legacy");
    }
    if ((BA = m.exec(BB))) {
      d = BA[1] == "mvc";
    }
    if ((BA = AO.exec(BB))) {
      AX = BA[1] == "mvcshare";
    }
    if ((BA = AR.exec(BB))) {
      k = BA[1] == "override";
    }
    if ((BA = I.exec(BB))) {
      R = BA[1] == "refresh";
    }
  }
  function Q(BA, BC, BD, BB, BI, BH, BG) {
    if (!(BC = AI(BC || window || this))) {
      return;
    }
    var BF;
    if (BA) {
      G("...\t:: LoadSimple [ " + BA + " ]", arguments);
      if (BD) {
        BF = BD;
        BD = undefined;
      }
    }
    var BE =
      "<script" +
      (BB ? ' defer="defer"' : "") +
      (BG ? ' language="' + BG + '"' : "") +
      (BI ? ' title="' + BI + '"' : "") +
      (BH ? ' type="' + BH + '"' : "") +
      (BA ? ' src="' + BA + '">' : ">") +
      (BD ? BD + ";" : "") +
      "</script>\n";
    BC.write(BE);
    if (BA) {
      G("DONE\t:: LoadSimple [ " + BA + " ]", arguments);
    }
    if (!(BD = BD || BF)) {
      return;
    }
    if (BA) {
      Q(undefined, BC, BD, BB, BI, BH, BG);
    }
  }
  function G(BE, BG, BD) {
    if (!Ae && !BD) {
      return;
    }
    var BC = /function\s*([^(]*)\s*\(/.exec(BG.callee) || [""],
      BH = BC.length > 1 ? BC[1] : BC[0];
    if (BE != undefined) {
      var BB = u;
      var BA = new Date();
      u =
        [BA.getFullYear(), BA.getMonth() + 1, BA.getDate()].join(".") +
        "," +
        [
          BA.getHours(),
          BA.getMinutes(),
          BA.getSeconds(),
          BA.getMilliseconds(),
        ].join(":") +
        "\t:: " +
        F +
        " :: " +
        BH +
        "\r\n" +
        BE +
        "\r\n\r\n";
      var BF =
        u.indexOf("ERROR") >= 0
          ? "error"
          : u.indexOf("WARN") >= 0
          ? "warn"
          : "info";
      !G.is
        ? (G.is = {
            Firebug: typeof console != "undefined" && At(console.info),
            MochiKit: typeof MochiKit != "undefined" && At(MochiKit.log),
            YAHOO: typeof YAHOO != "undefined" && At(YAHOO.log),
          })
        : 0;
      G.is.Firebug && console[BF](u);
      G.is.YAHOO && YAHOO.log(u, BF);
      G.is.MochiKit &&
        (BF == "info"
          ? MochiKit.log(u)
          : BF == "error"
          ? MochiKit.logError(u)
          : BF == "warn"
          ? MochiKit.logWarning(u)
          : 0);
      u += BB;
    }
    if (BD) {
      Aa();
    }
  }
  function V(BA, BD, BC) {
    var BB =
      BA == "*" || BA == A8
        ? 'Import   ("' + BD + '.*")'
        : BA == BD
        ? 'Include  ("' + BD + '")'
        : 'ImportAs ("' + BA + '", "' + BD + '")';
    G("CHECKING :: " + BB + "...", BC);
  }
  function Ad(BB, BI, BG, BA) {
    l();
    BB = BB || "<default>";
    G('Namespace ("' + BB + '")', arguments);
    var BH = BA || window || this;
    if (BB == "<default>") {
      AY.update(BI, BG);
      G(AY, arguments);
      return BH;
    }
    AQ(BB);
    var BC = BB.split(".");
    for (var BF = 0, BE = BC.length; BF < BE; BF++) {
      BH = typeof BH[BC[BF]] != "undefined" ? BH[BC[BF]] : (BH[BC[BF]] = {});
    }
    var BD = e[BB];
    if (BD) {
      BD.update(BI, BG);
      G(BD, arguments);
      return BH;
    }
    if (!BI) {
      BD = s(BB, BG);
    }
    if (BI || !BD) {
      BD = new z(BI, BG, BB);
    }
    if (BD && !e[BB]) {
      e[BB] = BD;
    }
    G(BD, arguments);
    return BH;
  }
  function z(BK, BH, BB, BI, BE, BJ, BL) {
    function BF(BM) {
      BG();
      BM.hasOption = BD;
      BM.toString = BA;
      BM.update = BC;
      BM.update(BK, BH, BB, BI, BE, BJ, BL);
      return BM;
    }
    function BG() {
      if (!(BK && BK.constructor == z)) {
        return;
      }
      var BM = BK;
      BJ = BM.extension;
      BB = BM.fullName;
      BH = BM.notation;
      BL = BM.options;
      BK = BM.path;
      BI = BM.shortName;
      BE = BM.version;
    }
    function BD(BM) {
      BL = BL || this.options;
      if (!(BL && BM && BL.indexOf(BM) >= 0)) {
        return false;
      }
      var BN = new RegExp(BM, "g").exec(BL);
      return BN && typeof BN[1] != "undefined" && BN[1] == BM;
    }
    function BA() {
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
    function BC(BQ, BP, BR, BM, BN, BS, BO) {
      this.extension = BS || this.extension || M;
      this.fullName = BR || this.fullName || "";
      this.shortName = BM || this.shortName || "";
      this.notation = A4(BP)
        ? BP
        : this.notation || (AY && A4(AY.notation) ? AY.notation : ".");
      this.options = A4(BO) ? BO : this.options || j();
      this.path = A4(BQ) ? BQ : this.path || (AY && A4(AY.path) ? AY.path : "");
      this.uri = this.path + this.fullName.replace(/\x2e/g, this.notation);
      this.version = "" + (BN || this.version || "");
      if (!this.uri) {
        return;
      }
      this.uri += (this.version ? "." + this.version : "") + this.extension;
    }
    if (this.constructor != z) {
      if (!this.constructor || this.constructor.toString() != z.toString()) {
        return new z(BK, BH, BB, BI, BE, BJ, BL);
      }
    }
    return BF(this);
  }
  function AG(BD) {
    var BF = [n.get(""), n.get(BD), n.get(D)];
    if (!BF[0] && !BF[1] && !BF[2]) {
      return;
    }
    var BA = (BF[0] && BF[0].getSize() > 0) || (BF[1] && BF[1].getSize() > 0);
    if (Ae && BA) {
      G("NOTIFY :: Import Listeners for " + BD + "...", arguments);
    }
    for (var BC, BB = BF.length; --BB >= 0; ) {
      if (!BF[BB]) {
        continue;
      }
      BC = BF[BB].getAll();
      for (var BE in BC) {
        if ("undefined" == typeof Object.prototype[BE]) {
          BC[BE](BD);
        }
      }
    }
    if (Ae && BA) {
      G("NOTIFY :: Import Listeners for " + BD + "...DONE!", arguments);
    }
  }
  function AM() {
    Ad(Ay);
    Z((window.Import = T));
    Z((window.ImportAs = r));
    Z((window.Include = A0));
    Z((window.Load = X));
    Z((window.Namespace = Ad));
    Z((AT.AddImportListener = Ac));
    Z((AT.EnableLegacy = J));
    Z(
      (AT.GetVersion = function () {
        return AN;
      })
    );
    Z((AT.RemoveImportListener = Ap));
    Z((AT.SetOption = AV));
    Z((AT.ShowLog = Aa));
    Z((AT.Unload = A1));
    Av("Cloak");
    Av("Debug");
    Av("Override");
    Av("Refresh");
    J(g || false);
  }
  function Av(BA) {
    if (!BA || !A4(BA)) {
      return;
    }
    Z(
      (AT["Enable" + BA] = function (BB) {
        AV(BA, BB);
      })
    );
  }
  function Ap(BA, BE) {
    l();
    if (!BE || !At(BE)) {
      if (At(BA)) {
        BE = BA;
        BA = undefined;
      } else {
        return false;
      }
    } else {
      if (BA && !A4(BA)) {
        return false;
      }
    }
    var BG = [n.get(""), n.get(BA), n.get(D)];
    if (!BG[0] && !BG[1] && !BG[2]) {
      return false;
    }
    var BD = false;
    for (var BC, BB = BG.length; --BB >= 0; ) {
      if (!BG[BB]) {
        continue;
      }
      BC = BG[BB].getAll();
      for (var BF in BC) {
        if ("undefined" == typeof Object.prototype[BF]) {
          if (BC[BF] == BE) {
            BG[BB].remove(BF);
            BD = true;
            break;
          }
        }
      }
    }
    return BD;
  }
  function t(BA) {
    if (!(B && (BA = document.createElement("meta")))) {
      return;
    }
    BA.httpEquiv = Aq + y + " " + AN;
    Aq = Ay.split(".").reverse().join(".");
    BA.content = Aq + " :: Smart scripts that play nice ";
    AE(window.document).appendChild(BA);
  }
  function J(BA) {
    if (BA == undefined) {
      BA = true;
    }
    g = BA;
    AT = AT || AW(y) || {};
    if (BA) {
      AT.DIR_NAMESPACE = AT.USE_PATH = "/";
      AT.DOT_NAMESPACE = AT.USE_NAME = ".";
      Z((AT.CompleteImports = P));
      Z((AT.EnableDebugging = AT.EnableDebug));
      Z((AT.GetPathFor = AC));
      Z((window.JSBasePath = window.JSPath = AT.SetBasePath = U));
      Z((window.JSImport = T));
      Z((window.JSLoad = X));
      Z((window.JSPackaging = AT));
      Z((window.JSPackage = window.Package = Ad));
      Z(
        (window.JSPacked = function (BB) {
          AY.notation = BB;
        })
      );
      Z((window.NamespaceException = window.PackageException = A5));
    }
    if (BA || typeof window["JSPackaging"] == "undefined") {
      return;
    }
    delete AT.DIR_NAMESPACE;
    delete AT.DOT_NAMESPACE;
    delete AT.CompleteImports;
    delete AT.EnableDebugging;
    delete AT.GetPathFor;
    delete AT.SetBasePath;
    delete AT.USE_NAME;
    delete AT.USE_PATH;
    As(L);
  }
  function AV(BA, BB) {
    l();
    if (!BA || !A4(BA)) {
      return;
    }
    BB = BB == undefined ? true : BB;
    BA = BA.toLowerCase();
    switch (BA) {
      case "cloak":
        A7 = BB;
        break;
      case "debug":
        Ae = BB;
        break;
      case "legacy":
        J(BB);
        break;
      case "override":
        k = BB;
        break;
      case "refresh":
        R = BB;
        break;
      default:
        break;
    }
  }
  function AJ(BA) {
    if (/ajile.refresh/g.test(BA)) {
      return BA;
    }
    return BA + (/\?/g.test(BA) ? "&" : "?") + "ajile.refresh=" + Math.random();
  }
  function Aa() {
    l();
    if (!Ae) {
      u =
        "\r\nTo enable debug logging, use <b>" +
        y +
        ".EnableDebug()</b> from within any of your scripts or use " +
        y +
        "'s debug load-time option as follows:<br><br><pre><code>&lt;script src=\"" +
        AY.uri +
        '?<b>debug</b>" type="text/javascript"&gt;&lt;/script&gt;</code></pre>';
    }
    var BC =
      "<html><head><title>" +
      y +
      "'s Debug Log " +
      (!Ae ? ":: DISABLED" : "") +
      '</title>\r\n<style type="text/css">*{background-color:#eee;color:#000;font-family:"Tahoma";font-size:12px;}</style>\r\n</head>\r\n<body>' +
      u.replace(/\r\n/g, "<br>") +
      "</body></html>";
    var BD = screen.width / 1.5;
    var BA = screen.height / 1.5;
    var BB = window.open(
      "",
      "__AJILELOG__",
      "width=" +
        BD +
        ",height=" +
        BA +
        ",addressbar=0,directories=0,location=0,menubar=0,scrollbars=1,statusbar=0,toolbar=0,resizable=1"
    );
    if (!BB) {
      return;
    }
    BB.document.writeln(BC);
    BB.document.close();
  }
  function AS() {
    var BC = {},
      BK = 0;
    function BE(BL) {
      BL.add = BI;
      BL.clear = BG;
      BL.get = BB;
      BL.getAll = BF;
      BL.getAllArray = BA;
      BL.getSize = BJ;
      BL.has = BH;
      BL.remove = BD;
      return BL;
    }
    function BI(BL, BM, BN) {
      if (BB(BL) && !BN) {
        return false;
      }
      BC[BL] = BM;
      BK++;
      return true;
    }
    function BG() {
      for (var BL in BC) {
        if ("undefined" == typeof Object.prototype[BL]) {
          delete BC[BL];
        }
      }
      BK = 0;
    }
    function BB(BL) {
      return typeof Object.prototype[BL] != "undefined" ||
        typeof BC[BL] == "undefined"
        ? undefined
        : BC[BL];
    }
    function BF() {
      return BC;
    }
    function BA() {
      var BM = [];
      for (var BL in BC) {
        if ("undefined" == typeof Object.prototype[BL]) {
          BM[BM.length] = [BL, BC[BL]];
        }
      }
      return BM;
    }
    function BJ() {
      return BK;
    }
    function BH(BL) {
      return (
        typeof Object.prototype[BL] == "undefined" &&
        typeof BC[BL] != "undefined"
      );
    }
    function BD(BL) {
      if (!BH(BL)) {
        return false;
      }
      delete BC[BL];
      BK--;
      return true;
    }
    if (this.constructor != AS) {
      if (!this.constructor || this.constructor.toString() != AS.toString()) {
        return new AS();
      }
    }
    return BE(this);
  }
  function q(BC) {
    var BD = AU.get(BC);
    if (!BD) {
      return;
    }
    BD = BD.getAll();
    var BB;
    for (var BA in BD) {
      if ("undefined" == typeof Object.prototype[BA]) {
        if (AZ.has(BA) && (BB = AW(BA))) {
          if (AA(AZ.get(BA), BA, BB)) {
            q(BA);
          }
        }
      }
    }
  }
  var F = Ay,
    w = new AS(),
    n = new AS(),
    A6 = AH("@_jscript_version"),
    b = typeof ScriptEngine != "undefined" && /InScript/.test(ScriptEngine()),
    O = /Opera/i.test(window.navigator.userAgent),
    AP = /WebKit/i.test(window.navigator.userAgent),
    C = new AS(),
    e = {
      clear: function () {
        for (var BA in this) {
          if ("undefined" == typeof Object.prototype[BA]) {
            delete this[BA];
          }
        }
      },
    },
    AZ = new AS(),
    Am = new AS(),
    AU = new AS();
  Af();
})("1.1.5");
