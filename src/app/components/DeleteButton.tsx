import React from 'react';

interface DeleteButtonProps {
    fileId: any;
    onDeleted?: () => void;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ fileId, onDeleted }) => {
    const handleDelete = async () => {
        try {
            const response = await fetch(`/api/upload/${fileId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                onDeleted?.();
            } else {
                alert('Error al eliminar el archivo');
            }
        } catch (error) {
            alert('Error de red al eliminar el archivo');
        }
    };

    return (
        <button onClick={handleDelete} style={{ color: 'white', background: 'red', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}>
            Eliminar
        </button>
    );
};

export default DeleteButton;