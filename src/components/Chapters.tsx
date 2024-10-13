import React, { useEffect, useState } from "react";
import { getChaptersDetail } from "../api/helper";

interface ChapterProps {
  chapterId: number;
}

interface Image {
  id: number;
  file: string;
  width: number;
  height: number;
}

interface ImagePage {
  id: number;
  page_index: number;
  image: Image;
}

interface BookData {
  id: number;
  title: string;
  book: {
    id: number;
    title: string;
    chapter_ids: number[];
  };
  chapter_index: number;
  pages: ImagePage[];
}

const Chapter: React.FC<ChapterProps> = ({ chapterId }) => {
  const [bookData, setBookData] = useState<BookData | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        const response = await getChaptersDetail(chapterId);
        setBookData(response?.data);
        setCurrentPage(0);
      } catch (err) {
        setError("Failed to load book data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookData();
  }, [chapterId]);

  const handlePageChange = (index: number) => {
    setCurrentPage(index);
  };

  const handleImageClick = (event: React.MouseEvent<HTMLImageElement>) => {
    const { clientX } = event;
    const imageElement = event.currentTarget;
    const { left, width } = imageElement.getBoundingClientRect();
    const clickPosition = clientX - left;

    if (clickPosition < width / 2) {
      goToPreviousPage();
    } else {
      goToNextPage();
    }
  };

  const goToNextPage = () => {
    if (currentPage < (bookData?.pages.length || 0) - 1) {
      handlePageChange(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      handlePageChange(currentPage - 1);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!bookData || !bookData.pages.length) {
    return <div>No pages available.</div>;
  }

  const totalPages = bookData.pages.length;
  const currentImage = bookData.pages[currentPage];

  return (
    <div className="book-viewer">
      <div className="image-viewer">
        <img
          src={currentImage.image.file}
          alt={`Page ${currentImage.page_index + 1}`}
          onClick={handleImageClick}
          style={{ cursor: "pointer" }}
        />
        <p>
          {currentPage + 1} / {totalPages}
        </p>
      </div>
    </div>
  );
};

export default Chapter;
