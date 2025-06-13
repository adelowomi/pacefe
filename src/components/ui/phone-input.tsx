import { useState, useEffect } from 'react';
import { ChevronDown, Phone } from 'lucide-react';

interface Country {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
}

interface PhoneInputProps {
  value?: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  error?: string;
  disabled?: boolean;
  label?: string;
  required?: boolean;
}

// Common countries with their dial codes and flags
const countries: Country[] = [
  { code: 'NG', name: 'Nigeria', dialCode: '+234', flag: '🇳🇬' },
  { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺' },
  { code: 'DE', name: 'Germany', dialCode: '+49', flag: '🇩🇪' },
  { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷' },
  { code: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳' },
  { code: 'CN', name: 'China', dialCode: '+86', flag: '🇨🇳' },
  { code: 'JP', name: 'Japan', dialCode: '+81', flag: '🇯🇵' },
  { code: 'KR', name: 'South Korea', dialCode: '+82', flag: '🇰🇷' },
  { code: 'BR', name: 'Brazil', dialCode: '+55', flag: '🇧🇷' },
  { code: 'MX', name: 'Mexico', dialCode: '+52', flag: '🇲🇽' },
  { code: 'AR', name: 'Argentina', dialCode: '+54', flag: '🇦🇷' },
  { code: 'ZA', name: 'South Africa', dialCode: '+27', flag: '🇿🇦' },
  { code: 'EG', name: 'Egypt', dialCode: '+20', flag: '🇪🇬' },
  { code: 'KE', name: 'Kenya', dialCode: '+254', flag: '🇰🇪' },
  { code: 'GH', name: 'Ghana', dialCode: '+233', flag: '🇬🇭' },
  { code: 'ET', name: 'Ethiopia', dialCode: '+251', flag: '🇪🇹' },
  { code: 'UG', name: 'Uganda', dialCode: '+256', flag: '🇺🇬' },
];

export default function PhoneInput({
  value,
  onChange,
  placeholder = "Enter phone number",
  className = "",
  error,
  disabled = false,
  label,
  required = false
}: PhoneInputProps) {
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]); // Default to Nigeria
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Parse existing value on component mount or when value changes
  useEffect(() => {
    if (value) {
      // Try to parse the existing phone number to extract country code and number
      const phoneStr = value.toString();
      let foundCountry = countries[0]; // Default to Nigeria
      let numberPart = phoneStr;

      // Check if the phone number starts with a country code
      for (const country of countries) {
        if (phoneStr.startsWith(country.dialCode)) {
          foundCountry = country;
          numberPart = phoneStr.substring(country.dialCode.length);
          break;
        }
      }

      setSelectedCountry(foundCountry);
      setPhoneNumber(numberPart);
    } else {
      setPhoneNumber('');
    }
  }, [value]);

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setIsDropdownOpen(false);
    
    // Update the full phone number
    const fullNumber = phoneNumber ? `${country.dialCode}${phoneNumber}` : '';
    onChange(fullNumber);
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNumber = e.target.value.replace(/[^\d]/g, ''); // Only allow digits
    setPhoneNumber(newNumber);
    
    // Update the full phone number
    const fullNumber = newNumber ? `${selectedCountry.dialCode}${newNumber}` : '';
    onChange(fullNumber);
  };

  const formatPhoneNumber = (number: string) => {
    // Simple formatting for display
    if (number.length >= 10) {
      return number.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
    } else if (number.length >= 6) {
      return number.replace(/(\d{3})(\d{3})/, '$1 $2');
    } else if (number.length >= 3) {
      return number.replace(/(\d{3})/, '$1');
    }
    return number;
  };

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-foreground mb-2">
          <Phone className="h-4 w-4 inline mr-1" />
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <div className={`flex border rounded-md shadow-sm bg-background ${
          error ? 'border-red-500' : 'border-input'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
          
          {/* Country Code Selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => !disabled && setIsDropdownOpen(!isDropdownOpen)}
              disabled={disabled}
              className="flex items-center px-3 py-2 border-r border-input bg-muted hover:bg-accent text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent rounded-l-md transition-colors"
            >
              <span className="mr-2">{selectedCountry.flag}</span>
              <span className="text-sm font-medium">{selectedCountry.dialCode}</span>
              <ChevronDown className="ml-1 h-4 w-4" />
            </button>

            {/* Dropdown */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 z-50 mt-1 w-72 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
                {countries.map((country) => (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => handleCountrySelect(country)}
                    className="w-full flex items-center px-3 py-2 text-left hover:bg-accent text-popover-foreground transition-colors"
                  >
                    <span className="mr-3">{country.flag}</span>
                    <span className="flex-1 text-sm">{country.name}</span>
                    <span className="text-sm font-medium text-muted-foreground">{country.dialCode}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Phone Number Input */}
          <input
            type="tel"
            value={formatPhoneNumber(phoneNumber)}
            onChange={handlePhoneNumberChange}
            placeholder={placeholder}
            disabled={disabled}
            className={`flex-1 px-3 py-2 bg-transparent text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent rounded-r-md ${className}`}
          />
        </div>

        {/* Close dropdown when clicking outside */}
        {isDropdownOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsDropdownOpen(false)}
          />
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
