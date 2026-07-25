import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./management.module.css";

interface BookFormVO {
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
  mfile: File | null;
}

const Form: React.FC = () => {
  const backendUrl =
    process.env.REACT_APP_BACK_END_URL ??
    "http://localhost:8080";

  const navigate = useNavigate();

  const [formData, setFormData] = useState<BookFormVO>({
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
    mfile: null,
  });

  const [preview, setPreview] = useState<string | null>(
    null
  );

  // 일반 입력값 변경
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

  // 이미지 선택 및 미리보기
  const fileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    setFormData((previous) => ({
      ...previous,
      mfile: selectedFile,
    }));

    const reader = new FileReader();

    reader.onloadend = () => {
      setPreview(reader.result as string);
    };

    reader.readAsDataURL(selectedFile);
  };

  // 입력값 검사
  const validateForm = (): boolean => {
    const pageNumber = Number(formData.page);
    const priceNumber = Number(formData.price);
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
      alert("도서 분야를 선택하세요.");
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

  // 도서 등록
  const formSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const data = new FormData();

    data.append("title", formData.title);
    data.append("author", formData.author);
    data.append("publisher", formData.publisher);
    data.append(
      "publishDate",
      formData.publishDate
    );
    data.append("page", formData.page);
    data.append("isbn", formData.isbn);
    data.append(
      "category",
      formData.category
    );
    data.append("keyword", formData.keyword);
    data.append("price", formData.price);
    data.append("stock", formData.stock);
    data.append(
      "bookWidth",
      formData.bookWidth
    );
    data.append(
      "bookHeight",
      formData.bookHeight
    );

    if (formData.mfile) {
      data.append("mfile", formData.mfile);
    }

    try {
      await axios.post(
        `${backendUrl}/api/management/add`,
        data
      );

      alert("도서가 등록되었습니다.");

      // 등록 완료 후 도서 목록으로 이동
      navigate("/management/list");
    } catch (error) {
      console.error("도서 등록 실패:", error);

    
      alert(
        "백엔드가 연결되지 않아 화면 확인용으로 목록으로 이동."
      );

      navigate("/management/list");
    }
  };

  // 프로젝트 첫 화면
  const goHome = () => {
    navigate("/");
  };

  return (
    <>
      <header className={styles.topHeader}>
        <div className={styles.topBar}>
          <div
            className={styles.logo}
            style={{
              fontFamily:
                '"Batang", "맑은 고딕", "Noto Serif KR", serif',
              fontWeight: 1500,
            }}
          >
           
          </div>
          신간 도서 등록
        </div>
      </header>

      <main className={styles.formContainer}>
        <header className={styles.pageHeader}>
          <h1></h1>
          <p>
            ISBN은 <p></p>
            13자리 숫자로 이루어져 있으며 국제표준도서번호(International Standard
            Book Number)의 약자입니다.
          </p>
        </header>

        <form onSubmit={formSubmit}>
          <section className={styles.formContent}>
            {/* 도서 이미지 영역 */}
            <div className={styles.imageArea}>
              {preview ? (
                <img
                  src={preview}
                  alt="도서 이미지 미리보기"
                  className={styles.previewImage}
                />
              ) : (
                <div
                  className={
                    styles.imagePlaceholder
                  }
                >
                  도서 이미지
                </div>
              )}

              <label
                htmlFor="mfile"
                className={
                  styles.imageChangeButton
                }
              >
                이미지 선택
              </label>

              <input
                type="file"
                id="mfile"
                name="mfile"
                accept="image/*"
                className={styles.fileInput}
                onChange={fileChange}
              />
            </div>

            {/* 도서 입력 영역 */}
            <div className={styles.inputArea}>
              <div className={styles.formRow}>
                <label htmlFor="title">
                  책 제목
                </label>

                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={formChange}
                  placeholder="책 제목을 입력하세요"
                  required
                />
              </div>

              <div className={styles.formRow}>
                <label htmlFor="author">
                  저자
                </label>

                <input
                  id="author"
                  name="author"
                  type="text"
                  value={formData.author}
                  onChange={formChange}
                  placeholder="저자를 입력하세요"
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
                  placeholder="출판사를 입력하세요"
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
                <label htmlFor="page">
                  페이지
                </label>

                <input
                  id="page"
                  name="page"
                  type="number"
                  min="1"
                  step="1"
                  value={formData.page}
                  onChange={formChange}
                  placeholder="페이지 수"
                  required
                />
              </div>

              <div className={styles.formRow}>
                <label htmlFor="isbn">
                  ISBN
                </label>

                <input
                  id="isbn"
                  name="isbn"
                  type="text"
                  value={formData.isbn}
                  onChange={formChange}
                  placeholder="ISBN 번호"
                  required
                />
              </div>

              

              <div className={styles.formRow}>
                <label htmlFor="category">
                  분야
                </label>

                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={formChange}
                  required
                >
                  <option value="">
                    분야 선택
                  </option>
                  <option value="경제">
                    경제
                  </option>
                  <option value="IT">
                    IT
                  </option>
                  <option value="소설">
                    소설
                  </option>
                  <option value="인문학">
                    인문학
                  </option>
                  <option value="예술">
                    예술
                  </option>
                  <option value="사진">
                    사진
                  </option>
                  <option value="그림책">
                    그림책
                  </option>
                  <option value="건축">
                    건축
                  </option>
                  <option value="요리">
                    요리
                  </option>
                </select>
              </div>

              <div className={styles.formRow}>
                <label htmlFor="keyword">
                  분야 키워드
                </label>

                <input
                  id="keyword"
                  name="keyword"
                  type="text"
                  value={formData.keyword}
                  onChange={formChange}
                  placeholder="예: 자연, 나무, 색채"
                />
              </div>

              <div className={styles.formRow}>
                <label htmlFor="price">
                  금액
                </label>

                <div
                  className={
                    styles.priceInputArea
                  }
                >
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
                  placeholder="재고 수량"
                  required
                />
              </div>
            </div>
          </section>

          <section className={styles.buttonArea}>
            <button
              type="button"
              className={styles.outlineButton}
              onClick={goHome}
            >
              ← 첫 화면
            </button>

            <button
              type="submit"
              className={styles.primaryButton}
            >
              도서 등록 저장
            </button>
          </section>
        </form>
      </main>
    </>
  );
};

export default Form;