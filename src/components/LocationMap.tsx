'use client';

interface LocationMapProps {
  address: string;
  name: string;
}

export default function LocationMap({ address, name }: LocationMapProps) {
  // Google Maps embed URL (API 키 불필요)
  const encodedAddress = encodeURIComponent(address);
  const mapUrl = `https://maps.google.com/maps?q=${encodedAddress}&output=embed`;

  return (
    <div className="mt-4 rounded-xl overflow-hidden border border-white/10 bg-black/20">
      <div className="p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-b border-white/10">
        <div className="flex items-center gap-2">
          <svg
            className="w-5 h-5 text-purple-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <p className="text-sm text-white/80 font-medium">{address}</p>
        </div>
      </div>

      <iframe
        src={mapUrl}
        width="100%"
        height="300"
        style={{ border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={`${name} 위치`}
        className="w-full"
      />

      <div className="p-3 bg-black/20 border-t border-white/10">
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
          구글 지도에서 크게 보기
        </a>
      </div>
    </div>
  );
}
