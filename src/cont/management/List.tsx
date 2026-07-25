import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "./management.module.css";

interface BookVO {
  bookId: number;
  title: string;
  author: string;
  publisher: string;
  publishDate: string;
  price: number;
  stock: number;
  isbn: string;
  category: string;
  imgn?: string;
}

const sampleBooks: BookVO[] = [
  {
    bookId: 1,
    title: "나는 정말 나무가 되었다",
    author: "오정희",
    publisher: "초록책방",
    publishDate: "2025-05-10",
    price: 17000,
    stock: 12,
    isbn: "978-89-1111-111-1",
    category: "그림책",
    imgn: "prod1.png",
  },
  {
    bookId: 2,
    title: "Room of Fragments",
    author: "Yeon Moon",
    publisher: "Fragments Press",
    publishDate: "2025-04-20",
    price: 22000,
    stock: 8,
    isbn: "978-89-2222-222-2",
    category: "사진",
    imgn: "prod2.png",
  },
  {
    bookId: 3,
    title: "Seek Immediate Shelter",
    author: "Vincent Yu",
    publisher: "Novel Books",
    publishDate: "2025-03-15",
    price: 19000,
    stock: 5,
    isbn: "978-89-3333-333-3",
    category: "소설",
    imgn: "prod3.png",
  },
  {
    bookId: 4,
    title: "싯타르타",
    author: "Justin Halpern",
    publisher: "Novel Books",
    publishDate: "2025-02-11",
    price: 18000,
    stock: 9,
    isbn: "978-89-4444-444-4",
    category: "소설",
    imgn: "prod4.png",
  },
];

const List: React.FC = () => {
  const backendUrl =
    process.env.REACT_APP_BACK_END_URL ??
    "http://localhost:8080";

  const [bookList, setBookList] = useState<BookVO[]>([]);
  const [searchValue, setSearchValue] = useState("");

  const fetchBookList = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/management/list`,
        {
          params: {
            searchValue,
          },
        }
      );

      const result = response.data.data ?? response.data;

      setBookList(result);
    } catch (error) {
      console.error("도서 목록 조회 실패:", error);

 
      const keyword = searchValue.trim().toLowerCase();

      if (keyword === "") {
        setBookList(sampleBooks);
        return;
      }

      const filteredBooks = sampleBooks.filter(
        (book) =>
          book.title.toLowerCase().includes(keyword) ||
          book.author.toLowerCase().includes(keyword)
      );

      setBookList(filteredBooks);
    }
  };

  useEffect(() => {
    fetchBookList();

    // 첫 화면에서 한 번만 실행
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <header className={styles.topHeader}>
        <div className={styles.topBar}>
          <div className={styles.logo}>
            RETAIL BOOKS 재고 관리
          </div>
        </div>
      </header>

      <main className={styles.listContainer}>
        <header className={styles.pageHeader}>
          <h1>도서 리스트</h1>

          <p>
            등록된 도서와 현재 재고를 확인합니다.
          </p>
        </header>

        <section className={styles.searchArea}>
          <input
            type="text"
            value={searchValue}
            placeholder="도서 제목 또는 저자를 입력하세요"
            onChange={(e) =>
              setSearchValue(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                fetchBookList();
              }
            }}
          />

          <button
            type="button"
            onClick={fetchBookList}
          >
            검색
          </button>
        </section>

        <section className={styles.bookList}>
          {bookList.length === 0 ? (
            <div className={styles.emptyMessage}>
              검색된 도서가 없습니다.
            </div>
          ) : (
            bookList.map((book) => (
              <article
                className={styles.bookItem}
                key={book.bookId}
              >
                <div className={styles.bookImage}>
                  {book.imgn ? (
                    <img
                      src={`/images/${book.imgn}`}
                      alt={book.title}
                    />
                  ) : (
                    <div
                      className={
                        styles.imagePlaceholder
                      }
                    >
                      No Image
                    </div>
                  )}
                </div>

                <div className={styles.bookInfo}>
                  <h2>{book.title}</h2>

                  <p>
                    <strong>저자</strong>
                    <span>{book.author}</span>
                  </p>

                  <p>
                    <strong>출판사</strong>
                    <span>{book.publisher}</span>
                  </p>

                  <p>
                    <strong>출판일</strong>
                    <span>{book.publishDate}</span>
                  </p>

                  {/* 가격 표시 변경 */}
                  <p className={styles.priceRow}>
                    <strong>금액</strong>

                    <span className={styles.priceLine} />

                    <span className={styles.priceValue}>
                      {book.price.toLocaleString()}원
                    </span>
                  </p>

                  <p>
                    <strong>재고</strong>
                    <span>{book.stock}권</span>
                  </p>
                </div>

                <Link
                  to={`/management/detail/${book.bookId}`}
                  className={styles.outlineButton}
                >
                  도서 프로필
                </Link>
              </article>
            ))
          )}
        </section>

        <div className={styles.bottomArea}>
          <Link
            to="/management/form"
            className={styles.primaryButton}
          >
            신간 도서 등록
          </Link>
        </div>
      </main>
    </>
  );
};

export default List;