import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  useNavigate,
  useParams,
} from "react-router-dom";
import styles from "./management.module.css";

interface BookEditVO {
  bookId: number;
  title: string;
  author: string;
  publisher: string;
  publishDate: string;
  page: string;
  isbn: string;
  category: string;
  keyword: string;
  price: string;
  stock: string;
  bookWidth: string;
  bookHeight: string;
  imgn?: string;
  mfile: File | null;
}

const Form2: React.FC = () => {
  const backendUrl =
    process.env.REACT_APP_BACK_END_URL ??
    "http://localhost:8080";

  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<BookEditVO>({
    bookId: Number(bookId),
    title: "",
    author: "",
    publisher: "",
    publishDate: "",
    page: "",
    isbn: "",
    category: "",
    keyword: "",
    price: "",
    stock: "",
    bookWidth: "",
    bookHeight: "",
    imgn: "",
    mfile: null,
  });

  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/management/detail`,
          {
            params: {
              bookId,
            },
          }
        );

        const book = response.data.data ?? response.data;

        setFormData({
          bookId: book.bookId,
          title: book.title ?? "",
          author: book.author ?? "",
          publisher: book.publisher ?? "",
          publishDate: book.publishDate ?? "",
          page: String(book.page ?? ""),
          isbn: book.isbn ?? "",
          category: book.category ?? "",
          keyword: book.keyword ?? "",
          price: String(book.price ?? ""),
          stock: String(book.stock ?? ""),
          bookWidth: String(book.bookWidth ?? ""),
          bookHeight: String(book.bookHeight ?? ""),
          imgn: book.imgn ?? "",
          mfile: null,
        });

        if (book.imgn) {
          setPreview(
            book.imgn.startsWith("http")
              ? book.imgn
              : `/images/${book.imgn}`
          );
        }
      } catch (error) {
        console.error("수정할 도서 조회 실패:", error);

        setFormData({
          bookId: Number(bookId),
          title: "나는 정말 나무가 되었다",
          author: "오정희",
          publisher: "초록책방",
          publishDate: "2025-05-10",
          page: "168",
          isbn: "978-89-1111-111-1",
          category: "그림책",
          keyword: "자연, 나무, 색채",
          price: "17000",
          stock: "12",
          bookWidth: "170",
          bookHeight: "240",
          imgn: `prod${bookId ?? 1}.png`,
          mfile: null,
        });

        setPreview(`/images/prod${bookId ?? 1}.png`);
      }
    };

    if (bookId) {
      fetchBook();
    }
  }, [backendUrl, bookId]);

  const formChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const fileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    setFormData((previous) => ({
      ...previous,
      mfile: file,
    }));

    const reader = new FileReader();

    reader.onloadend = () => {
      setPreview(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  const validateForm = (): boolean => {
    const priceNumber = Number(formData.price);
    const pageNumber = Number(formData.page);
    const stockNumber = Number(formData.stock);

    if (formData.title.trim() === "") {
      alert("책 제목을 입력하세요.");
      return false;
    }

    if (formData.author.trim() === "") {
      alert("저자를 입력하세요.");
      return false;
    }

    if (formData.publisher.trim() === "") {
      alert("출판사를 입력하세요.");
      return false;
    }

    if (formData.publishDate === "") {
      alert("출판일을 선택하세요.");
      return false;
    }

    if (
      formData.page === "" ||
      pageNumber <= 0
    ) {
      alert("페이지 수를 올바르게 입력하세요.");
      return false;
    }

    if (formData.isbn.trim() === "") {
      alert("ISBN을 입력하세요.");
      return false;
    }

    if (formData.category === "") {
      alert("분야를 선택하세요.");
      return false;
    }

    if (
      formData.price === "" ||
      priceNumber < 1000
    ) {
      alert("금액은 1,000원 이상 입력하세요.");
      return false;
    }

    if (priceNumber % 1000 !== 0) {
      alert("금액은 1,000원 단위로 입력하세요.");
      return false;
    }

    if (
      formData.stock === "" ||
      stockNumber < 0
    ) {
      alert("재고 수량을 올바르게 입력하세요.");
      return false;
    }

    return true;
  };

  const updateBook = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (
      !window.confirm(
        "입력한 내용으로 도서 정보를 수정하시겠습니까?"
      )
    ) {
      return;
    }

    const data = new FormData();

    data.append("bookId", String(formData.bookId));
    data.append("title", formData.title);
    data.append("author", formData.author);
    data.append("publisher", formData.publisher);
    data.append("publishDate", formData.publishDate);
    data.append("page", formData.page);
    data.append("isbn", formData.isbn);
    data.append("category", formData.category);
    data.append("keyword", formData.keyword);
    data.append("price", formData.price);
    data.append("stock", formData.stock);
    data.append("bookWidth", formData.bookWidth);
    data.append("bookHeight", formData.bookHeight);

    if (formData.mfile) {
      data.append("mfile", formData.mfile);
    }

    try {
      await axios.put(
        `${backendUrl}/api/management/update`,
        data
      );

      alert("도서 정보가 수정되었습니다.");

      navigate(`/management/detail/${bookId}`);
    } catch (error) {
      console.error("도서 수정 실패:", error);

      // 백엔드 연결 전 화면 흐름 확인용
      navigate(`/management/detail/${bookId}`);
    }
  };

  const deleteBook = async () => {
    if (
      !window.confirm(
        `'${formData.title}' 도서를 삭제하시겠습니까?\n삭제한 정보는 복구할 수 없습니다.`
      )
    ) {
      return;
    }

    try {
      await axios.delete(
        `${backendUrl}/api/management/delete`,
        {
          params: {
            bookId,
          },
        }
      );

      alert("도서가 삭제되었습니다.");

      navigate("/management/list");
    } catch (error) {
      console.error("도서 삭제 실패:", error);

    
      navigate("/management/list");
    }
  };

  return (
    <>
      <header className={styles.topHeader}>
        <div className={styles.topBar}>
          <div className={styles.logo}>
            재고 관리
          </div>
        </div>
      </header>

      <main className={styles.formContainer}>
        <header className={styles.pageHeader}>
          <h1>도서 정보 관리</h1>

          <p>
            도서 정보를 수정하거나 삭제할 수 있습니다.
          </p>
        </header>

        <form onSubmit={updateBook}>
          <section className={styles.formContent}>
            <div className={styles.imageArea}>
              {preview ? (
                <img
                  src={preview}
                  alt="도서 이미지"
                  className={styles.previewImage}
                />
              ) : (
                <div className={styles.imagePlaceholder}>
                  도서 이미지
                </div>
              )}

              <label
                htmlFor="editFile"
                className={styles.imageChangeButton}
              >
                이미지 변경
              </label>

              <input
                type="file"
                id="editFile"
                name="mfile"
                accept="image/*"
                className={styles.fileInput}
                onChange={fileChange}
              />
            </div>

            <div className={styles.inputArea}>
              <div className={styles.formRow}>
                <label htmlFor="title">책 제목</label>

                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={formChange}
                  required
                />
              </div>

              <div className={styles.formRow}>
                <label htmlFor="author">저자</label>

                <input
                  id="author"
                  name="author"
                  type="text"
                  value={formData.author}
                  onChange={formChange}
                  required
                />
              </div>

              <div className={styles.formRow}>
                <label htmlFor="publisher">
                  출판사
                </label>

                <input
                  id="publisher"
                  name="publisher"
                  type="text"
                  value={formData.publisher}
                  onChange={formChange}
                  required
                />
              </div>

              <div className={styles.formRow}>
                <label htmlFor="publishDate">
                  출판일
                </label>

                <input
                  id="publishDate"
                  name="publishDate"
                  type="date"
                  value={formData.publishDate}
                  onChange={formChange}
                  required
                />
              </div>

              <div className={styles.formRow}>
                <label htmlFor="page">페이지</label>

                <input
                  id="page"
                  name="page"
                  type="number"
                  min="1"
                  step="1"
                  value={formData.page}
                  onChange={formChange}
                  required
                />
              </div>

              <div className={styles.formRow}>
                <label htmlFor="isbn">ISBN</label>

                <input
                  id="isbn"
                  name="isbn"
                  type="text"
                  value={formData.isbn}
                  onChange={formChange}
                  required
                />
              </div>

        

              <div className={styles.formRow}>
                <label htmlFor="category">분야</label>

                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={formChange}
                  required
                >
                  <option value="">분야 선택</option>
                  <option value="경제">경제</option>
                  <option value="IT">IT</option>
                  <option value="소설">소설</option>
                  <option value="인문학">인문학</option>
                  <option value="예술">예술</option>
                  <option value="사진">사진</option>
                  <option value="그림책">그림책</option>
                  <option value="건축">건축</option>
                  <option value="요리">요리</option>
                </select>
              </div>

              <div className={styles.formRow}>
                <label htmlFor="keyword">키워드</label>

                <input
                  id="keyword"
                  name="keyword"
                  type="text"
                  value={formData.keyword}
                  onChange={formChange}
                />
              </div>

              <div className={styles.formRow}>
                <label htmlFor="price">금액</label>

                <div className={styles.priceInputArea}>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    min="1000"
                    step="1000"
                    value={formData.price}
                    onChange={formChange}
                    placeholder="1,000원 단위"
                    required
                  />

                  <span>원</span>
                </div>
              </div>

              <div className={styles.formRow}>
                <label htmlFor="stock">
                  재고 수량
                </label>

                <input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  step="1"
                  value={formData.stock}
                  onChange={formChange}
                  required
                />
              </div>
            </div>
          </section>

          <section className={styles.buttonArea}>
            <button
              type="button"
              className={styles.outlineButton}
              onClick={() =>
                navigate(`/management/detail/${bookId}`)
              }
            >
              취소
            </button>

            <div className={styles.buttonGroup}>
              <button
                type="button"
                className={styles.deleteButton}
                onClick={deleteBook}
              >
                삭제
              </button>

              <button
                type="submit"
                className={styles.primaryButton}
              >
                수정 저장
              </button>
            </div>
          </section>
        </form>
      </main>
    </>
  );
};

export default Form2;