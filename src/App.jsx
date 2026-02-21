import { useState } from 'react'
import restaurantData from './data.json'
import './App.css'

const LOCATIONS = ['어은동', '어궁동', '궁동']
const CATEGORY_BUTTONS = [
  { label: '한식', value: '한식' },
  { label: '고기/구이', value: '고기/구이' },
  { label: '일식', value: '일식' },
  { label: '중식', value: '중식' },
  { label: '양식', value: '양식' },
]

function App() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  // 다중 선택을 위해 배열로 관리
  const [selectedLocations, setSelectedLocations] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [results, setResults] = useState([])

  const handleSanghyunRandom = () => {
    setSelectedLocations([...LOCATIONS]);
    const allCatValues = CATEGORY_BUTTONS.map(c => c.value);
    setSelectedCategories(allCatValues);
    
    // 선택 후 바로 검색 결과까지 보여주고 싶다면 아래 주석 해제
    setTimeout(() => handleSearch(), 0); 
  }

  // 다중 선택 핸들러 (모두 버튼 로직 포함)
  const toggleFilter = (item, list, setList, allItems) => {
    if (item === '모두') {
      if (list.length === allItems.length) {
        setList([]) // 모두 켜진 상태에서 누르면 전체 해제
      } else {
        setList([...allItems]) // 아니면 전체 선택
      }
    } else {
      const newList = list.includes(item)
        ? list.filter((i) => i !== item) // 이미 있으면 제거
        : [...list, item] // 없으면 추가
      setList(newList)
    }
  }

  const handleSearch = () => {
    const filtered = restaurantData.filter((restaurant) => {
      // 선택된 게 없으면 전체 검색, 있으면 포함 여부 확인
      const locationMatch = selectedLocations.length === 0 || selectedLocations.includes(restaurant.location);
      const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(restaurant.category);
      return locationMatch && categoryMatch;
    })

    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    setResults(shuffled.slice(0, 3))
    setIsSearchOpen(false) 
  }

  const getDisplayText = () => {
    const locText = selectedLocations.length > 0 ? selectedLocations.join(', ') : '';
    const catText = selectedCategories.length > 0 
      ? selectedCategories.map(val => CATEGORY_BUTTONS.find(c => c.value === val)?.label).join(', ') 
      : '';

    if (!locText && !catText) return '밥약 조건을 선택해 주세요';
    
    // 위치와 카테고리가 모두 있으면 중간에 ' / '를 넣어 구분
    if (locText && catText) return `${locText} / ${catText}`;
    return locText || catText;
  };

  return (
    <main className="app">
      <div className="container">
        <header className="hero">
          <p className="hero-badge">KAIST 밥약 도우미</p>
          <h1 className="hero-title">일루젼 26학번들을 위한 밥약 장소 추천</h1>

          <section className="search-panel">
            <button type="button" className="search-input" onClick={() => setIsSearchOpen(!isSearchOpen)}>
              <span>
                {getDisplayText()}
              </span>
              <span className="search-input-indicator">{isSearchOpen ? '접기' : '열기'}</span>
            </button>

            {isSearchOpen && (
              <div className="search-options">
                {/* 위치 필터 */}
                <div className="filter-group">
                  <h2 className="filter-title">위치</h2>
                  <div className="chip-row">
                    <button 
                      className={'chip' + (selectedLocations.length === LOCATIONS.length ? ' chip--selected' : '')}
                      onClick={() => toggleFilter('모두', selectedLocations, setSelectedLocations, LOCATIONS)}
                    >모두</button>
                    {LOCATIONS.map((loc) => (
                      <button
                        key={loc}
                        className={'chip' + (selectedLocations.includes(loc) ? ' chip--selected' : '')}
                        onClick={() => toggleFilter(loc, selectedLocations, setSelectedLocations, LOCATIONS)}
                      >{loc}</button>
                    ))}
                  </div>
                </div>

                {/* 카테고리 필터 */}
                <div className="filter-group">
                  <h2 className="filter-title">음식 종류</h2>
                  <div className="chip-row">
                    <button 
                      className={'chip' + (selectedCategories.length === CATEGORY_BUTTONS.map(c => c.value).length ? ' chip--selected' : '')}
                      onClick={() => toggleFilter('모두', selectedCategories, setSelectedCategories, CATEGORY_BUTTONS.map(c => c.value))}
                    >모두</button>
                    {CATEGORY_BUTTONS.map((cat) => (
                      <button
                        key={cat.value}
                        className={'chip' + (selectedCategories.includes(cat.value) ? ' chip--selected' : '')}
                        onClick={() => toggleFilter(cat.value, selectedCategories, setSelectedCategories, CATEGORY_BUTTONS.map(c => c.value))}
                      >{cat.label}</button>
                    ))}
                  </div>
                </div>

                {/* 2. 새로운 '상현상현' 섹션 추가 */}
                <div className="filter-group" style={{ marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}>
                  <h2 className="filter-title" style={{ color: '#FFEA00', textShadow: '0 0 8px rgba(255, 234, 0, 0.4)' }}>✨ 상현상현이 추천하는 랜덤 맛집!</h2>
                  <div className="chip-row">
                    <button
                      type="button"
                      className="chip sanghyun-random-chip"
                      style={{ 
                        background: '#FFEA00', /* 배경을 노란색으로 */
                        color: '#FFEA00',           /* 글씨를 검은색으로 */
                        borderColor: '#FFEA00',
                        boxShadow: '0 0 20px rgba(255, 234, 0, 0.6)'
                      }}
                      onClick={handleSanghyunRandom}
                    >
                      🎲 고민보다 Go! 
                    </button>
                  </div>
                </div>

                <button type="button" className="search-button" onClick={handleSearch}>추천받기</button>
              </div>
            )}
          </section>
        </header>

        {/* 결과 섹션 (기존과 동일) */}
        <section className="results">
          <h2 className="results-title">추천 결과</h2>
          {!results.length ? (
            <p className="results-empty">조건을 골라 <strong>추천받기</strong>를 눌러주세요.</p>
          ) : (
            <div className="card-grid">
              {results.map((res, index) => (
                <article key={res.id} className="restaurant-card">
                  <div className="restaurant-image-container">
                    <img src={res.imageUrl || 'https://via.placeholder.com/300x200'} alt={res.name} className="restaurant-image" />
                    <span className="restaurant-rank-badge">{index + 1}</span>
                  </div>
                  <div className="card-content">
                    <span className="restaurant-rank">{index + 1}</span>
                    <div className="restaurant-info">
                      <h3 className="restaurant-name">{res.name}</h3>
                      <p className="restaurant-meta">{res.location} · {res.category}</p>
                    </div>
                    {res.naverUrl && <a href={res.naverUrl} target="_blank" rel="noreferrer" className="map-link">지도</a>}
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