import React from 'react';
import QRCode from 'react-qr-code';

const QRCodeComponent = ({ url, title }) => {
  return (
    <div className="qr-container">
      <h3>{title}</h3>
      <div className="qr-code-wrapper">
        <QRCode
          value={url}
          size={200}
          style={{ height: "auto", maxWidth: "100%", width: "100%" }}
        />
      </div>
      <p className="qr-url">{url}</p>
    </div>
  );
};

export default QRCodeComponent;
