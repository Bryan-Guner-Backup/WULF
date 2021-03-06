/**----------------------------------------------------------------------------+
| Product:  ajile [com.iskitz.ajile]
| @version  1.6.8
|+-----------------------------------------------------------------------------+
| @author   Michael A. I. Lee [iskitz.com]
|
| Created:  Tuesday,   November   4, 2003    [2003.11.04]
| Updated:  Tuesday,   February   5, 2013    [2013.02.05.03.51-08.00]
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
(function (AS, Z, c) {
  var A2, B, e, b;
  if (typeof Ak != "undefined" && Ak() > 1) {
    return;
  }
  var BE = true,
    Aj = false,
    k = false,
    h = true,
    Ac = true,
    o = false,
    T = false;
  var AD = "Ajile",
    Aw = "Powered by ",
    An = "index",
    N = ".js",
    E = "<*>",
    A5 = "com.iskitz.ajile",
    l,
    s = [AD, "Import", "ImportAs", "Include", "Load", "Namespace"],
    M = [
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
  var Ax,
    Ad,
    BF = "__LOADED__",
    A3,
    y = "",
    AY;
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
  var j = /(cloakoff|cloak)/,
    O = /(debugoff|debug)/,
    As = /(legacyoff|legacy)/,
    q = /(mvcoff|mvc)/,
    AT = /(mvcshareoff|mvcshare)/,
    AW = /(overrideoff|override)/,
    J = /(refreshoff|refresh)/,
    L = /(.*\/)[^\/]+/,
    AK = /(.*)\.[^\.]+/,
    U = /(\/\.\/)|(\/[^\/]*\/\.\.\/)/,
    t = /:\/\x2f/;
  function Ak(BH) {
    if (typeof A == "undefined" || typeof AZ == "undefined") {
      return 0;
    }
    if ((BH = BH || A())) {
      return 3;
    }
    Ad = new AE(w(A5));
    if (!o && (BH = BH || (AY = Ab(A5)))) {
      return 2;
    }
    Ad.version = AS = AS || Ad.version;
    d((AY = AY || {}).constructor);
    d(AL);
    x();
    if (!A2) {
      Ad.fullName = A5;
      Ad.path = "/use/";
      Ad.shortName = AD;
    }
    Ah(AB);
    AR();
    Ae.add(A5, AD);
    Ar.add(A5, AD);
    AF(AD, A5, AY);
    A9();
    return 1;
  }
  function A7(BH) {
    if (BH && BH != A5) {
      AI(BH);
      return;
    }
    Av(AB);
    AA.clear();
    r.clear();
    C.clear();
    i.clear();
    Ae.clear();
    Ar.clear();
    AZ.clear();
    p(false);
    AB();
    A3 = null;
    Ay(s.concat(M));
    z(A5);
  }
  function F(BJ, BH) {
    if (BJ == G) {
      return;
    }
    var BI = AA.get(G);
    !BI && (BI = new AX()) && AA.add(G, BI);
    BI.add(BJ, BH);
  }
  function Ah(BH, BJ) {
    p();
    var BL,
      BM = [];
    switch (true) {
      case !BJ || !Az(BJ):
        if (!Az(BH)) {
          return false;
        }
        BJ = BH;
        BH = c;
        break;
      case !!BH && !BB(BH):
        if (!D(BH) || !Az(BJ)) {
          return false;
        }
        BL = AC(BH, BJ, BM);
        BH = c;
        break;
    }
    if (BH == E && this == Z[AD]) {
      return false;
    }
    !BH && this != Z[AD] && (BH = E);
    !BH && (BH = "");
    var BI = r.get(BH);
    BJ = { notify: BL || BJ, notified: BM };
    !BI && (BI = new AX()) && r.add(BH, BI);
    BI.add(Math.random(), BJ);
    BH && (Ar.has(BH) || Ab(BH)) && (BM[BM.length] = A8(BJ.notify, BH));
    if (!BH) {
      if (Ar.getSize() > 0 || Ae.getSize() == 0) {
        for (var BK in Ar.getAll()) {
          "undefined" == typeof Object.prototype[BK] &&
            (BM[BM.length] = A8(BJ.notify, BK));
        }
      }
    }
    BH && new g(BH).start();
    return true;
  }
  function AC(BH, BI, BJ) {
    return function (BL) {
      for (var BM = 0, BK = BH.length; BM < BK; BM++) {
        if (!Ab(BH[BM])) {
          return false;
        }
      }
      BJ[BJ.length] = A8(BI, BH);
    };
  }
  function Ag(BH) {
    if (BH == G) {
      return;
    }
    var BI = AZ.get(BH);
    !BI && (BI = new AX()) && AZ.add(BH, BI);
    BI.add(G);
  }
  function AB(BI) {
    for (var BO, BM, BL, BK, BN, BH = Aq(), BJ = BH.length; --BJ >= 0; ) {
      if (!BH[BJ]) {
        continue;
      }
      BO = BH[BJ].title;
      if (!BO) {
        continue;
      }
      BM = false;
      BN = !!BO && BO.indexOf(A5) == 0;
      BO && (BL = Ab(BO)) && (BK = Au(BO)) && (BM = BK.hasOption("cloak"));
      if (BL && (BN || (BK && BM) || BE || !BH[BJ].src)) {
        d(Az(BL) ? BL : BL.constructor);
        Ao(BH[BJ]);
      }
    }
  }
  function Ao(BI, BH) {
    if (e) {
      Ao = function BJ(BM, BL) {
        if ((BL = BL || BM.parentNode)) {
          if (BL.removeChild) {
            BL.removeChild(BM);
          }
        }
      };
    } else {
      if (B) {
        Ao = new Function(
          "element",
          "container",
          'if(container){  try { container.removeChild(element); }catch(e){}  return;}try { document.getElementsByTagName("head")[0].removeChild(element); }catch(e){try { document.body.removeChild(element);}catch(e){}}'
        );
      } else {
        Ao = function BK() {};
      }
    }
    if (BI) {
      Ao(BI, BH);
    }
  }
  function d(BH) {
    if (!BH || !BH.toString || BH === Function || BH === Object) {
      return false;
    }
    BH.toString = cloakObjectToggler;
    return true;
  }
  cloakObjectToggler = function () {};
  function AQ(BI, BH) {
    return BI - BH;
  }
  function R(BL) {
    var BI = !BB(BL) ? Ae.getAllArray() : [[BL, Ae.get(BL) || BL]];
    if (!BI) {
      return;
    }
    for (var BK, BH, BJ = BI.length; --BJ >= 0; ) {
      BL = BI[BJ][0];
      BK = Ab(BL);
      if (!BK || !Ap(BL)) {
        continue;
      }
      X((BH = BI[BJ][1]), BL, arguments);
      if (BH == "*") {
        BH = c;
      }
      AF(BH, BL, BK);
      u(BL);
    }
  }
  function AH(BH) {
    return (
      AD +
      ".GetPathFor(" +
      BH +
      ") is not supported. Namespace paths are protected."
    );
  }
  function BC(BH) {
    this.name = "DEPRECATED: " + A5 + ".NamespaceException";
    this.message = "DEPRECATED: Invalid _namespace name [" + BH + "]";
    this.toString = BI;
    function BI() {
      return "[ " + this.name + " ] :: " + this.message;
    }
  }
  function W(BH) {
    if (BB(BH)) {
      Ad.path = BH;
    }
  }
  function Ay(BI) {
    if (!B) {
      for (var BH = BI.length; --BH >= 0; Z[BI[BH]] = c) {}
    } else {
      (Ay = new Function(
        "SYS",
        "global",
        "  try     { for(var i=SYS.length; --i >= 0; delete global[SYS[i]]);      }  catch(e){ for(var j=SYS.length; --j >= 0; global[SYS[j]] = undefined); }"
      ))(BI, Z);
    }
  }
  function z(BL) {
    if (!BL) {
      return;
    }
    var BK = {},
      BI = BL.split("\x2e"),
      BJ = Z[BI[0]];
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
          AI(BI.slice(0, BK[BJ][0] + 1).join("."));
        }
      }
    }
  }
  function AI(BJ) {
    var BH;
    Ae.remove(BJ);
    Ar.remove(BJ);
    if (BJ) {
      if (!BB(BJ)) {
        if ((BJ = Au(BJ))) {
          BJ = BJ.fullName;
          BH = BJ.shortName;
        }
      }
      if (!BH && BJ) {
        BH = BJ.substring(BJ.lastIndexOf("\x2e") + 1);
      }
      BJ = AK.exec(BJ);
      BJ = BJ ? BJ[1] : c;
    }
    var BI = Ab(BJ);
    if (BI && BH) {
      if (BH == "*" || typeof BI[BH] != "undefined") {
        if (BH != "*") {
          if (BI[BH] == Z[BH]) {
            Z[BH] = c;
          }
          delete BI[BH];
        } else {
          for (var BK in BI) {
            if ("undefined" == typeof Object.prototype[BK]) {
              delete BI[BK];
            }
          }
          z(BJ);
        }
      }
    }
    AB(BJ);
  }
  function AV(BL) {
    var BH = BL;
    var BM = Ae.getAllArray();
    for (var BJ, BK = 0, BI = BM.length; BK < BI; ++BK) {
      if (Ar.has((BJ = BM[BK][0]))) {
        continue;
      }
      if ("*" != BM[BK][1]) {
        BH = AK.exec(BJ);
      }
      if (!(BH && BL == BH[1])) {
        continue;
      }
      Ar.add((G = BJ));
      return;
    }
    G = An;
  }
  function p(BJ, BH) {
    var BI = (BH = BH || Z || this).onload;
    if (BI === Q) {
      BJ == c && (BJ = true);
      !BJ && (BH.onload = Q(true));
      return;
    }
    if (BI && BI != Q.onLoad) {
      Q.onLoad = BI;
    }
    d((BH.onload = Q));
  }
  function Q(BI) {
    p = function () {};
    var BH = Q.onLoad;
    delete Q.onLoad;
    R();
    AB();
    return BH && Az(BH) && BH(BI);
  }
  function AN(BH) {
    if (!BH) {
      return window.document;
    }
    if (typeof BH.write == "undefined") {
      if (typeof BH.document != "undefined") {
        BH = BH.document;
      } else {
        if (typeof BH.parentNode != "undefined") {
          return AN(BH.parentNode);
        } else {
          return window.document;
        }
      }
    }
    return BH;
  }
  function BG(BH, BN) {
    if (!BN) {
      return c;
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
      return c;
    }
    return [BH, BN, BI];
  }
  function Aq(BI) {
    if (!(BI = AN(BI))) {
      return c;
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
  function AJ(BH) {
    if (BH) {
      if ((!A3 || e) && !B) {
        if ((A3 && b && BH != A3.ownerDocument) || !A3 || (!b && e)) {
          if (BH.lastChild && BH.lastChild.firstChild) {
            A3 = BH.lastChild.firstChild;
          }
        }
      } else {
        if (!A3 && B) {
          A3 = Ax;
        }
      }
    }
    return A3;
  }
  function Y(BJ) {
    Al(BJ);
    if (!BJ || !BB(BJ)) {
      return [];
    }
    var BI = N ? BJ.lastIndexOf(N) : BJ.lastIndexOf("\x2e");
    if (BI < BJ.length && BI >= 0) {
      var BK = BJ.slice(BI, BI + N.length);
      var BH = BJ.substring(0, BI);
      if (BH && isNaN(BH.charAt(0))) {
        BH = "";
      }
    }
    return [BH, BK];
  }
  function Ab(BL, BH) {
    if (!BB(BL)) {
      return c;
    }
    var BK = BH || Z;
    BL = BL.split("\x2e");
    for (var BJ = 0, BI = BL.length; BJ < BI; BJ++) {
      if (typeof BK[BL[BJ]] != "undefined") {
        BK = BK[BL[BJ]];
      } else {
        return c;
      }
    }
    return BK;
  }
  function Au(BJ) {
    if (!BJ) {
      return new AE(Ad);
    }
    var BH = BB(BJ);
    for (var BI in i) {
      if ("undefined" == typeof Object.prototype[BI]) {
        if ((BH && BJ == BI) || (!BH && BJ == Ab(BI))) {
          return i[BI];
        }
      }
    }
    return c;
  }
  function w(BY, BO) {
    BY = BY || A5;
    if (BY == A5 && Ad && Ad.path) {
      return Ad;
    }
    var BQ = i[BY];
    if (BQ) {
      return BQ;
    }
    var Ba = AG(BY, BO);
    if ((BQ = m(BY, Ba))) {
      return (i[BY] = BQ);
    }
    var BH = Aq();
    if (!(BH && Ba)) {
      return c;
    }
    var BX;
    for (var BP = false, BS, BU, BW = 0, BV = BH.length; BW < BV; BW++) {
      BS = unescape(BH[BW].src);
      if (BS && BS.search(t) == -1) {
        BS = unescape(window.location.href);
        if (BS.charAt(BS.length - 1) != l) {
          if ((BU = L.exec(BS)) != null) {
            if (BU[1].length > BS.search(t) + 3) {
              BS = BU[1];
            }
          }
        }
        BS += unescape(BH[BW].src);
      }
      if (BS == c || BS == null) {
        continue;
      }
      while (U.test(BS)) {
        BS = BS.replace(U, "\x2f");
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
        BM.length > 2 && BM.sort(AQ);
        Bb = BM[BM.length - 1];
        BO = Bb == BS.lastIndexOf(BZ) + 1 ? BK : c;
        BX = BS.substring(0, Bb);
        BP = true;
        if (BY == A5 && BH[BW].title != A5) {
          BH[BW].title = A5;
        }
        var BI = Bb + BZ.length - 2;
        var BR = Y(BS.substring(BI + 1));
        var BN = BR[1];
        var BL = BR[0] || (BY == A5 && AS);
        break;
      }
    }
    if (!BX) {
      return c;
    }
    BQ = new AE(BX, BO, BY, c, BL, BN);
    i[BY] = BQ;
    return BQ;
  }
  function m(BX, BY) {
    var BP = Number.MAX_VALUE;
    var BR;
    var BI = [];
    var BS;
    var BL = 0;
    BY = BY || AG(BX);
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
            var BU = Y(BT.substring(BH + 1));
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
      return c;
    }
    BT = BT.substring(0, BI[BL]);
    var BQ = new AE(BT, BN[BL], BX, c, BM, BO);
    if (BQ.path) {
      i[BX] = BQ;
    }
    return BQ;
  }
  function AG(BJ, BL) {
    var BN = l || A4();
    var BH = BL == c ? I : [BL];
    var BK = {};
    for (var BM, BI = BH.length; --BI >= 0; ) {
      BL = BH[BI];
      BM = BN + BJ.replace(/\x2e/g, BL);
      BK[BL] = [BM + BL, BM + N];
    }
    return BK;
  }
  function n() {
    return [
      BE ? "cloak" : "cloakoff",
      Aj ? "debug" : "debugoff",
      k ? "legacy" : "legacyoff",
      h ? "mvc" : "mvcoff",
      Ac ? "mvcshare" : "mvcshareoff",
      o ? "override" : "overrideoff",
      T ? "refresh" : "refreshoff",
    ].join(",");
  }
  function A4(BJ) {
    if (!BJ && l) {
      return l;
    }
    var BK = unescape(window.location.href);
    var BH = BK.lastIndexOf("\x5c") + 1;
    var BI = BK.lastIndexOf("\x2f") + 1;
    l = BH > BI ? "\x5c" : "\x2f";
    return l;
  }
  function Am(BI, BO, BL, BN, BK, BM, BH) {
    if (!Ae.add(BO, BI)) {
      return BM;
    }
    F(BO, BI == "*" ? BO : BI);
    Ag(BO);
    if (BI == "*") {
      (BI = BF), H('...\t:: Import ("' + BO + '.*")', arguments);
    } else {
      if (BI == BO) {
        H('...\t:: Include ("' + BI + '")', arguments);
      } else {
        H('...\t:: ImportAs ("' + BI + '", "' + BO + '")', arguments);
      }
    }
    if (new g(BO).start()) {
      return BM;
    }
    BL = AP(BI, BO, BL, BN, BK);
    var BJ = a(
      BL,
      AN(BH || Z || this),
      'ImportAs("' + BI + '", "' + BO + '");',
      false,
      BO
    );
    return BM;
  }
  function AP(BH, BO, BK, BN, BI) {
    k && (BN = BN === false ? "\x2f" : "\x2e");
    !BN && (BN = Ad.notation);
    var BM = BO + (BH == "*" ? ".*" : "");
    var BJ = BM;
    var BL;
    do {
      if ((BM = AK.exec(BM))) {
        BM = BM[1];
      } else {
        break;
      }
      if (BM == BJ) {
        break;
      }
      BJ = BM;
      BL = w(BM, BN);
    } while (!BL);
    !BB(BK) && (BK = (BL && BL.path) || Ad.path || "");
    BK.charAt(BK.length - 1) != "\x2f" && (BK += "\x2f");
    BK += escape(BO.replace(/\x2e/g, BN));
    BI && (BK += "\x2e" + BI);
    BK += N;
    BL && BL.hasOption("refresh") && (BK = AO(BK));
    return BK;
  }
  function AF(BI, BN, BL, BH) {
    BH = BH || Z || this;
    if (!BL) {
      return BL;
    }
    if (BI != BF && A0(BI, BN, BH)) {
      Ae.remove(BN);
      return BL;
    }
    if (!Ap(BN, BI)) {
      return c;
    }
    var BJ = [],
      BM = Ae.get(BN),
      BK = BI == BN || BM == BN;
    if (BI && BI != BF && (!BM || (BM != "*" && BM != BF))) {
      if (BK) {
        BJ[0] = 'SUCCESS :: Include ("' + BN + '")';
      } else {
        (BH[BI] = BL),
          (BJ[0] = 'SUCCESS :: ImportAs ("' + BI + '", "' + BN + '")');
      }
      Ae.remove(BN);
      Ar.add(BN, BI);
    } else {
      if (BM == "*") {
        BA(BI, BN, BL, BH, BK, BJ);
      } else {
        if (BM != "*" && (BM == BF || BI == BF)) {
          BJ[0] =
            "SUCCESS :: " + (BK ? "Include" : "Import") + ' ("' + BN + '.*")';
          Ae.remove(BN);
          Ar.add(BN, "*");
        }
      }
    }
    BJ.length > 0 && H(BJ.join("\r\n"), arguments);
    BI != BN && AL(BI);
    AL(BN);
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
        if (i[BM] || A0(BO, BM, BH)) {
          continue;
        }
        BH[BO] = BL[BO];
        BJ[BJ.length] = 'SUCCESS :: ImportAs ("' + BO + '", "' + BM + '")';
      }
    }
    Ae.remove(BN);
    if (BI != BF) {
      Ae.add(BN, BF);
    }
  }
  function A0(BI, BK, BH) {
    BH = BH || Z || this;
    if (
      o ||
      (BK == BI && !Ab(BI)) ||
      typeof BH[BI] == "undefined" ||
      Ab(BK) == BH[BI]
    ) {
      return false;
    }
    var BJ =
      "\nWARNING: There is a naming conflict, " +
      BI +
      " already exists.\nConsider using the override load-time option, " +
      AD +
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
    H(BJ, arguments, Aj);
    return true;
  }
  function AM(BH) {
    return new Function("return /*@cc_on @if(@_jscript)" + BH + "@end @*/;")();
  }
  function V(BK, BI, BJ, BH) {
    return v(c, BK, BI, BJ, BH);
  }
  function v(BS, BL, BH, BQ, BI) {
    p();
    if (!BL || BL == "*") {
      H('ERROR :: ImportAs ("' + BS + '", "' + BL + '")');
      return c;
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
    BI = BI || Z || this;
    if (BS == "*") {
      BL = AK.exec(BL)[1];
    } else {
      if (typeof BI[BS] != "undefined" && BS != BL) {
        for (var BT = k ? s.concat(M) : s, BU = BT.length; --BU >= 0; ) {
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
      if (Ae.has(BL) || !Ar.has(BL)) {
        BJ = AF(BS, BL, BJ, BI);
        u(BL);
      }
      return BJ;
    }
    if (Ae.has(BL)) {
      if (BS == "*" || BS == BF) {
        BS = BL;
      }
      F(BL, BS);
      Ag(BL);
      return c;
    }
    return Am(BS, BL, BH, BQ, BP, BJ, BI);
  }
  function g(BL, BJ, BH) {
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
        case !!Ab(BL) && Ap(BL):
          R(BL);
          return true;
        default:
          BP = setTimeout(BI, 0);
          return false;
      }
    }
    function BO() {
      c != BP && clearTimeout(BP);
      c != BK && clearInterval(BK);
    }
    if (this.constructor != g) {
      if (!this.constructor || this.constructor.toString() != g.toString()) {
        return new g(BL, BJ, BH);
      }
    }
    return BM(this);
  }
  function A6(BK, BI, BJ, BH) {
    BK && (BK = BK.split(".*").join(""));
    return v(BK, BK, BI, BJ, BH);
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
  function Az(BH) {
    return (
      BH != c &&
      BH != null &&
      (typeof BH == "function" || Function == BH.constructor)
    );
  }
  function A() {
    if (typeof document == "undefined") {
      return false;
    }
    var BH = !!document.write && !!document.writeln;
    A2 = !!document.createElement;
    B =
      A2 &&
      !!document.createTextNode &&
      !!document.getElementsByTagName &&
      !!(Ax = document.getElementsByTagName("head")[0]).appendChild &&
      !!Ax.removeChild;
    e =
      B &&
      !!document.firstChild &&
      !!document.lastChild &&
      !!document.parentNode;
    b = e && !!document.ownerDocument;
    return !(BH || A2 || B || e || b);
  }
  function At(BK, BH) {
    var BJ = BK == G;
    var BI = Ae.has(BK);
    if (BJ || Ap(G) || BI) {
      return true;
    }
    Ae.add(BK, BH || BK);
    new g(BK).start();
    return false;
  }
  function BB(BH) {
    return (
      BH != null &&
      BH != c &&
      (typeof BH == "string" || BH.constructor == String)
    );
  }
  function Ap(BK, BH) {
    var BI = AA.get(BK);
    BI && (BI = BI.getAll());
    for (var BJ in BI) {
      if ("undefined" == typeof Object.prototype[BJ]) {
        if (!Ab(BI[BJ])) {
          return false;
        }
      }
    }
    return true;
  }
  function a(BJ, BH, BL, BN, BM, BK, BO) {
    p();
    if (!(BH = AN(BH))) {
      H(
        "ERROR :: Container not found. Unable to load:\n\n[" + BJ + "]",
        arguments
      );
      return false;
    }
    if (BJ) {
      C.add(unescape(BJ));
      if (T) {
        BJ = AO(BJ);
      }
    }
    if (!(BK || BO)) {
      BO = "JavaScript";
      BK = "text/javascript";
    }
    if (BN == c) {
      BN = false;
    }
    var BI;
    if (A2 && !f) {
      BI = BH.createElement("script");
    }
    if (!BI) {
      if (BL) {
        BL = "setTimeout('" + BL + "',0);";
      }
      S(BJ, BH, BL, BN, BM, BK, BO);
      return false;
    }
    true && (BI.async = !!BN);
    BN && (BI.defer = BN);
    BO && (BI.language = BO);
    BM && (BI.title = BM);
    BK && (BI.type = BK);
    if (BJ) {
      H("...\t:: Load [ " + BJ + " ]", arguments);
      if (AU || !(BD || P)) {
        BI.src = BJ;
      }
      AJ(BH).appendChild(BI);
      if (!AU || BD || P) {
        BI.src = BJ;
      }
      H("DONE\t:: Load [ " + BJ + " ]", arguments);
    }
    if (!BL) {
      return true;
    }
    if (BJ) {
      a(c, BH, BL, BN, BM, BK, BO);
      return true;
    }
    if (typeof BI.canHaveChildren == "undefined" || BI.canHaveChildren) {
      BI.appendChild(BH.createTextNode(BL));
    } else {
      if (!BI.canHaveChildren) {
        BI.text = BL;
      }
    }
    AJ(BH).appendChild(BI);
    return false;
  }
  function A9() {
    if (!(h || Ac)) {
      return;
    }
    if (Ac) {
      a(Ad.path + An + N, null, null, null, An);
    }
    if (!h) {
      return;
    }
    var BI = unescape(window.location.pathname);
    var BH = BI.lastIndexOf(l);
    BI = BI.substring(++BH);
    BH = BI.lastIndexOf("\x2e");
    BH = BH == -1 ? 0 : BH;
    if ("" != (BI = BI.substring(0, BH))) {
      An = BI;
    }
    a(An + N, null, null, null, An);
  }
  function Al(BI) {
    if (!BI || !BB(BI)) {
      return;
    }
    var BJ = BI.lastIndexOf("?") + 1;
    BI = BI.substring(BJ).toLowerCase();
    if (BI.length == 0) {
      return;
    }
    var BH;
    if ((BH = j.exec(BI))) {
      BE = BH[1] == "cloak";
    }
    if ((BH = O.exec(BI))) {
      Aj = BH[1] == "debug";
    }
    if ((BH = As.exec(BI))) {
      K(BH[1] == "legacy");
    }
    if ((BH = q.exec(BI))) {
      h = BH[1] == "mvc";
    }
    if ((BH = AT.exec(BI))) {
      Ac = BH[1] == "mvcshare";
    }
    if ((BH = AW.exec(BI))) {
      o = BH[1] == "override";
    }
    if ((BH = J.exec(BI))) {
      T = BH[1] == "refresh";
    }
  }
  function S(BH, BJ, BK, BI, BP, BO, BN) {
    if (!(BJ = AN(BJ || window || this))) {
      return;
    }
    var BM;
    if (BH) {
      H("...\t:: LoadSimple [ " + BH + " ]", arguments);
      if (BK) {
        BM = BK;
        BK = c;
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
      S(c, BJ, BK, BI, BP, BO, BN);
    }
  }
  function H(BL, BN, BK) {
    if (!Aj && !BK) {
      return;
    }
    var BJ = /function\s*([^(]*)\s*\(/.exec(BN.callee) || [""],
      BO = BJ.length > 1 ? BJ[1] : BJ[0];
    if (BL != c) {
      var BI = y;
      var BH = new Date();
      y =
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
        y.indexOf("ERROR") >= 0
          ? "error"
          : y.indexOf("WARN") >= 0
          ? "warn"
          : "info";
      !H.is
        ? (H.is = {
            Firebug: typeof console != "undefined" && Az(console.info),
            MochiKit: typeof MochiKit != "undefined" && Az(MochiKit.log),
            YAHOO: typeof YAHOO != "undefined" && Az(YAHOO.log),
          })
        : 0;
      H.is.Firebug && console[BM](y);
      H.is.YAHOO && YAHOO.log(y, BM);
      H.is.MochiKit &&
        (BM == "info"
          ? MochiKit.log(y)
          : BM == "error"
          ? MochiKit.logError(y)
          : BM == "warn"
          ? MochiKit.logWarning(y)
          : 0);
      y += BI;
    }
    if (BK) {
      Af();
    }
  }
  function X(BH, BK, BJ) {
    var BI =
      BH == "*" || BH == BF
        ? 'Import   ("' + BK + '.*")'
        : BH == BK
        ? 'Include  ("' + BK + '")'
        : 'ImportAs ("' + BH + '", "' + BK + '")';
    H("CHECKING :: " + BI + "...", BJ);
  }
  function Ai(BI, BP, BN, BH) {
    p();
    BI = BI || "\x3cdefault\x3e";
    H('Namespace ("' + BI + '")', arguments);
    var BO = BH || Z || this;
    if (BI == "\x3cdefault\x3e") {
      Ad.update(BP, BN);
      H(Ad, arguments);
      return BO;
    }
    AV(BI);
    var BJ = BI.split("\x2e");
    for (var BM = 0, BL = BJ.length; BM < BL; BM++) {
      BO = typeof BO[BJ[BM]] != "undefined" ? BO[BJ[BM]] : (BO[BJ[BM]] = {});
    }
    var BK = i[BI];
    if (BK) {
      BK.update(BP, BN);
      H(BK, arguments);
      return BO;
    }
    if (!BP) {
      BK = w(BI, BN);
    }
    if (BP || !BK) {
      BK = new AE(BP, BN, BI);
    }
    if (BK && !i[BI]) {
      i[BI] = BK;
    }
    H(BK, arguments);
    return BO;
  }
  function AE(BR, BO, BI, BP, BL, BQ, BS) {
    function BM(BT) {
      BN();
      BT.hasOption = BK;
      BT.toString = BH;
      BT.update = BJ;
      BT.update(BR, BO, BI, BP, BL, BQ, BS);
      return BT;
    }
    function BN() {
      if (!(BR && BR.constructor == AE)) {
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
      this.extension = BZ || this.extension || N;
      this.fullName = BY || this.fullName || "";
      this.shortName = BT || this.shortName || "";
      this.notation = BB(BW)
        ? BW
        : this.notation || (Ad && BB(Ad.notation) ? Ad.notation : "\x2e");
      this.options = BB(BV) ? BV : this.options || n();
      this.path = BB(BX) ? BX : this.path || (Ad && BB(Ad.path) ? Ad.path : "");
      this.uri = this.path + this.fullName.replace(/\x2e/g, this.notation);
      this.version = "" + (BU || this.version || "");
      if (!this.uri) {
        return;
      }
      this.uri += (this.version ? "\x2e" + this.version : "") + this.extension;
    }
    if (this.constructor != AE) {
      if (!this.constructor || this.constructor.toString() != AE.toString()) {
        return new AE(BR, BO, BI, BP, BL, BQ, BS);
      }
    }
    return BM(this);
  }
  function A8(BI, BH) {
    return setTimeout(function () {
      BI(BH);
    }, 0);
  }
  function AL(BL) {
    var BN = [r.get(""), r.get(BL), r.get(E)];
    if (!BN[0] && !BN[1] && !BN[2]) {
      return;
    }
    var BH = (BN[0] && BN[0].getSize() > 0) || (BN[1] && BN[1].getSize() > 0);
    Aj && BH && H("NOTIFY :: Import Listeners for " + BL + "...", arguments);
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
          Az(BK.notify) &&
            (BK.notified[BK.notified.length] = A8(BK.notify, BL));
        }
      }
    }
    Aj &&
      BH &&
      H("NOTIFY :: Import Listeners for " + BL + "...DONE!", arguments);
  }
  function AR() {
    Ai(A5);
    d((Z.Import = V));
    d((Z.ImportAs = v));
    d((Z.Include = A6));
    d((Z.Load = a));
    d((Z.Namespace = Ai));
    d((AY.AddImportListener = Ah));
    d((AY.EnableLegacy = K));
    d(
      (AY.GetVersion = function () {
        return AS;
      })
    );
    AY.GetVersion.toString = AY.GetVersion.prototype.toString = AY.GetVersion;
    d((AY.RemoveImportListener = Av));
    d((AY.SetOption = Aa));
    d((AY.ShowLog = Af));
    d((AY.Unload = A7));
    A1("Cloak");
    A1("Debug");
    A1("Override");
    A1("Refresh");
    K(k || false);
  }
  function A1(BH) {
    if (!BH || !BB(BH)) {
      return;
    }
    d(
      (AY["Enable" + BH] = function (BI) {
        Aa(BH, BI);
      })
    );
  }
  function Av(BI, BM) {
    p();
    switch (true) {
      case !BM || !Az(BM):
        if (!Az(BI)) {
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
    var BK = [r.get(""), r.get(BI), r.get(E)];
    if (!BK[0] && !BK[1] && !BK[2]) {
      return false;
    }
    var BO = false;
    for (var BQ, BP, BN = BK.length; --BN >= 0; ) {
      if (!BK[BN]) {
        continue;
      }
      BQ = BK[BN].getAll();
      for (var BJ in BQ) {
        if ("undefined" == typeof Object.prototype[BJ]) {
          if (!BQ[BJ] || BQ[BJ].notify != BM) {
            continue;
          }
          delete BQ[BJ].notify;
          BP = BQ[BJ].notified;
          for (var BL = 0, BH = BP.length; BL < BH; BL++) {
            clearTimeout(BP[BL]);
            BP[BL] = c;
            delete BP[BL];
          }
          delete BQ[BJ].notified;
          BK[BN].remove(BJ);
          BO = true;
          break;
        }
      }
    }
    return BO;
  }
  function x(BH) {
    if (!(B && (BH = document.createElement("meta")))) {
      return;
    }
    BH.httpEquiv = Aw + AD + " " + AS;
    Aw = A5.split("\x2e").reverse().join("\x2e");
    BH.content = Aw + " :: Smart scripts that play nice ";
    AJ(window.document).appendChild(BH);
  }
  function K(BH) {
    if (BH == c) {
      BH = true;
    }
    k = BH;
    AY = AY || Ab(AD) || {};
    if (BH) {
      AY.DIR_NAMESPACE = AY.USE_PATH = "\x2f";
      AY.DOT_NAMESPACE = AY.USE_NAME = "\x2e";
      d((AY.CompleteImports = R));
      d((AY.EnableDebugging = AY.EnableDebug));
      d((AY.GetPathFor = AH));
      d((Z.JSBasePath = Z.JSPath = AY.SetBasePath = W));
      d((Z.JSImport = V));
      d((Z.JSLoad = a));
      d((Z.JSPackaging = AY));
      d((Z.JSPackage = Z.Package = Ai));
      d(
        (Z.JSPacked = function (BI) {
          Ad.notation = BI;
        })
      );
      d((Z.NamespaceException = Z.PackageException = BC));
    }
    if (BH || typeof Z["JSPackaging"] == "undefined") {
      return;
    }
    delete AY.DIR_NAMESPACE;
    delete AY.DOT_NAMESPACE;
    delete AY.CompleteImports;
    delete AY.EnableDebugging;
    delete AY.GetPathFor;
    delete AY.SetBasePath;
    delete AY.USE_NAME;
    delete AY.USE_PATH;
    Ay(M);
  }
  function Aa(BH, BI) {
    p();
    if (!BH || !BB(BH)) {
      return;
    }
    BI = BI == c ? true : BI;
    BH = BH.toLowerCase();
    switch (BH) {
      case "cloak":
        BE = BI;
        break;
      case "debug":
        Aj = BI;
        break;
      case "legacy":
        K(BI);
        break;
      case "override":
        o = BI;
        break;
      case "refresh":
        T = BI;
        break;
      default:
        break;
    }
  }
  function AO(BH) {
    if (/ajile.refresh/g.test(BH)) {
      return BH;
    }
    return BH + (/\?/g.test(BH) ? "&" : "?") + "ajile.refresh=" + Math.random();
  }
  function Af() {
    p();
    if (BD && !B) {
      return;
    }
    if (!Aj) {
      y =
        "\r\nTo enable debug logging, use <b>" +
        AD +
        ".EnableDebug()</b> from within any of your scripts or use " +
        AD +
        "'s debug load-time option as follows:<br><br><pre><code>&lt;script src=\"" +
        Ad.uri +
        '?<b>debug</b>" type="text/javascript"&gt;&lt;/script&gt;</code></pre>';
    }
    var BJ =
      "<html><head><title>" +
      AD +
      "'s Debug Log " +
      (!Aj ? ":: DISABLED" : "") +
      '</title>\r\n<style type="text/css">*{background-color:#eee;color:#000;font-family:"Tahoma";font-size:12px;}</style>\r\n</head>\r\n<body>' +
      y.replace(/\r\n/g, "<br>") +
      "</body></html>";
    var BK = screen.width / 1.5;
    var BH = screen.height / 1.5;
    var BI = Af.window
      ? Af.window
      : (Af.window = window.open(
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
  function AX() {
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
        ? c
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
    if (this.constructor != AX) {
      if (!this.constructor || this.constructor.toString() != AX.toString()) {
        return new AX();
      }
    }
    return BL(this);
  }
  function u(BJ) {
    var BK = AZ.get(BJ);
    if (!BK) {
      return;
    }
    BK = BK.getAll();
    var BI;
    for (var BH in BK) {
      if ("undefined" == typeof Object.prototype[BH]) {
        if (Ae.has(BH) && (BI = Ab(BH))) {
          if (AF(Ae.get(BH), BH, BI)) {
            u(BH);
          }
        }
      }
    }
  }
  var G = A5,
    AA = new AX(),
    r = new AX(),
    BD = AM("@_jscript_version"),
    f = typeof ScriptEngine != "undefined" && /InScript/.test(ScriptEngine()),
    P = /Opera/i.test(window.navigator.userAgent),
    AU = /WebKit/i.test(window.navigator.userAgent),
    C = new AX(),
    i = {
      clear: function () {
        for (var BH in this) {
          if ("undefined" == typeof Object.prototype[BH]) {
            delete this[BH];
          }
        }
      },
    },
    Ae = new AX(),
    Ar = new AX(),
    AZ = new AX();
  Ak();
})("1.6.8", this);
