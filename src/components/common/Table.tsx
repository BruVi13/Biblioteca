import { Edit, Trash2 } from 'lucide-react';
import styles from './Table.module.css';
import type { TableColumn } from '../../types';

interface TableProps<T extends { id: string | number }> {
  columns: TableColumn<T>[];
  data: T[];
  onEdit: (item: T) => void;
  onDelete: (id: T['id']) => void;
}

const Table = <T extends { id: string | number }>({ columns, data, onEdit, onDelete }: TableProps<T>) => {
  return (
    <div className="table-container">
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={String(col.key)}>{col.label}</th>
            ))}
            <th style={{ width: '100px' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + 1} className={styles.empty}>
                No hay registros para mostrar
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item.id}>
                {columns.map((col) => (
                  <td key={`${item.id}-${String(col.key)}`}>
                    {col.render
                      ? col.render(item)
                      : (item as any)[col.key as keyof T]}
                  </td>
                ))}
                <td>
                  <div className={styles.actions}>
                    <button
                      onClick={() => onEdit(item)}
                      className={styles.editBtn}
                      title="Editar"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(item.id)}
                      className={styles.deleteBtn}
                      title="Eliminar"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
