const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  if (name === '' || name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (pageCount < readPage) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });

    response.code(400);

    return response;
  }
  const newBook = {
    id,
    updatedAt,
    insertedAt,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    finished: false,
  };
  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllBooksHandler = (request, h) => {
  const queryName = request.query.name;
  const queryReading = request.query.reading;
  const queryFinished = request.query.finished;

  if (queryName !== undefined) {
    const result = [];

    books.map((book) => {
      if (book.name.toLowerCase().includes(queryName.toLowerCase())) {
        result.push({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        });
      }
    });
    const response = h.response({
      status: 'success',
      data: {
        books: result,
      },
    });

    return response;
  }

  // Reading
  if (queryReading !== undefined) {
    if (queryReading === '0') {
      const result = [];
      books.map((book) => {
        if (book.reading === false) {
          result.push({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          });
        }
      });

      const response = h.response({
        status: 'success',
        data: {
          books: result,
        },
      });

      return response;
    }
    if (queryReading === '1') {
      const result = [];
      books.map((book) => {
        if (book.reading === true) {
          result.push({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          });
        }
      });

      const response = h.response({
        status: 'success',
        data: {
          books: result,
        },
      });

      return response;
    }
  }

  // Finished
  if (queryFinished !== undefined) {
    if (queryFinished === '0') {
      const result = [];

      books.map((book) => {
        if (book.finished === false) {
          result.push({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          });
        }
      });

      const response = h.response({
        status: 'success',
        data: {
          books: result,
        },
      });

      return response;
    }
    if (queryFinished === '1') {
      const result = [];
      books.map((book) => {
        if (book.finished === true) {
          result.push({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          });
        }
      });

      const response = h.response({
        status: 'success',
        data: {
          books: result,
        },
      });

      return response;
    }
  }
  const result = [];
  books.map((book) => {
    result.push({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    });
  });
  const response = h.response({
    status: 'success',
    data: {
      books: result,
    },
  });

  return response;
};
const getBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const book = books.filter((b) => b.id === id)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};
const editBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();

  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    // Book didt have a name
    if (name === '' || name === undefined) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      });

      response.code(400);

      return response;
    }

    // Book readpage more than pagecount
    if (pageCount < readPage) {
      const response = h.response({
        status: 'fail',
        message:
          'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      });

      response.code(400);

      return response;
    }

    // Edited book success
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  // ID book not found
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
