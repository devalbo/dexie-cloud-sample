
export const AppContainer = ({children}: {children: React.ReactNode}) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      width: '100%',
      margin: '0 auto',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {children}
    </div>
  );
}