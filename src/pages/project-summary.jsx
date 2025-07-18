import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/DesignPreview.css';
import emailjs from 'emailjs-com';
import { useState } from 'react';

const ProjectSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state?.formData;
  const [sending, setSending] = useState(false);

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

  // 세부 공간 정보 보기 좋게 포맷팅
  const formatSpaceDetails = () => {
    if (!Array.isArray(formData?.extraSpaces) || !formData.extraSpaces.length) return '없음';
    const labelMap = {
      reception: '리셉션',
      lounge: '라운지',
      breakRoom: '휴게실',
      storage: '창고',
      exhibition: '전시공간',
      serverRoom: '서버실',
      other: '기타'
    };
    return formData.extraSpaces.map(spaceId => {
      const detail = formData.extraDetail?.[spaceId];
      let desc = '';
      if (spaceId === 'reception' && detail?.count) desc = `상주 인원: ${detail.count}`;
      if (spaceId === 'lounge') {
        desc = `${detail?.type ? `유형: ${detail.type === 'work' ? '워크라운지' : detail.type === 'rest' ? '휴게라운지' : detail.type}` : ''}`;
        if (detail?.purpose?.length) desc += `${desc ? ', ' : ''}목적: ${detail.purpose.join(', ')}`;
      }
      if (spaceId === 'breakRoom') {
        if (detail?.facilities?.length) desc = `편의시설: ${detail.facilities.join(', ')}`;
        if (detail?.etc) desc += `${desc ? ', ' : ''}기타: ${detail.etc}`;
      }
      if (spaceId === 'storage' && detail?.racks?.length) {
        desc = '랙/선반: ' + detail.racks.map((rack, idx) => (rack.size || rack.count) ? `${rack.size ? `크기: ${rack.size}` : ''}${rack.count ? `, 수량: ${rack.count}` : ''}` : '').filter(Boolean).join(' / ');
      }
      if (spaceId === 'exhibition') {
        if (detail?.purpose?.length) desc = `목적: ${detail.purpose.join(', ')}`;
        if (detail?.etc) desc += `${desc ? ', ' : ''}기타: ${detail.etc}`;
      }
      if (spaceId === 'serverRoom') {
        let arr = [];
        if (detail?.rack) arr.push('서버랙');
        if (detail?.aircon) arr.push('항온항습기');
        if (detail?.etcChecked && detail?.etc) arr.push(`기타: ${detail.etc}`);
        if (arr.length) desc = `필요기기: ${arr.join(', ')}`;
      }
      if (spaceId === 'other' && detail?.desc) desc = detail.desc;
      return `- ${labelMap[spaceId] || spaceId}${desc ? ` (${desc})` : ''}`;
    }).join('\n');
  };

  // CSV 형식 상담 요약 생성
  const getAttachmentSection = () => {
    const lines = [];
    lines.push(`회사명,${formData.companyName || ''}`);
    lines.push(`프로젝트 목적,${formData.projectPurpose === 'move' ? '이전' : formData.projectPurpose === 'expand' ? '확장' : '신규'}`);
    lines.push(`건물 주소,${formData.buildingAddress || ''}`);
    lines.push(`상세 주소,${formData.buildingDetailAddress || ''}`);
    lines.push(`임차공간 면적,${formData.buildingSize || ''}`);
    lines.push(`직접 발주 사항,${(formData.directOrder || []).map(id => ({
      'security': '보안', 'network': '통신', 'av': 'AV', 'move': '이사', 'furniture': '가구', 'landscape': '조경', 'none': '없음', 'etc': '기타'
    }[id] || id)).filter(opt => opt !== '기타').join(', ') + (formData.directOrder?.includes('etc') && formData.directOrderEtc ? (formData.directOrder.length > 1 ? ', ' : '') + `기타(${formData.directOrderEtc})` : '')}`);
    lines.push(`공사 희망 일정,${formData.constructionStart || '미정'} ~ ${formData.constructionEnd || '미정'}`);
    lines.push(`공사 가능 시간,${(formData.constructionTimes || []).map(id => ({
      'weekday-day': '평일 주간', 'weekday-night': '평일 야간', 'weekend-day': '주말 주간', 'weekend-night': '주말 야간'
    }[id] || id)).join(', ')}`);
    lines.push(`디자인 키워드,${(formData.workStyle || []).join(', ')}`);
    lines.push(`브랜드 컬러,${(formData.brandColors || []).join(', ')}`);
    lines.push(`업무 공간 기능,${Array.isArray(formData.seatingType) ? formData.seatingType.join(', ') : ''}`);
    lines.push(`레퍼런스 링크,${formData.referenceLink || ''}`);
    // 세부 공간
    lines.push(`세부 공간 구성,${formatSpaceDetails()}`);
    // 현장 정보
    lines.push(`건물 내 통신사,${(formData.buildingTelecom || []).join(', ')}`);
    lines.push(`필요 보험,${(formData.buildingInsurance || []).join(', ')}${formData.buildingInsurance?.includes('기타') && formData.buildingInsuranceEtc ? `(${formData.buildingInsuranceEtc})` : ''}`);
    lines.push(`시설 관리팀 연락처,${formData.facilityContactProvided ? `${formData.facilityContactName || ''} ${formData.facilityContactPhone || ''}` : '제공 불가'}`);
    lines.push(`기타 특이사항,${formData.spaceEtc || ''}`);
    lines.push(`냉난방 실내기,${formData.acIndoorSystem || ''}`);
    lines.push(`냉난방 실외기,${formData.acOutdoorSystem || ''}`);
    lines.push(`실외기 위치,${formData.acOutdoorLocation || ''}`);
    lines.push(`전기 용량,${formData.electricCapacity || ''}`);
    // 첨부파일
    const attachArr = ['fileInterior', 'fileBuilding', 'fileFitout', 'fileEtc', 'sitePhoto'].map(key =>
      formData[key + 'Checked'] && formData[key + 'Link']
        ? `${{
          fileInterior: '인테리어 준공 도서',
          fileBuilding: '입주 건물 관련 도서',
          fileFitout: '빌딩 fit-out guide',
          fileEtc: '기타 첨부 자료',
          sitePhoto: '현장 사진'
        }[key]}: ${formData[key + 'Link']}`
        : null
    ).filter(Boolean);
    lines.push(`첨부파일,${attachArr.join(' | ')}`);
    return lines.join('\n');
  };

  const handleSubmitData = async () => {
    setSending(true);
    const emailData = {
      company_name: formData.companyName,
      buildingAddress: formData.buildingAddress,
      buildingDetailAddress: formData.buildingDetailAddress || '',
      buildingSize: formData.buildingSize,
      projectPurpose: formData.projectPurpose === 'move' ? '이전' : formData.projectPurpose === 'expand' ? '확장' : '신규',
      directOrder: (formData.directOrder || []).map(id => ({
        'security': '보안', 'network': '통신', 'av': 'AV', 'move': '이사', 'furniture': '가구', 'landscape': '조경', 'none': '없음', 'etc': '기타'
      }[id] || id)).filter(opt => opt !== '기타').join(', ') +
        (formData.directOrder?.includes('etc') && formData.directOrderEtc ? (formData.directOrder.length > 1 ? ', ' : '') + `기타(${formData.directOrderEtc})` : ''),
      constructionStart: formData.constructionStart || '미정',
      constructionEnd: formData.constructionEnd || '미정',
      constructionTimes: (formData.constructionTimes || []).map(id => ({
        'weekday-day': '평일 주간', 'weekday-night': '평일 야간', 'weekend-day': '주말 주간', 'weekend-night': '주말 야간'
      }[id] || id)).join(', '),
      workStyle: (formData.workStyle || []).join(', '),
      brandColors: (formData.brandColors || []).join(', '),
      seatingType: (Array.isArray(formData.seatingType) ? formData.seatingType.join(', ') : ''),
      referenceLink: formData.referenceLink || '',
      spaceDetails: formatSpaceDetails(),
      siteInfo: [
        `건물 내 통신사: ${(formData.buildingTelecom || []).join(', ')}`,
        `필요 보험: ${(formData.buildingInsurance || []).join(', ')}${formData.buildingInsurance?.includes('기타') && formData.buildingInsuranceEtc ? `(${formData.buildingInsuranceEtc})` : ''}`,
        `시설 관리팀 연락처: ${formData.facilityContactProvided ? `${formData.facilityContactName || ''} ${formData.facilityContactPhone || ''}` : '제공 불가'}`,
        `기타 특이사항: ${formData.spaceEtc || ''}`,
        `냉난방 실내기: ${formData.acIndoorSystem || ''}`,
        `냉난방 실외기: ${formData.acOutdoorSystem || ''}`,
        `실외기 위치: ${formData.acOutdoorLocation || ''}`,
        `전기 용량: ${formData.electricCapacity || ''}`
      ].join('\n'),
      attachments: [
        ...['fileInterior', 'fileBuilding', 'fileFitout', 'fileEtc', 'sitePhoto'].map(key =>
          formData[key + 'Checked'] && formData[key + 'Link']
            ? `${{
              fileInterior: '인테리어 준공 도서',
              fileBuilding: '입주 건물 관련 도서',
              fileFitout: '빌딩 fit-out guide',
              fileEtc: '기타 첨부 자료',
              sitePhoto: '현장 사진'
            }[key]}: ${formData[key + 'Link']}`
            : null
        ).filter(Boolean)
      ].join('\n'),
      attachment_section: getAttachmentSection()
    };

    try {
      await emailjs.send(
        'service_officementary2',
        'template_2ls7vl8',
        emailData,
        'YiZScPmNjcBDnC8nm'
      );
      alert('상담 정보가 성공적으로 제출되었습니다.');
    } catch (e) {
      alert('이메일 전송에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setSending(false);
    }
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
          <button className="submit-button" onClick={handleSubmitData} disabled={sending}>
            {sending ? '제출 중...' : '상담정보 제출하기'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectSummary; 