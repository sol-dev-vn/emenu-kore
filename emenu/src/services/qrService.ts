// QR Code generation and management service
import QRCode from 'qrcode';

export interface QRCodeOptions {
  size?: number;
  margin?: number;
  color?: {
    dark?: string;
    light?: string;
  };
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  includeTableNumber?: boolean;
  customBranding?: boolean;
}

export interface QRGenerationRequest {
  branchId: string;
  layoutId: string;
  tableIds: string[];
  options: QRCodeOptions;
}

export interface QRCodeData {
  tableId: string;
  tableNumber: string;
  branchId: string;
  branchName: string;
  layoutId: string;
  layoutName: string;
  url: string;
}

export interface GeneratedQRCode {
  id: string;
  tableId: string;
  tableNumber: string;
  qrCodeDataUrl: string;
  downloadUrl: string;
  status: 'generated' | 'processing' | 'failed';
  createdAt: string;
}

export class QRCodeService {
  private static readonly DEFAULT_OPTIONS: QRCodeOptions = {
    size: 250,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    },
    errorCorrectionLevel: 'M',
    includeTableNumber: true,
    customBranding: true
  };

  /**
   * Generate QR code data URL for a specific table
   */
  static async generateQRCode(
    data: QRCodeData,
    options: QRCodeOptions = {}
  ): Promise<string> {
    const mergedOptions = { ...this.DEFAULT_OPTIONS, ...options };

    // Create the URL that the QR code will point to
    const qrData = JSON.stringify({
      tableId: data.tableId,
      tableNumber: data.tableNumber,
      branchId: data.branchId,
      branchName: data.branchName,
      layoutId: data.layoutId,
      layoutName: data.layoutName,
      timestamp: new Date().toISOString()
    });

    try {
      // Generate QR code as data URL
      const qrDataUrl = await QRCode.toDataURL(qrData, {
        width: mergedOptions.size,
        margin: mergedOptions.margin,
        color: mergedOptions.color,
        errorCorrectionLevel: mergedOptions.errorCorrectionLevel
      });

      return qrDataUrl;
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw new Error('Failed to generate QR code');
    }
  }

  /**
   * Generate QR codes for multiple tables in a layout
   */
  static async generateBatchQRCodes(
    request: QRGenerationRequest
  ): Promise<GeneratedQRCode[]> {
    const generatedCodes: GeneratedQRCode[] = [];

    for (const tableId of request.tableIds) {
      try {
        const qrData: QRCodeData = {
          tableId,
          tableNumber: tableId.replace('table-', ''),
          branchId: request.branchId,
          branchName: `Branch ${request.branchId}`,
          layoutId: request.layoutId,
          layoutName: `Layout ${request.layoutId}`,
          url: `/qr/${tableId}`
        };

        const qrDataUrl = await this.generateQRCode(qrData, request.options);

        generatedCodes.push({
          id: `qr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          tableId,
          tableNumber: qrData.tableNumber,
          qrCodeDataUrl,
          downloadUrl: qrDataUrl,
          status: 'generated',
          createdAt: new Date().toISOString()
        });
      } catch (error) {
        console.error(`Error generating QR code for table ${tableId}:`, error);
        generatedCodes.push({
          id: `qr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          tableId,
          tableNumber: tableId.replace('table-', ''),
          qrCodeDataUrl: '',
          downloadUrl: '',
          status: 'failed',
          createdAt: new Date().toISOString()
        });
      }
    }

    return generatedCodes;
  }

  /**
   * Generate QR code with custom branding overlay
   */
  static async generateBrandedQRCode(
    data: QRCodeData,
    brandLogo: string,
    options: QRCodeOptions = {}
  ): Promise<string> {
    if (!options.customBranding) {
      return this.generateQRCode(data, options);
    }

    // This would require canvas manipulation to add logo overlay
    // For now, return the basic QR code
    return this.generateQRCode(data, options);
  }

  /**
   * Validate QR code data before generation
   */
  static validateQRData(data: Partial<QRCodeData>): string[] {
    const errors: string[] = [];

    if (!data.tableId) {
      errors.push('Table ID is required');
    }

    if (!data.tableNumber) {
      errors.push('Table number is required');
    }

    if (!data.branchId) {
      errors.push('Branch ID is required');
    }

    if (!data.layoutId) {
      errors.push('Layout ID is required');
    }

    return errors;
  }

  /**
   * Generate printable QR code sheets (A4 format)
   */
  static async generatePrintableQRSheets(
    qrCodes: GeneratedQRCode[],
    format: 'A4' | 'Letter' = 'A4'
  ): Promise<string> {
    // This would generate a PDF with multiple QR codes per page
    // For now, return a mock implementation
    const sheetHtml = `
      <html>
        <head>
          <title>SOL eMenu - QR Codes Print Sheet</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              background: white;
            }
            .qr-sheet {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 20px;
              max-width: 800px;
              margin: 0 auto;
            }
            .qr-item {
              text-align: center;
              border: 2px dashed #ccc;
              padding: 15px;
              border-radius: 8px;
            }
            .qr-image {
              width: 200px;
              height: 200px;
              margin-bottom: 10px;
            }
            .qr-table {
              font-weight: bold;
              font-size: 18px;
              color: #333;
            }
            .qr-info {
              font-size: 12px;
              color: #666;
              margin-top: 5px;
            }
            @media print {
              body { margin: 0; }
              .qr-sheet {
                grid-template-columns: repeat(3, 1fr);
                gap: 15px;
              }
            }
          </style>
        </head>
        <body>
          <h1 style="text-align: center; margin-bottom: 30px;">SOL Restaurant QR Codes</h1>
          <div class="qr-sheet">
            ${qrCodes.map(qr => `
              <div class="qr-item">
                <div class="qr-table">Table ${qr.tableNumber}</div>
                <img src="${qr.qrCodeDataUrl}" alt="QR Code" class="qr-image" />
                <div class="qr-info">Scan to view menu</div>
              </div>
            `).join('')}
          </div>
        </body>
      </html>
    `;

    // In a real implementation, this would convert HTML to PDF
    return `data:text/html;base64,${btoa(sheetHtml)}`;
  }

  /**
   * Download QR codes as individual files
   */
  static downloadQRCode(qrCode: GeneratedQRCode, filename?: string): void {
    const link = document.createElement('a');
    link.download = filename || `table-${qrCode.tableNumber}-qr.png`;
    link.href = qrCode.qrCodeDataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Download all QR codes as a ZIP file
   */
  static async downloadAllQRCodes(qrCodes: GeneratedQRCode[]): Promise<void> {
    // This would require JSZip or similar library
    // For now, download them individually
    qrCodes.forEach((qrCode, index) => {
      setTimeout(() => {
        this.downloadQRCode(qrCode);
      }, index * 100); // Stagger downloads
    });
  }

  /**
   * Get QR code statistics
   */
  static getQRStatistics(qrCodes: GeneratedQRCode[]) {
    const total = qrCodes.length;
    const generated = qrCodes.filter(qr => qr.status === 'generated').length;
    const failed = qrCodes.filter(qr => qr.status === 'failed').length;
    const processing = qrCodes.filter(qr => qr.status === 'processing').length;

    return {
      total,
      generated,
      failed,
      processing,
      successRate: total > 0 ? (generated / total) * 100 : 0
    };
  }
}

export default QRCodeService;