interface FolderPickerProps {
  onFolderSelected: (path: string) => void;
}

export default function FolderPicker({ onFolderSelected }: FolderPickerProps) {
  async function handleSelectFolder() {
    const path = await window.electronAPI.selectFolder();
    if (path) {
      onFolderSelected(path);
    }
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      gap: '24px',
      padding: '32px'
    }}>
      <h1 style={{ fontSize: '32px', fontWeight: 600 }}>
        Welcome to Eisenhower Matrix
      </h1>
      <p style={{
        color: 'var(--color-text-secondary)',
        textAlign: 'center',
        maxWidth: '500px'
      }}>
        Choose a folder to store your tasks. All tasks will be saved as markdown files
        in this folder, making them accessible to other tools like Claude Cowork.
      </p>
      <button
        onClick={handleSelectFolder}
        style={{
          padding: '12px 24px',
          backgroundColor: 'var(--color-primary)',
          color: 'white',
          borderRadius: 'var(--radius-md)',
          fontSize: '16px',
          fontWeight: 500,
          cursor: 'pointer',
          border: 'none'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--color-primary)';
        }}
      >
        Select Folder
      </button>
    </div>
  );
}
