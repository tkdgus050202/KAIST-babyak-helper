import { useState } from 'react'
import restaurantData from './data.json'
import './App.css'

// 위치 옵션 상수
const LOCATIONS = ['모두', '어은동', '어궁동', '궁동']

// 카테고리 옵션 상수 (value는 data.json의 형식과 일치해야 함)
const CATEGORY_BUTTONS = [
  { label: '모두', value: '모두' },
  { label: '한식', value: '한식' },
  { label: '고기&구이', value: '고기/구이' },
  { label: '일식', value: '일식' },
  { label: '중식', value: '중식' },
  { label: '양식', value: '양식' },
]

function App() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  // 초기값을 '모두'로 설정
  const [selectedLocation, setSelectedLocation] = useState('모두')
  const [selectedCategory, setSelectedCategory] = useState('모두')
  const [results, setResults] = useState([])

  const handleSearch = () => {
    // 필터링 로직: '모두'인 경우 해당 조건 검사를 건너뜁니다.
    const filtered = restaurantData.filter((restaurant) => {
      const locationMatch = selectedLocation === '모두' || restaurant.location === selectedLocation;
      const categoryMatch = selectedCategory === '모두' || restaurant.category === selectedCategory;
      return locationMatch && categoryMatch;
    })

    // 랜덤 섞기 및 3개 추출
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    setResults(shuffled.slice(0, 3))
    setIsSearchOpen(false) 
  }

  // '모두'가 기본이므로 검색 버튼은 항상 활성화 가능 (데이터가 없을 경우 대비)
  const searchDisabled = false
  return (
    <main className="app">
      {/* CSS에서 중앙 정렬을 제어할 핵심 컨테이너 */}
      <div className="container">
        
        {/* 상단 헤더 섹션 */}
        <header className="hero">
          <p className="hero-badge">KAIST 밥약 도우미</p>
          <h1 className="hero-title">일루젼 26학번들을 위한 밥약 장소 추천</h1>

          {/* 검색 필터 패널 */}
          <section className="search-panel">
            <button
              type="button"
              className="search-input"
              onClick={() => setIsSearchOpen((open) => !open)}
            >
              <span>
                {selectedLocation || selectedCategory
                  ? `${selectedLocation || '위치'} · ${
                      CATEGORY_BUTTONS.find(
                        (c) => c.value === selectedCategory,
                      )?.label || '음식 종류'
                    }`
                  : '밥약 조건을 선택해 주세요'}
              </span>
              <span className="search-input-indicator">
                {isSearchOpen ? '접기' : '열기'}
              </span>
            </button>

            {/* 조건 선택 영역 (isSearchOpen이 true일 때만 노출) */}
            {isSearchOpen && (
              <div className="search-options">
                <div className="filter-group">
                  <h2 className="filter-title">위치</h2>
                  <div className="chip-row">
                    {LOCATIONS.map((location) => (
                      <button
                        key={location}
                        type="button"
                        className={
                          'chip' +
                          (selectedLocation === location ? ' chip--selected' : '')
                        }
                        onClick={() => setSelectedLocation(location)}
                      >
                        {location}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="filter-group">
                  <h2 className="filter-title">음식 종류</h2>
                  <div className="chip-row">
                    {CATEGORY_BUTTONS.map((category) => (
                      <button
                        key={category.value}
                        type="button"
                        className={
                          'chip' +
                          (selectedCategory === category.value
                            ? ' chip--selected'
                            : '')
                        }
                        onClick={() => setSelectedCategory(category.value)}
                      >
                        {category.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  className="search-button"
                  onClick={handleSearch}
                  disabled={searchDisabled}
                >
                  검색하기
                </button>
              </div>
            )}
          </section>
        </header>

        {/* 결과 표시 섹션 */}
        <section className="results">
          <h2 className="results-title">추천 결과</h2>
          {!results.length ? (
            <p className="results-empty">
              위에서 조건을 골라 <strong>검색하기</strong> 버튼을 눌러주세요.
            </p>
          ) : (
            <div className="card-grid">
              {results.map((restaurant, index) => (
                <article key={restaurant.id} className="restaurant-card">
                  {/* 1. 이미지 영역 추가 */}
                  <div className="restaurant-image-container">
                    <img 
                      src={restaurant.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'} 
                      alt={restaurant.name} 
                      className="restaurant-image"
                    />
                    <span className="restaurant-rank-badge">{index + 1}</span>
                  </div>

                  <div className="card-content">
                    {/* 순위 표시: index + 1 */}
                    <span className="restaurant-rank">{index + 1}</span>
                    <div className="restaurant-info">
                      <h3 className="restaurant-name">{restaurant.name}</h3>
                      <p className="restaurant-meta">
                        {restaurant.location} · {restaurant.category}
                      </p>
                    </div>
                    {/* 네이버 지도 링크 버튼 */}
                    {restaurant.naverUrl && (
                      <a 
                        href={restaurant.naverUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="map-link"
                      >
                        지도 보기
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
        
      </div>
    </main>
  )
}

export default App