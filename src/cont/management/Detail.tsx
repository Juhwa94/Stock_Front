import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";
import styles from "./management.module.css";

interface BookVO {
  bookId: number;
  title: string;
  author: string;
  publisher: string;
  publishDate: string;
  page: number;
  isbn: string;
  category: string;
  keyword: string;
  price: number;
  stock: number;
  bookWidth: number;
  bookHeight: number;
  imgn?: string;
}

const sampleBooks: Record<number, BookVO> = {
  1: {
    bookId: 1,
    title: "나는 정말 나무가 되었다",
    author: "오정희",
    publisher: "초록책방",
    publishDate: "2025-05-10",
    page: 168,
    isbn: "978-89-1111-111-1",
    category: "그림책",
    keyword: "자연, 나무, 색채",
    price: 17000,
    stock: 12,
    bookWidth: 170,
    bookHeight: 240,
    imgn: "prod1.png",
  },
  2: {
    bookId: 2,
    title: "Room of Fragments",
    author: "Yeon Moon",
    publisher: "Fragments Press",
    publishDate: "2025-04-20",
    page: 220,
    isbn: "978-89-2222-222-2",
    category: "사진",
    keyword: "사진, 기록, 풍경",
    price: 22000,
    stock: 8,
    bookWidth: 180,
    bookHeight: 250,
    imgn: "prod2.png",
  },
  3: {
    bookId: 3,
    title: "Seek Immediate Shelter",
    author: "Vincent Yu",
    publisher: "Novel Books",
    publishDate: "2025-03-15",
    page: 310,
    isbn: "978-89-3333-333-3",
    category: "소설",
    keyword: "집, 가족, 삶",
    price: 19000,
    stock: 5,
    bookWidth: 150,
    bookHeight: 220,
    imgn: "prod3.png",
  },
  4: {
    bookId: 4,
    title: "Get Lost",
    author: "Justin Halpern",
    publisher: "Novel Books",
    publishDate: "2025-02-11",
    page: 288,
    isbn: "978-89-4444-444-4",
    category: "소설",
    keyword: "여행, 모험, 성장",
    price: 18000,
    stock: 9,
    bookWidth: 150,
    bookHeight: 220,
    imgn: "prod4.png",
  },
};

const Detail: React.FC = () => {
  const backendUrl =
    process.env.REACT_APP_BACK_END_URL ?? "http://localhost:8080";

  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();

  const [book, setBook] = useState<BookVO | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/management/detail`,
          {
            params: { bookId },
          }
        );

        setBook(response.data.data ?? response.data);
      } catch (error) {
        console.error("도서 상세조회 실패:", error);

        setBook(sampleBooks[Number(bookId)] ?? sampleBooks[1]);
      }
    };

    fetchDetail();
  }, [backendUrl, bookId]);

  if (!book) {
    return (
      <div className={styles.loadingMessage}>
        도서 정보를 불러오는 중입니다.
      </div>
    );
  }

  return (
    <>
      <header className={styles.topHeader}>
        <div className={styles.topBar}>
          <div className={styles.logo}>재고 관리</div>
        </div>
      </header>

      <main className={styles.detailContainer}>
        <header className={styles.pageHeader}>
          <h1>도서 프로필</h1></header>
      
        

        <section className={styles.detailContent}>
          <div className={styles.detailImage}>
            {book.imgn ? (
              <img
                src={`/images/${book.imgn}`}
                alt={book.title}
              />
            ) : (
              <div className={styles.imagePlaceholder}>
                No Image
              </div>
            )}
          </div>

          <div className={styles.detailInfo}>
            <div className={styles.detailRow}>
              <strong>제목</strong>
              <span>{book.title}</span>
            </div>

            <div className={styles.detailRow}>
              <strong>저자</strong>
              <span>{book.author}</span>
            </div>

            <div className={styles.detailRow}>
              <strong>출판사</strong>
              <span>{book.publisher}</span>
            </div>

            <div className={styles.detailRow}>
              <strong>출판일</strong>
              <span>{book.publishDate}</span>
            </div>

            <div className={styles.detailRow}>
              <strong>페이지</strong>
              <span>{book.page}쪽</span>
            </div>

            <div className={styles.detailRow}>
              <strong>ISBN</strong>
              <span>{book.isbn}</span>
            </div>

        

            <div className={styles.detailRow}>
              <strong>분야</strong>
              <span>{book.category}</span>
            </div>

            <div className={styles.detailRow}>
              <strong>키워드</strong>
              <span>{book.keyword}</span>
            </div>

            <div className={styles.detailRow}>
              <strong>가격</strong>
              <span>{book.price.toLocaleString()}원</span>
            </div>

            <div className={styles.detailRow}>
              <strong>재고</strong>
              <span>{book.stock}권</span>
            </div>
          </div>
        </section>

        <div className={styles.bottomArea}>
          <button
            type="button"
            className={styles.outlineButton}
            onClick={() => navigate("/management/list")}
          >
            ← 이전 도서 리스트
          </button>

          <Link
            to={`/management/form2/${book.bookId}`}
            className={styles.primaryButton}
          >
            도서 정보 관리
          </Link>
        </div>
      </main>
    </>
  );
};

export default Detail;