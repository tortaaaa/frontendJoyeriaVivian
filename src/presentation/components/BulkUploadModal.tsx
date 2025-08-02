// src/presentation/components/cms/BulkUploadModal.tsx
import React, { useRef } from 'react';
import * as XLSX from 'xlsx';
import styles from './BulkUploadModal.module.css';

interface BulkUploadModalProps {
  show: boolean;
  onClose: () => void;
  onFileLoaded: (rows: any[]) => void;
}

const BulkUploadModal: React.FC<BulkUploadModalProps> = ({ show, onClose, onFileLoaded }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!show) return null;

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(firstSheet, { defval: '' });
      onFileLoaded(rows);
      onClose();
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files.length) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modal}>
        <h2>Carga Masiva de Productos (.xlsx)</h2>
        <div
          className={styles.dropArea}
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
        >
          Arrastra y suelta tu archivo aquí o haz clic para seleccionarlo
          <input
            type="file"
            ref={fileInputRef}
            accept=".xlsx"
            style={{ display: 'none' }}
            onChange={handleInputChange}
          />
        </div>
        <button className={styles.closeButton} onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default BulkUploadModal;
