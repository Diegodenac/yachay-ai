const CorrectionCard = ({ original, correcto, explicacion }) => (
  <div style={{
    background: 'linear-gradient(135deg, #1a1a00 0%, #0d1a00 100%)',
    border: '1px solid #F5A623',
    borderLeft: '3px solid #F5A623',
    borderRadius: '8px',
    padding: '10px 14px',
    marginTop: '10px',
    fontSize: '13px',
  }}>
    <div style={{ color: '#F5A623', fontWeight: 700, marginBottom: '6px', fontSize: '11px', letterSpacing: '0.05em' }}>
      ✦ CORRECCIÓN
    </div>
    <div style={{ color: '#ff6b6b', marginBottom: '3px' }}>
      <span style={{ color: '#666', fontSize: '11px' }}>Escribiste: </span>{original}
    </div>
    <div style={{ color: '#69db7c', marginBottom: '3px' }}>
      <span style={{ color: '#666', fontSize: '11px' }}>Correcto: </span>{correcto}
    </div>
    <div style={{ color: '#AAAAAA', fontSize: '12px', fontStyle: 'italic' }}>
      {explicacion}
    </div>
  </div>
);

const parseMessage = (text) => {
  const correctionRegex = /%%CORRECTION%%([\s\S]*?)%%END_CORRECTION%%/;
  const match = text.match(correctionRegex);

  if (!match) return { cleanText: text, correction: null };

  const block = match[1];
  const original = block.match(/ORIGINAL:\s*(.+)/)?.[1]?.trim() || '';
  const correcto = block.match(/CORRECTO:\s*(.+)/)?.[1]?.trim() || '';
  const explicacion = block.match(/EXPLICACIÓN:\s*(.+)/)?.[1]?.trim() || '';
  const cleanText = text.replace(correctionRegex, '').trim();

  return { cleanText, correction: { original, correcto, explicacion } };
};

const MessageBubble = ({ message }) => {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
        <div style={{
          background: '#1E1E1E',
          border: '1px solid #2E2E2E',
          borderRadius: '16px 16px 4px 16px',
          padding: '10px 14px',
          maxWidth: '75%',
          color: '#FFFFFF',
          fontSize: '15px',
          lineHeight: '1.5',
        }}>
          {message.content}
        </div>
      </div>
    );
  }

  const { cleanText, correction } = parseMessage(message.content);

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '12px' }}>
      <div style={{ maxWidth: '80%' }}>
        <div style={{
          background: '#111111',
          border: '1px solid #1E1E1E',
          borderRadius: '16px 16px 16px 4px',
          padding: '10px 14px',
          color: '#EEEEEE',
          fontSize: '15px',
          lineHeight: '1.6',
        }}>
          {cleanText}
        </div>
        {correction && (
          <CorrectionCard
            original={correction.original}
            correcto={correction.correcto}
            explicacion={correction.explicacion}
          />
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
