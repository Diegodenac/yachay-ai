const ProgressBar = ({ wordsLearned = 0, corrections = 0 }) => (
  <div style={{
    display: 'flex',
    gap: '16px',
    padding: '8px 0 12px 0',
    borderBottom: '1px solid #1E1E1E',
    marginBottom: '8px',
    justifyContent: 'center',
  }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{ color: '#F5A623', fontWeight: 700, fontSize: '18px' }}>{wordsLearned}</div>
      <div style={{ color: '#555', fontSize: '11px' }}>palabras</div>
    </div>
    <div style={{ width: '1px', background: '#222' }} />
    <div style={{ textAlign: 'center' }}>
      <div style={{ color: '#2E7D32', fontWeight: 700, fontSize: '18px' }}>{corrections}</div>
      <div style={{ color: '#555', fontSize: '11px' }}>correcciones</div>
    </div>
  </div>
);

export default ProgressBar;
