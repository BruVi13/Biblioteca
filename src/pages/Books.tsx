import { useState } from 'react';
import type { FormEvent } from 'react';
import { Plus } from 'lucide-react';
import Table from '../components/common/Table';
import Modal from '../components/common/Modal';
import type { Book, BookFormData } from '../models/Book';
import { useBooksController } from '../hooks/useBooksController';

const Books = () => {
    const {
        books,
        authors,
        publishers,
        categories,
        addBook,
        updateBook,
        deleteBook
    } = useBooksController();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentBook, setCurrentBook] = useState<Book | null>(null);
    const [formData, setFormData] = useState<BookFormData>({
        title: '',
        authorId: '',
        publisherId: '',
        categoryId: '',
        isbn: '',
        publicationYear: '',
        description: '',
    });

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let success = false;

        if (currentBook) {
            success = await updateBook(currentBook.id, formData);
        } else {
            success = await addBook(formData);
        }

        if (success) {
            handleCloseModal();
        }
    };

    const handleDelete = async (id: string) => {
        await deleteBook(id);
    };

    const handleEdit = (book: Book) => {
        setCurrentBook(book);
        setFormData({
            title: book.title,
            authorId: book.authorId,
            publisherId: book.publisherId,
            categoryId: book.categoryId,
            isbn: book.isbn,
            publicationYear: String(book.publicationYear),
            description: book.description,
        });
        setIsModalOpen(true);
    };

    const handleOpenModal = () => {
        setCurrentBook(null);
        setFormData({
            title: '',
            authorId: '',
            publisherId: '',
            categoryId: '',
            isbn: '',
            publicationYear: '',
            description: '',
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentBook(null);
    };

    const columns = [
        { key: 'title', label: 'Título' },
        { key: 'author', label: 'Autor', render: (book: Book) => book.author?.name || 'N/A' },
        {
            key: 'publisher',
            label: 'Editorial',
            render: (book: Book) => book.publisher?.name || 'N/A',
        },
        {
            key: 'category',
            label: 'Categoría',
            render: (book: Book) => book.category?.name || 'N/A',
        },
        { key: 'publicationYear', label: 'Año' },
    ];

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Gestión de Libros</h1>
                <button onClick={handleOpenModal} className="btn btn-primary">
                    <Plus size={20} />
                    Nuevo Libro
                </button>
            </div>

            <div className="card">
                <Table columns={columns} data={books} onEdit={handleEdit} onDelete={handleDelete} />
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={currentBook ? 'Editar Libro' : 'Nuevo Libro'}
            >
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Título</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Autor</label>
                        <select
                            className="form-input"
                            value={formData.authorId}
                            onChange={(e) => setFormData({ ...formData, authorId: e.target.value })}
                            required
                        >
                            <option value="">Seleccionar Autor</option>
                            {authors.map((a) => (
                                <option key={a.id} value={a.id}>
                                    {a.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Editorial</label>
                        <select
                            className="form-input"
                            value={formData.publisherId}
                            onChange={(e) =>
                                setFormData({ ...formData, publisherId: e.target.value })
                            }
                            required
                        >
                            <option value="">Seleccionar Editorial</option>
                            {publishers.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Categoría</label>
                        <select
                            className="form-input"
                            value={formData.categoryId}
                            onChange={(e) =>
                                setFormData({ ...formData, categoryId: e.target.value })
                            }
                            required
                        >
                            <option value="">Seleccionar Categoría</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">ISBN</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.isbn}
                            onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Año de Publicación</label>
                        <input
                            type="number"
                            className="form-input"
                            value={formData.publicationYear}
                            onChange={(e) =>
                                setFormData({ ...formData, publicationYear: e.target.value })
                            }
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Descripción</label>
                        <textarea
                            className="form-input"
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({ ...formData, description: e.target.value })
                            }
                            rows={3}
                        />
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: '1rem',
                            marginTop: '2rem',
                        }}
                    >
                        <button type="button" onClick={handleCloseModal} className="btn btn-outline">
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Guardar
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Books;
