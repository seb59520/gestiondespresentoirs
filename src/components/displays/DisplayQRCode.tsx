import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Link as LinkIcon } from 'lucide-react';
import { getPublicDisplayUrl } from '../../utils/url';

interface DisplayQRCodeProps {
  displayId: string;
  displayName: string;
}

export const DisplayQRCode: React.FC<DisplayQRCodeProps> = ({ displayId, displayName }) => {
  const [showQR, setShowQR] = useState(false);
  
  // Créer l'URL publique pour le présentoir
  const displayUrl = getPublicDisplayUrl(displayId);

  const handleDownload = () => {
    const svg = document.getElementById('display-qr-code');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      
      const downloadLink = document.createElement('a');
      downloadLink.download = `qr-presentoir-${displayName.toLowerCase().replace(/\s+/g, '-')}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(displayUrl);
  };

  return (
    <div className="mt-4">
      <button
        onClick={() => setShowQR(!showQR)}
        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
      >
        {showQR ? 'Masquer le QR Code' : 'Afficher le QR Code'}
      </button>

      {showQR && (
        <div className="mt-4 p-4 bg-white rounded-lg shadow-sm">
          <div className="flex flex-col items-center">
            <QRCodeSVG
              id="display-qr-code"
              value={displayUrl}
              size={200}
              level="H"
              includeMargin
            />
            <div className="mt-4 text-sm w-full">
              <p className="text-gray-500 mb-2">Scanner ce QR code pour accéder aux informations publiques du présentoir</p>
              <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded">
                <p className="text-blue-600 font-mono flex-1 select-all break-all">
                  {displayUrl}
                </p>
                <button
                  onClick={handleCopyLink}
                  className="p-1 hover:bg-gray-100 rounded"
                  title="Copier le lien"
                >
                  <LinkIcon className="h-4 w-4 text-gray-500" />
                </button>
              </div>
              <div className="mt-4 flex justify-center">
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger le QR code
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};