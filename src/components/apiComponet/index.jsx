import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ApiComponent = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://hospitalemcor.com.br/claviscord/api/index.php?table=chaves');
        const encryptedData = response.data;
        const decryptedData = await decryptData(encryptedData, '0123456789ABCDEF0123456789ABCDEF');
        setData(JSON.parse(decryptedData));
      } catch (error) {
        console.error('Erro ao obter dados:', error);
      }
    };

    fetchData();
  }, []);

  const decryptData = (data, key) => {
    const base64Decoded = atob(data);
    const iv = base64Decoded.slice(0, 16);
    const ciphertext = base64Decoded.slice(16);
    const keyBytes = new TextEncoder().encode(key);

    return crypto.subtle.importKey('raw', keyBytes, 'AES-CBC', false, ['decrypt'])
        .then(cryptoKey => {
            return crypto.subtle.decrypt({ name: 'AES-CBC', iv: new Uint8Array([...atob(iv)].map(char => char.charCodeAt(0))) }, cryptoKey, new Uint8Array([...atob(ciphertext)].map(char => char.charCodeAt(0))));
        })
        .then(decrypted => {
            return new TextDecoder().decode(decrypted);
        });
};


  return (
    <div>
      <h1>Dados Descriptografados:</h1>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
};

export default ApiComponent;