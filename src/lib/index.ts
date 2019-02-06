declare const intlTelInputUtils: any;

export type phoneNumber = string;

export namespace phoneNumber {

	function syncLoadUtilIfNode() {

		const is_intlTelInputUtils_defined = (() => {

			try {
				intlTelInputUtils;
			} catch{
				return false;
			}

			return intlTelInputUtils !== undefined;

		})();

		if (is_intlTelInputUtils_defined) {
			return;
		}

		if (
			typeof process !== "undefined" &&
			process.release.name === "node"
		) {

			//Trick browserify so it does not bundle.
			let path = "../../node_modules/intl-tel-input/build/js/utils";

			require(path);

		} else {

			throw new Error([
				"Util script should be loaded, include it in the HTML",
				"page or run async function remoteLoadUtil before use"
			].join(" "));

		}

	}

	export function remoteLoadUtil(
		src: string = "//github.com/garronej/phone-number/releases/download/intlTelInputUtils/utils.js"
	) {

		return new Promise(resolve =>
			(function (d, s, id) {
				var js, fjs = d.getElementsByTagName(s)[0];
				if (d.getElementById(id)) {
					resolve();
					return;
				}
				js = d.createElement(s); js.id = id;
				js.onload = function () {
					resolve();
				};
				js.src = src;
				fjs.parentNode!.insertBefore(js, fjs);
			}(document, "script", "intlTelInputUtils"))
		);

	}

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
	export function build(
		rawInput: string,
		iso: string | undefined,
		mustBeDialable: "MUST BE DIALABLE" | undefined = undefined
	): phoneNumber {

		syncLoadUtilIfNode();

		const shouldFormatToE164: boolean = (() => {

			if (!iso) {
				return false;
			}

			const numberType = intlTelInputUtils.getNumberType(rawInput, iso);

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

			return intlTelInputUtils.formatNumber(
				rawInput,
				iso,
				intlTelInputUtils.numberFormat.E164
			);

		} else {

			/** If any char other than *+# () and number is present => match  */
			if (rawInput.match(/[^*+#\ \-\(\)0-9]/)) {

				if (mustBeDialable) {
					throw new Error("unauthorized char, not dialable");
				}

				return rawInput;

			} else {

				/** 0 (111) 222-333 => 0111222333 */
				let phoneNumber = rawInput.replace(/[\ \-\(\)]/g, "");

				if (!phoneNumber.length) {

					if (mustBeDialable) {
						throw new Error("void, not dialable");
					}

					return rawInput;

				}

				return phoneNumber;

			}

		}

	}

	/** let us test if we should allow the number to be dialed */
	export function isDialable(phoneNumber: phoneNumber): boolean {

		try {

			build(phoneNumber, undefined, "MUST BE DIALABLE");

		} catch{

			return false;

		}

		return true;

	}

	function isValidE164(phoneNumber: phoneNumber): boolean {

		syncLoadUtilIfNode();

		return (
			phoneNumber[0] === "+" &&
			intlTelInputUtils.isValidNumber(phoneNumber)
		);

	}

	/**
	 * Pretty print (format) the phone number:
	 * In national format if the iso of the number and the provided iso matches.
	 * In international format if no iso is provided or
	 * the iso of the number and the provided iso mismatch.
	 * Do nothing if it's not dialable.
	 */
	export function prettyPrint(
		phoneNumber: phoneNumber,
		simIso?: string
	): string {

		syncLoadUtilIfNode();

		if (!isValidE164(phoneNumber)) {
			return phoneNumber;
		}

		if (!simIso) {

			return intlTelInputUtils.formatNumber(
				phoneNumber,
				undefined,
				intlTelInputUtils.numberFormat.INTERNATIONAL
			);

		}

		const pnNational = intlTelInputUtils.formatNumber(
			phoneNumber,
			null,
			intlTelInputUtils.numberFormat.NATIONAL
		);

		const pnBackToE164 = intlTelInputUtils.formatNumber(
			pnNational,
			simIso,
			intlTelInputUtils.numberFormat.E164
		);

		if (pnBackToE164 === phoneNumber) {

			return pnNational;

		} else {

			return intlTelInputUtils.formatNumber(
				phoneNumber,
				simIso,
				intlTelInputUtils.numberFormat.INTERNATIONAL
			);

		}

	}

	export function areSame(
		phoneNumber: phoneNumber,
		rawInput: string
	): boolean {

		syncLoadUtilIfNode();

		if (phoneNumber === rawInput) {
			return true;
		}

		const rawInputDry = rawInput.replace(/[^*#+0-9]/g, "");

		if (rawInputDry === phoneNumber) {
			return true;
		}

		if (isValidE164(phoneNumber)) {

			if (
				rawInputDry.startsWith("00") &&
				rawInputDry.replace(/^00/, "+") === phoneNumber
			) {
				return true;
			}

			const pnNationalDry = intlTelInputUtils.formatNumber(
				phoneNumber,
				null,
				intlTelInputUtils.numberFormat.NATIONAL
			).replace(/[^*#+0-9]/g, "");

			if (rawInputDry === pnNationalDry) {
				return true;
			}

		}

		return false;

	}

	global["phoneNumber"] = phoneNumber;

}
