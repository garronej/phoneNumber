export declare type phoneNumber = string;
export declare namespace phoneNumber {
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
    function build(rawInput: string, iso: string | undefined, mustBeDialable?: "MUST BE DIALABLE" | undefined): phoneNumber;
    /** let us test if we should allow the number to be dialed */
    function isDialable(phoneNumber: phoneNumber): boolean;
    /**
     * Pretty print the phone number in national format if
     * it is a number from the SIM country,
     * in international format if it's from an other country
     * or do nothing if it's not dialable.
     *
     * @param phoneNumber
     * @param simIso
     */
    function prettyPrint(phoneNumber: phoneNumber, simIso: string | undefined): string;
    function areSame(phoneNumber: phoneNumber, rawInput: string): boolean;
}
