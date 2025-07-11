import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/DesignPreview.css';

const ProjectSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state?.formData;

  // 유틸: 라벨 변환
  const getWorkStyleLabel = (id) => ({
    'minimal': 'Minimal & Sleek',
    'natural': 'Natural & Calm',
    'industrial': 'Industrial & Urban',
    'warm': 'Warm & Cozy',
    'futuristic': 'Futuristic & Techy',
    'playful': 'Playful & Creative',
    'classic': 'Classic & Elegant',
    'layered': 'Layered & Textured',
    'other': formData?.workStyleOther || '기타'
  }[id] || id);

  const getSeatingTypeLabel = (id) => ({
    'focus': 'Focus',
    'open': 'Open',
    'private': 'Private',
    'teamwork': 'Teamwork',
    'healing': 'Healing',
    'brand': 'Brand'
  }[id] || id);

  // 뒤로가기
  const handleGoBack = () => {
    navigate('/initial-info', {
      state: {
        formData,
        fromPreview: true
      },
      replace: true
    });
  };

  return (
    <div className="design-preview-container">
      <h2>오피스 설계 프로젝트 요약</h2>
      <div className="preview-content">
        <div className="preview-section">
          <h2>입력된 정보</h2>
          <div className="info-grid">
            {/* 1. 프로젝트 기본 정보 */}
            <div className="info-item">
              <h3>프로젝트 기본 정보</h3>
              <p className="info-value">회사명: {formData?.companyName}</p>
              <p className="info-value">프로젝트 목적: {formData?.projectPurpose === 'move' ? '이전' : formData?.projectPurpose === 'expand' ? '확장' : '신규'}</p>
              <p className="info-value">건물 주소: {formData?.buildingAddress}</p>
              <p className="info-value">상세 주소: {formData?.buildingDetailAddress}</p>
              <p className="info-value">임차공간 면적: {formData?.buildingSize} m²</p>
            </div>
            {/* 2. 일정 및 발주 정보 */}
            <div className="info-item">
              <h3>일정 및 발주 정보</h3>
              <p className="info-value">공사 희망 일정: {formData?.constructionStart || '미정'} ~ {formData?.constructionEnd || '미정'}</p>
              <p className="info-value">공사 가능 시간: {(formData?.constructionTimes || []).map(id => {
                const opt = {
                  'weekday-day': '평일 주간', 'weekday-night': '평일 야간', 'weekend-day': '주말 주간', 'weekend-night': '주말 야간'
                }[id] || id;
                return opt;
              }).join(', ')}</p>
              <p className="info-value">직접 발주 사항: {(formData?.directOrder || []).map(id => {
                const opt = {
                  'security': '보안', 'network': '통신', 'av': 'AV', 'move': '이사', 'furniture': '가구', 'landscape': '조경', 'none': '없음', 'etc': '기타'
                }[id] || id;
                return opt;
              }).filter(id => id !== '기타').join(', ')} {formData?.directOrder?.includes('etc') && formData?.directOrderEtc ? `${formData.directOrder.filter(id => id !== 'etc').length > 0 ? ', ' : ''}기타(${formData.directOrderEtc})` : ''}</p>
            </div>
            {/* 3. 디자인 방향성 */}
            <div className="info-item">
              <h3>디자인 방향성</h3>
              <p className="info-value">디자인 키워드: {(formData?.workStyle || []).map(getWorkStyleLabel).join(', ')}</p>
              <p className="info-value">브랜드 컬러: {formData?.brandColors && formData.brandColors.length > 0 ? formData.brandColors.join(', ') : '미정'}</p>
              <p className="info-value">업무 공간 기능: {(Array.isArray(formData?.seatingType) ? formData.seatingType.map(getSeatingTypeLabel).join(', ') : '')}</p>
              <p className="info-value">레퍼런스 링크: {formData?.referenceLink ? (
                <a href={formData.referenceLink} target="_blank" rel="noopener noreferrer">{formData.referenceLink}</a>
              ) : ''}</p>
            </div>
            {/* 4. 세부 공간 구성 */}
            <div className="info-item">
              <h3>세부 공간 구성</h3>
              {/* 캔틴, 회의실, 추가공간 등 세부 항목은 필요시 추가 구현 */}
              <p className="info-value">캔틴: {(formData?.canteenOptions || []).map(id => {
                const opt = {
                  'water': '정수기', 'microwave': '전자레인지', 'sink': '싱크대', 'fridge': '냉장고', 'coffee': '커피머신', 'other': '기타'
                }[id] || id;
                return opt;
              }).join(', ')} {formData?.canteenOptions?.includes('other') && formData?.canteenOther ? `(${formData.canteenOther})` : ''}</p>
              <p className="info-value">회의실: {(formData?.meetingOptions || []).map(id => {
                const opt = {
                  'video': '화상 회의 장비', 'tv': 'TV', 'whiteboard': '화이트보드', 'projector': '프로젝터', 'other': '기타'
                }[id] || id;
                return opt;
              }).join(', ')} {formData?.meetingOptions?.includes('other') && formData?.meetingOther ? `(${formData.meetingOther})` : ''}</p>
              {/* 추가 공간 상세 미리보기 */}
              <p className="info-value">
                <b>추가 공간:</b>
                {Array.isArray(formData?.extraSpaces) && formData.extraSpaces.length > 0 ? (
                  <ul style={{ margin: '8px 0 0 0', paddingLeft: 18 }}>
                    {formData.extraSpaces.map(spaceId => {
                      const labelMap = {
                        reception: '리셉션',
                        lounge: '라운지',
                        breakRoom: '휴게실',
                        storage: '창고',
                        exhibition: '전시공간',
                        serverRoom: '서버실',
                        other: '기타'
                      };
                      const detail = formData.extraDetail?.[spaceId];
                      return (
                        <li key={spaceId}>
                          <b>{labelMap[spaceId] || spaceId}</b>
                          {/* 공간별 세부 정보 */}
                          {spaceId === 'reception' && detail?.count && ` (상주 인원: ${detail.count})`}
                          {spaceId === 'lounge' && (
                            <>
                              {detail?.type && ` (유형: ${detail.type === 'work' ? '워크라운지' : detail.type === 'rest' ? '휴게라운지' : detail.type})`}
                              {detail?.purpose?.length > 0 && `, 목적: ${detail.purpose.join(', ')}`}
                            </>
                          )}
                          {spaceId === 'breakRoom' && (
                            <>
                              {detail?.facilities?.length > 0 && ` (편의시설: ${detail.facilities.join(', ')})`}
                              {detail?.etc && `, 기타: ${detail.etc}`}
                            </>
                          )}
                          {spaceId === 'storage' && (
                            <>
                              {detail?.racks?.length > 0 && (
                                <span>
                                  {' '}랙/선반:
                                  {detail.racks.map((rack, idx) =>
                                    (rack.size || rack.count) ? (
                                      <span key={idx}>
                                        {rack.size && ` [크기: ${rack.size}]`}
                                        {rack.count && ` [수량: ${rack.count}]`}
                                      </span>
                                    ) : null
                                  )}
                                </span>
                              )}
                            </>
                          )}
                          {spaceId === 'exhibition' && (
                            <>
                              {detail?.purpose?.length > 0 && ` (목적: ${detail.purpose.join(', ')})`}
                              {detail?.etc && `, 기타: ${detail.etc}`}
                            </>
                          )}
                          {spaceId === 'serverRoom' && (
                            <>
                              {(detail?.rack || detail?.aircon || detail?.etcChecked) && ' (필요기기: '}
                              {detail?.rack && '서버랙 '}
                              {detail?.aircon && '항온항습기 '}
                              {detail?.etcChecked && detail?.etc && `기타: ${detail.etc}`}
                              {(detail?.rack || detail?.aircon || detail?.etcChecked) && ')'}
                            </>
                          )}
                          {spaceId === 'other' && detail?.desc && ` (${detail.desc})`}
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  ' 없음'
                )}
              </p>
            </div>
            {/* 5. 현장 정보 및 설비 조건 */}
            <div className="info-item">
              <h3>현장 정보 및 설비 조건</h3>
              <p className="info-value">건물 내 통신사: {(formData?.buildingTelecom || []).join(', ')}</p>
              <p className="info-value">필요 보험: {(formData?.buildingInsurance || []).join(', ')} {formData?.buildingInsurance?.includes('기타') && formData?.buildingInsuranceEtc ? `(${formData.buildingInsuranceEtc})` : ''}</p>
              <p className="info-value">시설 관리팀 연락처: {formData?.facilityContactProvided ? `${formData.facilityContactName || ''} ${formData.facilityContactPhone || ''}` : '제공 불가'}</p>
              <p className="info-value">기타 특이사항: {formData?.spaceEtc}</p>
              <p className="info-value">냉난방 실내기: {formData?.acIndoorSystem}</p>
              <p className="info-value">냉난방 실외기: {formData?.acOutdoorSystem}</p>
              <p className="info-value">실외기 위치: {formData?.acOutdoorLocation}</p>
              <p className="info-value">전기 용량: {formData?.electricCapacity}</p>
            </div>
            {/* 6. 첨부파일 */}
            <div className="info-item">
              <h3>첨부파일</h3>
              {[
                { key: 'fileInterior', label: '인테리어 준공 도서' },
                { key: 'fileBuilding', label: '입주 건물 관련 도서' },
                { key: 'fileFitout', label: '빌딩 fit-out guide' },
                { key: 'fileEtc', label: '기타 첨부 자료' },
                { key: 'sitePhoto', label: '현장 사진' }
              ].map(item => (
                formData?.[item.key + 'Checked'] && formData?.[item.key + 'Link'] && (
                  <p className="info-value" key={item.key}>
                    {item.label}: <a href={formData[item.key + 'Link']} target="_blank" rel="noopener noreferrer">{formData[item.key + 'Link']}</a>
                  </p>
                )
              ))}
              {!formData?.fileInteriorChecked && !formData?.fileBuildingChecked && !formData?.fileFitoutChecked && !formData?.fileEtcChecked && !formData?.sitePhotoChecked && (
                <p className="info-value">첨부된 파일 없음</p>
              )}
            </div>
          </div>
        </div>
        <div className="data-actions">
          <button className="back-button" onClick={handleGoBack}>
            이전으로 돌아가기
          </button>
          {/* 
          <button className="submit-button" onClick={handleSubmitData}>
            상담정보 제출하기
          </button>
           */}
        </div>
      </div>
    </div>
  );
};

export default ProjectSummary; 