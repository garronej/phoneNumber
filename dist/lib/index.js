"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//require("../../node_modules/intl-tel-input/build/js/utils");
require("intl-tel-input/build/js/utils");
var phoneNumber;
(function (phoneNumber_1) {
    /**
     * This function will try to convert a raw string as a E164 formated phone number.
     *
     * If the rawInput is already a E164 it will remain untouched regardless of the iso
     * ex: +33636786385, it => +33636786385
     *
     * In case the number can not be converted to E164:
     * -If the number contain any character that is not a digit or ( ) [space] - # * +
     * then the number will be considered not dialable and remain untouched.
     * e.g: SFR => SFR | Error
     *
     * -If the number contain only digits ( ) [space] - # * or +
     * then ( ) [space] and - will be removed.
     * e.g: +00 (111) 222-333 => +00111222333
     * (if after the number is "" we return rawInput and it's not dialable )
     * e.g: ()()-=> ()()- | Error
     * e.g: [""] => | Error
     *
     * @param rawInput raw string provided as phone number by Dongle or intlInput
     * @param iso
     * country of the number ( lowercase ) e.g: fr, it...
     * - If we use intlInput the iso is provided.
     * - If it's a incoming SMS/Call from Dongle the iso to provide is the one of the SIM
     * as we will ether have an E164 formated number not affected by the iso
     * or if we have a locally formated number it's formated it mean that the number is from the same
     * country of the sim card.
     * @param mustBeDialable: throw if the number is not dialable.
     *
     */
    function build(rawInput, iso, mustBeDialable) {
        if (mustBeDialable === void 0) { mustBeDialable = undefined; }
        var shouldFormatToE164 = (function () {
            if (!iso) {
                return false;
            }
            var numberType = intlTelInputUtils.getNumberType(rawInput, iso);
            switch (numberType) {
                case intlTelInputUtils.numberType.FIXED_LINE:
                case intlTelInputUtils.numberType.FIXED_LINE_OR_MOBILE:
                case intlTelInputUtils.numberType.MOBILE:
                    return true;
                default:
                    return false;
            }
        })();
        if (shouldFormatToE164) {
            return intlTelInputUtils.formatNumber(rawInput, iso, intlTelInputUtils.numberFormat.E164);
        }
        else {
            /** If any char other than *+# () and number is present => match  */
            if (rawInput.match(/[^*+#\ \-\(\)0-9]/)) {
                if (mustBeDialable) {
                    throw new Error("unauthorized char, not dialable");
                }
                return rawInput;
            }
            else {
                /** 0 (111) 222-333 => 0111222333 */
                var phoneNumber_2 = rawInput.replace(/[\ \-\(\)]/g, "");
                if (!phoneNumber_2.length) {
                    if (mustBeDialable) {
                        throw new Error("void, not dialable");
                    }
                    return rawInput;
                }
                return phoneNumber_2;
            }
        }
    }
    phoneNumber_1.build = build;
    /** let us test if we should allow the number to be dialed */
    function isDialable(phoneNumber) {
        try {
            build(phoneNumber, undefined, "MUST BE DIALABLE");
        }
        catch (_a) {
            return false;
        }
        return true;
    }
    phoneNumber_1.isDialable = isDialable;
    function isValidE164(phoneNumber) {
        return (phoneNumber[0] === "+" &&
            intlTelInputUtils.isValidNumber(phoneNumber));
    }
    /**
     * Pretty print (format) the phone number:
     * In national format if the iso of the number and the provided iso matches.
     * In international format if no iso is provided or
     * the iso of the number and the provided iso mismatch.
     * Do nothing if it's not dialable.
     */
    function prettyPrint(phoneNumber, simIso) {
        if (!isValidE164(phoneNumber)) {
            return phoneNumber;
        }
        if (!simIso) {
            return intlTelInputUtils.formatNumber(phoneNumber, undefined, intlTelInputUtils.numberFormat.INTERNATIONAL);
        }
        var pnNational = intlTelInputUtils.formatNumber(phoneNumber, null, intlTelInputUtils.numberFormat.NATIONAL);
        var pnBackToE164 = intlTelInputUtils.formatNumber(pnNational, simIso, intlTelInputUtils.numberFormat.E164);
        if (pnBackToE164 === phoneNumber) {
            return pnNational;
        }
        else {
            return intlTelInputUtils.formatNumber(phoneNumber, simIso, intlTelInputUtils.numberFormat.INTERNATIONAL);
        }
    }
    phoneNumber_1.prettyPrint = prettyPrint;
    function areSame(phoneNumber, rawInput) {
        if (phoneNumber === rawInput) {
            return true;
        }
        var rawInputDry = rawInput.replace(/[^*#+0-9]/g, "");
        if (rawInputDry === phoneNumber) {
            return true;
        }
        if (isValidE164(phoneNumber)) {
            if (rawInputDry.startsWith("00") &&
                rawInputDry.replace(/^00/, "+") === phoneNumber) {
                return true;
            }
            var pnNationalDry = intlTelInputUtils.formatNumber(phoneNumber, null, intlTelInputUtils.numberFormat.NATIONAL).replace(/[^*#+0-9]/g, "");
            if (rawInputDry === pnNationalDry) {
                return true;
            }
        }
        return false;
    }
    phoneNumber_1.areSame = areSame;
    global["phoneNumber"] = phoneNumber;
})(phoneNumber = exports.phoneNumber || (exports.phoneNumber = {}));
