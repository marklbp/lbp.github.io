var arrVar = ["getElementById", ".", "indexOf", "substring", "value", "pre-tax", "txtshebao", "txtgjj", "TxtSJHJJSMIN", "TxtSJHJJSMAX", "TxtGJJHJMIN", "TxtGJJHJMAX", "", "TxtGYYL", "TxtGYYLBL", "TxtGYYB", "TxtGYYBBL", "TxtGYSY", "TxtGYSYBL", "TxtGYGJJ", "TxtGYGJJBL", "TxtGYBCGJJ", "TxtGYBCGJJBL", "TxtGYTOTAL", "TxtDWYL", "TxtDWYLBL", "TxtDWYB", "TxtDWYBBL", "TxtDWSY", "TxtDWSYBL", "TxtDWGJJ", "TxtDWGJJBL", "TxtDWBCGJJ", "TxtDWBCGJJBL", "TxtGS", "TxtGSBL", "TxtSY", "TxtSYBL", "TxtDWTOTAL", "TxtDWTOTAL1", "TxtK4J", "TxtSDS", "TxtGYTOTAL1", "TxtHGZ", "tax", "innerText", "musttaxtotal", "back-tax", "taxtotal", "checked", "disabled", "DropDownBCBL", "0%"];
var koufei = 0;
function jq(id) {
    return document[arrVar[0]](id);
}
function countFun(m, n) {
    return (parseFloat(m) / 100) * n;
}
function floatTwo(str) {
    var i = str.toString()[arrVar[2]](arrVar[1]);
    if (i > 0) {
        return str.toString()[arrVar[3]](0, i + 2);
    } else {
        return str;
    }
}
function subCacu(value) {
    value = jq(arrVar[5])[arrVar[4]];
    var _0x4cddxc = jq(arrVar[6]);
    var _0x4cddxd = jq(arrVar[7]);
    var _0x4cddxe = jq(arrVar[8])[arrVar[4]];
    var _0x4cddxf = jq(arrVar[9])[arrVar[4]];
    var _0x4cddx10 = jq(arrVar[10])[arrVar[4]] / 2;
    var _0x4cddx11 = jq(arrVar[11])[arrVar[4]] / 2;
    if (isNaN(value)) {
        jq(arrVar[5])[arrVar[4]] = arrVar[12];
        return;
    }
    ;if ((parseFloat(value) - parseFloat(_0x4cddxe)) < 0) {
        _0x4cddxc[arrVar[4]] = _0x4cddxe;
    } else {
        if ((parseFloat(value) - parseFloat(_0x4cddxf)) > 0) {
            _0x4cddxc[arrVar[4]] = _0x4cddxf;
        }
        ;
    }
    ;if (parseFloat(value) <= parseFloat(_0x4cddx10) / 0.07) {
        _0x4cddxd[arrVar[4]] = floatTwo(_0x4cddx10 / 0.07);
    } else {
        if (parseFloat(value) > parseFloat(_0x4cddx11) / 0.07) {
            _0x4cddxd[arrVar[4]] = floatTwo(_0x4cddx11 / 0.07);
        }
        ;
    }
    ;if (parseFloat(value) < 1) {
        _0x4cddxc[arrVar[4]] = 0;
        _0x4cddxd[arrVar[4]] = 0;
        value = 0;
    }
    ;cacuFax(value, _0x4cddxc, _0x4cddxd);
}
function changValue(_0x4cddx6) {
    jq(arrVar[5])[arrVar[4]] = _0x4cddx6;
    var _0x4cddxc = jq(arrVar[6]);
    var _0x4cddxd = jq(arrVar[7]);
    var _0x4cddxe = jq(arrVar[8])[arrVar[4]];
    var _0x4cddxf = jq(arrVar[9])[arrVar[4]];
    var _0x4cddx10 = jq(arrVar[10])[arrVar[4]] / 2;
    var _0x4cddx11 = jq(arrVar[11])[arrVar[4]] / 2;
    if (isNaN(_0x4cddx6)) {
        jq(arrVar[5])[arrVar[4]] = arrVar[12];
        return;
    }
    ;if ((parseFloat(_0x4cddx6) - parseFloat(_0x4cddxe)) < 0) {
        _0x4cddxc[arrVar[4]] = _0x4cddxe;
    } else {
        if ((parseFloat(_0x4cddx6) - parseFloat(_0x4cddxf)) > 0) {
            _0x4cddxc[arrVar[4]] = _0x4cddxf;
        } else {
            _0x4cddxc[arrVar[4]] = _0x4cddx6;
        }
        ;
    }
    ;if (parseFloat(_0x4cddx6) <= parseFloat(_0x4cddx10) / 0.07) {
        _0x4cddxd[arrVar[4]] = floatTwo(_0x4cddx10 / 0.07);
    } else {
        if (parseFloat(_0x4cddx6) > parseFloat(_0x4cddx11) / 0.07) {
            _0x4cddxd[arrVar[4]] = floatTwo(_0x4cddx11 / 0.07);
        } else {
            _0x4cddxd[arrVar[4]] = _0x4cddx6;
        }
        ;
    }
    ;if (parseFloat(_0x4cddx6) < 1) {
        _0x4cddxc[arrVar[4]] = 0;
        _0x4cddxd[arrVar[4]] = 0;
        _0x4cddx6 = 0;
    }
    ;cacuFax(_0x4cddx6, _0x4cddxc, _0x4cddxd);
}
function cacuFax(_0x4cddx6, _0x4cddxc, _0x4cddxd) {
    jq(arrVar[13])[arrVar[4]] = floatTwo(countFun(jq(arrVar[14])[arrVar[4]], _0x4cddxc[arrVar[4]]));
    jq(arrVar[15])[arrVar[4]] = floatTwo(countFun(jq(arrVar[16])[arrVar[4]], _0x4cddxc[arrVar[4]]));
    jq(arrVar[17])[arrVar[4]] = floatTwo(countFun(jq(arrVar[18])[arrVar[4]], _0x4cddxc[arrVar[4]]));
    jq(arrVar[19])[arrVar[4]] = floatTwo(countFun(jq(arrVar[20])[arrVar[4]], _0x4cddxd[arrVar[4]]));
    jq(arrVar[21])[arrVar[4]] = floatTwo(countFun(jq(arrVar[22])[arrVar[4]], _0x4cddxd[arrVar[4]]));
    var _0x4cddx14 = parseFloat(jq(arrVar[13])[arrVar[4]]) + parseFloat(jq(arrVar[15])[arrVar[4]]) + parseFloat(jq(arrVar[17])[arrVar[4]]) + parseFloat(jq(arrVar[19])[arrVar[4]]) + parseFloat(jq(arrVar[21])[arrVar[4]]);
    jq(arrVar[23])[arrVar[4]] = floatTwo(_0x4cddx14);
    jq(arrVar[24])[arrVar[4]] = floatTwo(countFun(jq(arrVar[25])[arrVar[4]], _0x4cddxc[arrVar[4]]));
    jq(arrVar[26])[arrVar[4]] = floatTwo(countFun(jq(arrVar[27])[arrVar[4]], _0x4cddxc[arrVar[4]]));
    jq(arrVar[28])[arrVar[4]] = floatTwo(countFun(jq(arrVar[29])[arrVar[4]], _0x4cddxc[arrVar[4]]));
    jq(arrVar[30])[arrVar[4]] = floatTwo(countFun(jq(arrVar[31])[arrVar[4]], _0x4cddxd[arrVar[4]]));
    jq(arrVar[32])[arrVar[4]] = floatTwo(countFun(jq(arrVar[33])[arrVar[4]], _0x4cddxd[arrVar[4]]));
    jq(arrVar[34])[arrVar[4]] = floatTwo(countFun(jq(arrVar[35])[arrVar[4]], _0x4cddxc[arrVar[4]]));
    jq(arrVar[36])[arrVar[4]] = floatTwo(countFun(jq(arrVar[37])[arrVar[4]], _0x4cddxd[arrVar[4]]));
    jq(arrVar[38])[arrVar[4]] = floatTwo(parseFloat(jq(arrVar[24])[arrVar[4]]) + parseFloat(jq(arrVar[26])[arrVar[4]]) + parseFloat(jq(arrVar[28])[arrVar[4]]) + parseFloat(jq(arrVar[30])[arrVar[4]]) + parseFloat(jq(arrVar[34])[arrVar[4]]) + parseFloat(jq(arrVar[36])[arrVar[4]]) + parseFloat(jq(arrVar[32])[arrVar[4]]));
    jq(arrVar[39])[arrVar[4]] = parseFloat(jq(arrVar[38])[arrVar[4]]) + parseFloat(_0x4cddx6);
    jq(arrVar[40])[arrVar[4]] = parseFloat(_0x4cddx6) - parseFloat(jq(arrVar[23])[arrVar[4]]);
    var _0x4cddx8 = parseFloat(_0x4cddx6) - parseFloat(jq(arrVar[23])[arrVar[4]]) - 3500;
    if (_0x4cddx8 > 0) {
        jq(arrVar[41])[arrVar[4]] = floatTwo(_0x4cddx8 * caluTaxPercent(_0x4cddx8) - koufei);
    } else {
        jq(arrVar[41])[arrVar[4]] = 0;
    }
    ;jq(arrVar[42])[arrVar[4]] = floatTwo(parseFloat(jq(arrVar[41])[arrVar[4]]) + parseFloat(jq(arrVar[23])[arrVar[4]]));
    jq(arrVar[43])[arrVar[4]] = _0x4cddx6 - parseFloat(jq(arrVar[42])[arrVar[4]]);
}
function caluTaxPercent(_0x4cddx6) {
    if (_0x4cddx6 <= 1500) {
        koufei = 0;
        return 0.03;
    } else {
        if (_0x4cddx6 > 1500 && _0x4cddx6 <= 4500) {
            koufei = 105;
            return 0.1;
        } else {
            if (_0x4cddx6 > 4500 && _0x4cddx6 <= 9000) {
                koufei = 255;
                return 0.2;
            } else {
                if (_0x4cddx6 > 9000 && _0x4cddx6 <= 35000) {
                    koufei = 1005;
                    return 0.25;
                } else {
                    if (_0x4cddx6 > 35000 && _0x4cddx6 <= 55000) {
                        koufei = 2755;
                        return 0.30;
                    } else {
                        if (_0x4cddx6 > 55000 && _0x4cddx6 <= 80000) {
                            koufei = 5505;
                            return 0.35;
                        } else {
                            if (_0x4cddx6 > 80000) {
                                koufei = 13505;
                            }
                            ;
                        }
                        ;
                    }
                    ;
                }
                ;
            }
            ;
        }
        ;
    }
    ;return 0.45;
}
function count() {
    jq(arrVar[44])[arrVar[4]] = jq(arrVar[46])[arrVar[45]];
    jq(arrVar[47])[arrVar[4]] = jq(arrVar[5])[arrVar[4]] - jq(arrVar[44])[arrVar[4]] - parseFloat(jq(arrVar[48])[arrVar[45]]);
}
function checkGjj(_0x4cddx6) {
    if (_0x4cddx6[arrVar[49]]) {
        jq(arrVar[7])[arrVar[50]] = false;
    } else {
        jq(arrVar[7])[arrVar[4]] = 0;
        jq(arrVar[7])[arrVar[50]] = true;
    }
    ;
}
function checkbcGjj(_0x4cddx6) {
    if (_0x4cddx6[arrVar[49]]) {
        jq(arrVar[51])[arrVar[50]] = false;
        changebcGjj(jq(arrVar[51])[arrVar[4]]);
    } else {
        jq(arrVar[51])[arrVar[50]] = true;
        changebcGjj(arrVar[52]);
    }
    ;
}
function changebcGjj(_0x4cddx6) {
    jq(arrVar[33])[arrVar[4]] = _0x4cddx6;
    jq(arrVar[22])[arrVar[4]] = _0x4cddx6;
}