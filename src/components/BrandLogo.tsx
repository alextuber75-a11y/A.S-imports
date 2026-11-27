import { useEffect, useState } from 'react';
import { OFFICIAL_LOGO_URL } from '../data/defaultCatalog';

interface BrandLogoProps {
  brandName?: string;
  customLogoUrl?: string;
  size?: 'sm' | 'md' | 'lg';
  inverted?: boolean;
}

export function BrandLogo({
  brandName = 'A.S Imports Variedades',
  customLogoUrl,
  size = 'sm',
  inverted = false,
}: BrandLogoProps) {
  const [imgError, setImgError] = useState(false);

  const trimmedUrl = customLogoUrl?.trim();
  const resolvedLogoUrl =
    !trimmedUrl || trimmedUrl === '/assets/aistudio/image_a736b359.png'
      ? OFFICIAL_LOGO_URL
      : trimmedUrl;
  const isOfficialLogo = resolvedLogoUrl === OFFICIAL_LOGO_URL;

  useEffect(() => {
    setImgError(false);
  }, [resolvedLogoUrl]);

  if (resolvedLogoUrl && !imgError) {
    if (isOfficialLogo) {
      const containerClasses =
        size === 'lg'
          ? 'w-72 sm:w-80 aspect-video rounded-2xl'
          : size === 'md'
            ? 'w-48 sm:w-56 aspect-video rounded-xl'
            : 'h-14 sm:h-[68px] aspect-video rounded-xl';

      return (
        <span
          className={`inline-flex items-center justify-center overflow-hidden bg-[#ECEEF1] shrink-0 ${containerClasses} ${
            inverted
              ? 'ring-1 ring-white/25 shadow-sm'
              : 'border border-[#1B4272]/15 shadow-xs'
          }`}
        >
          <img
            src={resolvedLogoUrl}
            alt={brandName}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-contain object-center scale-[1.55]"
          />
        </span>
      );
    }

    if (size === 'lg' || size === 'md') {
      return (
        <div
          className={`inline-flex items-center gap-4 rounded-2xl border overflow-hidden p-3.5 ${
            inverted
              ? 'bg-white border-white/20 shadow-sm'
              : 'bg-white/95 border-[#1B4272]/15 shadow-xs'
          }`}
        >
          <img
            src={resolvedLogoUrl}
            alt={brandName}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className={
              size === 'lg'
                ? 'h-16 w-auto max-w-[220px] object-contain rounded-lg'
                : 'h-12 w-auto max-w-[180px] object-contain rounded-lg'
            }
          />
          <div className="flex flex-col">
            <span className="font-display font-extrabold tracking-tight text-lg leading-tight text-[#0B1F3A]">
              {brandName.toUpperCase()}
            </span>
            <span className="font-display font-semibold tracking-wider text-xs text-[#EA580C]">
              LOJA DE VARIEDADES
            </span>
          </div>
        </div>
      );
    }

    return (
      <span className="inline-flex items-center gap-2.5 whitespace-nowrap shrink-0">
        <img
          src={resolvedLogoUrl}
          alt=""
          aria-hidden="true"
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="h-11 w-auto max-w-[160px] object-contain rounded bg-white p-0.5"
        />
        <span
          className={`font-display font-bold tracking-tight text-base whitespace-nowrap ${
            inverted ? 'text-white' : 'text-[#0B1F3A]'
          }`}
        >
          {brandName}
        </span>
      </span>
    );
  }

  if (size === 'sm') {
    return (
      <span className="inline-flex items-center gap-2.5 whitespace-nowrap shrink-0">
        <svg
          width="34"
          height="34"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className="shrink-0"
        >
          <rect
            width="40"
            height="40"
            rx="9"
            fill={inverted ? '#FFFFFF' : '#0B1F3A'}
          />
          <path
            d="M11 28L17.5 11H21.2L27.5 28H23.6L22.2 24H16.4L15 28H11ZM17.4 20.8H21.2L19.3 15.2L17.4 20.8Z"
            fill={inverted ? '#0B1F3A' : '#FFFFFF'}
          />
          <path d="M27.5 11.5L32.5 16.5V11.5H27.5Z" fill="#F97316" />
          <rect x="11" y="30.5" width="18" height="2.5" rx="1.25" fill="#F97316" />
        </svg>
        <span
          className={`font-display font-bold tracking-tight text-base whitespace-nowrap ${
            inverted ? 'text-white' : 'text-[#0B1F3A]'
          }`}
        >
          {brandName}
        </span>
      </span>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-4 p-3.5 rounded-xl border ${
        inverted
          ? 'bg-white/5 border-white/15'
          : 'bg-[#F8FAFC] border-slate-200'
      }`}
    >
      <svg
        width="56"
        height="56"
        viewBox="0 0 56 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        <rect
          width="56"
          height="56"
          rx="12"
          fill={inverted ? '#FFFFFF' : '#0B1F3A'}
        />
        <path
          d="M14.5 39L24 14.5H29.4L38.8 39H33.2L31.2 33.2H22.2L20.1 39H14.5ZM23.6 28.6H29.8L26.7 19.6L23.6 28.6Z"
          fill={inverted ? '#0B1F3A' : '#FFFFFF'}
        />
        <path d="M38.5 14.5L46 22V14.5H38.5Z" fill="#F97316" />
        <rect x="14.5" y="42.5" width="27" height="3.2" rx="1.6" fill="#F97316" />
      </svg>
      <div className="flex flex-col">
        <span
          className={`font-display font-extrabold tracking-tight text-xl leading-none ${
            inverted ? 'text-white' : 'text-[#0B1F3A]'
          }`}
        >
          A.S IMPORTS
        </span>
        <span className="font-display font-bold tracking-[0.18em] text-xs text-[#EA580C] mt-1.5">
          VARIEDADES
        </span>
      </div>
    </div>
  );
}
