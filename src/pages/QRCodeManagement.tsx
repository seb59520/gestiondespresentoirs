import React from 'react';
import { ArrowLeft, Download, Printer, Share2, Link as LinkIcon } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { getPublicDisplayUrl } from '../utils/url';

interface QRCodeManagementProps {
  onBack: () => void;
}

export const QRCodeManagement: React.FC<QRCodeManagementProps> = ({ onBack }) => {
  const domain = JSON.parse(localStorage.getItem('domain') || '{}');
  const displays = domain.displays || [];

  const handleDownload = (displayId: string, displayName: string) => {
    const svg = document.getElementById(`qr-${displayId}`);
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

  const handlePrint = (displayId: string) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const svg = document.getElementById(`qr-${displayId}`);
    if (!svg) return;

    const display = displays.find(d => d.id === displayId);
    const displayUrl = getPublicDisplayUrl(displayId);

    printWindow.document.write(`
      <html>
        <head>
          <title>QR Code - ${display?.name}</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; }
            .container { text-align: center; padding: 20px; }
            .qr-code { margin: 20px 0; }
            .info { color: #666; font-size: 14px; margin: 10px 0; }
            .url { 
              color: #2563eb; 
              font-family: monospace; 
              background: #f9fafb; 
              padding: 8px; 
              border-radius: 4px;
              margin: 10px 0;
              word-break: break-all;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>${display?.name}</h2>
            <div class="qr-code">
              ${svg.outerHTML}
            </div>
            <p class="info">Scanner ce QR code pour accéder aux informations du présentoir</p>
            <p class="url">${displayUrl}</p>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.print();
  };

  const handleCopyLink = (displayUrl: string) => {
    navigator.clipboard.writeText(displayUrl);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Retour au tableau de bord
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des QR Codes</h1>
        </div>

        {displays.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <p className="text-gray-500">Aucun présentoir n'a été créé</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {displays.map((display) => {
              const displayUrl = getPublicDisplayUrl(display.id);
              return (
                <div key={`display-${display.id}`} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">{display.name}</h3>
                    
                    <div className="flex justify-center bg-gray-50 p-4 rounded-lg">
                      <QRCodeSVG
                        id={`qr-${display.id}`}
                        value={displayUrl}
                        size={150}
                        level="H"
                        includeMargin
                      />
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleDownload(display.id, display.name)}
                        className="flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Télécharger
                      </button>
                      <button
                        onClick={() => handlePrint(display.id)}
                        className="flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <Printer className="h-4 w-4 mr-2" />
                        Imprimer
                      </button>
                    </div>

                    <div className="mt-4">
                      <p className="text-sm text-gray-500 mb-2">Scanner pour accéder aux informations publiques du présentoir</p>
                      <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded">
                        <p className="text-sm font-mono flex-1 select-all text-blue-600 break-all">
                          {displayUrl}
                        </p>
                        <button
                          onClick={() => handleCopyLink(displayUrl)}
                          className="p-1 hover:bg-gray-100 rounded"
                          title="Copier le lien"
                        >
                          <LinkIcon className="h-4 w-4 text-gray-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};