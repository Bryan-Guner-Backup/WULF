/**----------------------------------------------------------------------------+
| Product:  Ajile [com.iskitz.ajile]
| @version  1.2.1
|+-----------------------------------------------------------------------------+
| @author   Michael A. I. Lee [ http://ajile.iskitz.com/ ]
|
| Created:  Tuesday,   November   4, 2003    [2003.11.04]
| Modified: Sunday,    December  30, 2007    [2007.12.30 - 03:43:30 AM EDT]
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
(function (AO) {
  var Ax, B, b, Z;
  if (typeof Ag != "undefined" && Ag() > 1) {
    return;
  }
  var A8 = true,
    Af = false,
    h = false,
    e = true,
    AY = true,
    l = false,
    S = false;
  var z = "Ajile",
    Ar = "Powered by ",
    Aj = "index",
    M = ".js",
    D = "<*>",
    Az = "com.iskitz.ajile",
    i,
    p = [z, "Import", "ImportAs", "Include", "Load", "Namespace"],
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
  var As,
    AZ,
    A9 = "__LOADED__",
    Ay,
    v = "",
    AU;
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
  var g = /(cloakoff|cloak)/,
    N = /(debugoff|debug)/,
    Ao = /(legacyoff|legacy)/,
    n = /(mvcoff|mvc)/,
    AP = /(mvcshareoff|mvcshare)/,
    AS = /(overrideoff|override)/,
    I = /(refreshoff|refresh)/,
    K = /(.*\/)[^\/]+/,
    AG = /(.*)\.[^\.]+/,
    T = /(\/\.\/)|(\/[^\/]*\/\.\.\/)/,
    q = /:\/\x2f/;
  function Ag(BB) {
    undefined = void 0;
    if (typeof A == "undefined" || typeof AV == "undefined") {
      return 0;
    }
    if ((BB = BB || A())) {
      return 3;
    }
    AZ = new AA(t(Az));
    if (!l && (BB = BB || (AU = AX(Az)))) {
      return 2;
    }
    AZ.version = AO = AO || AZ.version;
    a((AU = AU || {}).constructor);
    a(AH);
    u();
    if (!Ax) {
      AZ.fullName = Az;
      AZ.path = "../lib/ajile/";
      AZ.shortName = z;
    }
    AN();
    Aa.add(Az, z);
    An.add(Az, z);
    AB(z, Az, AU);
    A3();
    y(Az);
    m();
    return 1;
  }
  function A2(BB) {
    if (BB && BB != Az) {
      AE(BB);
      return;
    }
    x.clear();
    o.clear();
    C.clear();
    f.clear();
    Aa.clear();
    An.clear();
    AV.clear();
    m(false);
    y();
    Ay = null;
    At(p.concat(L));
    w(Az);
  }
  function E(BD, BB) {
    if (BD == F) {
      return;
    }
    var BC = x.get(F);
    if (!BC) {
      x.add(F, (BC = new AT()));
    }
    BC.add(BD, BB);
  }
  function Ad(BB, BE) {
    m();
    if (!BE || !Au(BE)) {
      if (Au(BB)) {
        BE = BB;
        BB = undefined;
      } else {
        return false;
      }
    } else {
      if (BB && !A5(BB)) {
        return false;
      }
    }
    if (BB == D && this == window[z]) {
      return false;
    }
    if (!BB && this != window[z]) {
      BB = D;
    }
    var BD = BE;
    if (BB && (An.has(BB) || AX(BB))) {
      return window.setTimeout(function () {
        BD(BB);
      }, 62.25);
    }
    if (!BB) {
      if (An.getSize() > 0 || Aa.getSize() == 0) {
        for (var BF in An.getAll()) {
          window.setTimeout(function () {
            BD(BF);
          }, 62.25);
        }
      }
    }
    var BC = o.get((BB = BB || ""));
    if (!BC) {
      o.add(BB, (BC = new AT()));
    }
    BC.add(Math.random(), BD);
    return true;
  }
  function Ac(BB) {
    if (BB == F) {
      return;
    }
    var BC = AV.get(BB);
    if (!BC) {
      AV.add(BB, (BC = new AT()));
    }
    BC.add(F);
  }
  function y(BC, BD) {
    if (BC && !A5(BC)) {
      return;
    }
    BC = BC || "";
    var BG = AX(BC);
    if (BG) {
      a(Au(BG) ? BG : BG.constructor);
    }
    if (!B) {
      return;
    }
    var BJ = Ap(BC);
    var BF = BJ && BJ.hasOption("cloak");
    for (var BE, BB, BK, BI = Am(), BH = BI.length; --BH >= 0; ) {
      if (!BI[BH]) {
        continue;
      }
      if ((BE = BI[BH].title) && BC && BE != BC) {
        continue;
      }
      BB = BI[BH].src;
      BK = (BB && BB.indexOf(Az) >= 0) || (BE && BE.indexOf(Az) == 0);
      if (BK || (!BB && BE) || BF || A8) {
        Ak(BI[BH], BD);
      }
    }
  }
  function Ak(BC, BB) {
    if (b) {
      Ak = function BD(BG, BF) {
        if ((BF = BF || BG.parentNode)) {
          if (BF.removeChild) {
            BF.removeChild(BG);
          }
        }
      };
    } else {
      if (B) {
        Ak = new Function(
          "element",
          "container",
          'if(container){  try { container.removeChild(element); }catch(e){}  return;}try { document.getElementsByTagName("head")[0].removeChild(element); }catch(e){try { document.body.removeChild(element);}catch(e){}}'
        );
      } else {
        Ak = function BE() {};
      }
    }
    if (BC) {
      Ak(BC, BB);
    }
  }
  function a(BD) {
    if (!BD || typeof BD.toString == "undefined") {
      return;
    }
    var BB = /(function\s*.*\s*\(.*\))/.exec(BD.toString()) || [""],
      BC = BB.length > 1 ? BB[1] : BB[0];
    if (typeof BD.prototype == "undefined") {
      return;
    }
    BD.prototype.constructor.toString = function (BE) {
      return Af && !A8 ? BC : BD.prototype.toString();
    };
  }
  function AM(BC, BB) {
    return BC - BB;
  }
  function Q(BF) {
    var BE, BC;
    if (!(A5(BF) && Aa.has(BF))) {
      BC = Aa.getAllArray();
    } else {
      if (AX(BF)) {
        BC = [[BF, Aa.get(BF)]];
      }
    }
    if (!BC) {
      return;
    }
    for (var BB, BD = BC.length; --BD >= 0; ) {
      BF = BC[BD][0];
      if (!(Aa.has(BF) && (BE = AX(BF)))) {
        continue;
      }
      W((BB = BC[BD][1]), BF, arguments);
      if (BB == "*") {
        BB = undefined;
      }
      AB(BB, BF, BE);
      r(BF);
    }
  }
  function AD(BB) {
    return (
      z +
      ".GetPathFor(" +
      BB +
      ") is not supported. Namespace paths are protected."
    );
  }
  function A6(BB) {
    this.name = "DEPRECATED: " + Az + ".NamespaceException";
    this.message = "DEPRECATED: Invalid _namespace name [" + BB + "]";
    this.toString = BC;
    function BC() {
      return "[ " + this.name + " ] :: " + this.message;
    }
  }
  function V(BB) {
    if (A5(BB)) {
      AZ.path = BB;
    }
  }
  function At(BC) {
    if (!B) {
      for (var BB = BC.length; --BB >= 0; window[BC[BB]] = undefined) {}
    } else {
      (At = new Function(
        "SYS",
        "  try     { for(var i=SYS.length; --i >= 0; delete window[SYS[i]]);      }  catch(e){ for(var j=SYS.length; --j >= 0; window[SYS[j]] = undefined); }"
      ))(BC);
    }
  }
  function w(BF) {
    if (!BF) {
      return;
    }
    var BE = {},
      BC = BF.split("\x2e"),
      BD = window[BC[0]];
    for (var BB = 1; typeof BC[BB] != "undefined"; BB++) {
      if (typeof BD[BC[BB]] == "undefined") {
        break;
      }
      BE[BC[BB - 1]] = [BB, true];
      BD = BD[BC[BB]];
      for (var BG in BD) {
        if ("undefined" == typeof Object.prototype[BG]) {
          if (BG != BC[BB]) {
            BE[BC[BB - 1]][1] = false;
            break;
          }
        }
      }
    }
    for (BD in BE) {
      if ("undefined" == typeof Object.prototype[BD]) {
        if (BE[BD][1]) {
          AE(BC.slice(0, BE[BD][0] + 1).join("."));
        }
      }
    }
  }
  function AE(BD) {
    var BB;
    if (BD) {
      if (!A5(BD)) {
        if ((BD = Ap(BD))) {
          BD = BD.fullName;
          BB = BD.shortName;
        }
      }
      if (!BB && BD) {
        BB = BD.substring(BD.lastIndexOf("\x2e") + 1);
      }
      BD = AG.exec(BD);
      BD = BD ? BD[1] : undefined;
    }
    var BC = AX(BD);
    if (BC && BB) {
      if (BB == "*" || typeof BC[BB] != "undefined") {
        if (BB != "*") {
          if (BC[BB] == window[BB]) {
            window[BB] = undefined;
          }
          delete BC[BB];
        } else {
          for (var BE in BC) {
            if ("undefined" == typeof Object.prototype[BE]) {
              delete BC[BE];
            }
          }
          w(BD);
        }
      }
    }
    y(BD);
  }
  function AR(BF) {
    var BB = BF;
    var BG = Aa.getAllArray();
    for (var BD, BE = 0, BC = BG.length; BE < BC; ++BE) {
      if (An.has((BD = BG[BE][0]))) {
        continue;
      }
      if ("*" != BG[BE][1]) {
        BB = AG.exec(BD);
      }
      if (!(BB && BF == BB[1])) {
        continue;
      }
      An.add((F = BD));
      return;
    }
    F = Aj;
  }
  function m(BB, BD) {
    BD = BD != undefined ? BD : !(BB == false);
    var BC = (BB = BB || window || this).onload;
    if (Au(BC) && P === BC) {
      if (!BD) {
        BB.onload = BC(true);
      }
      return;
    }
    if (BC != P.onLoad) {
      P.onLoad = BC;
    }
    a((BB.onload = P));
  }
  function P(BC) {
    var BB = P.onLoad;
    if (!BB || BC == true) {
      return BB || null;
    }
    Ad(y);
    Q();
    y();
    if (Au(BB)) {
      BB(BC);
    }
    m = function () {};
    return BB;
  }
  function AJ(BB) {
    if (!BB) {
      return window.document;
    }
    if (typeof BB.write == "undefined") {
      if (typeof BB.document != "undefined") {
        BB = BB.document;
      } else {
        if (typeof BB.parentNode != "undefined") {
          return AJ(BB.parentNode);
        } else {
          return window.document;
        }
      }
    }
    return BB;
  }
  function BA(BB, BH) {
    if (!BH) {
      return undefined;
    }
    var BG = BH.split("\x2e");
    var BC;
    for (var BF = BB == BH, BE = 0, BD = BG.length; BE < BD; BE++) {
      if (isNaN(BG[BE])) {
        continue;
      }
      BH = BG.slice(0, BE).join("\x2e");
      BB = BF ? BH : BB || BG.slice(BE - 1, BE)[0];
      BC = BG.slice(BE).join("\x2e");
      break;
    }
    if (!BC) {
      return undefined;
    }
    return [BB, BH, BC];
  }
  function Am(BC) {
    if (!(BC = AJ(BC))) {
      return undefined;
    }
    var BB =
      typeof BC.scripts != "undefined" &&
      typeof BC.scripts.length != "undefined" &&
      BC.scripts.length > 0
        ? BC.scripts
        : typeof BC.getElementsByTagName != "undefined"
        ? BC.getElementsByTagName("script") || []
        : [];
    return BB;
  }
  function AF(BB) {
    if (BB) {
      if ((!Ay || b) && !B) {
        if ((Ay && Z && BB != Ay.ownerDocument) || !Ay || (!Z && b)) {
          if (BB.lastChild && BB.lastChild.firstChild) {
            Ay = BB.lastChild.firstChild;
          }
        }
      } else {
        if (!Ay && B) {
          Ay = As;
        }
      }
    }
    return Ay;
  }
  function X(BD) {
    Ah(BD);
    if (!BD || !A5(BD)) {
      return [];
    }
    var BC = M ? BD.lastIndexOf(M) : BD.lastIndexOf("\x2e");
    if (BC < BD.length && BC >= 0) {
      var BE = BD.slice(BC, BC + M.length);
      var BB = BD.substring(0, BC);
      if (BB && isNaN(BB.charAt(0))) {
        BB = "";
      }
    }
    return [BB, BE];
  }
  function AX(BF, BB) {
    if (!A5(BF)) {
      return undefined;
    }
    var BE = BB || window;
    BF = BF.split("\x2e");
    for (var BD = 0, BC = BF.length; BD < BC; BD++) {
      if (typeof BE[BF[BD]] != "undefined") {
        BE = BE[BF[BD]];
      } else {
        return undefined;
      }
    }
    return BE;
  }
  function Ap(BD) {
    if (!BD) {
      return new AA(AZ);
    }
    var BB = A5(BD);
    for (var BC in f) {
      if ("undefined" == typeof Object.prototype[BC]) {
        if ((BB && BD == BC) || (!BB && BD == AX(BC))) {
          return f[BC];
        }
      }
    }
    return undefined;
  }
  function t(BS, BI) {
    BS = BS || Az;
    if (BS == Az && AZ && AZ.path) {
      return AZ;
    }
    var BK = f[BS];
    if (BK) {
      return BK;
    }
    var BU = AC(BS, BI);
    if ((BK = j(BS, BU))) {
      return (f[BS] = BK);
    }
    var BB = Am();
    if (!(BB && BU)) {
      return undefined;
    }
    var BR;
    for (var BJ = false, BM, BO, BQ = 0, BP = BB.length; BQ < BP; BQ++) {
      BM = unescape(BB[BQ].src);
      if (BM && BM.search(q) == -1) {
        BM = unescape(window.location.href);
        if (BM.charAt(BM.length - 1) != i) {
          if ((BO = K.exec(BM)) != null) {
            if (BO[1].length > BM.search(q) + 3) {
              BM = BO[1];
            }
          }
        }
        BM += unescape(BB[BQ].src);
      }
      if (BM == undefined || BM == null) {
        continue;
      }
      while (T.test(BM)) {
        BM = BM.replace(T, "\x2f");
      }
      if (C.has(BM)) {
        continue;
      }
      C.add(BM);
      if (BJ) {
        continue;
      }
      var BD;
      for (var BE in BU) {
        if (typeof Object.prototype[BE] != "undefined") {
          continue;
        }
        BD = BU[BE];
        var BT,
          BV,
          BG = [];
        for (var BN = BD.length; --BN >= 0; ) {
          BT = BD[BN];
          BV = BM.lastIndexOf(BT) + 1;
          if (BV <= 0 || BV == BG[0]) {
            continue;
          }
          BG[BG.length] = BV;
          G("FOUND :: Path [ " + BM + " ]", arguments);
        }
        if (BG.length == 0) {
          continue;
        }
        BG.sort(AM);
        BV = BG[BG.length - 1];
        BI = BV == BM.lastIndexOf(BT) + 1 ? BE : undefined;
        BR = BM.substring(0, BV);
        BJ = true;
        if (BS == Az && BB[BQ].title != Az) {
          BB[BQ].title = Az;
        }
        var BC = BV + BT.length - 2;
        var BL = X(BM.substring(BC + 1));
        var BH = BL[1];
        var BF = BL[0] || (BS == Az && AO);
        break;
      }
    }
    if (!BR) {
      return undefined;
    }
    BK = new AA(BR, BI, BS, undefined, BF, BH);
    f[BS] = BK;
    return BK;
  }
  function j(BR, BS) {
    var BJ = Number.MAX_VALUE;
    var BL;
    var BC = [];
    var BM;
    var BF = 0;
    BS = BS || AC(BR);
    var BH = [];
    var BP = C.getAll();
    BP: for (var BN in BP) {
      if (typeof Object.prototype[BN] != "undefined") {
        continue;
      }
      for (var BE in BS) {
        if (typeof Object.prototype[BE] != "undefined") {
          continue;
        }
        BH[BH.length] = BE;
        for (var BD = BS[BE], BQ = BD.length; --BQ >= 0; ) {
          if (0 < (BM = BN.lastIndexOf(BD[BQ]))) {
            BL = BN.length - (BM + BD[BQ].length);
            if (BL < BJ) {
              BJ = BL;
              BF = BC.length;
            }
            BC[BC.length] = BM + 1;
            var BB = BM + 1 + BD[BQ].length - 2;
            var BO = X(BN.substring(BB + 1));
            var BI = BO[1];
            var BG = BO[0];
            G("FOUND :: Cached Path [ " + BN + " ]", arguments);
            break BP;
          }
          if (BQ == 0) {
            delete BH[--BH.length];
          }
        }
      }
    }
    if (!BC || BC.length == 0) {
      return undefined;
    }
    BN = BN.substring(0, BC[BF]);
    var BK = new AA(BN, BH[BF], BR, undefined, BG, BI);
    if (BK.path) {
      f[BR] = BK;
    }
    return BK;
  }
  function AC(BD, BF) {
    var BG = i || A0();
    var BB = BF == undefined ? H : [BF];
    var BE = {};
    for (var BC = BB.length; --BC >= 0; ) {
      BF = BB[BC];
      BE[BF] = [];
      BE[BF][2] = BG + BD.replace(/\x2e/g, BF);
      BE[BF][0] = BE[BF][2] + BF;
      BE[BF][1] = BE[BF][2] + BG;
      BE[BF][2] = BE[BF][2] + "\x2e";
    }
    return BE;
  }
  function k() {
    return [
      A8 ? "cloak" : "cloakoff",
      Af ? "debug" : "debugoff",
      h ? "legacy" : "legacyoff",
      e ? "mvc" : "mvcoff",
      AY ? "mvcshare" : "mvcshareoff",
      l ? "override" : "overrideoff",
      S ? "refresh" : "refreshoff",
    ].join(",");
  }
  function A0(BD) {
    if (!BD && i) {
      return i;
    }
    var BE = unescape(window.location.href);
    var BB = BE.lastIndexOf("\x5c") + 1;
    var BC = BE.lastIndexOf("\x2f") + 1;
    i = BB > BC ? "\x5c" : "\x2f";
    return i;
  }
  function Ai(BC, BI, BF, BH, BE, BG, BB) {
    if (!Aa.add(BI, BC)) {
      return BG;
    }
    E(BI, BC == "*" ? BI : BC);
    Ac(BI);
    if (BC == "*") {
      (BC = A9), G('...\t:: Import ("' + BI + '.*")', arguments);
    } else {
      if (BC == BI) {
        G('...\t:: Include ("' + BC + '")', arguments);
      } else {
        G('...\t:: ImportAs ("' + BC + '", "' + BI + '")', arguments);
      }
    }
    BF = AL(BC, BI, BF, BH, BE);
    var BD = Y(
      BF,
      AJ(BB || window || this),
      'ImportAs("' + BC + '", "' + BI + '");',
      false,
      BI
    );
    if (BD) {
      new d(BI).start();
    }
    return BG;
  }
  function AL(BB, BI, BE, BH, BC) {
    var BG = BI + (BB == "*" ? ".*" : "");
    var BD = BG;
    var BF;
    do {
      if ((BG = AG.exec(BG))) {
        BG = BG[1];
      } else {
        break;
      }
      if (BG == BD) {
        break;
      }
      BD = BG;
      BF = t(BG);
    } while (!BF);
    if (!A5(BE)) {
      BE =
        BF != undefined && BF != null && typeof BF.path != "undefined"
          ? BF.path
          : AZ.path || "";
    }
    if (BE.lastIndexOf("\x2f") != BE.length - 1) {
      BE += "\x2f";
    }
    if (h) {
      if (BH == false) {
        BH = "\x2f";
      } else {
        if (BH == true) {
          BH = "\x2e";
        }
      }
    }
    if (BH == null || undefined == BH) {
      BH = BF
        ? "undefined" == typeof BF.notation
          ? AZ.notation
          : BF.notation
        : AZ.notation;
    }
    BE += escape(BI.replace(/\x2e/g, BH));
    if (BC) {
      BE += "\x2e" + BC;
    }
    BE += M;
    if (BF && BF.hasOption("refresh")) {
      BE = AK(BE);
    }
    return BE;
  }
  function AB(BC, BH, BF, BB) {
    BB = BB || window || this;
    if (!BF) {
      return BF;
    }
    if (BC != A9 && Av(BC, BH, BB)) {
      Aa.remove(BH);
      return BF;
    }
    if (!Al(BH, BC)) {
      return undefined;
    }
    var BD = [],
      BG = Aa.get(BH),
      BE = BC == BH || BG == BH;
    if (BC && BC != A9 && (!BG || (BG != "*" && BG != A9))) {
      if (BE) {
        BD[0] = 'SUCCESS :: Include ("' + BH + '")';
      } else {
        (BB[BC] = BF),
          (BD[0] = 'SUCCESS :: ImportAs ("' + BC + '", "' + BH + '")');
      }
      Aa.remove(BH);
      An.add(BH, BC);
    } else {
      if (BG == "*") {
        A4(BC, BH, BF, BB, BE, BD);
      } else {
        if (BG != "*" && (BG == A9 || BC == A9)) {
          BD[0] =
            "SUCCESS :: " + (BE ? "Include" : "Import") + ' ("' + BH + '.*")';
          Aa.remove(BH);
          An.add(BH, "*");
        }
      }
    }
    if (BD.length > 0) {
      G(BD.join("\r\n"), arguments);
    }
    AH(BH);
    return BF;
  }
  function A4(BC, BH, BF, BB, BE, BD) {
    BD[BD.length] = " ";
    if (!BE) {
      var BG;
      for (var BI in BF) {
        if (typeof Object.prototype[BI] != "undefined") {
          continue;
        }
        BG = BH + "." + BI;
        if (f[BG] || Av(BI, BG, BB)) {
          continue;
        }
        BB[BI] = BF[BI];
        BD[BD.length] = 'SUCCESS :: ImportAs ("' + BI + '", "' + BG + '")';
      }
    }
    Aa.remove(BH);
    if (BC != A9) {
      Aa.add(BH, A9);
    }
  }
  function Av(BC, BE, BB) {
    BB = BB || window || this;
    if (
      l ||
      (BE == BC && !AX(BC)) ||
      typeof BB[BC] == "undefined" ||
      AX(BE) == BB[BC]
    ) {
      return false;
    }
    var BD =
      "\nWARNING: There is a naming conflict, " +
      BC +
      " already exists.\nConsider using the override load-time option, " +
      z +
      '.EnableOverride(),\nor ImportAs with an alias; for example:\n\n\tImportAs ("' +
      BC +
      '1", "' +
      BE +
      '");';
    if (BC == BE) {
      BD += "\n\nThe module is currently inaccessible.\n";
    } else {
      BD +=
        "\n\nThe module can currently be accessed using its fully-qualified name:\n\n\t" +
        BE +
        ".\n";
    }
    G(BD, arguments, Af);
    return true;
  }
  function AI(BB) {
    return new Function("return /*@cc_on @if(@_jscript)" + BB + "@end @*/;")();
  }
  function U(BE, BC, BD, BB) {
    return s(undefined, BE, BC, BD, BB);
  }
  function s(BM, BF, BB, BK, BC) {
    m();
    if (!BF || BF == "*") {
      G('ERROR :: ImportAs ("' + BM + '", "' + BF + '")');
      return undefined;
    }
    var BL, BJ;
    if (!A5(BM)) {
      BM = "";
    }
    if ((BL = BA(BM, BF))) {
      BF = BL[1];
      BM = BM != A9 ? BL[0] : A9;
      BJ = BL[2];
    } else {
      if (!BM) {
        BM = BF.substring(BF.lastIndexOf("\x2e") + 1);
      }
    }
    BC = BC || window || this;
    if (BM == "*") {
      BF = AG.exec(BF)[1];
    } else {
      if (typeof BC[BM] != "undefined" && BM != BF) {
        for (var BN = h ? p.concat(L) : p, BO = BN.length; --BO >= 0; ) {
          if (BM != BN[BO]) {
            continue;
          }
          G(
            'ERROR :: ImportAs ("' +
              BM +
              '", "' +
              BF +
              '")! ' +
              BM +
              " is restricted.",
            arguments
          );
          return BC[BM];
        }
      }
    }
    var BD = BC;
    var BI = "";
    for (var BE = BF.split("\x2e"), BH = 0, BG = BE.length; BH < BG; BH++) {
      if (typeof BD[BE[BH]] != "undefined") {
        BD = BD[BE[BH]];
        BI += BE[BH] + "\x2e";
      } else {
        break;
      }
    }
    if (BH >= BG && BM != "*") {
      if (Aa.has(BF) || !An.has(BF)) {
        BD = AB(BM, BF, BD, BC);
        r(BF);
      }
      return BD;
    }
    if (Aa.has(BF)) {
      if (BM == "*" || BM == A9) {
        BM = BF;
      }
      E(BF, BM);
      Ac(BF);
      return undefined;
    }
    return Ai(BM, BF, BB, BK, BJ, BD, BC);
  }
  function d(BF, BD, BB) {
    var BE,
      BJ,
      BH = 0;
    function BG(BK) {
      BB = BB || 500;
      BK.start = BC;
      BK.stop = BI;
      BE = window.setInterval(BI, (BD = BD || 60000));
      return BK;
    }
    function BC() {
      if (BH >= BB) {
        BI();
        return;
      }
      if (AX(BF)) {
        Q();
      } else {
        BJ = window.setTimeout(BC, 0);
      }
    }
    function BI() {
      if (undefined != BJ) {
        window.clearTimeout(BJ);
      }
      if (undefined != BE) {
        window.clearInterval(BE);
      }
    }
    if (this.constructor != d) {
      if (!this.constructor || this.constructor.toString() != d.toString()) {
        return new d(BF, BD, BB);
      }
    }
    return BG(this);
  }
  function A1(BE, BC, BD, BB) {
    if (BE) {
      BE = BE.split(".*").join("");
    }
    return s(BE, BE, BC, BD, BB);
  }
  function Au(BB) {
    return (
      BB != undefined &&
      BB != null &&
      (typeof BB == "function" || Function == BB.constructor)
    );
  }
  function A() {
    if (typeof document == "undefined") {
      return false;
    }
    var BB =
      "undefined" != typeof document.write &&
      "undefined" != typeof document.writeln;
    Ax = BB && "undefined" != typeof document.createElement;
    B =
      Ax &&
      "undefined" != typeof document.createTextNode &&
      "undefined" != typeof document.getElementsByTagName &&
      "undefined" !=
        typeof (As = document.getElementsByTagName("head")[0]).appendChild &&
      "undefined" != typeof As.removeChild;
    b =
      B &&
      "undefined" != typeof document.firstChild &&
      "undefined" != typeof document.lastChild &&
      "undefined" != typeof document.parentNode;
    Z = b && "undefined" != typeof document.ownerDocument;
    return !(BB || Ax || B || b || Z);
  }
  function A5(BB) {
    return (
      BB != null &&
      BB != undefined &&
      (typeof BB == "string" || BB.constructor == String)
    );
  }
  function Al(BH, BB) {
    var BE = BH == F;
    var BC = Aa.has(BH);
    var BD = x.get(BH);
    function BF() {
      if (BE || Al(F) || BC) {
        return true;
      }
      Aa.add(BH, BB);
      new d(BH).start();
      return false;
    }
    if (!BD || !(BD = BD.getAll())) {
      return BF();
    }
    for (var BG in BD) {
      if ("undefined" == typeof Object.prototype[BG]) {
        if (!AX(BD[BG])) {
          return false;
        }
      }
    }
    return BF();
  }
  function Y(BD, BB, BF, BH, BG, BE, BI) {
    m();
    if (!(BB = AJ(BB))) {
      G(
        "ERROR :: Container not found. Unable to load:\n\n[" + BD + "]",
        arguments
      );
      return false;
    }
    if (BD) {
      C.add(unescape(BD));
      if (S) {
        BD = AK(BD);
      }
    }
    if (!(BE || BI)) {
      BI = "JavaScript";
      BE = "text/javascript";
    }
    if (BH == undefined) {
      BH = false;
    }
    var BC;
    if (Ax && !c) {
      BC = BB.createElement("script");
    }
    if (!BC) {
      if (BF) {
        BF = "window.setTimeout('" + BF + "',0);";
      }
      R(BD, BB, BF, BH, BG, BE, BI);
      return false;
    }
    if (BH) {
      BC.defer = BH;
    }
    if (BI) {
      BC.language = BI;
    }
    if (BG) {
      BC.title = BG;
    }
    if (BE) {
      BC.type = BE;
    }
    if (BD) {
      G("...\t:: Load [ " + BD + " ]", arguments);
      if (AQ || !(A7 || O)) {
        BC.src = BD;
      }
      AF(BB).appendChild(BC);
      if (!AQ || A7 || O) {
        BC.src = BD;
      }
      G("DONE\t:: Load [ " + BD + " ]", arguments);
    }
    if (!BF) {
      return true;
    }
    if (BD) {
      Y(undefined, BB, BF, BH, BG, BE, BI);
      return true;
    }
    if (typeof BC.canHaveChildren == "undefined" || BC.canHaveChildren) {
      BC.appendChild(BB.createTextNode(BF));
    } else {
      if (!BC.canHaveChildren) {
        BC.text = BF;
      }
    }
    AF(BB).appendChild(BC);
    return false;
  }
  function A3() {
    if (!(e || AY)) {
      return;
    }
    if (AY) {
      Y(AZ.path + Aj + M, null, null, null, Aj);
    }
    if (!e) {
      return;
    }
    var BC = unescape(window.location.pathname);
    var BB = BC.lastIndexOf(i);
    BC = BC.substring(++BB);
    BB = BC.lastIndexOf("\x2e");
    BB = BB == -1 ? 0 : BB;
    if ("" != (BC = BC.substring(0, BB))) {
      Aj = BC;
    }
    Y(Aj + M, null, null, null, Aj);
  }
  function Ah(BC) {
    if (!BC || !A5(BC)) {
      return;
    }
    var BD = BC.lastIndexOf("?") + 1;
    BC = BC.substring(BD).toLowerCase();
    if (BC.length == 0) {
      return;
    }
    var BB;
    if ((BB = g.exec(BC))) {
      A8 = BB[1] == "cloak";
    }
    if ((BB = N.exec(BC))) {
      Af = BB[1] == "debug";
    }
    if ((BB = Ao.exec(BC))) {
      J(BB[1] == "legacy");
    }
    if ((BB = n.exec(BC))) {
      e = BB[1] == "mvc";
    }
    if ((BB = AP.exec(BC))) {
      AY = BB[1] == "mvcshare";
    }
    if ((BB = AS.exec(BC))) {
      l = BB[1] == "override";
    }
    if ((BB = I.exec(BC))) {
      S = BB[1] == "refresh";
    }
  }
  function R(BB, BD, BE, BC, BJ, BI, BH) {
    if (!(BD = AJ(BD || window || this))) {
      return;
    }
    var BG;
    if (BB) {
      G("...\t:: LoadSimple [ " + BB + " ]", arguments);
      if (BE) {
        BG = BE;
        BE = undefined;
      }
    }
    var BF =
      "<script" +
      (BC ? ' defer="defer"' : "") +
      (BH ? ' language="' + BH + '"' : "") +
      (BJ ? ' title="' + BJ + '"' : "") +
      (BI ? ' type="' + BI + '"' : "") +
      (BB ? ' src="' + BB + '">' : ">") +
      (BE ? BE + ";" : "") +
      "</script>\n";
    BD.write(BF);
    if (BB) {
      G("DONE\t:: LoadSimple [ " + BB + " ]", arguments);
    }
    if (!(BE = BE || BG)) {
      return;
    }
    if (BB) {
      R(undefined, BD, BE, BC, BJ, BI, BH);
    }
  }
  function G(BF, BH, BE) {
    if (!Af && !BE) {
      return;
    }
    var BD = /function\s*([^(]*)\s*\(/.exec(BH.callee) || [""],
      BI = BD.length > 1 ? BD[1] : BD[0];
    if (BF != undefined) {
      var BC = v;
      var BB = new Date();
      v =
        [BB.getFullYear(), BB.getMonth() + 1, BB.getDate()].join(".") +
        "," +
        [
          BB.getHours(),
          BB.getMinutes(),
          BB.getSeconds(),
          BB.getMilliseconds(),
        ].join(":") +
        "\t:: " +
        F +
        " :: " +
        BI +
        "\r\n" +
        BF +
        "\r\n\r\n";
      var BG =
        v.indexOf("ERROR") >= 0
          ? "error"
          : v.indexOf("WARN") >= 0
          ? "warn"
          : "info";
      !G.is
        ? (G.is = {
            Firebug: typeof console != "undefined" && Au(console.info),
            MochiKit: typeof MochiKit != "undefined" && Au(MochiKit.log),
            YAHOO: typeof YAHOO != "undefined" && Au(YAHOO.log),
          })
        : 0;
      G.is.Firebug && console[BG](v);
      G.is.YAHOO && YAHOO.log(v, BG);
      G.is.MochiKit &&
        (BG == "info"
          ? MochiKit.log(v)
          : BG == "error"
          ? MochiKit.logError(v)
          : BG == "warn"
          ? MochiKit.logWarning(v)
          : 0);
      v += BC;
    }
    if (BE) {
      Ab();
    }
  }
  function W(BB, BE, BD) {
    var BC =
      BB == "*" || BB == A9
        ? 'Import   ("' + BE + '.*")'
        : BB == BE
        ? 'Include  ("' + BE + '")'
        : 'ImportAs ("' + BB + '", "' + BE + '")';
    G("CHECKING :: " + BC + "...", BD);
  }
  function Ae(BC, BJ, BH, BB) {
    m();
    BC = BC || "\x3cdefault\x3e";
    G('Namespace ("' + BC + '")', arguments);
    var BI = BB || window || this;
    if (BC == "\x3cdefault\x3e") {
      AZ.update(BJ, BH);
      G(AZ, arguments);
      return BI;
    }
    AR(BC);
    var BD = BC.split("\x2e");
    for (var BG = 0, BF = BD.length; BG < BF; BG++) {
      BI = typeof BI[BD[BG]] != "undefined" ? BI[BD[BG]] : (BI[BD[BG]] = {});
    }
    var BE = f[BC];
    if (BE) {
      BE.update(BJ, BH);
      G(BE, arguments);
      return BI;
    }
    if (!BJ) {
      BE = t(BC, BH);
    }
    if (BJ || !BE) {
      BE = new AA(BJ, BH, BC);
    }
    if (BE && !f[BC]) {
      f[BC] = BE;
    }
    G(BE, arguments);
    return BI;
  }
  function AA(BL, BI, BC, BJ, BF, BK, BM) {
    function BG(BN) {
      BH();
      BN.hasOption = BE;
      BN.toString = BB;
      BN.update = BD;
      BN.update(BL, BI, BC, BJ, BF, BK, BM);
      return BN;
    }
    function BH() {
      if (!(BL && BL.constructor == AA)) {
        return;
      }
      var BN = BL;
      BK = BN.extension;
      BC = BN.fullName;
      BI = BN.notation;
      BM = BN.options;
      BL = BN.path;
      BJ = BN.shortName;
      BF = BN.version;
    }
    function BE(BN) {
      BM = BM || this.options;
      if (!(BM && BN && BM.indexOf(BN) >= 0)) {
        return false;
      }
      var BO = new RegExp(BN, "g").exec(BM);
      return BO && typeof BO[1] != "undefined" && BO[1] == BN;
    }
    function BB() {
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
    function BD(BR, BQ, BS, BN, BO, BT, BP) {
      this.extension = BT || this.extension || M;
      this.fullName = BS || this.fullName || "";
      this.shortName = BN || this.shortName || "";
      this.notation = A5(BQ)
        ? BQ
        : this.notation || (AZ && A5(AZ.notation) ? AZ.notation : "\x2e");
      this.options = A5(BP) ? BP : this.options || k();
      this.path = A5(BR) ? BR : this.path || (AZ && A5(AZ.path) ? AZ.path : "");
      this.uri = this.path + this.fullName.replace(/\x2e/g, this.notation);
      this.version = "" + (BO || this.version || "");
      if (!this.uri) {
        return;
      }
      this.uri += (this.version ? "\x2e" + this.version : "") + this.extension;
    }
    if (this.constructor != AA) {
      if (!this.constructor || this.constructor.toString() != AA.toString()) {
        return new AA(BL, BI, BC, BJ, BF, BK, BM);
      }
    }
    return BG(this);
  }
  function AH(BE) {
    var BG = [o.get(""), o.get(BE), o.get(D)];
    if (!BG[0] && !BG[1] && !BG[2]) {
      return;
    }
    var BB = (BG[0] && BG[0].getSize() > 0) || (BG[1] && BG[1].getSize() > 0);
    if (Af && BB) {
      G("NOTIFY :: Import Listeners for " + BE + "...", arguments);
    }
    for (var BD, BC = BG.length; --BC >= 0; ) {
      if (!BG[BC]) {
        continue;
      }
      BD = BG[BC].getAll();
      for (var BF in BD) {
        if ("undefined" == typeof Object.prototype[BF]) {
          if (Au(BD[BF])) {
            BD[BF](BE);
          }
        }
      }
    }
    if (Af && BB) {
      G("NOTIFY :: Import Listeners for " + BE + "...DONE!", arguments);
    }
  }
  function AN() {
    Ae(Az);
    a((window.Import = U));
    a((window.ImportAs = s));
    a((window.Include = A1));
    a((window.Load = Y));
    a((window.Namespace = Ae));
    a((AU.AddImportListener = Ad));
    a((AU.EnableLegacy = J));
    a(
      (AU.GetVersion = function () {
        return AO;
      })
    );
    AU.GetVersion.toString = AU.GetVersion.prototype.toString = AU.GetVersion;
    a((AU.RemoveImportListener = Aq));
    a((AU.SetOption = AW));
    a((AU.ShowLog = Ab));
    a((AU.Unload = A2));
    Aw("Cloak");
    Aw("Debug");
    Aw("Override");
    Aw("Refresh");
    J(h || false);
  }
  function Aw(BB) {
    if (!BB || !A5(BB)) {
      return;
    }
    a(
      (AU["Enable" + BB] = function (BC) {
        AW(BB, BC);
      })
    );
  }
  function Aq(BB, BF) {
    m();
    if (!BF || !Au(BF)) {
      if (Au(BB)) {
        BF = BB;
        BB = undefined;
      } else {
        return false;
      }
    } else {
      if (BB && !A5(BB)) {
        return false;
      }
    }
    var BH = [o.get(""), o.get(BB), o.get(D)];
    if (!BH[0] && !BH[1] && !BH[2]) {
      return false;
    }
    var BE = false;
    for (var BD, BC = BH.length; --BC >= 0; ) {
      if (!BH[BC]) {
        continue;
      }
      BD = BH[BC].getAll();
      for (var BG in BD) {
        if ("undefined" == typeof Object.prototype[BG]) {
          if (BD[BG] == BF) {
            BH[BC].remove(BG);
            BE = true;
            break;
          }
        }
      }
    }
    return BE;
  }
  function u(BB) {
    if (!(B && (BB = document.createElement("meta")))) {
      return;
    }
    BB.httpEquiv = Ar + z + " " + AO;
    Ar = Az.split("\x2e").reverse().join("\x2e");
    BB.content = Ar + " :: Smart scripts that play nice ";
    AF(window.document).appendChild(BB);
  }
  function J(BB) {
    if (BB == undefined) {
      BB = true;
    }
    h = BB;
    AU = AU || AX(z) || {};
    if (BB) {
      AU.DIR_NAMESPACE = AU.USE_PATH = "\x2f";
      AU.DOT_NAMESPACE = AU.USE_NAME = "\x2e";
      a((AU.CompleteImports = Q));
      a((AU.EnableDebugging = AU.EnableDebug));
      a((AU.GetPathFor = AD));
      a((window.JSBasePath = window.JSPath = AU.SetBasePath = V));
      a((window.JSImport = U));
      a((window.JSLoad = Y));
      a((window.JSPackaging = AU));
      a((window.JSPackage = window.Package = Ae));
      a(
        (window.JSPacked = function (BC) {
          AZ.notation = BC;
        })
      );
      a((window.NamespaceException = window.PackageException = A6));
    }
    if (BB || typeof window["JSPackaging"] == "undefined") {
      return;
    }
    delete AU.DIR_NAMESPACE;
    delete AU.DOT_NAMESPACE;
    delete AU.CompleteImports;
    delete AU.EnableDebugging;
    delete AU.GetPathFor;
    delete AU.SetBasePath;
    delete AU.USE_NAME;
    delete AU.USE_PATH;
    At(L);
  }
  function AW(BB, BC) {
    m();
    if (!BB || !A5(BB)) {
      return;
    }
    BC = BC == undefined ? true : BC;
    BB = BB.toLowerCase();
    switch (BB) {
      case "cloak":
        A8 = BC;
        break;
      case "debug":
        Af = BC;
        break;
      case "legacy":
        J(BC);
        break;
      case "override":
        l = BC;
        break;
      case "refresh":
        S = BC;
        break;
      default:
        break;
    }
  }
  function AK(BB) {
    if (/ajile.refresh/g.test(BB)) {
      return BB;
    }
    return BB + (/\?/g.test(BB) ? "&" : "?") + "ajile.refresh=" + Math.random();
  }
  function Ab() {
    m();
    if (A7 && !B) {
      return;
    }
    if (!Af) {
      v =
        "\r\nTo enable debug logging, use <b>" +
        z +
        ".EnableDebug()</b> from within any of your scripts or use " +
        z +
        "'s debug load-time option as follows:<br><br><pre><code>&lt;script src=\"" +
        AZ.uri +
        '?<b>debug</b>" type="text/javascript"&gt;&lt;/script&gt;</code></pre>';
    }
    var BD =
      "<html><head><title>" +
      z +
      "'s Debug Log " +
      (!Af ? ":: DISABLED" : "") +
      '</title>\r\n<style type="text/css">*{background-color:#eee;color:#000;font-family:"Tahoma";font-size:12px;}</style>\r\n</head>\r\n<body>' +
      v.replace(/\r\n/g, "<br>") +
      "</body></html>";
    var BE = screen.width / 1.5;
    var BB = screen.height / 1.5;
    var BC = Ab.window
      ? Ab.window
      : (Ab.window = window.open(
          "",
          "__AJILELOG__",
          "width=" +
            BE +
            ",height=" +
            BB +
            ",addressbar=0,directories=0,location=0,menubar=0,scrollbars=1,statusbar=0,toolbar=0,resizable=1"
        ));
    if (!(BC && BC.document)) {
      return;
    }
    BC.document.open();
    BC.document.writeln(BD);
    BC.document.close();
  }
  function AT() {
    var BD = {},
      BL = 0;
    function BF(BM) {
      BM.add = BJ;
      BM.clear = BH;
      BM.get = BC;
      BM.getAll = BG;
      BM.getAllArray = BB;
      BM.getSize = BK;
      BM.has = BI;
      BM.remove = BE;
      return BM;
    }
    function BJ(BM, BN, BO) {
      if (BC(BM) && !BO) {
        return false;
      }
      BD[BM] = BN;
      BL++;
      return true;
    }
    function BH() {
      for (var BM in BD) {
        if ("undefined" == typeof Object.prototype[BM]) {
          delete BD[BM];
        }
      }
      BL = 0;
    }
    function BC(BM) {
      return typeof Object.prototype[BM] != "undefined" ||
        typeof BD[BM] == "undefined"
        ? undefined
        : BD[BM];
    }
    function BG() {
      return BD;
    }
    function BB() {
      var BN = [];
      for (var BM in BD) {
        if ("undefined" == typeof Object.prototype[BM]) {
          BN[BN.length] = [BM, BD[BM]];
        }
      }
      return BN;
    }
    function BK() {
      return BL;
    }
    function BI(BM) {
      return (
        typeof Object.prototype[BM] == "undefined" &&
        typeof BD[BM] != "undefined"
      );
    }
    function BE(BM) {
      if (!BI(BM)) {
        return false;
      }
      delete BD[BM];
      BL--;
      return true;
    }
    if (this.constructor != AT) {
      if (!this.constructor || this.constructor.toString() != AT.toString()) {
        return new AT();
      }
    }
    return BF(this);
  }
  function r(BD) {
    var BE = AV.get(BD);
    if (!BE) {
      return;
    }
    BE = BE.getAll();
    var BC;
    for (var BB in BE) {
      if ("undefined" == typeof Object.prototype[BB]) {
        if (Aa.has(BB) && (BC = AX(BB))) {
          if (AB(Aa.get(BB), BB, BC)) {
            r(BB);
          }
        }
      }
    }
  }
  var F = Az,
    x = new AT(),
    o = new AT(),
    A7 = AI("@_jscript_version"),
    c = typeof ScriptEngine != "undefined" && /InScript/.test(ScriptEngine()),
    O = /Opera/i.test(window.navigator.userAgent),
    AQ = /WebKit/i.test(window.navigator.userAgent),
    C = new AT(),
    f = {
      clear: function () {
        for (var BB in this) {
          if ("undefined" == typeof Object.prototype[BB]) {
            delete this[BB];
          }
        }
      },
    },
    Aa = new AT(),
    An = new AT(),
    AV = new AT();
  Ag();
})("1.2.1");
