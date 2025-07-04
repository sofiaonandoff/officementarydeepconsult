import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/InitialInfo.css';

// 카카오 주소 API 스크립트 로드 함수
function loadDaumPostcodeScript(callback) {
  if (document.getElementById('daum-postcode-script')) {
    callback();
    return;
  }
  const script = document.createElement('script');
  script.id = 'daum-postcode-script';
  script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
  script.onload = callback;
  document.body.appendChild(script);
}

const InitialInfo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [emailError, setEmailError] = useState('');
  const [workStyleOther, setWorkStyleOther] = useState('');
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);
  const [brandLogo, setBrandLogo] = useState(null);
  const [brandLogoPreview, setBrandLogoPreview] = useState(null);
  const [brandColors, setBrandColors] = useState(['#000000']);
  const [brandGuide, setBrandGuide] = useState(null);
  const [brandGuideName, setBrandGuideName] = useState('');
  const [referenceImages, setReferenceImages] = useState([]);
  const [referencePreviews, setReferencePreviews] = useState([]);
  const [canteenOptions, setCanteenOptions] = useState([]);
  const [canteenOther, setCanteenOther] = useState('');
  const [meetingOptions, setMeetingOptions] = useState([]);
  const [meetingOther, setMeetingOther] = useState('');

  // 초기 formData 상태
  const initialFormData = {
    companyName: '',
    projectPurpose: '', // 이전 / 확장 / 신규(구축/신축)
    buildingType: '', // 구축 or 신축 (projectPurpose가 신규일 때)
    buildingAddress: '',
    buildingFloors: '',
    buildingSize: '', // 평수 or m²
    budgetDetail: '', // 구체적인 예산
    directOrder: [], // 직접 발주 사항 (다중 선택)
    directOrderEtc: '', // 직접 발주 기타 입력
    constructionStart: '', // 착공 가능일
    constructionEnd: '', // 완료 희망일
    constructionTimes: [], // 공사 가능 시간 (다중 선택)
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    spaceSize: '',
    totalEmployees: '',
    budget: '',
    startSchedule: '',
    endSchedule: '',
    seatingType: '',
    workStyle: [],
    workStyleFlexibility: '',
    workstations: {
      count: 0,
      size: '140x70'
    },
    lockers: {
      count: 0
    },
    focusRooms: {
      single: { count: 0, size: '2x2m' },
      double: { count: 0, size: '3x2m' }
    },
    executiveRooms: {
      count: 0,
      size: '4x4m'
    },
    meetingRooms: {
      small: { count: 0, type: 'small' },
      medium: { count: 0, type: 'medium' },
      large: { count: 0, type: 'large' },
      conference: { count: 0, type: 'conference' }
    },
    additionalSpaces: {
      canteen: { required: false, size: '' },
      lounge: { required: false, size: '' },
      breakRoom: { required: false, size: '' },
      storage: { required: false, size: '' },
      exhibition: { required: false, size: '' },
      serverRoom: { required: false, size: '' },
      other: { required: false, size: '' }
    }
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    console.log('Location state:', location.state); // 디버깅용 로그

    if (location.state?.formData) {
      const prevData = location.state.formData;
      console.log('Previous data:', prevData); // 디버깅용 로그

      // 미리보기 페이지에서 돌아왔을 때의 처리
      if (location.state.fromPreview) {
        // 깊은 복사를 통한 데이터 설정
        const newData = JSON.parse(JSON.stringify(prevData));
        console.log('New data:', newData); // 디버깅용 로그
        setFormData(newData);

        // 마지막으로 입력한 단계로 이동
        if (newData.workstations?.count > 0) {
          setStep(3);
        } else if (newData.seatingType) {
          setStep(2);
        } else {
          setStep(1);
        }
      } else {
        // 일반적인 데이터 병합
        const mergedData = {
          ...initialFormData,
          ...prevData,
          workstations: {
            ...initialFormData.workstations,
            ...prevData.workstations
          },
          lockers: {
            ...initialFormData.lockers,
            ...prevData.lockers
          },
          focusRooms: {
            single: {
              ...initialFormData.focusRooms.single,
              ...prevData.focusRooms?.single
            },
            double: {
              ...initialFormData.focusRooms.double,
              ...prevData.focusRooms?.double
            }
          },
          executiveRooms: {
            ...initialFormData.executiveRooms,
            ...prevData.executiveRooms
          },
          meetingRooms: {
            small: {
              ...initialFormData.meetingRooms.small,
              ...prevData.meetingRooms?.small
            },
            medium: {
              ...initialFormData.meetingRooms.medium,
              ...prevData.meetingRooms?.medium
            },
            large: {
              ...initialFormData.meetingRooms.large,
              ...prevData.meetingRooms?.large
            },
            conference: {
              ...initialFormData.meetingRooms.conference,
              ...prevData.meetingRooms?.conference
            }
          },
          additionalSpaces: {
            canteen: {
              ...initialFormData.additionalSpaces.canteen,
              ...prevData.additionalSpaces?.canteen
            },
            lounge: {
              ...initialFormData.additionalSpaces.lounge,
              ...prevData.additionalSpaces?.lounge
            },
            breakRoom: {
              ...initialFormData.additionalSpaces.breakRoom,
              ...prevData.additionalSpaces?.breakRoom
            },
            storage: {
              ...initialFormData.additionalSpaces.storage,
              ...prevData.additionalSpaces?.storage
            },
            exhibition: {
              ...initialFormData.additionalSpaces.exhibition,
              ...prevData.additionalSpaces?.exhibition
            },
            serverRoom: {
              ...initialFormData.additionalSpaces.serverRoom,
              ...prevData.additionalSpaces?.serverRoom
            },
            other: {
              ...initialFormData.additionalSpaces.other,
              ...prevData.additionalSpaces?.other
            }
          }
        };
        console.log('Merged data:', mergedData); // 디버깅용 로그
        setFormData(mergedData);

        // 마지막으로 입력한 단계로 이동
        if (prevData.workstations?.count > 0) {
          setStep(3);
        } else if (prevData.seatingType) {
          setStep(2);
        } else {
          setStep(1);
        }
      }
    }
  }, [location.state]);

  const seatingTypes = [
    { id: 'fixed', label: '고정좌석제', description: '개인별 지정된 자리에서 업무' },
    { id: 'flexible', label: '자율좌석제', description: '자유롭게 자리 선택 가능' }
  ];

  const workStyles = [
    { id: 'startup', label: '스타트업', icon: '🚀' },
    { id: 'finance', label: '재무/금융', icon: '💰' },
    { id: 'tech', label: 'IT/기술', icon: '💻' },
    { id: 'creative', label: '크리에이티브', icon: '🎨' },
    { id: 'consulting', label: '컨설팅', icon: '📊' },
    { id: 'research', label: '연구/개발', icon: '🔬' },
    { id: 'marketing', label: '마케팅', icon: '📈' },
    { id: 'general', label: '일반 사무', icon: '🏢' },
    { id: 'other', label: '기타', icon: '➕' }
  ];

  const flexibilityLevels = [
    { id: 'high', label: '매우 유연', description: '자유로운 공간 활용과 이동' },
    { id: 'medium', label: '중간', description: '일정한 규칙 하에서 유연한 공간 활용' },
    { id: 'low', label: '제한적', description: '정해진 공간에서 업무 수행' }
  ];

  const meetingRoomTypes = [
    { id: 'small', label: '소형 회의실', capacity: '4명' },
    { id: 'medium', label: '중형 회의실', capacity: '6명' },
    { id: 'large', label: '대형 회의실', capacity: '8명' },
    { id: 'conference', label: '컨퍼런스룸', capacity: '9명 이상' }
  ];

  const budgetOptions = [
    { id: 'basic', label: 'Basic', range: '평당 180만원-200만원', minPrice: 180, maxPrice: 200 },
    { id: 'essential', label: 'Essential', range: '평당 200만원-250만원', minPrice: 200, maxPrice: 250 },
    { id: 'premium', label: 'Premium', range: '평당 250만원-300만원', minPrice: 250, maxPrice: 300 },
    { id: 'signature', label: 'Signature', range: '평당 300만원 이상', minPrice: 300, maxPrice: null }
  ];

  const formatCurrency = (amount) => {
    if (amount >= 10000) {
      const billions = Math.floor(amount / 10000);
      const millions = amount % 10000;
      if (millions === 0) {
        return `${billions}억원`;
      }
      return `${billions}억 ${millions}만원`;
    }
    return `${amount}만원`;
  };

  const calculateEstimatedBudget = () => {
    if (!formData.spaceSize || !formData.budget) return null;

    const selectedBudget = budgetOptions.find(option => option.id === formData.budget);
    if (!selectedBudget) return null;

    const minTotal = formData.spaceSize * selectedBudget.minPrice;
    const maxTotal = selectedBudget.maxPrice
      ? formData.spaceSize * selectedBudget.maxPrice
      : null;

    return {
      min: formatCurrency(minTotal),
      max: maxTotal ? formatCurrency(maxTotal) : `${formatCurrency(minTotal)} 이상`
    };
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'contactEmail') {
      if (!value) {
        setEmailError('');
      } else if (!validateEmail(value)) {
        setEmailError('올바른 이메일 형식이 아닙니다');
      } else {
        setEmailError('');
      }
    }
  };

  const handleWorkstationChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      workstations: {
        ...prev.workstations,
        [name]: value
      }
    }));
  };

  const handleMeetingRoomCountChange = (type, value) => {
    setFormData(prev => ({
      ...prev,
      meetingRooms: {
        ...prev.meetingRooms,
        [type]: {
          ...prev.meetingRooms[type],
          count: parseInt(value) || 0
        }
      }
    }));
  };

  const handleMeetingRoomAdd = (type) => {
    setFormData(prev => ({
      ...prev,
      meetingRooms: {
        ...prev.meetingRooms,
        [type]: {
          ...prev.meetingRooms[type],
          count: prev.meetingRooms[type].count + 1
        }
      }
    }));
  };

  const handleMeetingRoomRemove = (type) => {
    setFormData(prev => ({
      ...prev,
      meetingRooms: {
        ...prev.meetingRooms,
        [type]: {
          ...prev.meetingRooms[type],
          count: Math.max(0, prev.meetingRooms[type].count - 1)
        }
      }
    }));
  };

  const handleAdditionalSpaceToggle = (spaceType) => {
    setFormData(prev => ({
      ...prev,
      additionalSpaces: {
        ...prev.additionalSpaces,
        [spaceType]: {
          ...prev.additionalSpaces[spaceType],
          required: !prev.additionalSpaces[spaceType].required
        }
      }
    }));
  };

  const handleAdditionalSpaceSizeChange = (spaceType, value) => {
    setFormData(prev => ({
      ...prev,
      additionalSpaces: {
        ...prev.additionalSpaces,
        [spaceType]: {
          ...prev.additionalSpaces[spaceType],
          size: value
        }
      }
    }));
  };

  const handlePhoneRoomCountChange = (value) => {
    setFormData(prev => ({
      ...prev,
      phoneRooms: {
        ...prev.phoneRooms,
        count: parseInt(value) || 0
      }
    }));
  };

  const handleFocusRoomCountChange = (type, value) => {
    setFormData(prev => ({
      ...prev,
      focusRooms: {
        ...prev.focusRooms,
        [type]: {
          ...prev.focusRooms[type],
          count: parseInt(value) || 0
        }
      }
    }));
  };

  const handleExecutiveRoomCountChange = (value) => {
    setFormData(prev => ({
      ...prev,
      executiveRooms: {
        ...prev.executiveRooms,
        count: parseInt(value) || 0
      }
    }));
  };

  const handleWorkStyleChange = (id) => {
    setFormData(prev => {
      const exists = prev.workStyle.includes(id);
      let newWorkStyle = exists
        ? prev.workStyle.filter(styleId => styleId !== id)
        : [...prev.workStyle, id];
      // 기타 해제 시 입력값도 초기화
      if (id === 'other' && exists) setWorkStyleOther('');
      return {
        ...prev,
        workStyle: newWorkStyle
      };
    });
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      // 4단계에서만 요약 페이지로 이동
      const mergedFormData = {
        ...formData,
        workStyleOther
      };
      navigate('/design-preview', { state: { formData: mergedFormData } });
    }
  };

  const handleSkip = () => {
    if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    } else if (step === 4) {
      const mergedFormData = {
        ...formData,
        workStyleOther
      };
      navigate('/design-preview', { state: { formData: mergedFormData } });
    }
  };

  const directOrderOptions = [
    { id: 'security', label: '보안' },
    { id: 'network', label: '통신' },
    { id: 'av', label: 'AV' },
    { id: 'move', label: '이사' },
    { id: 'furniture', label: '가구' },
    { id: 'landscape', label: '조경' },
    { id: 'none', label: '없음' },
    { id: 'etc', label: '기타' }
  ];

  const constructionTimeOptions = [
    { id: 'weekday-day', label: '평일 주간' },
    { id: 'weekday-night', label: '평일 야간' },
    { id: 'weekend-day', label: '주말 주간' },
    { id: 'weekend-night', label: '주말 야간' }
  ];

  // 주소 검색 완료 시 호출
  const handleAddressSearch = () => {
    loadDaumPostcodeScript(() => {
      setIsPostcodeOpen(true);
      new window.daum.Postcode({
        oncomplete: function (data) {
          setFormData(prev => ({ ...prev, buildingAddress: data.address }));
          setIsPostcodeOpen(false);
        },
        onclose: function () {
          setIsPostcodeOpen(false);
        }
      }).open({ popupName: 'postcodePopup' });
    });
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="step-container">
            <h2>프로젝트 기본 정보</h2>
            <div className="input-group">
              <div className="input-field">
                <label>회사 이름 <span className="required">*</span></label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  placeholder="회사명을 입력하세요"
                />
              </div>
              <div className="input-field">
                <label>프로젝트 목적 <span className="required">*</span></label>
                <div className="seating-options" style={{ marginTop: 8, display: 'flex', flexWrap: 'nowrap', justifyContent: 'flex-start' }}>
                  {[
                    { id: 'move', label: '이전', desc: '기존 사무실에서 새로운 공간으로 이전' },
                    { id: 'expand', label: '확장', desc: '기존 공간의 확장 또는 추가' },
                    { id: 'new', label: '신규', desc: '신규 오피스 설계' }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      className={`seating-option${formData.projectPurpose === opt.id ? ' selected' : ''}`}
                      onClick={() => handleInputChange({ target: { name: 'projectPurpose', value: opt.id } })}
                      style={{ width: 200, minWidth: 160, marginRight: 12, marginBottom: 0 }}
                    >
                      <h4 style={{ margin: 0 }}>{opt.label}</h4>
                      <p style={{ fontSize: 13, color: '#666', margin: '4px 0 0 0', minHeight: 18 }}>{opt.desc}</p>
                    </button>
                  ))}
                </div>
                {formData.projectPurpose === 'new' && (
                  <div style={{ marginTop: 12 }}>
                    <label style={{ marginRight: 8 }}>신규 유형:</label>
                    {[
                      { id: 'built', label: '구축 건물' },
                      { id: 'newly', label: '신축 건물' }
                    ].map(opt => (
                      <button
                        key={opt.id}
                        type="button"
                        className={`building-type-btn${formData.buildingType === opt.id ? ' selected' : ''}`}
                        style={{
                          padding: '6px 16px',
                          borderRadius: 8,
                          border: formData.buildingType === opt.id ? '2px solid #007bff' : '1px solid #ccc',
                          background: formData.buildingType === opt.id ? '#e6f0ff' : '#fff',
                          fontWeight: formData.buildingType === opt.id ? 700 : 400,
                          cursor: 'pointer',
                          marginRight: 8,
                          transition: 'all 0.2s'
                        }}
                        onClick={() => handleInputChange({ target: { name: 'buildingType', value: opt.id } })}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="input-field" style={{ display: 'flex', alignItems: 'flex-end', gap: 8, marginBottom: 16, width: '100%' }}>
                <div style={{ flex: 1, width: '100%' }}>
                  <label>건물 주소 <span className="required">*</span></label>
                  <input
                    type="text"
                    name="buildingAddress"
                    value={formData.buildingAddress}
                    onChange={handleInputChange}
                    placeholder="건물 주소를 입력하세요"
                    readOnly
                    style={{ width: '100%' }}
                  />
                </div>
                <button type="button" style={{ height: 36, minWidth: 90, marginBottom: 2 }} onClick={handleAddressSearch}>주소 검색</button>
              </div>
              <div className="input-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="input-field">
                  <label>건물 규모 <span className="required">*</span></label>
                  <input
                    type="text"
                    name="buildingSize"
                    value={formData.buildingSize}
                    onChange={handleInputChange}
                    placeholder="예: 300평 또는 1000m²"
                  />
                </div>
                <div className="input-field">
                  <label>건물 층수 <span className="required">*</span></label>
                  <input
                    type="number"
                    name="buildingFloors"
                    value={formData.buildingFloors}
                    onChange={handleInputChange}
                    placeholder="건물 층수"
                    min="1"
                  />
                </div>
              </div>
              <div className="input-field">
                <label>직접 발주 사항</label>
                <div className="work-style-options">
                  {directOrderOptions.map(opt => {
                    const checked = formData.directOrder.includes(opt.id);
                    return (
                      <span key={opt.id} style={{ display: 'inline-block', marginRight: 8 }}>
                        <button
                          type="button"
                          className={`work-style-checkbox work-style-btn${checked ? ' selected' : ''}`}
                          style={{
                            display: 'inline-block',
                            margin: '0 8px 8px 0',
                            cursor: 'pointer',
                            border: checked ? '2px solid #007bff' : '1px solid #ccc',
                            borderRadius: '8px',
                            padding: '10px 16px',
                            background: checked ? '#e6f0ff' : '#fff',
                            transition: 'all 0.2s',
                            fontWeight: checked ? 700 : 400,
                            width: 160,
                            minWidth: 140
                          }}
                          onClick={() => {
                            setFormData(prev => {
                              const exists = prev.directOrder.includes(opt.id);
                              let newDirectOrder = exists
                                ? prev.directOrder.filter(id => id !== opt.id)
                                : [...prev.directOrder, opt.id];
                              // 기타 해제 시 입력값도 초기화
                              let etcValue = prev.directOrderEtc;
                              if (opt.id === 'etc' && exists) etcValue = '';
                              return {
                                ...prev,
                                directOrder: newDirectOrder,
                                directOrderEtc: etcValue
                              };
                            });
                          }}
                        >
                          {opt.label}
                        </button>
                        {opt.id === 'etc' && checked && (
                          <input
                            type="text"
                            value={formData.directOrderEtc}
                            onChange={e => setFormData(prev => ({ ...prev, directOrderEtc: e.target.value }))}
                            placeholder="기타 직접 발주 사항 입력"
                            style={{ marginLeft: 8, padding: '2px 6px', borderRadius: 4, border: '1px solid #ccc', width: 140 }}
                          />
                        )}
                      </span>
                    );
                  })}
                </div>
              </div>
              <div className="input-field">
                <label>공사 희망 일정</label>
                <div className="schedule-input">
                  <input
                    type="date"
                    name="constructionStart"
                    value={formData.constructionStart}
                    onChange={handleInputChange}
                    min={new Date().toISOString().slice(0, 10)}
                    placeholder="착공 가능일"
                    className="styled-date-input"
                  />
                  <span style={{ margin: '0 8px' }}>~</span>
                  <input
                    type="date"
                    name="constructionEnd"
                    value={formData.constructionEnd}
                    onChange={handleInputChange}
                    min={formData.constructionStart ? formData.constructionStart : new Date().toISOString().slice(0, 10)}
                    placeholder="완료 희망일"
                    className="styled-date-input"
                  />
                </div>
              </div>
              <div className="input-field">
                <label>공사 가능 시간</label>
                <div className="work-style-options">
                  {constructionTimeOptions.map(opt => {
                    const checked = formData.constructionTimes.includes(opt.id);
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        className={`work-style-checkbox work-style-btn${checked ? ' selected' : ''}`}
                        style={{
                          display: 'inline-block',
                          margin: '0 8px 8px 0',
                          cursor: 'pointer',
                          border: checked ? '2px solid #007bff' : '1px solid #ccc',
                          borderRadius: '8px',
                          padding: '10px 16px',
                          background: checked ? '#e6f0ff' : '#fff',
                          transition: 'all 0.2s',
                          fontWeight: checked ? 700 : 400,
                          width: 160,
                          minWidth: 140
                        }}
                        onClick={() => {
                          setFormData(prev => {
                            const exists = prev.constructionTimes.includes(opt.id);
                            return {
                              ...prev,
                              constructionTimes: exists
                                ? prev.constructionTimes.filter(id => id !== opt.id)
                                : [...prev.constructionTimes, opt.id]
                            };
                          });
                        }}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="step-container">
            <h2>디자인 방향성 설정</h2>
            <div className="space-settings">
              <div className="setting-section">
                <h3>디자인 키워드</h3>
                <div className="work-style-options">
                  {[
                    { id: 'minimal', label: 'Minimal & Sleek', icon: '🧊', desc: '미니멀하고 매끄러운' },
                    { id: 'natural', label: 'Natural & Calm', icon: '🌿', desc: '자연스럽고 차분한' },
                    { id: 'industrial', label: 'Industrial & Urban', icon: '🏙️', desc: '노출 구조, 도심 감성' },
                    { id: 'warm', label: 'Warm & Cozy', icon: '🌞', desc: '따뜻하고 아늑한' },
                    { id: 'futuristic', label: 'Futuristic & Techy', icon: '🌀', desc: '미래지향적이고 기술적인' },
                    { id: 'playful', label: 'Playful & Creative', icon: '🌈', desc: '유쾌하고 창의적인' },
                    { id: 'classic', label: 'Classic & Elegant', icon: '📚', desc: '고전적이고 정제된' },
                    { id: 'layered', label: 'Layered & Textured', icon: '✨', desc: '복합적이고 입체감 있는' },
                    { id: 'other', label: '기타', icon: '➕', desc: '' }
                  ].map((style) => {
                    const checked = formData.workStyle.includes(style.id);
                    return (
                      <label
                        key={style.id}
                        className={`work-style-checkbox work-style-btn${checked ? ' selected' : ''}`}
                        style={{ display: 'inline-block', margin: '0 8px 8px 0', cursor: 'pointer', border: checked ? '2px solid #007bff' : '1px solid #ccc', borderRadius: '8px', padding: '10px 16px', background: checked ? '#e6f0ff' : '#fff', transition: 'all 0.2s' }}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => handleWorkStyleChange(style.id)}
                          style={{ display: 'none' }}
                        />
                        <span className="icon" style={{ marginRight: 6 }}>{style.icon}</span>
                        {style.label}
                        {style.desc && <span style={{ display: 'block', fontSize: 12, color: '#888', marginTop: 2 }}>{style.desc}</span>}
                        {style.id === 'other' && checked && (
                          <input
                            type="text"
                            value={workStyleOther}
                            onChange={e => setWorkStyleOther(e.target.value)}
                            placeholder="기타 디자인 키워드 입력"
                            style={{ marginLeft: 8, padding: '2px 6px', borderRadius: 4, border: '1px solid #ccc', width: 120 }}
                          />
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="setting-section">
                <h3>브랜드 아이덴티티</h3>
                <div className="brand-identity-fields" style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 8 }}>
                  {/* 로고 업로드 */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <label style={{ minWidth: 90 }}>브랜드 로고</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => {
                        const file = e.target.files[0];
                        setBrandLogo(file);
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = ev => setBrandLogoPreview(ev.target.result);
                          reader.readAsDataURL(file);
                        } else {
                          setBrandLogoPreview(null);
                        }
                      }}
                    />
                    {brandLogoPreview && (
                      <img src={brandLogoPreview} alt="로고 미리보기" style={{ width: 48, height: 48, objectFit: 'contain', border: '1px solid #eee', borderRadius: 8 }} />
                    )}
                  </div>
                  {/* 브랜드 컬러 */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                    <label style={{ minWidth: 90, marginTop: 8 }}>브랜드 컬러</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {brandColors.map((color, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <input
                            type="color"
                            value={color}
                            onChange={e => {
                              const newColors = [...brandColors];
                              newColors[idx] = e.target.value;
                              setBrandColors(newColors);
                            }}
                            style={{ width: 36, height: 36, border: 'none', background: 'none' }}
                          />
                          <input
                            type="text"
                            value={color}
                            onChange={e => {
                              const newColors = [...brandColors];
                              newColors[idx] = e.target.value;
                              setBrandColors(newColors);
                            }}
                            style={{ width: 90, marginLeft: 8 }}
                            maxLength={7}
                          />
                          {brandColors.length > 1 && (
                            <button type="button" style={{ marginLeft: 4 }} onClick={() => {
                              setBrandColors(brandColors.filter((_, i) => i !== idx));
                            }}>삭제</button>
                          )}
                        </div>
                      ))}
                      <button type="button" style={{ marginTop: 4, width: 200 }} onClick={() => setBrandColors([...brandColors, '#000000'])}>컬러 추가</button>
                    </div>
                  </div>
                  {/* 디자인 가이드 업로드 */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <label style={{ minWidth: 90 }}>디자인 가이드</label>
                    <input
                      type="file"
                      accept=".pdf,.ai,.psd,.zip,.ppt,.pptx,.doc,.docx,.hwp,.jpg,.png"
                      onChange={e => {
                        const file = e.target.files[0];
                        setBrandGuide(file);
                        setBrandGuideName(file ? file.name : '');
                      }}
                    />
                    {brandGuideName && (
                      <span style={{ fontSize: 13, color: '#555' }}>{brandGuideName}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="setting-section">
                <h3>업무 공간 분위기</h3>
                <div className="seating-options">
                  {[
                    { id: 'focus', label: 'Focus', desc: '집중이 잘 되는 공간' },
                    { id: 'open', label: 'Open', desc: '대화를 유도하는 열린 공간' },
                    { id: 'private', label: 'Private', desc: '조용하고 프라이빗한 느낌' },
                    { id: 'teamwork', label: 'Teamwork', desc: '팀워크와 공동작업 중심' },
                    { id: 'healing', label: 'Healing', desc: '회복과 휴식을 위한 공간' },
                    { id: 'brand', label: 'Brand', desc: '브랜드 정체성을 잘 보여주는 공간' }
                  ].map(type => {
                    const checked = Array.isArray(formData.seatingType) ? formData.seatingType.includes(type.id) : false;
                    return (
                      <button
                        key={type.id}
                        className={`seating-option${checked ? ' selected' : ''}`}
                        onClick={() => {
                          // 다중 선택 토글
                          let newArr = Array.isArray(formData.seatingType) ? [...formData.seatingType] : [];
                          if (checked) {
                            newArr = newArr.filter(id => id !== type.id);
                          } else {
                            newArr.push(type.id);
                          }
                          handleInputChange({ target: { name: 'seatingType', value: newArr } });
                        }}
                        style={{ width: 300, minWidth: 160, marginRight: 12, marginBottom: 8, textAlign: 'left', padding: '16px 20px' }}
                      >
                        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{type.label}</div>
                        <div style={{ fontSize: 14, color: '#666' }}>{type.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="setting-section">
                <h3>선호하는 레퍼런스 이미지</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={e => {
                      const files = Array.from(e.target.files);
                      // 기존 이미지에 새 파일을 누적
                      const newImages = [...referenceImages, ...files];
                      setReferenceImages(newImages);
                      // 미리보기 누적
                      Promise.all(files.map(file => {
                        return new Promise(resolve => {
                          const reader = new FileReader();
                          reader.onload = ev => resolve(ev.target.result);
                          reader.readAsDataURL(file);
                        });
                      })).then(newPreviews => {
                        setReferencePreviews(prev => [...prev, ...newPreviews]);
                      });
                    }}
                  />
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 8 }}>
                    {referencePreviews.map((src, idx) => (
                      <div key={idx} style={{ textAlign: 'center' }}>
                        <img src={src} alt={`ref${idx}`} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, border: '1px solid #eee' }} />
                        <div style={{ fontSize: 12, color: '#555', marginTop: 2, maxWidth: 80, wordBreak: 'break-all' }}>{referenceImages[idx]?.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="step-container">
            <h2>세부 공간 구성 및 활용 계획</h2>
            <div className="space-requirements">
              <div className="requirement-section">
                <h3>캔틴 구성</h3>
                <div className="canteen-options" style={{ marginBottom: 16 }}>
                  {[
                    { id: 'water', label: '정수기' },
                    { id: 'microwave', label: '전자레인지' },
                    { id: 'sink', label: '싱크대' },
                    { id: 'fridge', label: '냉장고' },
                    { id: 'other', label: '기타' }
                  ].map(opt => {
                    const checked = canteenOptions.includes(opt.id);
                    return (
                      <span key={opt.id} style={{ display: 'inline-block', marginRight: 8 }}>
                        <button
                          type="button"
                          className={`work-style-checkbox work-style-btn${checked ? ' selected' : ''}`}
                          style={{
                            display: 'inline-block',
                            margin: '0 8px 8px 0',
                            cursor: 'pointer',
                            border: checked ? '2px solid #007bff' : '1px solid #ccc',
                            borderRadius: '8px',
                            padding: '10px 16px',
                            background: checked ? '#e6f0ff' : '#fff',
                            transition: 'all 0.2s',
                            fontWeight: checked ? 700 : 400,
                            minWidth: 100
                          }}
                          onClick={() => {
                            setCanteenOptions(prev => {
                              const exists = prev.includes(opt.id);
                              if (exists) {
                                // 기타 해제 시 입력값도 초기화
                                if (opt.id === 'other') setCanteenOther('');
                                return prev.filter(id => id !== opt.id);
                              } else {
                                return [...prev, opt.id];
                              }
                            });
                          }}
                        >
                          {opt.label}
                        </button>
                        {opt.id === 'other' && checked && (
                          <input
                            type="text"
                            value={canteenOther}
                            onChange={e => setCanteenOther(e.target.value)}
                            placeholder="추가 필요한 기기"
                            style={{ marginLeft: 8, padding: '2px 6px', borderRadius: 4, border: '1px solid #ccc', width: 140 }}
                          />
                        )}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="requirement-section">
                <h3>회의실 구성</h3>
                <div className="meeting-room-options" style={{ marginBottom: 16, display: 'flex', flexWrap: 'nowrap', justifyContent: 'flex-start' }}>
                  {[
                    { id: 'video', label: '화상 회의 장비' },
                    { id: 'tv', label: 'TV' },
                    { id: 'whiteboard', label: '화이트보드' },
                    { id: 'projector', label: '프로젝터' },
                    { id: 'other', label: '기타' }
                  ].map(opt => {
                    const checked = meetingOptions.includes(opt.id);
                    return (
                      <span key={opt.id} style={{ display: 'inline-block', marginRight: 8 }}>
                        <button
                          type="button"
                          className={`work-style-checkbox work-style-btn${checked ? ' selected' : ''}`}
                          style={{
                            display: 'inline-block',
                            margin: '0 8px 8px 0',
                            cursor: 'pointer',
                            border: checked ? '2px solid #007bff' : '1px solid #ccc',
                            borderRadius: '8px',
                            padding: '10px 16px',
                            background: checked ? '#e6f0ff' : '#fff',
                            transition: 'all 0.2s',
                            fontWeight: checked ? 700 : 400,
                            minWidth: 100
                          }}
                          onClick={() => {
                            setMeetingOptions(prev => {
                              const exists = prev.includes(opt.id);
                              if (exists) {
                                if (opt.id === 'other') setMeetingOther('');
                                return prev.filter(id => id !== opt.id);
                              } else {
                                return [...prev, opt.id];
                              }
                            });
                          }}
                        >
                          {opt.label}
                        </button>
                        {opt.id === 'other' && checked && (
                          <input
                            type="text"
                            value={meetingOther}
                            onChange={e => setMeetingOther(e.target.value)}
                            placeholder="추가 필요한 장비"
                            style={{ marginLeft: 8, padding: '2px 6px', borderRadius: 4, border: '1px solid #ccc', width: 140 }}
                          />
                        )}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="requirement-section">
                <h3>추가 공간</h3>
                <div className="additional-spaces">
                  <div className="space-option">
                    <label>
                      <input
                        type="checkbox"
                        checked={formData.additionalSpaces.canteen.required}
                        onChange={() => handleAdditionalSpaceToggle('canteen')}
                      />
                      캔틴
                    </label>
                    {formData.additionalSpaces.canteen.required && (
                      <input
                        type="text"
                        placeholder="캔틴 크기 (예: 5x5m)"
                        value={formData.additionalSpaces.canteen.size}
                        onChange={(e) => handleAdditionalSpaceSizeChange('canteen', e.target.value)}
                      />
                    )}
                  </div>
                  <div className="space-option">
                    <label>
                      <input
                        type="checkbox"
                        checked={formData.additionalSpaces.lounge.required}
                        onChange={() => handleAdditionalSpaceToggle('lounge')}
                      />
                      라운지
                    </label>
                    {formData.additionalSpaces.lounge.required && (
                      <input
                        type="text"
                        placeholder="라운지 크기 (예: 4x4m)"
                        value={formData.additionalSpaces.lounge.size}
                        onChange={(e) => handleAdditionalSpaceSizeChange('lounge', e.target.value)}
                      />
                    )}
                  </div>
                  <div className="space-option">
                    <label>
                      <input
                        type="checkbox"
                        checked={formData.additionalSpaces.breakRoom.required}
                        onChange={() => handleAdditionalSpaceToggle('breakRoom')}
                      />
                      휴게실
                    </label>
                    {formData.additionalSpaces.breakRoom.required && (
                      <input
                        type="text"
                        placeholder="휴게실 크기 (예: 4x4m)"
                        value={formData.additionalSpaces.breakRoom.size}
                        onChange={(e) => handleAdditionalSpaceSizeChange('breakRoom', e.target.value)}
                      />
                    )}
                  </div>
                  <div className="space-option">
                    <label>
                      <input
                        type="checkbox"
                        checked={formData.additionalSpaces.storage.required}
                        onChange={() => handleAdditionalSpaceToggle('storage')}
                      />
                      창고
                    </label>
                    {formData.additionalSpaces.storage.required && (
                      <input
                        type="text"
                        placeholder="창고 크기 (예: 3x3m)"
                        value={formData.additionalSpaces.storage.size}
                        onChange={(e) => handleAdditionalSpaceSizeChange('storage', e.target.value)}
                      />
                    )}
                  </div>
                  <div className="space-option">
                    <label>
                      <input
                        type="checkbox"
                        checked={formData.additionalSpaces.exhibition.required}
                        onChange={() => handleAdditionalSpaceToggle('exhibition')}
                      />
                      전시공간
                    </label>
                    {formData.additionalSpaces.exhibition.required && (
                      <input
                        type="text"
                        placeholder="전시공간 크기 (예: 6x6m)"
                        value={formData.additionalSpaces.exhibition.size}
                        onChange={(e) => handleAdditionalSpaceSizeChange('exhibition', e.target.value)}
                      />
                    )}
                  </div>
                  <div className="space-option">
                    <label>
                      <input
                        type="checkbox"
                        checked={formData.additionalSpaces.serverRoom.required}
                        onChange={() => handleAdditionalSpaceToggle('serverRoom')}
                      />
                      서버실
                    </label>
                    {formData.additionalSpaces.serverRoom.required && (
                      <input
                        type="text"
                        placeholder="서버실 크기 (예: 4x4m)"
                        value={formData.additionalSpaces.serverRoom.size}
                        onChange={(e) => handleAdditionalSpaceSizeChange('serverRoom', e.target.value)}
                      />
                    )}
                  </div>
                  <div className="space-option">
                    <label>
                      <input
                        type="checkbox"
                        checked={formData.additionalSpaces.other.required}
                        onChange={() => handleAdditionalSpaceToggle('other')}
                      />
                      기타
                    </label>
                    {formData.additionalSpaces.other.required && (
                      <input
                        type="text"
                        placeholder="공간 용도와 크기 입력"
                        value={formData.additionalSpaces.other.size}
                        onChange={(e) => handleAdditionalSpaceSizeChange('other', e.target.value)}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="step-container">
            <h2>기본 정보 입력 (최종 확인)</h2>
            <div className="input-group">
              <div className="input-field">
                <label>회사 이름 <span className="required">*</span></label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  placeholder="회사명을 입력하세요"
                />
              </div>
              <div className="contact-info">
                <div className="input-field">
                  <label>담당자 이름 <span className="required">*</span></label>
                  <input
                    type="text"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleInputChange}
                    placeholder="담당자 이름을 입력하세요"
                  />
                </div>
                <div className="input-field">
                  <label>연락처 <span className="required">*</span></label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    placeholder="연락처를 입력하세요"
                  />
                </div>
              </div>
              <div className="input-field">
                <label>이메일 <span className="required">*</span></label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  placeholder="이메일을 입력하세요"
                />
                {emailError && <span className="error-message">{emailError}</span>}
              </div>
              <div className="input-field">
                <label>오피스 공간 크기</label>
                <div className="size-input">
                  <input
                    type="number"
                    name="spaceSize"
                    value={formData.spaceSize}
                    onChange={handleInputChange}
                    placeholder="평수 입력"
                    min="1"
                  />
                  <span className="unit">평</span>
                </div>
              </div>
              <div className="input-field">
                <label>오피스 총 인원</label>
                <div className="size-input">
                  <input
                    type="number"
                    name="totalEmployees"
                    value={formData.totalEmployees}
                    onChange={handleInputChange}
                    placeholder="인원 수 입력"
                    min="1"
                  />
                  <span className="unit">명</span>
                </div>
              </div>
              <div className="input-field">
                <label>예산 범위</label>
                <div className="budget-options">
                  {budgetOptions.map((option) => (
                    <button
                      key={option.id}
                      className={`budget-option ${formData.budget === option.id ? 'selected' : ''}`}
                      onClick={() => handleInputChange({ target: { name: 'budget', value: option.id } })}
                    >
                      <h4>{option.label}</h4>
                      <p>{option.range}</p>
                    </button>
                  ))}
                </div>
                {formData.spaceSize && formData.budget && (
                  <div className="estimated-budget">
                    <p>예상 총 예산: {
                      formData.budget === 'signature'
                        ? calculateEstimatedBudget().max
                        : `${calculateEstimatedBudget().min} ~ ${calculateEstimatedBudget().max}`
                    }</p>
                  </div>
                )}
              </div>
              <div className="schedule-inputs">
                <div className="input-field">
                  <label>시작 일정</label>
                  <div className="schedule-input">
                    <input
                      type="date"
                      name="startSchedule"
                      value={formData.startSchedule}
                      onChange={handleInputChange}
                      min={new Date().toISOString().slice(0, 10)}
                      placeholder="시작 일자 선택"
                      className="styled-date-input"
                    />
                  </div>
                </div>
                <div className="input-field">
                  <label>공사 완료 일정</label>
                  <div className="schedule-input">
                    <input
                      type="date"
                      name="endSchedule"
                      value={formData.endSchedule}
                      onChange={handleInputChange}
                      min={formData.startSchedule ? formData.startSchedule : new Date().toISOString().slice(0, 10)}
                      placeholder="완료 일자 선택"
                      className="styled-date-input"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="initial-info-container">
      <div className="progress-bar">
        <div className="progress" style={{ width: `${(step / 4) * 100}%` }} />
      </div>
      {renderStep()}
      <div className="navigation-buttons">
        {step > 1 && (
          <button className="back-button" onClick={() => setStep(step - 1)}>
            이전
          </button>
        )}
        {(step === 2 || step === 3) && (
          <button className="skip-button" onClick={handleSkip}>
            SKIP
          </button>
        )}
        <button
          className="next-button"
          onClick={handleNext}
          disabled={
            (step === 1 && (
              !formData.companyName ||
              !formData.projectPurpose ||
              (formData.projectPurpose === 'new' && !formData.buildingType) ||
              !formData.buildingAddress ||
              !formData.buildingFloors ||
              !formData.buildingSize
            )) ||
            (step === 2 && ((Array.isArray(formData.seatingType) ? formData.seatingType.length === 0 : true) || formData.workStyle.length === 0)) ||
            (step === 4 && (!formData.companyName || !formData.contactName ||
              !formData.contactPhone || !formData.contactEmail ||
              emailError || !validateEmail(formData.contactEmail)))
          }
        >
          {step === 4 ? '제출' : '다음'}
        </button>
      </div>
      {/* 주소 검색 모달(카카오)용 더미 div */}
      {isPostcodeOpen && <div id="postcode-layer" />}
    </div>
  );
};

export default InitialInfo; 