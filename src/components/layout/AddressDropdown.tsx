"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, Search, X } from "lucide-react";

interface AddressDropdownProps {
  options: string[];
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  disabled?: boolean;
}

export default function AddressDropdown({
  options,
  value,
  onChange,
  placeholder,
  disabled = false,
}: AddressDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset search term when opening/closing
  useEffect(() => {
    if (isOpen) {
      setSearchTerm("");
    }
  }, [isOpen]);

  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div ref={dropdownRef} className="relative w-full">
      {/* Trigger Button */}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full border border-gray-200 rounded-lg pl-3 pr-10 py-2.5 text-sm bg-white transition-all duration-200 cursor-pointer shadow-xs hover:border-gray-300 flex items-center justify-between min-h-[42px] select-none ${
          disabled
            ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
            : isOpen
            ? "border-primary ring-2 ring-red-100"
            : "text-gray-800"
        }`}
      >
        <span className="truncate">{value || placeholder}</span>
        <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />
      </div>

      {/* Options List Panel */}
      {isOpen && !disabled && (
        <div className="absolute left-0 right-0 mt-1.5 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden animate-[slide-in_0.2s_ease-out_forwards] max-h-60 flex flex-col">
          {/* Search Box */}
          <div className="relative p-2 border-b border-gray-50 flex items-center gap-2 bg-gray-50/50">
            <Search size={14} className="text-gray-400 absolute left-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm nhanh..."
              className="w-full bg-white border border-gray-200 rounded-lg pl-8 pr-8 py-1.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-primary"
              autoFocus
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-4 text-gray-400 hover:text-gray-600"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Options List */}
          <div className="overflow-y-auto flex-1 py-1 max-h-48 divide-y divide-gray-50">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <div
                  key={opt}
                  onClick={() => {
                    onChange(opt);
                    setIsOpen(false);
                  }}
                  className={`px-3 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-primary transition-colors cursor-pointer truncate ${
                    value === opt ? "bg-red-50/50 text-primary font-semibold" : ""
                  }`}
                >
                  {opt}
                </div>
              ))
            ) : (
              <div className="px-3 py-3 text-xs text-gray-400 text-center">
                Không tìm thấy kết quả
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
