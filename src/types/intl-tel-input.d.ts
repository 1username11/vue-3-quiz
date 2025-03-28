// Type definitions for intl-tel-input
// Project: https://github.com/jackocnr/intl-tel-input
// TypeScript Version: 4.0

declare module 'intl-tel-input' {
  interface IntlTelInputOptions {
    allowDropdown?: boolean;
    autoHideDialCode?: boolean;
    autoPlaceholder?: 'aggressive' | 'polite' | 'off';
    customContainer?: string;
    customPlaceholder?: (selectedCountryPlaceholder: string, selectedCountryData: any) => string;
    dropdownContainer?: Node | Element | string;
    excludeCountries?: string[];
    formatOnDisplay?: boolean;
    geoIpLookup?: (callback: (countryCode: string) => void) => void;
    hiddenInput?: string;
    initialCountry?: string;
    localizedCountries?: Record<string, string>;
    nationalMode?: boolean;
    onlyCountries?: string[];
    placeholderNumberType?: string;
    preferredCountries?: string[];
    separateDialCode?: boolean;
    showFlags?: boolean;
    utilsScript?: string;
  }

  interface IntlTelInputInstance {
    destroy(): void;
    getExtension(): string;
    getNumber(format?: string): string;
    getNumberType(): number;
    getSelectedCountryData(): any;
    getValidationError(): number;
    isValidNumber(): boolean;
    setCountry(countryCode: string): void;
    setNumber(number: string): void;
    setPlaceholderNumberType(type: string): void;
  }

  // Define the main function
  function intlTelInput(input: HTMLElement, options?: IntlTelInputOptions): IntlTelInputInstance;

  // Add namespace for those who want to use it as a namespace
  namespace intlTelInput {
    export type Options = IntlTelInputOptions;
    export type Instance = IntlTelInputInstance;
  }

  // Export the function as default
  export default intlTelInput;
}
