import React, { useEffect, useState } from "react";
import "../App.css";
import { getBook, getBookById } from "../api/helper";
import Chapter from "./Chapters";

interface TagButtonProps {
  tag: string;
  id: number;
  active: boolean;
  onClick: (tag: string, id: number) => void;
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number, chapterId: number) => void;
  chapterIds: any;
}

interface Book {
  id: number;
  title: string;
  chapter_ids: number[];
}

const TagButton: React.FC<TagButtonProps> = ({ tag, id, active, onClick }) => {
  return (
    <button
      className={`tag-button ${active ? "active" : ""}`}
      onClick={() => onClick(tag, id)}
    >
      {tag}
    </button>
  );
};

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  chapterIds,
  onPageChange,
}) => {
  const pages = [...Array(totalPages).keys()].map((i) => i + 1);

  return (
    <div className="pagination">
      {pages.map((page) => (
        <button
          key={page}
          className={`page-button ${currentPage === page ? "active" : ""}`}
          onClick={() => {
            const chapterId = chapterIds[page - 1];
            onPageChange(page, chapterId);
          }}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

const Books: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [activeTag, setActiveTag] = useState<string>("balloon_dream");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [activeBookChapters, setActiveBookChapters] = useState<number[]>([]);
  const [chapterId, setChapterId] = useState<number>(1);

  useEffect(() => {
    async function getBooks() {
      const response = await getBook();
      if (response.status === 200) {
        const fetchedBooks = response?.data;
        setBooks(fetchedBooks);
        if (fetchedBooks.length > 0) {
          setActiveTag(fetchedBooks[0].title);
          fetchBookById(fetchedBooks[0].id);
        }
      }
    }
    getBooks();
  }, []);

  const fetchBookById = async (id: number) => {
    const response = await getBookById(id);
    if (response.status === 200) {
      const bookData = response.data;
      setActiveBookChapters(bookData.chapter_ids);
      setTotalPages(bookData.chapter_ids.length);
      setChapterId(bookData.chapter_ids[0]);
      setCurrentPage(1);
    }
  };

  const handlePageChange = (page: number, chapterId: number): void => {
    setChapterId(chapterId);
    setCurrentPage(page);
  };

  const handleTagClick = (tag: string, id: number): void => {
    setActiveTag(tag);
    setCurrentPage(1);
    fetchBookById(id);
  };

  return (
    <div className="app-container">
      <div className="tags">
        {books.map((book) => (
          <TagButton
            key={book.id}
            tag={book.title}
            id={book.id}
            active={book.title === activeTag}
            onClick={handleTagClick}
          />
        ))}
      </div>

      <div className="content-wrapper">
        {activeBookChapters.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            chapterIds={activeBookChapters}
          />
        )}

        <Chapter chapterId={chapterId} />
      </div>
    </div>
  );
};

export default Books;
